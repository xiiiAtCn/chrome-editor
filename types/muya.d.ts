/** @format */

import { VNode } from "snabbdom";
import Muya from "src/muya/lib";
import ContentState from "src/muya/lib/contentState";
import StateRender from "src/muya/lib/parser/render";
import Cursor from "src/muya/lib/selection/cursor";
import { IEmoji } from "src/muya/lib/ui/emojis";

declare type InitConfig = {
  focusMode: boolean;
  markdown: string;
  preferLooseListItem: boolean;
  autoPairBracket: boolean;
  autoPairMarkdownSyntax: boolean;
  trimUnnecessaryCodeBlockEmptyLines: boolean;
  autoPairQuote: boolean;
  bulletListMarker: boolean;
  orderListDelimiter: boolean;
  tabSize: number;
  fontSize: number;
  lineHeight: number;
  codeBlockLineNumbers: boolean;
  listIndentation: boolean;
  frontmatterType: boolean;
  superSubScript: boolean;
  footnote: boolean;
  disableHtml: boolean;
  isGitlabCompatibilityEnabled: boolean;
  hideQuickInsertHint: boolean;
  hideLinkPopup: boolean;
  autoCheck: boolean;
  sequenceTheme: string;
  spellcheckEnabled: boolean;
  imageAction: (target: Muya) => void;
  imagePathPicker: (target: Muya) => void;
  clipboardFilePath: boolean;
  imagePathAutoComplete: boolean;
};

declare interface KeyBoard {
  hideAllFloatTools(): void;
}

declare interface Block {
  text?: string;
  type: string;
  editable?: boolean;
  functionType?: string;
  key: string;
  children?: Array<Block>;
  nextSibling: string | null;
  parent: string | null;
  preSibling: string | null;
  column?: number;
  align?: string;
  row?: number;
  info?: string;
  listItemType?: string;
  headingStyle?: string;
  token?: Token;
  imageId?: string;
  listType?: string;
  start?: number;
  bulletMarkerOrDelimiter?: boolean;
  checked?: boolean;
  isLooseListItem?: boolean;
  lang?: string;
  id?: string;
  history?: null;
  mathStyle?: string;
  marker?: any;
  alt?: string;
  src?: string;
  title?: string;
}

declare interface BackSpaceBlock {
  type: string;
  info?: string;
}

declare type IProp = {
  attrs?: {
    spellcheck?: string;
    contenteditable?: string;
    start?: number;
    end?: number;
    raw?: string;
    [key: string]: string | number | undefined;
  };
  props?: { href?: string; target?: string; [key: string]: string | undefined };
  dataset?: {
    [key: string]: any;
  };
  style?: {
    [key: string]: string | number;
  };
};

declare interface IRender {
  (dom: string, props: IProp, content?: string | Array<any>): string;

  (container: string, content?: string | Array<any>): string;
}

declare interface Anchor {
  key?: string;
  row?: number;
  position?: any;
  anchor?: Block;
  column?: number;
}

declare interface Focus {}

declare interface ISearchOption {
  isCaseSensitive?: boolean;
  isWholeWord?: boolean;
  isRegexp?: boolean;
  selectHighlight?: boolean;
  highlightIndex?: number;
  isSingle?: boolean;
}

declare interface IPosition {
  key: string;
  type?: string;
  block?: Block;
  offset: number;
  delata?: number;
  line?: number;
  ch?: number;
}

declare class Rule {
  exec(src: string): Array<string>;
}

declare interface Token {
  type: string;
  text?: string;
  raw?: string;
  content?: string;
  range?: {
    start: number;
    end: number;
  };
  parent?: Array<Token>;
  leftBracket?: string;
  label?: string;
  marker?: string;
  srcAndTitle?: string;
  attrs?: Record<string, string>;
  alt?: string;

