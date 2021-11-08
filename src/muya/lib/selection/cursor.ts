/** @format */

import { IPosition } from "types/muya";
import { compareParagraphsOrder } from "./dom";

export type ICursorConstructConfig = {
  anchor?: IPosition | null;
  focus?: IPosition | null;
  start?: IPosition | null;
  end?: IPosition | null;
  noHistory?: boolean;
};

class Cursor {
  anchor!: IPosition;
  focus!: IPosition;
  start!: IPosition;
  end!: IPosition;
  noHistory = false;
  // You need to provide either `anchor`&&`focus` or `start`&&`end` or all.
  constructor({
    anchor,
    focus,
    start,
    end,
    noHistory = false,
  }: ICursorConstructConfig) {
    if (anchor && focus && start && end) {
      this.anchor = anchor;
      this.focus = focus;
      this.start = start;
      this.end = end;
    } else if (anchor && focus) {
      this.anchor = anchor;
      this.focus = focus;
      if (anchor.key === focus.key) {
        if (anchor.offset <= focus.offset) {
          this.start = this.anchor;
          this.end = this.focus;
        } else {
          this.start = this.focus;
          this.end = this.anchor;
        }
      } else {
        const anchorParagraph = document.querySelector(
          `#${anchor.key}`
        )! as HTMLElement;
        const focusParagraph = document.querySelector(
          `#${focus.key}`
        )! as HTMLElement;
        let order = 0;
        if (anchorParagraph && focusParagraph) {
          order = compareParagraphsOrder(anchorParagraph, focusParagraph);
        }

        if (order) {
          this.start = this.anchor;
          this.end = this.focus;
        } else {
          this.start = this.focus;
          this.end = this.anchor;
        }
      }
    } else {
      this.anchor = this.start = start!;
      this.focus = this.end = end!;
    }
    this.noHistory = noHistory;
  }
}

export default Cursor;
