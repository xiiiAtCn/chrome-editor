/** @format */

import { Anchor, Block } from "types/muya";
import Muya from "..";
import { DEFAULT_TURNDOWN_CONFIG, HAS_TEXT_BLOCK_REG } from "../config";
import escapeCharactersMap, {
  escapeCharacters,
} from "../parser/escapeCharacter";
import StateRender from "../parser/render";
import selection from "../selection";
import Cursor from "../selection/cursor";
import { deepCopy, getUniqueId } from "../utils";
import importMarkdown from "../utils/importMarkdown";
import arrowCtrl from "./arrowCtrl";
import backspaceCtrl from "./backspaceCtrl";
import clickCtrl from "./clickCtrl";
import codeBlockCtrl from "./codeBlockCtrl";
import containerCtrl from "./containerCtrl";
import copyCutCtrl from "./copyCutCtrl";
import coreApi from "./core";
import deleteCtrl from "./deleteCtrl";
import dragDropCtrl from "./dragDropCtrl";
import emojiCtrl from "./emojiCtrl";
import enterCtrl from "./enterCtrl";
import footnoteCtrl from "./footnoteCtrl";
import formatCtrl from "./formatCtrl";
import History, { IHistoryState } from "./history";
import htmlBlockCtrl from "./htmlBlock";
import imageCtrl from "./imageCtrl";
import inputCtrl from "./inputCtrl";
import linkCtrl from "./linkCtrl";
import paragraphCtrl from "./paragraphCtrl";
import pasteCtrl from "./pasteCtrl";
import searchCtrl from "./searchCtrl";
import tabCtrl from "./tabCtrl";
import tableBlockCtrl from "./tableBlockCtrl";
import tableDragBarCtrl from "./tableDragBarCtrl";
import tableSelectCellsCtrl from "./tableSelectCellsCtrl";
import tocCtrl from "./tocCtrl";
import updateCtrl from "./updateCtrl";

const prototypes = [
  coreApi,
  tabCtrl,
  enterCtrl,
  updateCtrl,
  backspaceCtrl,
  deleteCtrl,
  codeBlockCtrl,
  arrowCtrl,
  pasteCtrl,
  copyCutCtrl,
  tableBlockCtrl,
  tableDragBarCtrl,
  tableSelectCellsCtrl,
  paragraphCtrl,
  formatCtrl,
  searchCtrl,
  containerCtrl,
  htmlBlockCtrl,
  clickCtrl,
  inputCtrl,
  tocCtrl,
  emojiCtrl,
  imageCtrl,
  linkCtrl,
  dragDropCtrl,
  footnoteCtrl,
  importMarkdown,
];

type IStateOptions = {
  bulletListMarker: boolean;
};

export type ICell = {
  ele: HTMLElement;
  key: string;
  text: string;
  align: string;
  top: boolean;
  right: boolean;
  bottom: boolean;
  left: boolean;
};

class ContentState {
  blocks: Array<Block>;
  muya: Muya;

  exemption: Set<string>;

  stateRender: any;

  renderRange: Array<string | null>;

  currentCursor: Cursor | null;

  selectedBlock: Block | null;

  _selectedImage: Block | null;

  dropAnchor: Anchor | null;

  prevCursor: Cursor | null;

  historyTimer: number | null;

  history: History;

  turndownConfig: Record<string, any>;

  dragInfo: any;

  isDragTableBar: boolean;

  dragEventIds: Array<string>;

  tabSize!: number;

  cellSelectInfo: {
    tableId?: string;
    anchor: Anchor;
    focus?: Anchor | null;
    isStartSelect?: boolean;
    cells: Array<Array<HTMLElement>>;
    selectedCells?: Array<ICell>;
  } | null;

  isGitlabCompatibilityEnabled!: boolean;

  listIndentation!: number;

  _selectedTableCells: {
    tableId: string;
    row: number;
    column: number;
    cells: Array<any>;
  } | null;

  cellSelectEventIds: Array<string | boolean>;

  searchMatches!: {
    value: string; // the search value
    matches: Array<any>; // matches
    index: number; // active match
  };

