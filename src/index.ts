import './style/index.css';

import type { ISearchResultChangeEvent, SearchAddon } from '@xterm/addon-search';
import type { IDisposable, ITerminalAddon, Terminal } from '@xterm/xterm';

import type { ISearchBarControlType, ISearchBarOption, ISearchBarTheme } from '../typings/index';
import {
  ADDON_MARKER_NAME,
  DEFAULT_SEARCH_DECORATIONS,
  DEFAULT_THEME,
  QUERY_SELECTOR,
  THEME_CSS_VARIABLES,
} from './config';

export class SearchBarAddon implements ITerminalAddon {
  private options: Partial<Omit<ISearchBarOption, 'searchAddon' | 'theme'>> = {};
  private theme: Partial<ISearchBarTheme> = {};

  private terminal: Terminal;
  private readonly searchAddon: SearchAddon;
  private resultChangeDisposable: IDisposable | undefined;

  private searchBarElement: HTMLDivElement;
  private searchValue: string = '';

  constructor(options: Partial<ISearchBarOption> = {}) {
    this.theme = { ...DEFAULT_THEME, ...(options.theme ?? {}) };
    this.options = {
      regex: options.regex ?? false,
      caseSensitive: options.caseSensitive ?? false,
      wholeWord: options.wholeWord ?? false,
      incremental: options.incremental ?? true,
      ...(typeof options.decorations === 'object' && Object.keys(options.decorations).length
        ? { decorations: options.decorations }
        : { decorations: DEFAULT_SEARCH_DECORATIONS }),
    };

    if (options.searchAddon) {
      this.searchAddon = options.searchAddon;
    }
  }

  public activate(terminal: Terminal): void {
    this.terminal = terminal;
    if (!this.searchAddon) {
      console.error('Cannot use search bar addon until search addon has been loaded!');
      return;
    }

    this.resultChangeDisposable?.dispose();
    this.resultChangeDisposable = this.searchAddon.onDidChangeResults((event) => {
      this.handleSearchMatchCounter(event);
    });
  }

  public dispose() {
    if (this.resultChangeDisposable) {
      this.resultChangeDisposable.dispose();
      this.resultChangeDisposable = undefined;
    }
    this.hidden();
  }

  /**
   *  Show the bar in the term
   * @returns empty
   * @memberof SearchBarAddon  necessary search addon instance
   */
  public show() {
    if (!this.terminal || !this.terminal.element) {
      return;
    }

    if (this.searchBarElement) {
      this.searchBarElement.style.visibility = 'visible';
    } else {
      this.createSearchBarElement();
      this.bindSearchBarEvents();
    }

    (this.searchBarElement.querySelector('input') as HTMLInputElement).focus();
  }

  /**
   * You can manually call close, also can click the close button on the bar
   * @memberof SearchBarAddon
   */
  public hidden() {
    if (this.searchBarElement && (this.terminal.element as HTMLElement).parentElement) {
      this.searchBarElement.style.visibility = 'hidden';
    }
    this.searchAddon.clearActiveDecoration();
  }

  /**
   * You can customize your own style, and then add CSS string template after search bar init
   * @param {string} newStyle
   * @memberof SearchBarAddon
   */
  public addNewStyle(newStyle: string) {
    let styleElement = document.getElementById(ADDON_MARKER_NAME) as HTMLStyleElement;

    if (!styleElement) {
      styleElement = document.createElement('style');
      // styleElement.type = 'text/css'; // deprecated
      styleElement.id = ADDON_MARKER_NAME;
      document.getElementsByTagName('head')[0].appendChild(styleElement);
    }

    styleElement.appendChild(document.createTextNode(newStyle));
  }

  public applyTheme(theme: Partial<ISearchBarTheme>): void {
    this.theme = { ...DEFAULT_THEME, ...(theme ?? {}) };
    if (!this.searchBarElement) return;

    for (const key of Object.keys(THEME_CSS_VARIABLES) as Array<keyof ISearchBarTheme>) {
      this.searchBarElement.style.setProperty(THEME_CSS_VARIABLES[key], this.theme[key] ?? DEFAULT_THEME[key]);
    }
  }

  private createSearchBarElement() {
    const terminalElement = this.terminal.element as HTMLElement;
    terminalElement.style.position = 'relative';
    const parentElement = terminalElement.parentElement as HTMLElement;
    if (!['relative', 'absolute', 'fixed'].includes(parentElement.style.position)) {
      parentElement.style.position = 'relative';
    }

    this.searchBarElement = document.createElement('div');
    this.searchBarElement.className = ADDON_MARKER_NAME;
    this.searchBarElement.innerHTML = `
      <div class="search-bar__inputs">
        <input type="text" class="search-bar__input"></input>
        <div class="search-bar__controls">
          <button class="search-bar__control case-sensitive" type="button">Aa</button>
          <button class="search-bar__control whole-word" type="button">W</button>
          <button class="search-bar__control regex" type="button">.*</button>
        </div>
      </div>
      <div class="search-bar__match-counter">0/0</div>
      <div class="search-bar__actions">
        <button class="search-bar__action prev disable" type="button"></button>
        <button class="search-bar__action next disable" type="button"></button>
        <button class="search-bar__action close" type="button"></button>
      </div>
    `;
    parentElement.appendChild(this.searchBarElement);

    this.applyTheme(this.theme);
  }

