/** @format */

import { tokenizer } from '../parser'
import { findNearestParagraph } from '../selection/dom'

export const getLinkInfo = (a: HTMLElement) => {
  const paragraph = findNearestParagraph(a)
  const raw = a.getAttribute('data-raw')
  const start = a.getAttribute('data-start')
  const end = a.getAttribute('data-end')
  const tokens = tokenizer(raw!, {})
  const token = tokens[0]
  const href = a.getAttribute('href')
  token.range = {
    start: Number(start!),
    end: Number(end!),
  }
  return {
    key: paragraph!.id,
    token,
    href,
  }
}
