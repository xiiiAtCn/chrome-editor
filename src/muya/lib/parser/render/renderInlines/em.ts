/** @format */

import { Block, Token, WholeRender } from '@/typings/muya'
import Cursor from 'src/muya/lib/selection/cursor'

export default function em(this: WholeRender, h: any, cursor: Cursor, block: Block, token: Token, outerClass: string) {
  return this.delEmStrongFac('em', h, cursor, block, token, outerClass)
}
