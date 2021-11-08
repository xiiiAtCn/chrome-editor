/** @format */
import { Block, Token, WholeRender } from '@/typings/muya'
import Cursor from 'src/muya/lib/selection/cursor'
import { CLASS_OR_ID } from '../../../config'

export default function softLineBreak(
  this: WholeRender,
  h: any,
  cursor: Cursor,
  block: Block,
  token: Token,
  outerClass: string,
) {
  const { spaces, lineBreak, isAtEnd } = token
  const className = CLASS_OR_ID.AG_HARD_LINE_BREAK
  const spaceClass = CLASS_OR_ID.AG_HARD_LINE_BREAK_SPACE
  if (isAtEnd) {
    return [h(`span.${className}`, h(`span.${spaceClass}`, spaces)), h(`span.${CLASS_OR_ID.AG_LINE_END}`, lineBreak)]
  } else {
    return [h(`span.${className}`, [h(`span.${spaceClass}`, spaces), lineBreak])]
  }
}
