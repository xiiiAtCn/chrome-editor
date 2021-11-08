/** @format */

import { ContentState as State } from '@/typings/muya'
import './assets/styles/index.css'
import './assets/theme/default.less'
import { MUYA_DEFAULT_OPTION } from './config'
import ContentState from './contentState'
import Cursor from './selection/cursor'
import ExportMarkdown from './utils/exportMarkdown'

export type IOption = {
  markdown: string
  hideLinkPopup: boolean
  footnote: boolean
  mermaidTheme: string
  sequenceTheme: string
  superSubScript: boolean
  isGitlabCompatibilityEnabled: boolean
  fontSize: number
  lineHeight: number
  frontmatterType: string
  orderListDelimiter: boolean
  bulletListMarker: boolean
  preferLooseListItem: boolean
  autoCheck: boolean
  autoPairBracket: boolean
  autoPairMarkdownSyntax: boolean
  autoPairQuote: boolean
  disableHtml: boolean
  imagePathPicker: any
  imageAction(path: string | File, id: string, name?: string): Promise<string>
  clipboardFilePath(): string
  imagePathAutoComplete(value: string): Array<any>
  focusMode: boolean
  codeBlockLineNumbers: boolean
  hideQuickInsertHint: boolean
  spellcheckEnabled: boolean
  trimUnnecessaryCodeBlockEmptyLines: boolean
  vegaTheme: string
}

class Render {
  static plugins: Array<{ plugin: any; options: any }> = []

  options: IOption
  markdown: string
  container: HTMLElement
  contentState: State

  constructor(container: HTMLElement, options?: IOption) {
    this.options = Object.assign({}, MUYA_DEFAULT_OPTION, options)
    const { markdown } = this.options
    this.markdown = markdown
    this.container = getContainer(container, this.options)
    // UI plugins

    // @ts-ignore
    this.contentState = new ContentState(this, this.options)
    this.init()
  }

  init() {
    const { container, contentState } = this
    contentState.stateRender.setContainer(container.children[0])
    const { markdown } = this
    this.setMarkdown(markdown)
  }

  getMarkdown() {
    const blocks = this.contentState.getBlocks()
    const { isGitlabCompatibilityEnabled, listIndentation } = this.contentState
    return new ExportMarkdown(blocks, listIndentation, isGitlabCompatibilityEnabled).generate()
  }

  getHistory() {
    return this.contentState.getHistory()
  }

  getTOC() {
    return this.contentState.getTOC()
  }

  setMarkdown(markdown: string, cursor?: Cursor, isRenderCursor = true) {
    let newMarkdown = markdown
    let isValid = false
    // if (cursor && cursor.anchor && cursor.focus) {
    //   const cursorInfo = this.contentState.addCursorToMarkdown(markdown, cursor)!
    //   newMarkdown = cursorInfo.markdown
    //   isValid = cursorInfo.isValid
    // }
    this.contentState.importMarkdown(newMarkdown)
    this.contentState.importCursor(false)
    this.contentState.render(false)
  }

  blur() {}

  setOptions(options: Partial<IOption>, needRender = false) {
    // FIXME: Just to be sure, disabled due to #1648.
    if (options.codeBlockLineNumbers) {
      options.codeBlockLineNumbers = false
    }

    Object.assign(this.options, options)
    if (needRender) {
      this.contentState.render(false, true)
    }

    // Set quick insert hint visibility
    const hideQuickInsertHint = options.hideQuickInsertHint
    if (typeof hideQuickInsertHint !== 'undefined') {
      const hasClass = this.container.classList.contains('ag-show-quick-insert-hint')
      if (hideQuickInsertHint && hasClass) {
        this.container.classList.remove('ag-show-quick-insert-hint')
      } else if (!hideQuickInsertHint && !hasClass) {
        this.container.classList.add('ag-show-quick-insert-hint')
      }
    }

    // Set spellcheck container attribute
    const spellcheckEnabled = options.spellcheckEnabled
    if (typeof spellcheckEnabled !== 'undefined') {
      this.container.setAttribute('spellcheck', String(!!spellcheckEnabled))
    }

    if (options.bulletListMarker) {
      this.contentState.turndownConfig.bulletListMarker = options.bulletListMarker
    }
  }

  destroy() {
    this.contentState.clear()
  }
}

/**
 * [ensureContainerDiv ensure container element is div]
 */
function getContainer(originContainer: HTMLElement, options: Partial<IOption>) {
  const { hideQuickInsertHint, spellcheckEnabled } = options
  const container = document.createElement('div')
  const rootDom = document.createElement('div')
  const attrs = originContainer.attributes
  // copy attrs from origin container to new div element
  Array.from(attrs).forEach(attr => {
    container.setAttribute(attr.name, attr.value)
  })

  if (!hideQuickInsertHint) {
    container.classList.add('ag-show-quick-insert-hint')
  }

  container.setAttribute('contenteditable', String(false))
  container.setAttribute('autocorrect', String(false))
  container.setAttribute('autocomplete', 'off')
  // NOTE: The browser is not able to correct misspelled words words without
  // a custom implementation like in Mark Text.
  container.setAttribute('spellcheck', String(!!spellcheckEnabled))
  container.appendChild(rootDom)
  originContainer.replaceWith(container)
  return container
}

export default Render