  constructor(muya: Muya, options: IStateOptions) {
    const { bulletListMarker } = options;

    this.muya = muya;
    Object.assign(this, options);

    // Use to cache the keys which you don't want to remove.
    this.exemption = new Set();
    this.blocks = [this.createBlockP()];
    this.stateRender = new StateRender(muya);
    this.renderRange = [null, null];
    this.currentCursor = null;
    // you'll select the outmost block of current cursor when you click the front icon.
    this.selectedBlock = null;
    this._selectedImage = null;
    this.dropAnchor = null;
    this.prevCursor = null;
    this.historyTimer = null;
    this.history = new History(this);
    this.turndownConfig = Object.assign({}, DEFAULT_TURNDOWN_CONFIG, {
      bulletListMarker,
    });
    // table drag bar
    this.dragInfo = null;
    this.isDragTableBar = false;
    this.dragEventIds = [];
    // table cell select
    this.cellSelectInfo = null;
    this._selectedTableCells = null;
    this.cellSelectEventIds = [];
    this.init();
  }

  set selectedTableCells(info) {
    const oldSelectedTableCells = this._selectedTableCells;
    if (!info && !!oldSelectedTableCells) {
      const selectedCells =
        this.muya.container.querySelectorAll(".ag-cell-selected");

      for (const cell of Array.from(selectedCells)) {
        cell.classList.remove("ag-cell-selected");
        cell.classList.remove("ag-cell-border-top");
        cell.classList.remove("ag-cell-border-right");
        cell.classList.remove("ag-cell-border-bottom");
        cell.classList.remove("ag-cell-border-left");
      }
    }
    this._selectedTableCells = info;
  }

  get selectedTableCells() {
    return this._selectedTableCells;
  }

  set selectedImage(image) {
    const oldSelectedImage = this._selectedImage;
    // if there is no selected image, remove selected status of current selected image.
    if (!image && oldSelectedImage) {
      const selectedImages = this.muya.container.querySelectorAll(
        ".ag-inline-image-selected"
      );
      for (const img of selectedImages) {
        img.classList.remove("ag-inline-image-selected");
      }
    }
    this._selectedImage = image;
  }

  get selectedImage() {
    return this._selectedImage;
  }

  set cursor(cursor: Cursor) {
    let temp;
    if (!(cursor instanceof Cursor)) {
      temp = new Cursor(cursor);
    } else {
      temp = cursor;
    }

    this.prevCursor = this.currentCursor;
    this.currentCursor = temp;

    const getHistoryState = () => {
      const { blocks, renderRange, currentCursor } = this;
      return {
        blocks,
        renderRange,
        cursor: currentCursor,
      };
    };

    if (!cursor.noHistory) {
      if (
        this.prevCursor &&
        ((cursor.start && this.prevCursor.start.key !== cursor.start.key) ||
          (cursor.end && this.prevCursor.end.key !== cursor.end.key))
      ) {
        // Push history immediately
        this.history.push(getHistoryState());
      } else {
        // WORKAROUND: The current engine doesn't support a smart history and we
        // need to store the whole state. Therefore, we push history only when the
        // user stops typing. Pushing one pending entry allows us to commit the
        // change before an undo action is triggered to partially solve #1321.
        if (this.historyTimer) clearTimeout(this.historyTimer);
        this.history.pushPending(getHistoryState());

        this.historyTimer = window.setTimeout(() => {
          this.history.commitPending();
        }, 2000);
      }
    }
  }

  get cursor() {
    return this.currentCursor!;
  }

  init() {
    const lastBlock = this.getLastBlock();
    const { key, text } = lastBlock!;
    const offset = text!.length;
    this.searchMatches = {
      value: "", // the search value
      matches: [], // matches
      index: -1, // active match
    };
    this.cursor = new Cursor({
      start: { key: key!, offset },
      end: { key: key!, offset },
    });
  }

  getHistory() {
    const { stack, index } = this.history;
    return { stack, index };
  }

  setHistory({ stack, index }: { stack: Array<IHistoryState>; index: number }) {
    this.history.setHistory(stack, index);
  }

  setCursor() {
    selection.setCursorRange(this.cursor!);
  }

