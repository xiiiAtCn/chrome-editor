/** @format */

import { IFootnote } from '@/typings/muya'
import defaultOptions, { IOption } from './options'
import { cleanUrl, escape } from './utils'

/**
 * Renderer
 */

export default class Renderer {
  options: Partial<IOption> = {}
  constructor(options?: Partial<IOption>) {
    this.options = options || defaultOptions
  }

  frontmatter(text: string) {
    return `<pre class="front-matter">\n${text}</pre>\n`
  }

  multiplemath(text: string) {
    let output = ''
    if (this.options.mathRenderer) {
      const displayMode = true
      output = this.options.mathRenderer(text, displayMode)
    }
    return output || `<pre class="multiple-math">\n${text}</pre>\n`
  }

  inlineMath(math: string) {
    let output = ''
    if (this.options.mathRenderer) {
      const displayMode = false
      output = this.options.mathRenderer(math, displayMode)
    }
    return output || math
  }

  emoji(text: string, emoji: string) {
    if (this.options.emojiRenderer) {
      return this.options.emojiRenderer(emoji)
    } else {
      return text
    }
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

  footnote(footnote: string) {
    return '<section class="footnotes" role="doc-endnotes">\n<hr />\n<ol>\n' + footnote + '</ol>\n</section>\n'
  }
  footnoteItem(content: string, { footnoteId, footnoteIdentifierId }: IFootnote) {
    return `<li id="fn${footnoteId}" role="doc-endnote">${content}<a href="#${
      footnoteIdentifierId ? `fnref${footnoteIdentifierId}` : ''
    }" class="footnote-back" role="doc-backlink">↩︎</a></li>`
  }

  code(code: string, infostring: string, escaped: boolean, codeBlockStyle: string) {
    const lang = (infostring || '').match(/\S*/)![0]
    if (this.options.highlight) {
      const out = this.options.highlight(code, lang)
      if (out !== null && out !== code) {
        escaped = true
        code = out
      }
    }
    let className = codeBlockStyle === 'fenced' ? 'fenced-code-block' : 'indented-code-block'
    className = lang ? `${className} ${this.options.langPrefix}${escape(lang, true)}` : className

    return '<pre><code class="' + className + '">' + (escaped ? code : escape(code, true)) + '</code></pre>\n'
  }

  blockquote(quote: string) {
    return '<blockquote>\n' + quote + '</blockquote>\n'
  }

  html(html: string): string {
    return html
  }

  heading(text: string, level: number, raw: string, slugger: { slug(raw: string): string }, headingStyle: string) {
    if (this.options.headerIds) {
      return (
        '<h' +
        level +
        ' id="' +
        this.options.headerPrefix +
        slugger.slug(raw) +
        '" class="' +
        headingStyle +
        '">' +
        text +
        '</h' +
        level +
        '>\n'
      )
    }
    // ignore IDs
    return '<h' + level + '>' + text + '</h' + level + '>\n'
  }

  hr() {
    return this.options.xhtml ? '<hr/>\n' : '<hr>\n'
  }

  list(body: string, ordered: boolean, start: number) {
    const type = ordered ? 'ol' : 'ul'
    const startatt = ordered && start !== 1 ? ' start="' + start + '"' : ''
    return '<' + type + startatt + '>\n' + body + '</' + type + '>\n'
  }

  listitem(text: string, checked: boolean) {
    // normal list
    if (checked === undefined) {
      return '<li>' + text + '</li>\n'
    }

    // task list
    return (
      '<li class="task-list-item"><input type="checkbox"' +
      (checked ? ' checked=""' : '') +
      ' disabled=""' +
      (this.options.xhtml ? ' /' : '') +
      '> ' +
      text +
      '</li>\n'
    )
  }

  paragraph(text: string) {
    return '<p>' + text + '</p>\n'
  }

  table = function (header: string, body: string) {
    if (body) body = '<tbody>' + body + '</tbody>'

    return '<table>\n' + '<thead>\n' + header + '</thead>\n' + body + '</table>\n'
  }

  tablerow(content: string) {
    return '<tr>\n' + content + '</tr>\n'
  }

  tablecell = function (content: string, flags: { header: boolean; align: string }) {
    const type = flags.header ? 'th' : 'td'
    const tag = flags.align ? '<' + type + ' align="' + flags.align + '">' : '<' + type + '>'
    return tag + content + '</' + type + '>\n'
  }

  strong(text: string) {
    return '<strong>' + text + '</strong>'
  }

  em(text: string) {
    return '<em>' + text + '</em>'
  }

  codespan(text: string) {
    return '<code>' + text + '</code>'
  }

  br() {
    return this.options.xhtml ? '<br/>' : '<br>'
  }

  del(text: string) {
    return '<del>' + text + '</del>'
  }

  link(href: string, title: string, text: string) {
    href = cleanUrl(this.options.sanitize, this.options.baseUrl!, href) || ''
    if (href === null) {
      return text
    }
    let out = '<a href="' + escape(href) + '"'
    if (title) {
      out += ' title="' + title + '"'
    }
    out += '>' + text + '</a>'
    return out
  }

  image(href: string, title: string, text: string) {
    if (!href) {
      return text
    }

    // Fix ASCII and UNC paths on Windows (#1997).
    if (/^(?:[a-zA-Z]:\\|[a-zA-Z]:\/).+/.test(href)) {
      href = 'file:///' + href.replace(/\\/g, '/')
    } else if (/^\\\?\\.+/.test(href)) {
      // NOTE: Only check for "\?\" instead of "\\?\" because URL escaping removes the first "\".
      href = 'file:///' + href.substring(3).replace(/\\/g, '/')
    } else if (/^\/.+/.test(href)) {
      // Be consistent but it's not needed.
      href = 'file://' + href
    }

    href = cleanUrl(this.options.sanitize, this.options.baseUrl!, href) || ''
    if (href === null) {
      return text
    }

    let out = '<img src="' + href + '" alt="' + text.replace(/\*/g, '') + '"'
    if (title) {
      out += ' title="' + title + '"'
    }
    out += this.options.xhtml ? '/>' : '>'
    return out
  }

  text(text: string) {
    return text
  }
  toc() {
    if (this.options.tocRenderer) {
      return this.options.tocRenderer()
    }
    return ''
  }
}
