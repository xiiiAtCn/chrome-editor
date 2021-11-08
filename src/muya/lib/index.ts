/** @format */

import { Block, ContentState as State, ISearchOption } from "@/typings/muya";
import "../themes/default.css";
import "./assets/styles/index.css";
import { CLASS_OR_ID, MUYA_DEFAULT_OPTION } from "./config";
import ContentState from "./contentState";
import { IHistoryState } from "./contentState/history";
import ClickEvent from "./eventHandler/clickEvent";
import Clipboard from "./eventHandler/clipboard";
import DragDrop from "./eventHandler/dragDrop";
import EventCenter, { ICustom } from "./eventHandler/event";
import Keyboard from "./eventHandler/keyboard";
import MouseEvent from "./eventHandler/mouseEvent";
import Resize from "./eventHandler/resize";
import Cursor from "./selection/cursor";
import { IFloatOption } from "./ui/baseFloat";
import ToolTip from "./ui/tooltip";
import { wordCount } from "./utils";
import ExportHtml from "./utils/exportHtml";
import ExportMarkdown from "./utils/exportMarkdown";

export type IOption = {
  markdown: string;
  hideLinkPopup: boolean;
  footnote: boolean;
  mermaidTheme: string;
  sequenceTheme: string;
  superSubScript: boolean;
  isGitlabCompatibilityEnabled: boolean;
  fontSize: number;
  lineHeight: number;
  frontmatterType: string;
  orderListDelimiter: boolean;
  bulletListMarker: boolean;
  preferLooseListItem: boolean;
  autoCheck: boolean;
  autoPairBracket: boolean;
  autoPairMarkdownSyntax: boolean;
  autoPairQuote: boolean;
  disableHtml: boolean;
  imagePathPicker: any;
  imageAction(path: string | File, id: string, name?: string): Promise<string>;
  clipboardFilePath(): string;
  imagePathAutoComplete(value: string): Array<any>;
  focusMode: boolean;
  codeBlockLineNumbers: boolean;
  hideQuickInsertHint: boolean;
  spellcheckEnabled: boolean;
  trimUnnecessaryCodeBlockEmptyLines: boolean;
  vegaTheme: string;
  containerId?: string;
  preview?: boolean;
};

class Muya {
  static plugins: Array<{ plugin: any; options: any }> = [];

  options: IOption;
  markdown: string;
  container: HTMLElement;
  eventCenter: EventCenter;
  tooltip: ToolTip;
  contentState: State;
  clipboard: Clipboard;
  clickEvent: ClickEvent;
  keyboard: Keyboard;
  dragdrop: DragDrop;
  resize: Resize;
  mouseEvent: MouseEvent;

  static use<T>(plugin: any, options: Partial<IFloatOption & T> = {}) {
    this.plugins.push({
      plugin,
      options,
    });
  }

  constructor(container: HTMLElement, options?: IOption) {
    this.options = Object.assign({}, MUYA_DEFAULT_OPTION, options);
    const { markdown } = this.options;
    this.markdown = markdown;
    this.container = getContainer(container, this.options);
    this.eventCenter = new EventCenter();
    this.tooltip = new ToolTip(this);
    // UI plugins
    if (Muya.plugins.length) {
      for (const { plugin: Plugin, options: opts } of Muya.plugins) {
        // @ts-ignore
        this[Plugin.pluginName] = new Plugin(this, opts);
      }
    }

    // @ts-ignore
    this.contentState = new ContentState(this, this.options);
    this.clipboard = new Clipboard(this);
    this.clickEvent = new ClickEvent(this);
    this.keyboard = new Keyboard(this);
    this.dragdrop = new DragDrop(this);
    this.resize = new Resize(this);
    this.mouseEvent = new MouseEvent(this);
    this.init();
  }

