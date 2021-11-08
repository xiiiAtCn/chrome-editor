/** @format */

import { Block, Token, WholeRender } from '@/typings/muya'
import Cursor from 'src/muya/lib/selection/cursor'
import { CLASS_OR_ID } from '../../../config'

export default function hr(this: WholeRender, h: any, cursor: Cursor, block: Block, token: Token, outerClass: string) {
  const { start, end } = token.range!
  const content = this.highlight(h, block, start, end, token)
  return [h(`span.${CLASS_OR_ID.AG_GRAY}.${CLASS_OR_ID.AG_REMOVE}`, content)]
}