  setNextRenderRange() {
    const { start, end } = this.cursor;
    const startBlock = this.getBlock(start?.key);
    const endBlock = this.getBlock(end?.key);
    const startOutMostBlock = this.findOutMostBlock(startBlock!);
    const endOutMostBlock = this.findOutMostBlock(endBlock!);

    this.renderRange = [
      startOutMostBlock.preSibling,
      endOutMostBlock.nextSibling,
    ];
  }

  postRender() {
    // @ts-ignore
    this.resizeLineNumber();
  }

  render(isRenderCursor = true, clearCache = false) {
    const {
      blocks,
      searchMatches: { matches, index },
    } = this;
    const activeBlocks = this.getActiveBlocks();
    if (clearCache) {
      this.stateRender.tokenCache.clear();
    }
    matches.forEach((m, i) => {
      m.active = i === index;
    });
    this.setNextRenderRange();
    this.stateRender.collectLabels(blocks);
    this.stateRender.render(blocks, activeBlocks, matches);
    if (isRenderCursor) {
      this.setCursor();
    } else {
      this.muya.blur();
    }
    this.postRender();
  }

  partialRender(isRenderCursor = true) {
    const {
      blocks,
      searchMatches: { matches, index },
    } = this;
    const activeBlocks = this.getActiveBlocks();
    const [startKey, endKey] = this.renderRange;
    matches.forEach((m, i) => {
      m.active = i === index;
    });
    const startIndex = startKey
      ? blocks.findIndex((block) => block.key === startKey)
      : 0;
    const endIndex = endKey
      ? blocks.findIndex((block) => block.key === endKey) + 1
      : blocks.length;
    const needRenderBlocks = blocks.slice(startIndex, endIndex);

    this.setNextRenderRange();
    this.stateRender.collectLabels(blocks);
    this.stateRender.partialRender(
      needRenderBlocks,
      activeBlocks,
      matches,
      startKey,
      endKey
    );
    if (isRenderCursor) {
      this.setCursor();
    } else {
      this.muya.blur();
    }
    this.postRender();
  }

  singleRender(block: Block, isRenderCursor = true) {
    const {
      blocks,
      searchMatches: { matches, index },
    } = this;
    const activeBlocks = this.getActiveBlocks();
    matches.forEach((m, i) => {
      m.active = i === index;
    });
    this.setNextRenderRange();
    this.stateRender.collectLabels(blocks);
    this.stateRender.singleRender(block, activeBlocks, matches);
    if (isRenderCursor) {
      this.setCursor();
    } else {
      this.muya.blur();
    }
    this.postRender();
  }

  /**
   * A block in Mark Text present a paragraph(block syntax in GFM) or a line in paragraph.
   * a `span` block must in a `p block` or `pre block` and `p block`'s children must be `span` blocks.
   */
  createBlock(type = "span", extras: Record<string, any> = {}) {
    const key = getUniqueId();
    const blockData: Block = {
      key,
      text: "",
      type,
      editable: true,
      parent: null,
      preSibling: null,
      nextSibling: null,
      children: [],
    };

    // give span block a default functionType `paragraphContent`
    if (type === "span" && !extras.functionType) {
      blockData.functionType = "paragraphContent";
    }

    if (extras.functionType === "codeContent" && extras.text) {
      const CHAR_REG = new RegExp(`(${escapeCharacters.join("|")})`, "gi");
      extras.text = extras.text.replace(CHAR_REG, (_: string, p: string) => {
        return escapeCharactersMap[p];
      });
    }

    Object.assign(blockData, extras);
    return blockData;
  }

  createBlockP(text = "") {
    const pBlock = this.createBlock("p");
    const contentBlock = this.createBlock("span", { text });
    this.appendChild(pBlock, contentBlock);
    return pBlock;
  }

  isCollapse(cursor = this.cursor) {
    const { start, end } = cursor!;
    return start.key === end.key && start.offset === end.offset;
  }

  // getBlocks
  getBlocks() {
    return this.blocks;
  }

  getCursor() {
    return this.cursor;
  }

  getBlock(key?: string | null): Block | null {
    if (!key) return null;
    let result = null;
    const travel = (blocks: Array<Block>) => {
      for (const block of blocks) {
        if (block.key === key) {
          result = block;
          return;
        }
        const { children } = block;
        if (children!.length) {
          travel(children!);
        }
      }
    };
    travel(this.blocks);
    return result;
  }