  src?: string;
  backlash?: string | IRange;
  rightBracket?: string;
  leftHrefMarker?: string;
  href?: string;
  rightHrefMarker?: string;
  leftTitlespace?: string;
  titleMarker?: string;
  title?: string;
  rightTitleSpace?: string;
  children?: Array<Token> | string;
  hrefAndTitle?: string;
  anchor?: string;
  isFullLink?: boolean;
  escapeCharacter?: string;
  www?: string;
  url?: string;
  email?: string;
  linkType?: "www" | "url" | "email";
  isLink?: boolean;
  tag?: string;
  openTag?: string;
  closeTag?: string;
  lineBreak?: string;
  isAtEnd?: boolean;
  spaces?: string;
  highlights?: Array<IHighlight>;
  style?: any;
  lang?: string;
  codeBlockStyle?: string;
  mathStyle?: string;
  identifier?: string;
  headingStyle?: string;
  depth?: number;
  header?: string | Array<string>;
  align?: string | null | Array<string | null>;
  cells?: Array<string | Array<string>>;
  ordered?: boolean;
  listType?: "order" | "task" | "bullet";
  start?: string | number;
  checked?: boolean;
  listItemType?: "order" | "task" | "bullet";
  bulletMarkerOrDelimiter?: string;
  pre?: boolean;
  escaped?: boolean;
}

declare interface ImageToken extends Token {
  alt: string;
  imageId?: string;

  token: Token;
  key?: string;
}

declare interface LinkToken extends Token {
  anchor: string;
  isLink: boolean;
  href: string;
  email: string;
}

declare interface HTMLTagToken extends Token {
  tag: "u" | "sub" | "sup" | "mark";
  children: Array<Token>;
}

declare interface ExtendedHTMLElement extends HTMLElement {
  key: string;
  functionType: string;
}

declare class ExtendedState {
  findNextRowCell(cell: Block): Block | null;
  findPrevRowCell(cell: Block): Block | null;
  docArrowHandler(event: KeyboardEvent): void;
  arrowHandler(event: KeyboardEvent): void;

  createTableInFigure(
    options: {
      rows: number;
      columns: number;
    },
    tableContents?: Array<any>
  ): Block;
  createFigure(options: { rows: number; columns: number }): void;
  createTable(options: { rows: number; columns: number }): void;
  tableToolBarClick(type: string): void;
  editTable(
    options: { location: any; action: any; target: any },
    cellContentKey?: string
  ): void;

  checkBackspaceCase(): BackSpaceBlock | boolean | undefined;
  docBackspaceHandler(event: Event): any;
  backspaceHandler(event: Event): any;

  insertImage(option: Block): void;

  getTOC(): Array<{ content: string; lvl: number; slug: string }>;

  selectionFormats(cursor?: Cursor): {
    formats: Array<any>;
    tokens: Array<Token>;
    neighbors: Array<any>;
  };
  clearBlockFormat(block: Block, cursor: Cursor, type?: string): void;
  format(type: string): void;
  updateImage(block: Block, attrName: string, attrValue: string): void;
  replaceImage(
    oldToken: Block,
    newToken: { alt?: string; src: string; title?: string; type?: string }
  ): void;
  deleteImage(imageBlock: Block): void;
  selectImage(imageInfo: Block): void;

  handleCellMouseDown(event: MouseEvent): void;
  handleCellMouseMove(event: Event): void;
  handleCellMouseUp(event: Event): void;
  calculateSelectedCells(): void;
  setSelectedCellsStyle(): void;
  deleteSelectedTableCells(isCut?: boolean): void;
  isSingleCellSelected(): Block | null;
  isWholeTableSelected(): Block | null;
  handleMouseDown(event: Event): void;

  handleMouseMove(event: Event): void;

  handleMouseUp(event: Event): void;

  hideUnnecessaryBar(): void;
  calculateCurIndex(): void;
  setDragTargetStyle(): void;
  setSwitchStyle(): void;
  setDropTargetStyle(): void;
  switchTableData(): void;
  resetDragTableBar(): void;

  selectionChange(cursor?: Cursor): {
    start: IPosition;
    end: IPosition;
    affiliation: Array<Block>;
    cursorCoords: { x: number; y: number; width: number };
  };

  getCommonParent(): {
    parent: Block | null;
    startIndex?: number;
    endIndex?: number;
  };

  handleFrontMatter(): void;

  handleListMenu(paraType: string, insertMode: boolean): boolean;

  updateList(
    paragraph: Block,
    type: string,
    extra: any,
    childBlock: Block
  ): Block | void;

  handleLooseListItem(): void;

  handleCodeBlockMenu(): void;

