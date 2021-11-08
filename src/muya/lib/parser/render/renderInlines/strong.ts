/** @format */
import { Block, Token, WholeRender } from '@/typings/muya'
import Cursor from 'src/muya/lib/selection/cursor'
export default function strong(
  this: WholeRender,
  h: any,
  cursor: Cursor,
  block: Block,
  token: Token,
  outerClass: string,
) {
  return this.delEmStrongFac('strong', h, cursor, block, token, outerClass)
}