  copyBlock(origin: Block) {
    const copiedBlock = deepCopy<Block>(origin);
    const travel = (
      block: Block,
      parent: Block | null,
      preBlock: Block | null,
      nextBlock: Block | null
    ) => {
      const key = getUniqueId();
      block.key = key;
      block.parent = parent ? parent.key : null;
      block.preSibling = preBlock ? preBlock.key : null;
      block.nextSibling = nextBlock ? nextBlock.key : null;
      const { children } = block;
      const len = children!.length;
      if (children && len) {
        let i;
        for (i = 0; i < len; i++) {
          const b = children[i];
          const preB = i >= 1 ? children[i - 1] : null;
          const nextB = i < len - 1 ? children[i + 1] : null;
          travel(b, block, preB, nextB);
        }
      }
    };

    travel(copiedBlock, null, null, null);
    return copiedBlock;
  }

  getParent(block: Block): Block | null {
    if (block && block.parent) {
      return this.getBlock(block.parent);
    }
    return null;
  }

  // return block and its parents
  getParents(block: Block) {
    const result = [];
    result.push(block);
    let parent = this.getParent(block);
    while (parent) {
      result.push(parent);
      parent = this.getParent(parent);
    }
    return result;
  }

  getPreSibling(block: Block): Block | null {
    return block.preSibling ? this.getBlock(block.preSibling) : null;
  }

  getNextSibling(block: Block): Block | null {
    return block.nextSibling ? this.getBlock(block.nextSibling) : null;
  }

  /**
   * if target is descendant of parent return true, else return false
   * @param  {[type]}  parent [description]
   * @param  {[type]}  target [description]
   * @return {Boolean}        [description]
   */
  isInclude(parent: Block, target: Block): boolean {
    const children = parent.children!;
    if (children.length === 0) {
      return false;
    } else {
      if (children.some((child) => child.key === target.key)) {
        return true;
      } else {
        return children.some((child) => this.isInclude(child, target));
      }
    }
  }

  removeTextOrBlock(block: Block) {
    if (block.functionType === "languageInput") return;
    const checkerIn = (block: Block): boolean => {
      if (this.exemption.has(block.key!)) {
        return true;
      } else {
        const parent = this.getBlock(block.parent!);
        return parent ? checkerIn(parent) : false;
      }
    };

    const checkerOut = (block: Block): boolean => {
      const children = block.children!;
      if (children.length) {
        if (children.some((child) => this.exemption.has(child.key!))) {
          return true;
        } else {
          return children.some((child) => checkerOut(child));
        }
      } else {
        return false;
      }
    };

    if (checkerIn(block) || checkerOut(block)) {
      block.text = "";
      const { children } = block;
      if (children!.length) {
        children!.forEach((child) => this.removeTextOrBlock(child));
      }
    } else if (block.editable) {
      this.removeBlock(block);
    }
  }

  /**
   * remove blocks between before and after, and includes after block.
   */
  removeBlocks(
    before: Block,
    after: Block,
    isRemoveAfter = true,
    isRecursion = false
  ) {
    if (!isRecursion) {
      if (/td|th/.test(before.type)) {
        this.exemption.add(this.closest(before, "figure")!.key!);
      }
      if (/td|th/.test(after.type)) {
        this.exemption.add(this.closest(after, "figure")!.key!);
      }
    }
    let nextSibling = this.getBlock(before.nextSibling!);
    let beforeEnd = false;
    while (nextSibling) {
      if (nextSibling.key === after.key || this.isInclude(nextSibling, after)) {
        beforeEnd = true;
        break;
      }
      this.removeTextOrBlock(nextSibling);
      nextSibling = this.getBlock(nextSibling.nextSibling);
    }
    if (!beforeEnd) {
      const parent = this.getParent(before);
      if (parent) {
        this.removeBlocks(parent, after, false, true);
      }
    }
    let preSibling = this.getBlock(after.preSibling);
    let afterEnd = false;
    while (preSibling) {
      if (preSibling.key === before.key || this.isInclude(preSibling, before)) {
        afterEnd = true;
        break;
      }
      this.removeTextOrBlock(preSibling);
      preSibling = this.getBlock(preSibling.preSibling);
    }
    if (!afterEnd) {
      const parent = this.getParent(after);
      if (parent) {
        const removeAfter = isRemoveAfter && this.isOnlyRemoveableChild(after);
        this.removeBlocks(before, parent, removeAfter, true);
      }
    }
    if (isRemoveAfter) {
      this.removeTextOrBlock(after);
    }
    if (!isRecursion) {
      this.exemption.clear();
    }
  }