  handleQuoteMenu(insertMode: boolean): void;

  insertContainerBlock(functionType: string, block: Block): void;

  createContainerBlock(functionType: string, value: string, style?: any): Block;

  showTablePicker(): void;

  insertHtmlBlock(block: Block): void;

  createHtmlBlock(code: string): Block;

  createPreAndPreview(
    type: string,
    code?: string
  ): { preBlock: Block; preview: Block };

  initHtmlBlock(block: Block): Block;

  updateParagraph(paraType: string, insertMode?: boolean): void;
  isAllowedTransformation(
    block: Block,
    paraType: string,
    flag: boolean
  ): boolean;

  getTypeFromBlock(block: Block): string | null;

  insertParagraph(
    location: "before" | "after",
    text?: string,
    outMost?: boolean
  ): void;
  getPreBlock(block: Block): Block | null;
  duplicate(): void;
  deleteParagraph(blockKey?: string): void;

  isSelectAll(): boolean;

  selectAllContent(): void;

  selectAll(): void;

  selectTable(table: Block): void;

  isWholeTableSelected(): Block | null;

  updateToParagraph(parentBlock: Block, startBlock: Block): void;

  checkInlineUpdate(preBlock: Block): void;

  clickHandler(event: MouseEvent): void;
  checkNeedRender(cursor?: Cursor): boolean;

  setCheckBoxState(checkbox: HTMLInputElement, checked: boolean): void;
  updateParentsCheckBoxState(checkbox: HTMLInputElement): void;

  updateChildrenCheckBoxState(
    checkbox: HTMLInputElement,
    checked: boolean
  ): void;

  listItemCheckBoxClick(checkbox: HTMLInputElement): void;

  checkEditLanguage(): { lang: string; paragraph: Element | null };

  selectLanguage(paragraph: HTMLElement, lang: string): void;

  updateCodeLanguage(block: Block, lang: string): void;

  updateMathBlock(block: Block): boolean;

  codeBlockUpdate(block: Block, code?: string, lang?: string): boolean;

  copyCodeBlock(event: Event): void;

  resizeLineNumber(): void;

  initContainerBlock(functionType: string, block: Block, style?: any): Block;

  handleContainerBlockClick(figureEle: HTMLElement): void;

  docCutHandler(event: Event): void;

  cutHandler(): void;

  getClipBoradData(): { html: string; text: string };

  htmlToMarkdown(htmlData: string, keeps?: Array<any>): string;

  docCopyHandler(event: ClipboardEvent): void;

  copyHandler(event: ClipboardEvent, type: string, copyInfo?: any): void;

  replaceWordInline(
    line: Cursor,
    wordCursor: Cursor,
    replacement: string,
    setCursor?: boolean
  ): void;

  docDeleteHandler(event: Event): void;

  deleteHandler(event: Event): void;

  hideGhost(): void;

  createGhost(event: MouseEvent): void;

  dragoverHandler(event: DragEvent): void;

  dragleaveHandler(event: Event): void;

  dropHandler(event: DragEvent): void;

  checkQuickInsert(block: Block): boolean;

  checkCursorInTokenType(
    functionType: string,
    text: string,
    offset: number,
    type: string
  ): boolean;

  checkNotSameToken(
    functionType: string,
    oldText: string,
    text: string
  ): boolean;

  inputHandler(event: InputEvent, notEqual?: boolean): void;

  unlink(linkInfo: Block): void;

  checkPasteType(start: Block, fragment: Block): "MERGE" | "NEWLINE";

  checkCopyType(html: string, text: string): "htmlToMd" | "copyAsHtml" | string;

  standardizeHTML(html: string): void;

  pasteImage(event: ClipboardEvent): Promise<string | File | null>;

  docPasteHandler(event: ClipboardEvent): void;

  pasteHandler(
    event: ClipboardEvent,
    type?: string,
    rawText?: string,
    rawHtml?: string
  ): void;

  html2State(html: string): Array<Block> | undefined;

  getCodeMirrorCursor(): void;

  addCursorToMarkdown(
    markdown: string,
    cursor: Cursor
  ): { markdown: string; isValid: boolean } | undefined;

  importCursor(hasCursor: boolean): void;

  importMarkdown(markdown: string): void;