  init() {
    const { container, contentState, eventCenter } = this;
    contentState.stateRender.setContainer(container.children[0]);
    eventCenter.subscribe("stateChange", this.dispatchChange);
    const { markdown } = this;
    const { focusMode } = this.options;
    this.setMarkdown(markdown);
    this.setFocusMode(focusMode);
    this.mutationObserver();
    eventCenter.attachDOMEvent(container, "focus", () => {
      eventCenter.dispatch("focus");
    });
    eventCenter.attachDOMEvent(container, "blur", () => {
      eventCenter.dispatch("blur");
    });
  }

  mutationObserver() {
    // Select the node that will be observed for mutations
    const { container, eventCenter } = this;

    // Options for the observer (which mutations to observe)
    const config = { childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback: MutationCallback = (mutationsList, observer) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          const { removedNodes, target } = mutation;
          // If the code executes any of the following `if` statements, the editor has gone wrong.
          // need to report bugs.
          if (removedNodes && removedNodes.length) {
            const hasTable = Array.from(removedNodes).some(
              (node) =>
                node.nodeType === 1 &&
                (node as HTMLElement).closest("table.ag-paragraph")
            );
            if (hasTable) {
              eventCenter.dispatch("crashed");
              console.warn("There was a problem with the table deletion.");
            }
          }

          if (
            (target as HTMLElement).getAttribute("id") === "ag-editor-id" &&
            (target as HTMLElement).childElementCount === 0
          ) {
            // TODO: the editor can not be input any more. report bugs and recovery...
            eventCenter.dispatch("crashed");
            console.warn("editor crashed, and can not be input any more.");
          }
        }
      }
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(container, config);
  }

  dispatchChange = () => {
    const { eventCenter } = this;
    const markdown = (this.markdown = this.getMarkdown());
    const wordCount = this.getWordCount(markdown);
    const cursor = this.getCursor();
    const history = this.getHistory();
    const toc = this.getTOC();

    eventCenter.dispatch("change", {
      markdown,
      wordCount,
      cursor,
      history,
      toc,
    });
  };

  dispatchSelectionChange = () => {
    const selectionChanges = this.contentState.selectionChange();

    this.eventCenter.dispatch("selectionChange", selectionChanges);
  };

  dispatchSelectionFormats = () => {
    const { formats } = this.contentState.selectionFormats();

    this.eventCenter.dispatch("selectionFormats", formats);
  };

  getMarkdown() {
    const blocks = this.contentState.getBlocks();
    const { isGitlabCompatibilityEnabled, listIndentation } = this.contentState;
    return new ExportMarkdown(
      blocks,
      listIndentation,
      isGitlabCompatibilityEnabled
    ).generate();
  }

  getHistory() {
    return this.contentState.getHistory();
  }

  getTOC() {
    return this.contentState.getTOC();
  }

  setHistory(history: { stack: Array<IHistoryState>; index: number }) {
    return this.contentState.setHistory(history);
  }

  clearHistory() {
    return this.contentState.history.clearHistory();
  }

  exportStyledHTML(options: any) {
    const { markdown } = this;
    return new ExportHtml(markdown, this).generate(options);
  }

  exportHtml() {
    const { markdown } = this;
    return new ExportHtml(markdown, this).renderHtml();
  }

  getWordCount(markdown: string) {
    return wordCount(markdown);
  }

  getCursor() {
    return this.contentState.getCodeMirrorCursor();
  }

  setMarkdown(markdown: string, cursor?: Cursor, isRenderCursor = true) {
    let newMarkdown = markdown;
    let isValid = false;
    if (cursor && cursor.anchor && cursor.focus) {
      const cursorInfo = this.contentState.addCursorToMarkdown(
        markdown,
        cursor
      )!;
      newMarkdown = cursorInfo.markdown;
      isValid = cursorInfo.isValid;
    }
    this.contentState.importMarkdown(newMarkdown);
    this.contentState.importCursor(!!cursor && isValid!);
    this.contentState.render(isRenderCursor);
    setTimeout(() => {
      this.dispatchChange();
    }, 0);
  }

  setCursor(cursor: Cursor) {
    const markdown = this.getMarkdown();
    const isRenderCursor = true;

    return this.setMarkdown(markdown, cursor, isRenderCursor);
  }

  createTable(tableChecker: { rows: number; columns: number }) {
    return this.contentState.createTable(tableChecker);
  }

  getSelection() {
    return this.contentState.selectionChange();
  }

  setFocusMode(bool: boolean) {
    const { container } = this;
    const { focusMode } = this.options;
    if (bool && !focusMode) {
      container.classList.add(CLASS_OR_ID.AG_FOCUS_MODE);
    } else {
      container.classList.remove(CLASS_OR_ID.AG_FOCUS_MODE);
    }
    this.options.focusMode = bool;
  }

  setFont({ fontSize, lineHeight }: { fontSize: string; lineHeight: number }) {
    if (fontSize) {
      this.options.fontSize = parseInt(fontSize, 10);
    }
    if (lineHeight) {
      this.options.lineHeight = lineHeight;
    }
    this.contentState.render(false);
  }

  setTabSize(tabSize: number) {
    if (!tabSize || typeof tabSize !== "number") {
      tabSize = 4;
    } else if (tabSize < 1) {
      tabSize = 1;
    } else if (tabSize > 4) {
      tabSize = 4;
    }
    this.contentState.tabSize = tabSize;
  }

  setListIndentation(listIndentation: number) {
    if (typeof listIndentation === "number") {
      if (listIndentation < 1 || listIndentation > 4) {
        listIndentation = 1;
      }
    } else if (listIndentation !== "dfm") {
      listIndentation = 1;
    }
    this.contentState.listIndentation = listIndentation;
  }

  updateParagraph(type: string) {
    this.contentState.updateParagraph(type);
  }

  duplicate() {
    this.contentState.duplicate();
  }

  deleteParagraph() {
    this.contentState.deleteParagraph();
  }

  insertParagraph(
    location: "before" | "after",
    text: string = "",
    outMost: boolean = false
  ) {
    this.contentState.insertParagraph(location, text, outMost);
  }

  editTable(data: { location: any; action: any; target: any }) {
    this.contentState.editTable(data);
  }

  hasFocus() {
    return document.activeElement === this.container;
  }

  focus() {
    this.contentState.setCursor();
    this.container.focus();
  }

  blur(isRemoveAllRange = false, unSelect = false) {
    if (isRemoveAllRange) {
      const selection = document.getSelection()!;
      selection.removeAllRanges();
    }

    if (unSelect) {
      this.contentState.selectedImage = null;
      this.contentState.selectedTableCells = null;
    }

    this.hideAllFloatTools();
    this.container.blur();
  }

  format(type: string) {
    this.contentState.format(type);
  }

  insertImage(imageInfo: Block) {
    this.contentState.insertImage(imageInfo);
  }

  search(value: string, opt: ISearchOption) {
    const { selectHighlight } = opt;
    this.contentState.search(value, opt);
    this.contentState.render(!!selectHighlight);
    return this.contentState.searchMatches;
  }

  replace(value: string, opt: ISearchOption) {
    this.contentState.replace(value, opt);
    this.contentState.render(false);
    return this.contentState.searchMatches;
  }

  find(action: "prev" | "next" /* pre or next */) {
    this.contentState.find(action);
    this.contentState.render(false);
    return this.contentState.searchMatches;
  }

  on(event: ICustom, listener: any) {
    this.eventCenter.subscribe(event, listener);
  }

  off(event: ICustom, listener: any) {
    this.eventCenter.unsubscribe(event, listener);
  }

  once(event: ICustom, listener: any) {
    this.eventCenter.subscribeOnce(event, listener);
  }

  undo() {
    this.contentState.history.undo();

    this.dispatchSelectionChange();
    this.dispatchSelectionFormats();
    this.dispatchChange();
  }

  redo() {
    this.contentState.history.redo();

    this.dispatchSelectionChange();
    this.dispatchSelectionFormats();
    this.dispatchChange();
  }

  selectAll() {
    if (!this.hasFocus() && !this.contentState.selectedTableCells) {
      return;
    }
    this.contentState.selectAll();
  }

  /**
   * Get all images' src from the given markdown.
   * @param {string} markdown you want to extract images from this markdown.
   */
  extractImages(markdown = this.markdown) {
    return this.contentState.extractImages(markdown);
  }

  copyAsMarkdown() {
    this.clipboard.copyAsMarkdown();
  }

  copyAsHtml() {
    this.clipboard.copyAsHtml();
  }

  pasteAsPlainText() {
    this.clipboard.pasteAsPlainText();
  }

  /**
   * Copy the anchor block contains the block with `info`. like copy as markdown.
   * @param {string|object} key the block key or block
   */
  copy(info: any) {
    return this.clipboard.copy("copyBlock", info);
  }

  setOptions(options: Partial<IOption>, needRender = false) {
    // FIXME: Just to be sure, disabled due to #1648.
    if (options.codeBlockLineNumbers) {
      options.codeBlockLineNumbers = false;
    }

    Object.assign(this.options, options);
    if (needRender) {
      this.contentState.render(false, true);
    }

    // Set quick insert hint visibility
    const hideQuickInsertHint = options.hideQuickInsertHint;
    if (typeof hideQuickInsertHint !== "undefined") {
      const hasClass = this.container.classList.contains(
        "ag-show-quick-insert-hint"
      );
      if (hideQuickInsertHint && hasClass) {
        this.container.classList.remove("ag-show-quick-insert-hint");
      } else if (!hideQuickInsertHint && !hasClass) {
        this.container.classList.add("ag-show-quick-insert-hint");
      }
    }

    // Set spellcheck container attribute
    const spellcheckEnabled = options.spellcheckEnabled;
    if (typeof spellcheckEnabled !== "undefined") {
      this.container.setAttribute("spellcheck", String(!!spellcheckEnabled));
    }

    if (options.bulletListMarker) {
      this.contentState.turndownConfig.bulletListMarker =
        options.bulletListMarker;
    }
  }

  hideAllFloatTools() {
    return this.keyboard.hideAllFloatTools();
  }

  /**
   * Replace the word range with the given replacement.
   *
   * @param {*} line A line block reference of the line that contains the word to
   *                 replace - must be a valid reference!
   * @param {*} wordCursor The range of the word to replace (line: "abc >foo< abc"
   *                       whereas `>`/`<` is start and end of `wordCursor`). This
   *                       range is replaced by `replacement`.
   * @param {string} replacement The replacement.
   * @param {boolean} setCursor Shoud we update the editor cursor?
   */
  replaceWordInline(
    line: Cursor,
    wordCursor: Cursor,
    replacement: string,
    setCursor = false
  ) {
    this.contentState.replaceWordInline(
      line,
      wordCursor,
      replacement,
      setCursor
    );
  }

  destroy() {
    this.contentState.clear();
    // this.quickInsert.destroy()
    // this.codePicker.destroy()
    // this.tablePicker.destroy()
    // this.emojiPicker.destroy()
    // this.imagePathPicker.destroy()
    this.eventCenter.detachAllDomEvents();
  }
}

/**
 * [ensureContainerDiv ensure container element is div]
 */
function getContainer(originContainer: HTMLElement, options: Partial<IOption>) {
  const { hideQuickInsertHint, spellcheckEnabled } = options;
  const container = document.createElement("div");
  const rootDom = document.createElement("div");
  const attrs = originContainer.attributes;
  // copy attrs from origin container to new div element
  Array.from(attrs).forEach((attr) => {
    container.setAttribute(attr.name, attr.value);
  });

  if (!hideQuickInsertHint) {
    container.classList.add("ag-show-quick-insert-hint");
  }

  container.setAttribute("contenteditable", String(true));
  container.setAttribute("autocorrect", String(false));
  container.setAttribute("autocomplete", "off");
  // NOTE: The browser is not able to correct misspelled words words without
  // a custom implementation like in Mark Text.
  container.setAttribute("spellcheck", String(!!spellcheckEnabled));
  container.appendChild(rootDom);
  originContainer.replaceWith(container);
  return container;
}

export default Muya;
