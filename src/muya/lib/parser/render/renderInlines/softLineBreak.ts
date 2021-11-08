/** @format */

import { Block, Token, WholeRender } from '@/typings/muya'
import Cursor from 'src/muya/lib/selection/cursor'
import { CLASS_OR_ID } from '../../../config'

export default function hardLineBreak(
  this: WholeRender,
  h: any,
  cursor: Cursor,
  block: Block,
  token: Token,
  outerClass: string,
) {
  const { lineBreak, isAtEnd } = token
  let selector = `span.${CLASS_OR_ID.AG_SOFT_LINE_BREAK}`
  if (isAtEnd) {
    selector += `.${CLASS_OR_ID.AG_LINE_END}`
  }

  return [h(selector, lineBreak)]
}