  extractImages(markdown: string): void;

  replaceOne(match: IMatch, value: string): void;

  replace(replaceValue: string, options?: { isSingle?: boolean }): void;

  search(
    value: string,
    options?: ISearchOption
  ): Array<{ key: string; start: number; end: number }>;

  setCursorToHighlight(): void;

  find(action: "prev" | "next"): void;

  findNextCell(block: Block): Block | undefined;

  findPreviousCell(block: Block): Block | undefined;

  isUnindentableListItem(block: Block): boolean | "REPLACEMENT" | "INDENT";

  isIndentableListItem(): boolean | string | null;

  unindentListItem(block: Block, type: string): void;

  indentListItem(): void;

  insertTab(): void;

  checkCursorAtEndFormat(
    text: string,
    offset: number
  ): { offset: number; text?: string } | null;

  tabHandler(event: KeyboardEvent): void;

  initTable(block: Block): Block | undefined;

  getTableBlock(): Block | undefined;

  tableBlockUpdate(block: Block): Block | boolean | undefined;

  checkSameMarkerOrDelimiter(list: Block, markerOrDelimiter: boolean): boolean;

  checkNeedRender(cursor?: Cursor): boolean;

  updateThematicBreak(block: Block, hr: string, line: Block): void;
  updateTaskListItem(block: Block, type: string, taskList?: string): void;

  checkInlineUpdate(block: Block): void;

  updateAtxHeader(block: Block, atxHeader: string, line: Block): void;

  updateSetextHeader(block: Block, setextHeader: string, line: Block): void;

  updateBlockQuote(block: Block, line: Block): void;

  updateIndentCode(block: Block, line: Block): void;

  updateFootnote(block: Block, line: Block): Block;

  updateToParagraph(block: Block, line: Block): void;

  docEnterHandler(event: KeyboardEvent): void;

  enterHandler(event: KeyboardEvent): void;

  setEmoji(emoji: IEmoji): void;

  chopBlockByCursor(block: Block, key: string, offset: number): Block;

  chopBlock(block: Block): Block;

  createRow(row: Block, isHeader?: boolean): Block;

  createBlockLi(paragraphInListItem?: Block): Block;

  createTaskItemBlock(paragraphInListItem?: Block, checked?: boolean): Block;

  enterInEmptyParagraph(block: Block): void;

  updateHtmlBlock(block: Block): Block | boolean;

  createFootnote(identifier: string): void;

  markdownToState(markdown: string): Array<Block> | undefined;
}

export type MarkdownType =
  | "strong"
  | "del"
  | "em"
  | "inline_code"
  | "inline_math"
  | "html_tag"
  | "link"
  | "image";

export type ContentState = ExtendedState &
  typeof ExtendedState &
  typeof ContentState &
  ContentState;

export type IFootnote = {
  footnoteId: string;
  footnoteIdentifierId: number;
  order: number;
};

export type ILink = {
  href: string;
  title: string;
};

export type IMatch = { start: number; end: number; key: string };

declare interface IsolatedRender {
  renderBlock(
    this: WholeRender,
    parent: Block,
    block: Block,
    activeBlocks: Array<Block>,
    matches: Array<IMatch>,
    useCache?: boolean
  ): VNode;

  renderContainerBlock(
    this: WholeRender,
    parent: Block,
    block: Block,
    activeBlocks: Array<Block>,
    matches: Array<IMatch>,
    useCache: boolean
  ): string;

  renderIcon(block: Block): VNode;

  renderLeafBlock(
    this: WholeRender,
    parent: Block,
    block: Block,
    activeBlocks: Array<Block>,
    matches: Array<IMatch>,
    useCache: boolean
  ): VNode;

  autoLink(
    h: any,
    cursor: Cursor,
    block: Block,
    token: Token,
    outerClass: string
  ): Array<string>;
  autoLinkExtension(
    h: any,
    cursor: Cursor,
    block: Block,
    token: Token,
    outerClass: string
  ): Array<string>;
  highlight(
    h: any,
    block: Block,
    start: number,
    end: number,
    token: Token
  ): string;

  backlash(
    h: any,
    cursor: Cursor,
    block: Block,
    token: Token,
    outerClass: string
  ): Array<string>;

