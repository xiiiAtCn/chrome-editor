/** @format */

import { filter } from 'fuzzaldrin'
import { CLASS_OR_ID } from '../../config'
import emojis from './emojisJson.json'

const emojisForSearch: Record<string, Array<IEmoji>> = {}

for (const emoji of emojis) {
  const newEmoji = Object.assign({}, emoji, { search: [...emoji.aliases, ...emoji.tags].join(' ') })
  if (emojisForSearch[newEmoji.category]) {
    emojisForSearch[newEmoji.category].push(newEmoji)
  } else {
    emojisForSearch[newEmoji.category] = [newEmoji]
  }
}

export type IEmoji = {
  emoji: string
  description: string
  category: string
  aliases: Array<string>
  tags: Array<string>
}

/**
 * check if one emoji code is in emojis, return undefined or found emoji
 */
export const validEmoji = (text: string) => {
  return emojis.find((emoji: IEmoji) => {
    return emoji.aliases.includes(text)
  })
}

/**
 * check edit emoji
 */

export const checkEditEmoji = (node: HTMLElement) => {
  if (node && node.classList.contains(CLASS_OR_ID.AG_EMOJI_MARKED_TEXT)) {
    return node
  }
  return false
}

class Emoji {
  cache: Map<string, any> | null = null
  constructor() {
    this.cache = new Map()
  }

  search(text: string) {
    const { cache } = this
    if (cache!.has(text)) return cache!.get(text)
    const result: Record<string, Array<string>> = {}

    Object.keys(emojisForSearch).forEach(category => {
      const list = filter<any, any>(emojisForSearch[category], text, { key: 'search' })
      if (list.length) {
        result[category] = list
      }
    })
    cache!.set(text, result)
    return result
  }

  destroy() {
    return this.cache!.clear()
  }
}

export default Emoji
