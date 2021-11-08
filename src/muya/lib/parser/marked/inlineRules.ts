/** @format */

import { block } from './blockRules'
import { edit, noop } from './utils'

/* eslint-disable no-useless-escape */

/**
 * Inline-Level Grammar
 */

const inline: Record<string, { exec(str: string): RegExpExecArray | null }> = {
  escape: /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/,
  autolink: /^<(scheme:[^\s\x00-\x1f<>]*|email)>/, // eslint-disable-line no-control-regex
  url: noop,
  // @ts-ignore
  tag:
    '^comment' +
    '|^</[a-zA-Z][\\w:-]*\\s*>' + // self-closing tag
    '|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>' + // open tag
    '|^<\\?[\\s\\S]*?\\?>' + // processing instruction, e.g. <?php ?>
    '|^<![a-zA-Z]+\\s[\\s\\S]*?>' + // declaration, e.g. <!DOCTYPE html>
    '|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>', // CDATA section
  link: /^!?\[(label)\]\(\s*(href)(?:\s+(title))?\s*\)/,
  reflink: /^!?\[(label)\]\[(?!\s*\])((?:\\[\[\]]?|[^\[\]\\])+)\]/,
  nolink: /^!?\[(?!\s*\])((?:\[[^\[\]]*\]|\\[\[\]]|[^\[\]])*)\](?:\[\])?/,
  strong: /^__([^\s_])__(?!_)|^\*\*([^\s*])\*\*(?!\*)|^__([^\s][\s\S]*?[^\s])__(?!_)|^\*\*([^\s][\s\S]*?[^\s])\*\*(?!\*)/,
  em: /^_([^\s_])_(?!_)|^\*([^\s*<\[])\*(?!\*)|^_([^\s<][\s\S]*?[^\s_])_(?!_|[^\spunctuation])|^_([^\s_<][\s\S]*?[^\s])_(?!_|[^\spunctuation])|^\*([^\s<"][\s\S]*?[^\s\*])\*(?!\*|[^\spunctuation])|^\*([^\s*"<\[][\s\S]*?[^\s])\*(?!\*)/,
  code: /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/,
  br: /^( {2,}|\\)\n(?!\s*$)/,
  del: noop,

  // ------------------------
  // patched

  // allow inline math "$" and superscript ("?=[\\<!\[`*]" to "?=[\\<!\[`*\$^]")
  text: /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*\$^]|\b_|$)|[^ ](?= {2,}\n))|(?= {2,}\n))/, // emoji is patched in gfm

  // ------------------------
  // extra
  emoji: noop,

  // TODO: make math optional GH#740
  math: /^\$([^$]*?[^\$\\])\$(?!\$)/,

  // superscript and subScript
  superscript: /^(\^)((?:[^\^\s]|(?<=\\)\1|(?<=\\) )+?)(?<!\\)\1(?!\1)/,
  subscript: /^(~)((?:[^~\s]|(?<=\\)\1|(?<=\\) )+?)(?<!\\)\1(?!\1)/,
  footnoteIdentifier: /^\[\^([^\^\[\]\s]+?)(?<!\\)\]/,
}

// list of punctuation marks from common mark spec
// without ` and ] to workaround Rule 17 (inline code blocks/links)
// without , to work around example 393
// @ts-ignore
inline._punctuation = '!"#$%&\'()+\\-.,/:;<=>?@\\[\\]`^{|}~'

inline._comment = edit(block._comment).replace('(?:-->|$)', '-->').getRegex()
inline.em = edit(inline.em as RegExp)
  //@ts-ignore
  .replace(/punctuation/g, inline._punctuation)
  .getRegex()

inline._escapes = /\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/g

inline._scheme = /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/
inline._email = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/
inline.autolink = edit(inline.autolink as RegExp)
  .replace('scheme', inline._scheme as RegExp)
  .replace('email', inline._email as RegExp)
  .getRegex()

inline._attribute = /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/

inline.tag = edit(inline.tag as RegExp)
  .replace('comment', inline._comment as RegExp)
  .replace('attribute', inline._attribute as RegExp)
  .getRegex()

inline._label = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/
inline._href = /<(?:\\.|[^\n<>\\])+>|[^\s\x00-\x1f]*/ // eslint-disable-line no-control-regex
inline._title = /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/

inline.link = edit(inline.link as RegExp)
  .replace('label', inline._label as RegExp)
  .replace('href', inline._href as RegExp)
  .replace('title', inline._title as RegExp)
  .getRegex()

inline.reflink = edit(inline.reflink as RegExp)
  .replace('label', inline._label as RegExp)
  .getRegex()

/**
 * Normal Inline Grammar
 */

export const normal = Object.assign({}, inline)

/**
 * Pedantic Inline Grammar
 */

export const pedantic = Object.assign({}, normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/,
  link: edit(/^!?\[(label)\]\((.*?)\)/)
    .replace('label', inline._label as RegExp)
    .getRegex(),
  reflink: edit(/^!?\[(label)\]\s*\[([^\]]*)\]/)
    .replace('label', inline._label as RegExp)
    .getRegex(),
})

/**
 * GFM Inline Grammar
 */

export const gfm = Object.assign({}, normal, {
  escape: edit(inline.escape as RegExp)
    .replace('])', '~|])')
    .getRegex(),
  _extended_email: /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/,
  url: /^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/,
  _backpedal: /(?:[^?!.,:;*_~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_~)]+(?!$))+/,
  del: /^(~~?)(?=[^\s~])([\s\S]*?[^\s~])\1(?=[^~]|$)/,

  // ------------------------
  // patched

  // allow inline math "$" and emoji ":" and superscrpt "^" ("?=[\\<!\[`*~]|" to "?=[\\<!\[`*~:\$^]|")
  text: /^([`~]+|[^`~])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*~:\$^]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))|(?= {2,}\n|[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@))/,

  // ------------------------
  // extra

  emoji: /^(:)([a-z_\d+-]+?)\1/, // not real GFM but put it in here
})

gfm.url = edit(gfm.url, 'i').replace('email', gfm._extended_email).getRegex()

/**
 * GFM + Line Breaks Inline Grammar
 */

export const breaks = Object.assign({}, gfm, {
  br: edit(inline.br as RegExp)
    .replace('{2,}', '*')
    .getRegex(),
  text: edit(gfm.text)
    .replace('\\b_', '\\b_| {2,}\\n')
    .replace(/\{2,\}/g, '*')
    .getRegex(),
})

/* eslint-ensable no-useless-escape */
