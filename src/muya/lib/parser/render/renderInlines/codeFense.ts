/** @format */

import { Block, Token, WholeRender } from '@/typings/muya'
import Cursor from 'src/muya/lib/selection/cursor'
import { CLASS_OR_ID } from '../../../config'

export default function codeFense(
  this: WholeRender,
  h: any,
  cursor: Cursor,
  block: Block,
  token: Token,
  outerClass: string,
) {
  const { start, end } = token.range!
  const { marker } = token

  const markerContent = this.highlight(h, block, start, start + marker!.length, token)
  const content = this.highlight(h, block, start + marker!.length, end, token)

  return [
    h(`span.${CLASS_OR_ID.AG_GRAY}`, markerContent),
    h(
      `span.${CLASS_OR_ID.AG_LANGUAGE}`,
      {
        attrs: {
          spellcheck: 'false',
        },
      },
      content,
    ),
  ]
}
