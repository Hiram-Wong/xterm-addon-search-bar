import type { ISearchOptions } from '@xterm/addon-search';

import type { ISearchBarTheme } from '../typings/index';

export const ADDON_MARKER_NAME = 'xterm-search-bar__addon';

export const DEFAULT_SEARCH_DECORATIONS: NonNullable<ISearchOptions['decorations']> = {
  matchBackground: '#515c6a',
  matchBorder: '#6f7d8f',
  matchOverviewRuler: '#6f7d8f',
  activeMatchBackground: '#7c5e2f',
  activeMatchBorder: '#d7ba7d',
  activeMatchColorOverviewRuler: '#d7ba7d',
};

export const DEFAULT_THEME: ISearchBarTheme = {
  widgetBackground: '#252526',
  widgetForeground: '#cccccc',
  widgetShadow: 'rgba(0, 0, 0, 0.36)',
  inputBackground: '#3c3c3c',
  inputForeground: '#cccccc',
  inputOptionActiveBackground: '#585959',
  inputOptionHoverBackground: '#4c4d4d',
  toolbarHoverBackground: 'rgba(90, 93, 94, 0.31)',
};

export const THEME_CSS_VARIABLES: Record<keyof ISearchBarTheme, string> = {
  widgetBackground: '--search-bar-widget-background',
  widgetForeground: '--search-bar-widget-foreground',
  widgetShadow: '--search-bar-widget-shadow',
  inputBackground: '--search-bar-input-background',
  inputForeground: '--search-bar-input-foreground',
  inputOptionActiveBackground: '--search-bar-inputOption-activeBackground',
  inputOptionHoverBackground: '--search-bar-inputOption-hoverBackground',
  toolbarHoverBackground: '--search-bar-toolbar-hoverBackground',
};

export const QUERY_SELECTOR = {
  input: '.search-bar__input',
  caseSensitiveControl: '.search-bar__control.case-sensitive',
  wholeWordControl: '.search-bar__control.whole-word',
  regexControl: '.search-bar__control.regex',
  matchCounter: '.search-bar__match-counter',
  closeAction: '.search-bar__action.close',
  prevAction: '.search-bar__action.prev',
  nextAction: '.search-bar__action.next',
};