  codeFense(
    h: any,
    cursor: Cursor,
    block: Block,
    token: Token,
    outerClass: string
  ): Array<string>;

  del(
    h: any,
    cursor: Cursor,
    block: Block,
    token: Token,
    outerClass: string
  ): Array<string>;
  delEmStrongFac(
    type: string,
    h: any,
    cursor: Cursor,
    block: Block,
    token: Token,
    outerClass: string
  ): Array<string>;
  backlashInToken(
    h: any,
    backlash: string | IRange,
    outerClass: string,
    backlashStart: number,
    token: Token
  ): Array<string>;
  em(
    h: any,
    cursor: Cursor,
    block: Block,
    token: Token,
    outerClass: string
  ): Array<string>;
  footnoteIdentifier(
    h: any,
    cursor: Cursor,
    block: Block,
    token: Token,
    outerClass: string
  ): Array<string>;
  softLineBreak(
    h: any,
    cursor: Cursor,
    block: Block,
    token: Token,
    outerClass: string
  ): Array<string>;
  header(
    h: any,
    cursor: Cursor,
    block: Block,
    token: Token,
    outerClass: string
  ): Array<string>;
  hr(
    h: any,
    cursor: Cursor,
    block: Block,
    token: Token,
    outerClass: string
  ): Array<string>;
  htmlEscape(
    h: any,
    cursor: Cursor,
    block: Block,
    token: Token,
    outerClass: string
  ): Array<string>;
  htmlRuby(
    h: any,
    cursor: Cursor,
    block: Block,
    token: Token,
    outerClass: string
  ): Array<string>;
  htmlTag(
    h: any,
    cursor: Cursor,
    block: Block,
    token: Token,
    outerClass: string
  ): Array<string>;
  image(
    h: any,
    cursor: Cursor,
    block: Block,
    token: Token,
    outerClass: string
  ): Array<string>;
  loadImageAsync(
    imageInfo: ImageInfo,
    attrs: Record<string, any>,
    className?: string,
    imageClass?: string
  ): ImageLoadStatus;
  inlineCode(
    h: any,
    cursor: Cursor,
    block: Block,
    token: Token,
    outerClass: string
  ): Array<string>;
  displayMath(
    h: any,
    cursor: Cursor,
    block: Block,
    token: Token,
    outerClass: string
  ): Array<string>;
  multipleMath(
    h: any,
    cursor: Cursor,
    block: Block,
    token: Token,
    outerClass: string
  ): Array<string>;
  referenceDefinition(
    h: any,
    cursor: Cursor,
    block: Block,
    token: Token,
    outerClass: string
  ): Array<string>;
  referenceImage(
    h: any,
    cursor: Cursor,
    block: Block,
    token: Token,
    outerClass: string
  ): Array<string>;
  referenceLink(
    h: any,
    cursor: Cursor,
    block: Block,
    token: Token,
    outerClass: string
  ): Array<string>;
  hardLineBreak(
    h: any,
    cursor: Cursor,
    block: Block,
    token: Token,
    outerClass: string
  ): Array<string>;
  superSubScript(
    h: any,
    cursor: Cursor,
    block: Block,
    token: Token,
    outerClass: string
  ): Array<string>;
  tailHeader(
    h: any,
    cursor: Cursor,
    block: Block,
    token: Token,
    outerClass: string
  ): Array<string>;
  text(
    h: any,
    cursor: Cursor,
    block: Block,
    token: Token,
    outerClass: string
  ): Array<string>;
}

export type WholeRender = IsolatedRender & StateRender & typeof StateRender;

export type IHighlight = { start: number; end: number; active?: boolean };

export type ITokenizerConfig = {
  highlights?: Array<IHighlight>;
  hasBeginRules?: boolean;
  labels?: Map<string, any>;
  options?: any;
};

export class ImageLoadStatus {
  id: string;
  isSuccess: boolean;
  width?: number;
  height?: number;
}

export type ImageInfo = {
  src: string;
  isUnknownType: boolean;
  token?: {
    attrs: IState;
  };
};
export type IState = {
  alt: string;
  src: string;
  title: string;
};

export type IRange = {
  first: string;
  second: string;
};

export type IFormat = {
  type: string;
  tag?: string;
};
