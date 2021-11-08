/** @format */

import { Block, Token, WholeRender } from '@/typings/muya'
import Cursor from 'src/muya/lib/selection/cursor'
export default function tailHeader(
  this: WholeRender,
  h: any,
  cursor: Cursor,
  block: Block,
  token: Token,
  outerClass: string,
) {
  const className = this.getClassName(outerClass, block, token, cursor)
  const { start, end } = token.range!
  const content = this.highlight(h, block, start, end, token)
  if (/^h\d$/.test(block.type)) {
    return [h(`span.${className}`, content)]
  } else {
    return content
  }
}
