/**
 * [renderBlock render one block, no matter it is a container block or text block]
 *
 * @format
 */

import { Block, IMatch, WholeRender } from '@/typings/muya'

export default function renderBlock(
  this: WholeRender,
  parent: Block,
  block: Block,
  activeBlocks: Array<Block>,
  matches: Array<IMatch>,
  useCache: boolean = false,
) {
  const method = Array.isArray(block.children) && block.children.length > 0
  if (method) {
    return this.renderContainerBlock(parent, block, activeBlocks, matches, useCache)
  } else {
    return this.renderLeafBlock(parent, block, activeBlocks, matches, useCache)
  }
}
