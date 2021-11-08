/** @format */
import { Block, Token, WholeRender } from '@/typings/muya'
import Cursor from 'src/muya/lib/selection/cursor'
import { CLASS_OR_ID } from '../../../config'

export default function header(
  this: WholeRender,
  h: any,
  cursor: Cursor,
  block: Block,
  token: Token,
  outerClass: string,
) {
  const { content } = token
  const { start, end } = token.range!
  const className = this.getClassName(
    outerClass,
    block,
    {
      type: '',
      range: {
        start,
        end: end - content!.length,
      },
    },
    cursor,
  )
  const markerVnode = this.highlight(h, block, start, end - content!.length, token)
  const contentVnode = this.highlight(h, block, end - content!.length, end, token)
  const spaceSelector =
    className === CLASS_OR_ID.AG_HIDE
      ? `span.${CLASS_OR_ID.AG_HEADER_TIGHT_SPACE}.${CLASS_OR_ID.AG_REMOVE}`
      : `span.${CLASS_OR_ID.AG_GRAY}.${CLASS_OR_ID.AG_REMOVE}`

  return [h(`span.${className}.${CLASS_OR_ID.AG_REMOVE}`, markerVnode), h(spaceSelector, contentVnode)]
}
