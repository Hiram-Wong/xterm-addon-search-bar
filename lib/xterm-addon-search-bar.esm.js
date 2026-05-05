/*!
 * xterm-addon-search-bar.js v0.2.1
 * (c) 2018-2026 yinshuxun
 * Released under the MIT License.
 */
function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = ".xterm-search-bar__addon{background-color:var(--search-bar-widget-background);box-shadow:0 0 8px 2px var(--search-bar-widget-shadow);color:var(--search-bar-widget-foreground);height:33px;line-height:19px;padding:0 4px;position:absolute;right:16px;top:4px;transition:transform .2s linear;z-index:999}.xterm-search-bar__addon,.xterm-search-bar__addon .search-bar__inputs{align-items:center;border-radius:4px;display:flex;gap:4px;overflow:hidden}.xterm-search-bar__addon .search-bar__inputs{background-color:var(--search-bar-input-background);height:24px;padding:0 2px;position:relative}.xterm-search-bar__addon .search-bar__inputs .search-bar__input{background-color:inherit;border:0;color:var(--search-bar-input-foreground);height:24px;max-width:138px;outline:none;padding:2px 0;width:138px}.xterm-search-bar__addon .search-bar__inputs .search-bar__controls{align-items:center;display:flex;gap:2px;height:100%}.xterm-search-bar__addon .search-bar__inputs .search-bar__controls .search-bar__control{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;background-color:transparent;border-radius:4px;border-style:none;color:var(--search-bar-widget-foreground);cursor:pointer;font-size:12px;height:20px;padding:3px;text-align:center;text-decoration:none;text-rendering:auto;text-transform:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-user-select:none;vertical-align:middle;width:20px}.xterm-search-bar__addon .search-bar__inputs .search-bar__controls .search-bar__control:hover{background-color:var(--search-bar-inputOption-hoverBackground)}.xterm-search-bar__addon .search-bar__inputs .search-bar__controls .search-bar__control.active{background-color:var(--search-bar-inputOption-activeBackground)}.xterm-search-bar__addon .search-bar__match-counter{align-items:center;display:flex;flex:initial;font-size:12px;height:24px;min-width:32px;text-align:center;vertical-align:middle}.xterm-search-bar__addon .search-bar__actions{align-items:center;display:flex;height:100%}.xterm-search-bar__addon .search-bar__actions .search-bar__action{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;background-color:transparent;border-radius:4px;border-style:none;cursor:pointer;height:20px;padding:3px;pointer-events:auto;text-align:center;text-decoration:none;text-rendering:auto;text-transform:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-user-select:none;width:20px}.xterm-search-bar__addon .search-bar__actions .search-bar__action:hover{background-color:var(--search-bar-toolbar-hoverBackground)}.xterm-search-bar__addon .search-bar__actions .search-bar__action:before{background-color:var(--search-bar-input-foreground);content:\"\";display:inline-block;height:14px;width:14px}.xterm-search-bar__addon .search-bar__actions .search-bar__action.disable{cursor:default;opacity:.5;pointer-events:none}.xterm-search-bar__addon .search-bar__actions .search-bar__action.prev:before{-webkit-mask:url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjQgNnYzNk0xMiAxOCAyNCA2bDEyIDEyIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+\") no-repeat center /contain;mask:url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjQgNnYzNk0xMiAxOCAyNCA2bDEyIDEyIiBzdHJva2U9IiMzMzMiIHN0cm9rZS13aWR0aD0iNCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PC9zdmc+\") no-repeat center /contain}.xterm-search-bar__addon .search-bar__actions .search-bar__action.next:before{-webkit-mask:url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjQgNDJWNk0zNiAzMCAyNCA0MiAxMiAzMCIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==\") no-repeat center /contain;mask:url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMjQgNDJWNk0zNiAzMCAyNCA0MiAxMiAzMCIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==\") no-repeat center /contain}.xterm-search-bar__addon .search-bar__actions .search-bar__action.close:before{-webkit-mask:url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtOCA4IDMyIDMyTTggNDAgNDAgOCIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==\") no-repeat center /contain;mask:url(\"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtOCA4IDMyIDMyTTggNDAgNDAgOCIgc3Ryb2tlPSIjMzMzIiBzdHJva2Utd2lkdGg9IjQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjwvc3ZnPg==\") no-repeat center /contain}";
styleInject(css_248z);

