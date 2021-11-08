/** @format */

import { Block, LinkToken, WholeRender } from '@/typings/muya'
import Cursor from 'src/muya/lib/selection/cursor'
import { CLASS_OR_ID } from '../../../config'

export default function autoLink(
  this: WholeRender,
  h: any,
  cursor: Cursor,
  block: Block,
  token: LinkToken,
  outerClass: string,
) {
  const className = this.getClassName(outerClass, block, token, cursor)
  const { isLink, marker, href, email } = token
  const { start, end } = token.range!

  const startMarker = this.highlight(h, block, start, start + marker!.length, token)
  const endMarker = this.highlight(h, block, end - marker!.length, end, token)
  const content = this.highlight(h, block, start + marker!.length, end - marker!.length, token)

  return [
    h(`span.${className}`, startMarker),
    h(
      `a.${CLASS_OR_ID.AG_INLINE_RULE}.${CLASS_OR_ID.AG_AUTO_LINK}`,
      {
        attrs: {
          spellcheck: 'false',
        },
        props: {
          href: isLink ? encodeURI(href) : `mailto:${email}`,
          target: '_blank',
        },
      },
      content,
    ),
    h(`span.${className}`, endMarker),
  ]
}
