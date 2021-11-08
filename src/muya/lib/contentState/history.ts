/** @format */

import { Block } from "types/muya";
import ContentState from ".";
import { UNDO_DEPTH } from "../config";
import Cursor from "../selection/cursor";
import { deepCopy } from "../utils";

export type IHistoryState = {
  blocks: Array<Block>;
  renderRange: Array<string | null>;
  cursor: Cursor | null;
};

class History {
  stack: Array<IHistoryState>;
  index: number;
  contentState: ContentState;
  pending: IHistoryState | null;

  constructor(contentState: ContentState) {
    this.stack = [];
    this.index = -1;
    this.contentState = contentState;
    this.pending = null;
  }

  setHistory(historyList: Array<IHistoryState>, index: number) {
    this.stack = historyList;
    this.index = index;
  }

  undo() {
    this.commitPending();
    if (this.index > 0) {
      this.index = this.index - 1;

      const state = deepCopy<IHistoryState>(this.stack[this.index]);
      const { blocks, cursor, renderRange } = state;
      cursor!.noHistory = true;
      this.contentState.blocks = blocks;
      this.contentState.renderRange = renderRange;
      this.contentState.cursor = cursor!;
      this.contentState.render();
    }
  }

  redo() {
    this.pending = null;
    const { index, stack } = this;
    const len = stack.length;
    if (index < len - 1) {
      this.index = index + 1;
      const state = <IHistoryState>deepCopy(stack[this.index]);
      const { blocks, cursor, renderRange } = state;
      cursor!.noHistory = true;
      this.contentState.blocks = blocks;
      this.contentState.renderRange = renderRange;
      this.contentState.cursor = cursor!;
      this.contentState.render();
    }
  }

  push(state: IHistoryState) {
    this.pending = null;
    this.stack.splice(this.index + 1);
    const copyState = <IHistoryState>deepCopy(state);
    this.stack.push(copyState);
    if (this.stack.length > UNDO_DEPTH) {
      this.stack.shift();
      this.index = this.index - 1;
    }
    this.index = this.index + 1;
  }

  pushPending(state: IHistoryState) {
    this.pending = state;
  }

  commitPending() {
    if (this.pending) {
      this.push(this.pending);
    }
  }

  clearHistory() {
    this.stack = [];
    this.index = -1;
    this.pending = null;
  }
}

export default History;
