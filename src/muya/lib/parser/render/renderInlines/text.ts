/** @format */

// render token of text type to vdom.
import { Block, Token, WholeRender } from '@/typings/muya'
import Cursor from 'src/muya/lib/selection/cursor'
export default function text(
  this: WholeRender,
  h: any,
  cursor: Cursor,
  block: Block,
  token: Token,
  outerClass: string,
) {
  const { start, end } = token.range!
  return [h('span.ag-plain-text', this.highlight(h, block, start, end, token))]
}
