/** @format */

import { Block, IRange, Token, WholeRender } from '@/typings/muya'
import Cursor from 'src/muya/lib/selection/cursor'
import { CLASS_OR_ID } from '../../../config'
import { isLengthEven, snakeToCamel } from '../../../utils'

// 'link': /^(\[)((?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*?)(\\*)\]\((.*?)(\\*)\)/, // can nest
export default function link(
  this: WholeRender,
  h: any,
  cursor: Cursor,
  block: Block,
  token: Token,
  outerClass: string,
) {
  let { preview } = this.muya.options
  let className = this.getClassName(outerClass, block, token, cursor)
  let linkClassName: string
  if (preview) {
    if (className === CLASS_OR_ID.AG_HIDE) {
      linkClassName = className
    } else {
      linkClassName = `${CLASS_OR_ID.AG_LINK_IN_BRACKET}.${CLASS_OR_ID.AG_HIDE}`
      className = `${className}.${CLASS_OR_ID.AG_HIDE}`
    }
  } else {
    linkClassName = className === CLASS_OR_ID.AG_HIDE ? className : CLASS_OR_ID.AG_LINK_IN_BRACKET
  }

  const { start, end } = token.range!
  const firstMiddleBracket = this.highlight(h, block, start, start + 3, token)

  const firstBracket = this.highlight(h, block, start, start + 1, token)
  const middleBracket = this.highlight(
    h,
    block,
    start + 1 + token.anchor!.length + (token.backlash! as IRange).first.length,
    start + 1 + token.anchor!.length + (token.backlash! as IRange).first.length + 2,
    token,
  )
  const hrefContent = this.highlight(
    h,
    block,
    start + 1 + token.anchor!.length + (token.backlash! as IRange).first.length + 2,
    start + 1 + token.anchor!.length + (token.backlash! as IRange).first.length + 2 + token.hrefAndTitle!.length,
    token,
  )
  const middleHref = this.highlight(
    h,
    block,
    start + 1 + token.anchor!.length + (token.backlash! as IRange).first.length,
    start + 1 + token.anchor!.length + (token.backlash! as IRange).first.length + 2 + token.hrefAndTitle!.length,
    token,
  )

  const lastBracket = this.highlight(h, block, end - 1, end, token)

  const firstBacklashStart = start + 1 + token.anchor!.length
  const secondBacklashStart = end - 1 - (token.backlash! as { second: string }).second.length

  if (isLengthEven((token.backlash! as IRange).first) && isLengthEven((token.backlash! as IRange).second)) {
    if (!token.children!.length && !(token.backlash! as IRange).first) {
      // no-text-link
      return [
        h(`span.${CLASS_OR_ID.AG_GRAY}.${CLASS_OR_ID.AG_REMOVE}`, firstMiddleBracket),
        h(
          `a.${CLASS_OR_ID.AG_NOTEXT_LINK}.${CLASS_OR_ID.AG_INLINE_RULE}`,
          {
            props: {
              href: token.href + encodeURI((token.backlash! as IRange).second),
              target: '_blank',
              title: token.title,
            },
          },
          [
            ...hrefContent,
            ...this.backlashInToken(h, (token.backlash! as IRange).second, className, secondBacklashStart, token),
          ],
        ),
        h(`span.${CLASS_OR_ID.AG_GRAY}.${CLASS_OR_ID.AG_REMOVE}`, lastBracket),
      ]
    } else {
      // has children
      return [
        h(`span.${className}.${CLASS_OR_ID.AG_REMOVE}`, firstBracket),
        h(
          `a.${CLASS_OR_ID.AG_INLINE_RULE}`,
          {
            props: {
              href: token.href + encodeURI((token.backlash as IRange).second),
              target: '_blank',
              title: token.title,
            },
            dataset: {
              start,
              end,
              raw: token.raw,
            },
          },
          [
            // @ts-ignore
            ...token.children.reduce((acc, to) => {
              // @ts-ignore
              const chunk = this[snakeToCamel(to.type)](h, cursor, block, to, className)
              return Array.isArray(chunk) ? [...acc, ...chunk] : [...acc, chunk]
            }, []),
            ...this.backlashInToken(h, (token.backlash as IRange).first, className, firstBacklashStart, token),
          ],
        ),
        h(`span.${className}.${CLASS_OR_ID.AG_REMOVE}`, middleBracket),
        h(
          `span.${linkClassName}.${CLASS_OR_ID.AG_REMOVE}`,
          {
            attrs: { spellcheck: 'false' },
          },
          [
            ...hrefContent,
            ...this.backlashInToken(h, (token.backlash as IRange).second, className, secondBacklashStart, token),
          ],
        ),
        h(`span.${className}.${CLASS_OR_ID.AG_REMOVE}`, lastBracket),
      ]
    }
  } else {
    return [
      ...firstBracket,
      // @ts-ignore
      ...token.children.reduce((acc, to) => {
        // @ts-ignore
        const chunk = this[snakeToCamel(to.type)](h, cursor, block, to, className)
        return Array.isArray(chunk) ? [...acc, ...chunk] : [...acc, chunk]
      }, []),
      ...this.backlashInToken(h, (token.backlash as IRange).first, className, firstBacklashStart, token),
      ...middleHref,
      ...this.backlashInToken(h, (token.backlash as IRange).second, className, secondBacklashStart, token),
      ...lastBracket,
    ]
  }
}