const ADDON_MARKER_NAME = 'xterm-search-bar__addon';
const DEFAULT_SEARCH_DECORATIONS = {
    matchBackground: '#515c6a',
    matchBorder: '#6f7d8f',
    matchOverviewRuler: '#6f7d8f',
    activeMatchBackground: '#7c5e2f',
    activeMatchBorder: '#d7ba7d',
    activeMatchColorOverviewRuler: '#d7ba7d',
};
const DEFAULT_THEME = {
    widgetBackground: '#252526',
    widgetForeground: '#cccccc',
    widgetShadow: 'rgba(0, 0, 0, 0.36)',
    inputBackground: '#3c3c3c',
    inputForeground: '#cccccc',
    inputOptionActiveBackground: '#585959',
    inputOptionHoverBackground: '#4c4d4d',
    toolbarHoverBackground: 'rgba(90, 93, 94, 0.31)',
};
const THEME_CSS_VARIABLES = {
    widgetBackground: '--search-bar-widget-background',
    widgetForeground: '--search-bar-widget-foreground',
    widgetShadow: '--search-bar-widget-shadow',
    inputBackground: '--search-bar-input-background',
    inputForeground: '--search-bar-input-foreground',
    inputOptionActiveBackground: '--search-bar-inputOption-activeBackground',
    inputOptionHoverBackground: '--search-bar-inputOption-hoverBackground',
    toolbarHoverBackground: '--search-bar-toolbar-hoverBackground',
};
const QUERY_SELECTOR = {
    input: '.search-bar__input',
    caseSensitiveControl: '.search-bar__control.case-sensitive',
    wholeWordControl: '.search-bar__control.whole-word',
    regexControl: '.search-bar__control.regex',
    matchCounter: '.search-bar__match-counter',
    closeAction: '.search-bar__action.close',
    prevAction: '.search-bar__action.prev',
    nextAction: '.search-bar__action.next',
};