  private bindSearchBarEvents() {
    this.on(QUERY_SELECTOR.input, 'keyup', (e: KeyboardEvent) => this.handleInputChange(e));

    this.on(QUERY_SELECTOR.caseSensitiveControl, 'click', (e: MouseEvent) => this.handleSwitchCaseSensitiveControl(e));
    this.on(QUERY_SELECTOR.wholeWordControl, 'click', (e: MouseEvent) => this.handleSwitchWholeWordControl(e));
    this.on(QUERY_SELECTOR.regexControl, 'click', (e: MouseEvent) => this.handleSwitchRegexControl(e));

    this.on(QUERY_SELECTOR.closeAction, 'click', (e: MouseEvent) => this.handleCloseAction(e));
    this.on(QUERY_SELECTOR.prevAction, 'click', (e: MouseEvent) => this.handleFindPrevAction(e));
    this.on(QUERY_SELECTOR.nextAction, 'click', (e: MouseEvent) => this.handleFindNextAction(e));
  }

  private on(selector: string, event: string, cb: (e: any) => void) {
    const parentElement = <HTMLElement>(this.terminal.element as HTMLElement).parentElement;
    parentElement.addEventListener(event, (e) => {
      const targetElement = this.searchBarElement.querySelector(selector);
      let target = e.target;

      while (target !== targetElement) {
        if (target === parentElement) {
          target = null;
          break;
        }

        target = (target as HTMLElement).parentElement;
      }

      if (target === targetElement) {
        cb.call(this, e);
        e.stopPropagation();
      }
    });
  }

  private handleSearchMatchCounter(event: ISearchResultChangeEvent): void {
    const { resultIndex, resultCount } = event;
    const current = resultIndex >= 0 ? resultIndex + 1 : 0;
    const isMatch = resultCount > 0;

    const counterElement = this.searchBarElement.querySelector(QUERY_SELECTOR.matchCounter) as HTMLSpanElement | null;
    if (counterElement) counterElement.textContent = `${current}/${resultCount}`;

    const nextActionElement = this.searchBarElement.querySelector(QUERY_SELECTOR.nextAction) as HTMLSpanElement | null;
    if (nextActionElement) nextActionElement.classList.toggle('disable', !isMatch);
    const prevActionElement = this.searchBarElement.querySelector(QUERY_SELECTOR.prevAction) as HTMLSpanElement | null;
    if (prevActionElement) prevActionElement.classList.toggle('disable', !isMatch);
  }

  private resetSearchMatchCounter(): void {
    this.handleSearchMatchCounter({ resultIndex: -1, resultCount: 0 });
  }

  private handleSwitchControl(type: ISearchBarControlType): void {
    if (this.options[type] === undefined) {
      this.options[type] = true;
    } else {
      this.options[type] = !this.options[type];
    }

    const toggleElement = this.searchBarElement.querySelector(
      QUERY_SELECTOR[`${type}Control`],
    ) as HTMLButtonElement | null;
    if (!toggleElement) return;

    const active = Boolean(this.options[type]);
    toggleElement.classList.toggle('active', active);

    this.handleRenderSearchMatches();
  }

  private handleRenderSearchMatches(): void {
    this.searchAddon.clearDecorations();

    if (this.searchValue) {
      this.searchAddon.clearDecorations();
      this.searchAddon.findNext(this.searchValue, {
        ...this.options,
        incremental: true,
      });
    } else {
      this.resetSearchMatchCounter();
    }
  }

  private handleInputChange(e: KeyboardEvent): void {
    this.searchValue = (e.target as HTMLInputElement).value;
    this.searchAddon.findNext(this.searchValue, {
      ...this.options,
      incremental: e.key !== 'Enter',
    });
  }

  private handleSwitchRegexControl(_e: MouseEvent): void {
    this.handleSwitchControl('regex');
  }

  private handleSwitchWholeWordControl(_e: MouseEvent): void {
    this.handleSwitchControl('wholeWord');
  }

  private handleSwitchCaseSensitiveControl(_e: MouseEvent): void {
    this.handleSwitchControl('caseSensitive');
  }

  private handleFindPrevAction(_e: MouseEvent): void {
    this.searchAddon.findPrevious(this.searchValue, {
      ...this.options,
      incremental: undefined, // not effective for findPrevious
    });
  }

  private handleFindNextAction(_e: MouseEvent): void {
    this.searchAddon.findNext(this.searchValue, {
      ...this.options,
      incremental: false,
    });
  }

  private handleCloseAction(_e: MouseEvent): void {
    this.hidden();
  }
}
