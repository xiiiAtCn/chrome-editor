/** @format */

import { Block, Token, WholeRender } from '@/typings/muya'
import Cursor from 'src/muya/lib/selection/cursor'
import { CLASS_OR_ID } from '../../../config'

export default function inlineCode(
  this: WholeRender,
  h: any,
  cursor: Cursor,
  block: Block,
  token: Token,
  outerClass: string,
) {
  const className = this.getClassName(outerClass, block, token, cursor)
  const { marker } = token
  const { start, end } = token.range!

  const startMarker = this.highlight(h, block, start, start + marker!.length, token)
  const endMarker = this.highlight(h, block, end - marker!.length, end, token)
  const content = this.highlight(h, block, start + marker!.length, end - marker!.length, token)

  return [
    h(`span.${className}.${CLASS_OR_ID.AG_REMOVE}`, startMarker),
    h(
      `code.${CLASS_OR_ID.AG_INLINE_RULE}`,
      {
        attrs: {
          spellcheck: 'false',
        },
      },
      content,
    ),
    h(`span.${className}.${CLASS_OR_ID.AG_REMOVE}`, endMarker),
  ]
}
