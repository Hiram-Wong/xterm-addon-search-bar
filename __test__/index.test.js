import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { afterEach, beforeAll, describe, expect, jest, test } from '@jest/globals';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let activeDocument;
let SearchBarAddon;

function transpileSource(filename, transformSource = (source) => source) {
  const source = transformSource(fs.readFileSync(path.resolve(__dirname, '..', filename), 'utf8'));
  const output = ts.transpileModule(source, {
    compilerOptions: {
      esModuleInterop: true,
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2020,
    },
  });
  return output.outputText;
}

async function importSearchBarAddon() {
  const moduleDir = fs.mkdtempSync(path.join(os.tmpdir(), 'xterm-search-bar-test-'));
  const configModulePath = path.join(moduleDir, 'config.mjs');
  const indexModulePath = path.join(moduleDir, 'index.mjs');

  fs.writeFileSync(configModulePath, transpileSource('src/config.ts'));
  fs.writeFileSync(
    indexModulePath,
    transpileSource('src/index.ts', (source) =>
      source.replace(/^import\s+['"].+\.css['"];\s*$/m, '').replace("from './config'", "from './config.mjs'"),
    ),
  );

  return import(pathToFileURL(indexModulePath).href);
}

class FakeClassList {
  constructor(owner) {
    this.owner = owner;
    this.classes = new Set();
  }

  add(className) {
    this.classes.add(className);
    this.owner.className = Array.from(this.classes).join(' ');
  }

  remove(className) {
    this.classes.delete(className);
    this.owner.className = Array.from(this.classes).join(' ');
  }

  contains(className) {
    return this.classes.has(className);
  }

  toggle(className, force) {
    const shouldAdd = force === undefined ? !this.classes.has(className) : force;
    if (shouldAdd) {
      this.add(className);
    } else {
      this.remove(className);
    }
    return shouldAdd;
  }
}

class FakeElement {
  constructor(tagName = 'div') {
    this.tagName = tagName.toUpperCase();
    this.children = [];
    this.parentElement = null;
    this.listeners = {};
    this.style = {
      values: {},
      setProperty: jest.fn((name, value) => {
        this.style.values[name] = value;
      }),
      getPropertyValue: (name) => this.style.values[name],
      position: '',
      visibility: '',
    };
    this.classList = new FakeClassList(this);
    this.className = '';
    this.textContent = '';
    this.value = '';
    this.focus = jest.fn();
  }

  set className(value) {
    this._className = value;
    if (this.classList) {
      this.classList.classes = new Set(value.split(/\s+/).filter(Boolean));
    }
  }

  get className() {
    return this._className;
  }

  set innerHTML(_value) {
    this.children = [];
    const inputs = new FakeElement('div');
    inputs.className = 'search-bar__inputs';
    const input = new FakeElement('input');
    input.className = 'search-bar__input';
    const controls = new FakeElement('div');
    controls.className = 'search-bar__controls';
    const caseSensitive = new FakeElement('button');
    caseSensitive.className = 'search-bar__control case-sensitive';
    const wholeWord = new FakeElement('button');
    wholeWord.className = 'search-bar__control whole-word';
    const regex = new FakeElement('button');
    regex.className = 'search-bar__control regex';
    controls.appendChild(caseSensitive);
    controls.appendChild(wholeWord);
    controls.appendChild(regex);
    inputs.appendChild(input);
    inputs.appendChild(controls);

    const counter = new FakeElement('div');
    counter.className = 'search-bar__match-counter';
    counter.textContent = '0/0';

    const actions = new FakeElement('div');
    actions.className = 'search-bar__actions';
    const prev = new FakeElement('button');
    prev.className = 'search-bar__action prev disable';
    const next = new FakeElement('button');
    next.className = 'search-bar__action next disable';
    const close = new FakeElement('button');
    close.className = 'search-bar__action close';
    actions.appendChild(prev);
    actions.appendChild(next);
    actions.appendChild(close);

    this.appendChild(inputs);
    this.appendChild(counter);
    this.appendChild(actions);
  }

  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  addEventListener(event, listener) {
    this.listeners[event] = this.listeners[event] || [];
    this.listeners[event].push(listener);
  }

  dispatchEvent(event) {
    for (const listener of this.listeners[event.type] || []) {
      listener(event);
    }
  }

  querySelector(selector) {
    return findElement(this, selector);
  }
}

function matchesSelector(element, selector) {
  if (selector === 'input') {
    return element.tagName === 'INPUT';
  }
  const classes = selector
    .split('.')
    .filter(Boolean)
    .map((part) => part.trim());
  return classes.length > 0 && classes.every((className) => element.classList.contains(className));
}

function findElement(root, selector) {
  if (matchesSelector(root, selector)) {
    return root;
  }
  for (const child of root.children) {
    const match = findElement(child, selector);
    if (match) {
      return match;
    }
  }
  return null;
}

function createDocument() {
  const head = new FakeElement('head');
  const body = new FakeElement('body');
  return {
    head,
    body,
    createElement: (tagName) => new FakeElement(tagName),
    createTextNode: (text) => ({ textContent: text, parentElement: null }),
    getElementsByTagName: (tagName) => (tagName === 'head' ? [head] : []),
    querySelector: (selector) => findElement(body, selector),
  };
}

function createSearchAddon() {
  let resultListener = null;
  return {
    clearActiveDecoration: jest.fn(),
    clearDecorations: jest.fn(),
    findNext: jest.fn(),
    findPrevious: jest.fn(),
    onDidChangeResults: jest.fn((listener) => {
      resultListener = listener;
      return { dispose: jest.fn() };
    }),
    emitResults(event) {
      resultListener(event);
    },
  };
}

function createAddon(options = {}) {
  activeDocument = createDocument();
  global.document = activeDocument;
  globalThis.document = activeDocument;
  return createAddonInActiveDocument(options);
}

function createAddonInActiveDocument(options = {}) {
  const terminalParent = new FakeElement('div');
  const terminalElement = new FakeElement('div');
  terminalParent.appendChild(terminalElement);
  document.body.appendChild(terminalParent);

  const searchAddon = createSearchAddon();
  const addon = new SearchBarAddon({ searchAddon, ...options });
  addon.activate({ element: terminalElement });
  addon.show();

  return { addon, searchAddon, terminalParent, terminalElement };
}

function dispatchFromParent(parent, type, target, extra = {}) {
  parent.dispatchEvent({
    type,
    target,
    stopPropagation: jest.fn(),
    ...extra,
  });
}

describe('SearchBarAddon', () => {
  beforeAll(async () => {
    ({ SearchBarAddon } = await importSearchBarAddon());
  });

  afterEach(() => {
    activeDocument = undefined;
    delete global.document;
    delete globalThis.document;
    jest.restoreAllMocks();
  });

  test('applies constructor theme as search bar CSS variables', () => {
    createAddon({
      theme: {
        widgetBackground: '#111111',
        inputBackground: '#222222',
        toolbarHoverBackground: 'rgba(1, 2, 3, 0.5)',
      },
    });

    const element = document.querySelector('.xterm-search-bar__addon');
    expect(element.style.getPropertyValue('--search-bar-widget-background')).toBe('#111111');
    expect(element.style.getPropertyValue('--search-bar-input-background')).toBe('#222222');
    expect(element.style.getPropertyValue('--search-bar-toolbar-hoverBackground')).toBe('rgba(1, 2, 3, 0.5)');
    expect(element.style.getPropertyValue('--search-bar-widget-foreground')).toBe('#cccccc');
  });

  test('updates match counter and navigation disabled state from search results', () => {
    const { searchAddon } = createAddon();

    searchAddon.emitResults({ resultIndex: 2, resultCount: 5 });

    expect(document.querySelector('.search-bar__match-counter').textContent).toBe('3/5');
    expect(document.querySelector('.search-bar__action.prev').classList.contains('disable')).toBe(false);
    expect(document.querySelector('.search-bar__action.next').classList.contains('disable')).toBe(false);

    searchAddon.emitResults({ resultIndex: -1, resultCount: 0 });

    expect(document.querySelector('.search-bar__match-counter').textContent).toBe('0/0');
    expect(document.querySelector('.search-bar__action.prev').classList.contains('disable')).toBe(true);
    expect(document.querySelector('.search-bar__action.next').classList.contains('disable')).toBe(true);
  });

  test('searches incrementally on input and non-incrementally on enter', () => {
    const { searchAddon, terminalParent } = createAddon();
    const input = document.querySelector('.search-bar__input');

    input.value = 'needle';
    dispatchFromParent(terminalParent, 'keyup', input, { key: 'e' });
    expect(searchAddon.findNext).toHaveBeenLastCalledWith(
      'needle',
      expect.objectContaining({ incremental: true, regex: false, caseSensitive: false, wholeWord: false }),
    );

    dispatchFromParent(terminalParent, 'keyup', input, { key: 'Enter' });
    expect(searchAddon.findNext).toHaveBeenLastCalledWith('needle', expect.objectContaining({ incremental: false }));
  });

  test('handles input events for multiple addon instances on the same page', () => {
    activeDocument = createDocument();
    global.document = activeDocument;
    globalThis.document = activeDocument;

    const first = createAddonInActiveDocument();
    const second = createAddonInActiveDocument();
    const firstInput = first.terminalParent.querySelector('.search-bar__input');
    const secondInput = second.terminalParent.querySelector('.search-bar__input');

    firstInput.value = 'first';
    secondInput.value = 'second';
    dispatchFromParent(second.terminalParent, 'keyup', secondInput, { key: 'd' });

    expect(first.searchAddon.findNext).not.toHaveBeenCalled();
    expect(second.searchAddon.findNext).toHaveBeenCalledWith('second', expect.objectContaining({ incremental: true }));
  });

  test('switching a control clears cached decorations and recalculates matches with new options', () => {
    const { searchAddon, terminalParent } = createAddon();
    const input = document.querySelector('.search-bar__input');
    const caseSensitive = document.querySelector('.search-bar__control.case-sensitive');

    input.value = 'needle';
    dispatchFromParent(terminalParent, 'keyup', input, { key: 'e' });
    searchAddon.clearDecorations.mockClear();
    searchAddon.findNext.mockClear();

    dispatchFromParent(terminalParent, 'click', caseSensitive);

    expect(caseSensitive.classList.contains('active')).toBe(true);
    expect(searchAddon.clearDecorations).toHaveBeenCalledTimes(2);
    expect(searchAddon.findNext).toHaveBeenCalledWith(
      'needle',
      expect.objectContaining({ caseSensitive: true, incremental: true }),
    );
  });

  test('switching a control without a search term resets counter and disables navigation', () => {
    const { searchAddon, terminalParent } = createAddon();
    const regex = document.querySelector('.search-bar__control.regex');

    dispatchFromParent(terminalParent, 'click', regex);

    expect(regex.classList.contains('active')).toBe(true);
    expect(searchAddon.clearDecorations).toHaveBeenCalled();
    expect(searchAddon.findNext).not.toHaveBeenCalled();
    expect(document.querySelector('.search-bar__match-counter').textContent).toBe('0/0');
    expect(document.querySelector('.search-bar__action.prev').classList.contains('disable')).toBe(true);
    expect(document.querySelector('.search-bar__action.next').classList.contains('disable')).toBe(true);
  });
});
