/** @format */

import { ContentState } from "types/muya";
import { IMAGE_EXT_REG, URL_REG } from "../config";
import Cursor from "../selection/cursor";
import { findNearestParagraph, findOutMostParagraph } from "../selection/dom";
import {
  checkImageContentType,
  getImageInfo as getImageSrc,
  getUniqueId,
  verticalPositionInRect,
} from "../utils";
import { getImageInfo } from "../utils/getImageInfo";
const GHOST_ID = "mu-dragover-ghost";
const GHOST_HEIGHT = 3;

const dragDropCtrl = (ContentState: ContentState) => {
  ContentState.prototype.hideGhost = function () {
    this.dropAnchor = null;
    const ghost = document.querySelector(`#${GHOST_ID}`);
    ghost && ghost.remove();
  };
  /**
   * create the ghost element.
   */
  ContentState.prototype.createGhost = function (event) {
    const target = event.target as HTMLElement;
    let ghost = null;
    const nearestParagraph = findNearestParagraph(target);
    const outmostParagraph = findOutMostParagraph(target);

    if (!outmostParagraph) {
      return this.hideGhost();
    }

    const block = this.getBlock(nearestParagraph!.id)!;
    let anchor = this.getAnchor(block);

    // dragover preview container
    if (!anchor && outmostParagraph) {
      anchor = this.getBlock(outmostParagraph.id);
    }

    if (anchor) {
      const anchorParagraph = this.muya.container.querySelector(
        `#${anchor.key}`
      )!;
      const rect = anchorParagraph.getBoundingClientRect();
      const position = verticalPositionInRect(event, rect);
      this.dropAnchor = {
        position,
        anchor,
      };
      // create ghost
      ghost = document.querySelector(`#${GHOST_ID}`) as HTMLElement;
      if (!ghost) {
        ghost = document.createElement("div");
        ghost.id = GHOST_ID;
        document.body.appendChild(ghost);
      }

      Object.assign(ghost.style, {
        width: `${rect.width}px`,
        left: `${rect.left}px`,
        top:
          position === "up"
            ? `${rect.top - GHOST_HEIGHT}px`
            : `${rect.top + rect.height}px`,
      });
    }
  };

  ContentState.prototype.dragoverHandler = function (event) {
    // Cancel to allow tab drag&drop.
    if (!event.dataTransfer!.types.length) {
      event.dataTransfer!.dropEffect = "none";
      return;
    }

    if (event.dataTransfer!.types.includes("text/uri-list")) {
      const items = Array.from(event.dataTransfer!.items);
      const hasUriItem = items.some((i) => i.type === "text/uri-list");
      const hasTextItem = items.some((i) => i.type === "text/plain");
      const hasHtmlItem = items.some((i) => i.type === "text/html");
      if (hasUriItem && hasHtmlItem && !hasTextItem) {
        this.createGhost(event);
        event.dataTransfer!.dropEffect = "copy";
      }
    }

    if (event.dataTransfer!.types.indexOf("Files") >= 0) {
      if (
        event.dataTransfer!.items.length === 1 &&
        event.dataTransfer!.items[0].type.indexOf("image") > -1
      ) {
        event.preventDefault();
        this.createGhost(event);
        event.dataTransfer!.dropEffect = "copy";
      }
    } else {
      event.stopPropagation();
      event.dataTransfer!.dropEffect = "none";
    }
  };

  ContentState.prototype.dragleaveHandler = function (event) {
    return this.hideGhost();
  };

  ContentState.prototype.dropHandler = async function (event) {
    event.preventDefault();
    const { dropAnchor } = this;
    this.hideGhost();
    // handle drag/drop web link image.
    if (event.dataTransfer!.items.length) {
      for (const item of event.dataTransfer!.items) {
        if (item.kind === "string" && item.type === "text/uri-list") {
          item.getAsString(async (str) => {
            if (URL_REG.test(str) && dropAnchor) {
              let isImage = false;
              if (IMAGE_EXT_REG.test(str)) {
                isImage = true;
              }
              if (!isImage) {
                isImage = await checkImageContentType(str);
              }
              if (!isImage) return;
              const text = `![](${str})`;
              const imageBlock = this.createBlockP(text);
              const { anchor, position } = dropAnchor;
              if (position === "up") {
                this.insertBefore(imageBlock, anchor!);
              } else {
                this.insertAfter(imageBlock, anchor!);
              }

              const key = imageBlock.children![0].key;
              const offset = 0;
              this.cursor = new Cursor({
                start: { key, offset },
                end: { key, offset },
              });
              this.render();
              this.muya.eventCenter.dispatch("stateChange");
            }
          });
        }
      }
    }

    if (event.dataTransfer!.files) {
      const fileList = [];
      for (const file of event.dataTransfer!.files) {
        fileList.push(file);
      }
      const image = fileList.find((file) => /image/.test(file.type));
      if (image && dropAnchor) {
        // @ts-ignore
        const { name, path } = image;
        const id = `loading-${getUniqueId()}`;
        const text = `![${id}](${path})`;
        const imageBlock = this.createBlockP(text);
        const { anchor, position } = dropAnchor;
        if (position === "up") {
          this.insertBefore(imageBlock, anchor!);
        } else {
          this.insertAfter(imageBlock, anchor!);
        }

        const key = imageBlock.children![0].key;
        const offset = 0;
        this.cursor = new Cursor({
          start: { key, offset },
          end: { key, offset },
        });
        this.render();

        const nSrc = await this.muya.options.imageAction(image, id, name);
        const { src } = getImageSrc(path);
        if (src) {
          this.stateRender.urlMap.set(nSrc, src);
        }
        const imageWrapper = this.muya.container.querySelector(
          `span[data-id=${id}]`
        ) as HTMLElement;

        if (imageWrapper) {
          const imageInfo = getImageInfo(imageWrapper);
          this.replaceImage(imageInfo, {
            alt: name,
            src: nSrc,
            type: "",
          });
        }
      }
      this.muya.eventCenter.dispatch("stateChange");
    }
  };
};

export default dragDropCtrl;