  removeBlock(block: Block, fromBlocks: Array<Block> | Block = this.blocks) {
    const remove = (blocks: Array<Block>, block: Block) => {
      const len = blocks.length;
      let i;
      for (i = 0; i < len; i++) {
        if (blocks[i].key === block.key) {
          const preSibling = this.getBlock(block.preSibling);
          const nextSibling = this.getBlock(block.nextSibling);

          if (preSibling) {
            preSibling.nextSibling = nextSibling ? nextSibling.key : null;
          }
          if (nextSibling) {
            nextSibling.preSibling = preSibling ? preSibling.key : null;
          }

          return blocks.splice(i, 1);
        } else {
          if (blocks[i].children!.length) {
            remove(blocks[i].children!, block);
          }
        }
      }
    };
    remove(
      fromBlocks instanceof Array ? fromBlocks : fromBlocks.children!,
      block
    );
  }

  getActiveBlocks() {
    const result = [];
    let block = this.getBlock(this.cursor?.start?.key);
    if (block) {
      result.push(block);
    }
    while (block && block.parent) {
      block = this.getBlock(block.parent);
      result.push(block);
    }
    return result;
  }

  insertAfter(newBlock: Block, oldBlock: Block) {
    const siblings = oldBlock.parent
      ? this.getBlock(oldBlock.parent)!.children
      : this.blocks;
    const oldNextSibling = this.getBlock(oldBlock.nextSibling);
    const index = this.findIndex(siblings, oldBlock);
    siblings!.splice(index + 1, 0, newBlock);
    oldBlock.nextSibling = newBlock.key;
    newBlock.parent = oldBlock.parent;
    newBlock.preSibling = oldBlock.key;
    if (oldNextSibling) {
      newBlock.nextSibling = oldNextSibling.key;
      oldNextSibling.preSibling = newBlock.key;
    }
  }

  insertBefore(newBlock: Block, oldBlock: Block) {
    const siblings = oldBlock.parent
      ? this.getBlock(oldBlock.parent)!.children
      : this.blocks;
    const oldPreSibling = this.getBlock(oldBlock.preSibling);
    const index = this.findIndex(siblings, oldBlock);
    siblings!.splice(index, 0, newBlock);
    oldBlock.preSibling = newBlock.key;
    newBlock.parent = oldBlock.parent;
    newBlock.nextSibling = oldBlock.key;
    newBlock.preSibling = null;

    if (oldPreSibling) {
      oldPreSibling.nextSibling = newBlock.key;
      newBlock.preSibling = oldPreSibling.key;
    }
  }

  findOutMostBlock(block: Block): Block {
    const parent = this.getBlock(block.parent);
    return parent ? this.findOutMostBlock(parent) : block;
  }

  findIndex(children: Array<Block> | undefined, block: Block) {
    if (!children) return -1;
    return children.findIndex((child) => child === block);
  }

  prependChild(parent: Block, block: Block) {
    block.parent = parent.key;
    block.preSibling = null;
    if (parent.children && parent.children.length) {
      block.nextSibling = parent.children[0].key;
    }
    parent.children?.unshift(block);
  }

  appendChild(parent: Block, block: Block) {
    const len = parent.children?.length;
    const lastChild = parent.children![len! - 1];
    parent.children?.push(block);
    block.parent = parent.key;
    if (lastChild) {
      lastChild.nextSibling = block.key;
      block.preSibling = lastChild.key;
    } else {
      block.preSibling = null;
    }
    block.nextSibling = null;
  }

  replaceBlock(newBlock: Block, oldBlock: Block) {
    const blockList = oldBlock.parent
      ? this.getParent(oldBlock)!.children
      : this.blocks;
    const index = this.findIndex(blockList, oldBlock);

    blockList!.splice(index, 1, newBlock);
    newBlock.parent = oldBlock.parent;
    newBlock.preSibling = oldBlock.preSibling;
    newBlock.nextSibling = oldBlock.nextSibling;
  }

