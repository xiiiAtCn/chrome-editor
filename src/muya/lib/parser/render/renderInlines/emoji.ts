/** @format */

import { Block, Token, WholeRender } from '@/typings/muya'
import Cursor from 'src/muya/lib/selection/cursor'
import { CLASS_OR_ID } from '../../../config'
import { validEmoji } from '../../../ui/emojis'

// render token of emoji to vdom
export default function emoji(
  this: WholeRender,
  h: any,
  cursor: Cursor,
  block: Block,
  token: Token,
  outerClass: string,
) {
  const { start: rStart, end: rEnd } = token.range!
  const className = this.getClassName(outerClass, block, token, cursor)
  const validation = validEmoji(token.content!)
  const finalClass = validation ? className : CLASS_OR_ID.AG_WARN
  const contentSelector =
    finalClass !== CLASS_OR_ID.AG_GRAY
      ? `span.${finalClass}.${CLASS_OR_ID.AG_INLINE_RULE}.${CLASS_OR_ID.AG_EMOJI_MARKED_TEXT}`
      : `span.${CLASS_OR_ID.AG_INLINE_RULE}.${CLASS_OR_ID.AG_EMOJI_MARKED_TEXT}`

  let startMarkerSelector = `span.${finalClass}.${CLASS_OR_ID.AG_EMOJI_MARKER}`
  let endMarkerSelector = startMarkerSelector
  let content = token.content
  let pos = rStart + token.marker!.length

  let tmp: Array<Array<string> | string> = []
  if (token.highlights && token.highlights.length) {
    content = ''
    for (const light of token.highlights) {
      let { start, end, active } = light
      const HIGHLIGHT_CLASSNAME = this.getHighlightClassName(!!active)
      if (start === rStart) {
        startMarkerSelector += `.${HIGHLIGHT_CLASSNAME}`
        start++
      }
      if (end === rEnd) {
        endMarkerSelector += `.${HIGHLIGHT_CLASSNAME}`
        end--
      }
      if (pos < start) {
        tmp.push(block.text!.substring(pos, start))
      }
      if (start < end) {
        tmp.push(h(`span.${HIGHLIGHT_CLASSNAME}`, block.text!.substring(start, end)))
      }
      pos = end
    }
    if (pos < rEnd - token.marker!.length) {
      tmp.push(block.text!.substring(pos, rEnd - 1))
    }
  }

  const emojiVdom = validation
    ? h(
        contentSelector,
        {
          attrs: {
            spellcheck: 'false',
          },
          dataset: {
            emoji: validation.emoji,
          },
        },
        content || tmp,
      )
    : h(contentSelector, content)

  return [h(startMarkerSelector, token.marker), emojiVdom, h(endMarkerSelector, token.marker)]
}
