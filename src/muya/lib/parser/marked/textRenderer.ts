/** @format */

import { IFootnote } from '@/typings/muya'

/**
 * TextRenderer
 * returns only the textual part of the token
 *
 * @format
 */
export default class TextRenderer {
  strong(text: string) {
    return text
  }

  em(text: string) {
    return text
  }

  codespan(text: string) {
    return text
  }

  del(text: string) {
    return text
  }

  text(text: string) {
    return text
  }

  html(text: string) {
    return text
  }

  inlineMath(text: string) {
    return text
  }

  emoji(text: string) {
    return text
  }
  script(content: string, marker: string) {
    const tagName = marker === '^' ? 'sup' : 'sub'
    return `<${tagName}>${content}</${tagName}>`
  }

  footnoteIdentifier(identifier: string, { footnoteId, footnoteIdentifierId, order }: IFootnote) {
    return `<a href="#${
      footnoteId ? `fn${footnoteId}` : ''
    }" class="footnote-ref" id="fnref${footnoteIdentifierId}" role="doc-noteref"><sup>${order || identifier}</sup></a>`
  }
  link(href: string, title: string, text: string) {
    return '' + text
  }
  image(href: string, title: string, text: string) {
    return '' + text
  }

  br() {
    return ''
  }
}