  canInserFrontMatter(block: Block) {
    if (!block) return true;
    const parent = this.getParent(block)!;
    return (
      block.type === "span" &&
      !block.preSibling &&
      !parent.preSibling &&
      !parent.parent
    );
  }

  isFirstChild(block: Block) {
    return !block.preSibling;
  }

  isLastChild(block: Block) {
    return !block.nextSibling;
  }

  isOnlyChild(block: Block) {
    return !block.nextSibling && !block.preSibling;
  }

  isOnlyRemoveableChild(block: Block) {
    if (block.editable === false) return false;
    const parent = this.getParent(block);
    return (
      (parent ? parent.children! : this.blocks).filter(
        (child) => child.editable && child.functionType !== "languageInput"
      ).length === 1
    );
  }

  getLastChild(block: Block) {
    if (block) {
      const len = block.children!.length;
      if (len) {
        return block.children![len - 1];
      }
    }
    return null;
  }

  firstInDescendant(block: Block): Block | undefined {
    const children = block.children!;
    if (block.children!.length === 0 && HAS_TEXT_BLOCK_REG.test(block.type)) {
      return block;
    } else if (children.length) {
      if (
        children[0].type === "input" ||
        (children[0].type === "div" && children[0].editable === false)
      ) {
        // handle task item
        return this.firstInDescendant(children[1]);
      } else {
        return this.firstInDescendant(children[0]);
      }
    }
  }

  lastInDescendant(block: Block): Block | undefined {
    if (block.children!.length === 0 && HAS_TEXT_BLOCK_REG.test(block.type)) {
      return block;
    } else if (block.children!.length) {
      const children = block.children;
      let lastChild = children![children!.length - 1];
      while (lastChild.editable === false) {
        lastChild = this.getPreSibling(lastChild)!;
      }
      return this.lastInDescendant(lastChild);
    }
  }

  findPreBlockInLocation(block: Block): Block | undefined {
    const parent = this.getParent(block);
    const preBlock = this.getPreSibling(block)!;
    if (
      block.preSibling &&
      preBlock.type !== "input" &&
      preBlock.type !== "div" &&
      preBlock.editable !== false
    ) {
      // handle task item and table
      return this.lastInDescendant(preBlock);
    } else if (parent) {
      return this.findPreBlockInLocation(parent);
    }
  }

  findNextBlockInLocation(block: Block): Block | undefined {
    const parent = this.getParent(block);
    const nextBlock = this.getNextSibling(block);

    if (nextBlock && nextBlock.editable !== false) {
      return this.firstInDescendant(nextBlock);
    } else if (parent) {
      return this.findNextBlockInLocation(parent);
    }
  }

  getPositionReference() {
    const { fontSize, lineHeight } = this.muya.options;
    const { start } = this.cursor!;
    const block = this.getBlock(start.key);
    const { x, y, width } = selection.getCursorCoords();
    const height = fontSize * lineHeight;
    const bottom = y + height;
    const right = x + width;
    const left = x;
    const top = y;
    return {
      getBoundingClientRect() {
        return { x, y, top, left, right, bottom, height, width };
      },
      clientWidth: width,
      clientHeight: height,
      id: block ? block.key : null,
    };
  }

  getFirstBlock() {
    return this.firstInDescendant(this.blocks[0]);
  }

  getLastBlock() {
    const { blocks } = this;
    const len = blocks.length;
    return this.lastInDescendant(blocks[len - 1]);
  }

  closest(block: Block | null, type: RegExp | string): Block | null {
    if (!block) {
      return null;
    }
    if (type instanceof RegExp ? type.test(block.type) : block.type === type) {
      return block;
    } else {
      const parent = this.getParent(block);
      return this.closest(parent, type);
    }
  }

  getAnchor(block: Block) {
    const { type, functionType } = block;
    if (type !== "span") {
      return null;
    }

    if (functionType === "codeContent" || functionType === "cellContent") {
      return this.closest(block, "figure") || this.closest(block, "pre");
    } else {
      return this.getParent(block);
    }
  }

  clear() {
    this.history.clearHistory();
  }
}

// @ts-ignore
prototypes.forEach((ctrl) => ctrl(ContentState));

export default ContentState;
