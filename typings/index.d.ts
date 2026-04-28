import type { ISearchOptions, SearchAddon } from '@xterm/addon-search';
import type { ITerminalAddon, Terminal } from '@xterm/xterm';

/**
 * Theme colors applied to the search bar through CSS custom properties.
 */
export interface ISearchBarTheme {
  widgetBackground: string;
  widgetForeground: string;
  widgetShadow: string;
  inputBackground: string;
  inputForeground: string;
  inputOptionActiveBackground: string;
  inputOptionHoverBackground: string;
  toolbarHoverBackground: string;
}

/**
 * Options used to configure the search bar addon.
 *
 * Search-related options are forwarded to `@xterm/addon-search`.
 */
export interface ISearchBarOption extends ISearchOptions {
  /**
   * The search addon instance that must also be loaded into the terminal.
   */
  searchAddon: SearchAddon;

  /**
   * Overrides for the default search bar theme.
   */
  theme: Partial<ISearchBarTheme>;
}

export type ISearchBarControlType = 'caseSensitive' | 'wholeWord' | 'regex';

export type ISearchBarAddonOptions = Partial<ISearchBarOption>;

export declare class SearchBarAddon implements ITerminalAddon {
  private options;
  private theme;
  private terminal;
  private readonly searchAddon;
  private resultChangeDisposable;
  private searchBarElement;
  private searchValue;

  constructor(options?: ISearchBarAddonOptions);

  activate(terminal: Terminal): void;

  dispose(): void;

  /**
   * Show the search bar and focus its input.
   */
  show(): void;

  /**
   * Hide the search bar and clear the active search decoration.
   */
  hidden(): void;

  /**
   * Append custom CSS to the search bar style element.
   */
  addNewStyle(newStyle: string): void;

  /**
   * Apply a new theme to the search bar.
   */
  applyTheme(theme: Partial<ISearchBarTheme>): void;

  private createSearchBarElement;
  private bindSearchBarEvents;
  private on;
  private handleSearchMatchCounter;
  private resetSearchMatchCounter;
  private handleSwitchControl;
  private handleRenderSearchMatches;
  private handleInputChange;
  private handleSwitchRegexControl;
  private handleSwitchWholeWordControl;
  private handleSwitchCaseSensitiveControl;
  private handleFindPrevAction;
  private handleFindNextAction;
  private handleCloseAction;
}