class SearchBarAddon {
    options = {};
    theme = {};
    terminal;
    searchAddon;
    resultChangeDisposable;
    searchBarElement;
    searchValue = '';
    constructor(options = {}) {
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
    activate(terminal) {
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
    dispose() {
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
    show() {
        if (!this.terminal || !this.terminal.element) {
            return;
        }
        if (this.searchBarElement) {
            this.searchBarElement.style.visibility = 'visible';
        }
        else {
            this.createSearchBarElement();
            this.bindSearchBarEvents();
        }
        this.searchBarElement.querySelector('input').focus();
    }
    /**
     * You can manually call close, also can click the close button on the bar
     * @memberof SearchBarAddon
     */
    hidden() {
        if (this.searchBarElement && this.terminal.element.parentElement) {
            this.searchBarElement.style.visibility = 'hidden';
        }
        this.searchAddon.clearActiveDecoration();
    }
    /**
     * You can customize your own style, and then add CSS string template after search bar init
     * @param {string} newStyle
     * @memberof SearchBarAddon
     */
    addNewStyle(newStyle) {
        let styleElement = document.getElementById(ADDON_MARKER_NAME);
        if (!styleElement) {
            styleElement = document.createElement('style');
            // styleElement.type = 'text/css'; // deprecated
            styleElement.id = ADDON_MARKER_NAME;
            document.getElementsByTagName('head')[0].appendChild(styleElement);
        }
        styleElement.appendChild(document.createTextNode(newStyle));
    }
    applyTheme(theme) {
        if (!this.searchBarElement)
            return;
        this.theme = { ...DEFAULT_THEME, ...(theme ?? {}) };
        for (const key of Object.keys(THEME_CSS_VARIABLES)) {
            this.searchBarElement.style.setProperty(THEME_CSS_VARIABLES[key], this.theme[key] ?? DEFAULT_THEME[key]);
        }
    }
    createSearchBarElement() {
        const terminalElement = this.terminal.element;
        terminalElement.style.position = 'relative';
        const parentElement = terminalElement.parentElement;
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
    bindSearchBarEvents() {
        this.on(QUERY_SELECTOR.input, 'keyup', (e) => this.handleInputChange(e));
        this.on(QUERY_SELECTOR.caseSensitiveControl, 'click', (e) => this.handleSwitchCaseSensitiveControl(e));
        this.on(QUERY_SELECTOR.wholeWordControl, 'click', (e) => this.handleSwitchWholeWordControl(e));
        this.on(QUERY_SELECTOR.regexControl, 'click', (e) => this.handleSwitchRegexControl(e));
        this.on(QUERY_SELECTOR.closeAction, 'click', (e) => this.handleCloseAction(e));
        this.on(QUERY_SELECTOR.prevAction, 'click', (e) => this.handleFindPrevAction(e));
        this.on(QUERY_SELECTOR.nextAction, 'click', (e) => this.handleFindNextAction(e));
    }
    on(selector, event, cb) {
        const parentElement = this.terminal.element.parentElement;
        parentElement.addEventListener(event, (e) => {
            const targetElement = this.searchBarElement.querySelector(selector);
            let target = e.target;
            while (target !== targetElement) {
                if (target === parentElement) {
                    target = null;
                    break;
                }
                target = target.parentElement;
            }
            if (target === targetElement) {
                cb.call(this, e);
                e.stopPropagation();
            }
        });
    }
    handleSearchMatchCounter(event) {
        const { resultIndex, resultCount } = event;
        const current = resultIndex >= 0 ? resultIndex + 1 : 0;
        const isMatch = resultCount > 0;
        const counterElement = this.searchBarElement.querySelector(QUERY_SELECTOR.matchCounter);
        if (counterElement)
            counterElement.textContent = `${current}/${resultCount}`;
        const nextActionElement = this.searchBarElement.querySelector(QUERY_SELECTOR.nextAction);
        if (nextActionElement)
            nextActionElement.classList.toggle('disable', !isMatch);
        const prevActionElement = this.searchBarElement.querySelector(QUERY_SELECTOR.prevAction);
        if (prevActionElement)
            prevActionElement.classList.toggle('disable', !isMatch);
    }
    resetSearchMatchCounter() {
        this.handleSearchMatchCounter({ resultIndex: -1, resultCount: 0 });
    }
    handleSwitchControl(type) {
        if (this.options[type] === undefined) {
            this.options[type] = true;
        }
        else {
            this.options[type] = !this.options[type];
        }
        const toggleElement = this.searchBarElement.querySelector(QUERY_SELECTOR[`${type}Control`]);
        if (!toggleElement)
            return;
        const active = Boolean(this.options[type]);
        toggleElement.classList.toggle('active', active);
        this.handleRenderSearchMatches();
    }
    handleRenderSearchMatches() {
        this.searchAddon.clearDecorations();
        if (this.searchValue) {
            this.searchAddon.clearDecorations();
            this.searchAddon.findNext(this.searchValue, {
                ...this.options,
                incremental: true,
            });
        }
        else {
            this.resetSearchMatchCounter();
        }
    }
    handleInputChange(e) {
        this.searchValue = e.target.value;
        this.searchAddon.findNext(this.searchValue, {
            ...this.options,
            incremental: e.key !== 'Enter',
        });
    }
    handleSwitchRegexControl(_e) {
        this.handleSwitchControl('regex');
    }
    handleSwitchWholeWordControl(_e) {
        this.handleSwitchControl('wholeWord');
    }
    handleSwitchCaseSensitiveControl(_e) {
        this.handleSwitchControl('caseSensitive');
    }
    handleFindPrevAction(_e) {
        this.searchAddon.findPrevious(this.searchValue, {
            ...this.options,
            incremental: undefined, // not effective for findPrevious
        });
    }
    handleFindNextAction(_e) {
        this.searchAddon.findNext(this.searchValue, {
            ...this.options,
            incremental: false,
        });
    }
    handleCloseAction(_e) {
        this.hidden();
    }
}

export { SearchBarAddon };
