/** @format */

import { Block, Token, WholeRender } from '@/typings/muya'
import Cursor from 'src/muya/lib/selection/cursor'

export default function del(
  this: WholeRender,
  h: any,
  cursor: Cursor,
  block: Block,
  token: Token,
  outerClass: string,
): Array<string> {
  return this.delEmStrongFac('del', h, cursor, block, token, outerClass)
}
