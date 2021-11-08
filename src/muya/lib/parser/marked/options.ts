/** @format */
import Renderer from './renderer'
export type IOption = {
  baseUrl?: string | null
  breaks: boolean
  gfm: boolean
  headerIds: boolean
  headerPrefix: string
  highlight: { (str: string, lang: string): string } | null
  mathRenderer: { (str: string, mode: boolean): string } | null
  emojiRenderer: { (str: string): string }
  tocRenderer: { (): string }
  langPrefix: string
  mangle: boolean
  pedantic: boolean
  renderer: Renderer | null // new Renderer(),
  silent: boolean
  smartLists: boolean
  smartypants: boolean
  xhtml: boolean
  disableInline: boolean

  // NOTE: sanitize and sanitizer are deprecated since version 0.7.0, should not be used and will be removed in the future.
  sanitize: boolean
  sanitizer: { (str: string): string }

  // Markdown extensions:
  // TODO: We set whether to support `emoji`, `math`, `frontMatter` default value to `true`
  // After we add user setting, we maybe set math and frontMatter default value to false.
  // User need to enable them in the user setting.
  emoji: boolean
  math: boolean
  frontMatter: boolean
  superSubScript: boolean
  footnote: boolean
  isGitlabCompatibilityEnabled: boolean

  isHtmlEnabled: boolean

  focusMode: boolean
  markdown: string
  fontSize: number
  lineHeight: number

  codeBlockLineNumbers: boolean
  hideQuickInsertHint: boolean
  spellcheckEnabled: boolean
  bulletListMarker: boolean
}

const options: Partial<IOption> = {
  baseUrl: null,
  breaks: false,
  gfm: true,
  headerIds: true,
  headerPrefix: '',
  highlight: (str: string, lang: string): string => {
    return str
  },
  mathRenderer: (str: string, mode: boolean): string => {
    return str
  },
  emojiRenderer: (str: string): string => {
    return str
  },
  tocRenderer: () => {
    return ''
  },
  langPrefix: 'language-',
  mangle: true,
  pedantic: false,
  renderer: null, // new Renderer(),
  silent: false,
  smartLists: false,
  smartypants: false,
  xhtml: false,
  disableInline: false,

  // NOTE: sanitize and sanitizer are deprecated since version 0.7.0, should not be used and will be removed in the future.
  sanitize: false,
  sanitizer: (str: string): string => {
    return str
  },

  // Markdown extensions:
  // TODO: We set whether to support `emoji`, `math`, `frontMatter` default value to `true`
  // After we add user setting, we maybe set math and frontMatter default value to false.
  // User need to enable them in the user setting.
  emoji: true,
  math: true,
  frontMatter: true,
  superSubScript: false,
  footnote: false,
  isGitlabCompatibilityEnabled: false,

  isHtmlEnabled: true,
}

export default options
