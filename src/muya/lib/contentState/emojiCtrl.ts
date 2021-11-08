/** @format */

import { ContentState, Token } from '@/typings/muya'
import { generator, tokenizer } from '../parser/'
import Cursor from '../selection/cursor'
import { IEmoji } from '../ui/emojis'

const emojiCtrl = (ContentState: ContentState) => {
  ContentState.prototype.setEmoji = function (item: IEmoji) {
    let { key, offset } = this.cursor.start
    const startBlock = this.getBlock(key)!
    const { text } = startBlock
    const tokens = tokenizer(text!, {
      options: this.muya.options,
    })
    let delta = 0

    const findEmojiToken = (tokens: Array<Token>, offset: number): Token | undefined => {
      for (const token of tokens) {
        const { start, end } = token.range!
        if (offset >= start && offset <= end) {
          delta = end - offset
          return token.children && Array.isArray(token.children) && token.children.length
            ? findEmojiToken(token.children, offset)
            : token
        }
      }
    }

    const token = findEmojiToken(tokens, offset)
    if (token && token.type === 'emoji') {
      const emojiText = item.aliases[0]
      offset += delta + emojiText.length - token.content!.length
      token.content = emojiText
      token.raw = `:${emojiText}:`
      startBlock.text = generator(tokens)
      this.cursor = new Cursor({
        start: { key, offset },
        end: { key, offset },
      })
      return this.partialRender()
    }
  }
}

export default emojiCtrl
