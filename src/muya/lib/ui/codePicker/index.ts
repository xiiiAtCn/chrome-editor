/** @format */

import Muya from '../..'
import { h, patch } from '../../parser/render/snabbdom'
import { ILang, search } from '../../prism/index'
import { IFloatOption } from '../baseFloat'
import BaseScrollFloat from '../baseScrollFloat'
import fileIcons from '../fileIcons'
import './index.css'

const defaultOptions: IFloatOption = {
  placement: 'bottom-start',
  modifiers: {
    offset: {
      offset: '0, 0',
    },
  },
  showArrow: false,
}

class CodePicker extends BaseScrollFloat<ILang> {
  static pluginName = 'codePicker'

  renderArray: Array<ILang>

  oldVnode: any

  constructor(muya: Muya, options?: IFloatOption) {
    const name = 'ag-list-picker'
    const opts = Object.assign({}, defaultOptions, options || {})
    super(muya, name, opts)
    this.renderArray = []
    this.oldVnode = null
    this.activeItem = null
    this.listen()
  }

  listen() {
    super.listen()
    const { eventCenter } = this.muya
    eventCenter.subscribe(
      'muya-code-picker',
      ({ reference, lang, cb }: { reference: HTMLElement; lang: string; cb: () => void }) => {
        const modes = search(lang)
        if (modes.length && reference) {
          this.show(reference, cb)
          this.renderArray = modes
          this.activeItem = modes[0]
          this.render()
        } else {
          this.hide()
        }
      },
    )
  }

  render() {
    const { renderArray, oldVnode, scrollElement, activeItem } = this
    let children = renderArray.map(item => {
      let iconClassNames
      if (item.ext && Array.isArray(item.ext)) {
        for (const ext of item.ext) {
          iconClassNames = fileIcons.getClassWithColor(`fackname.${ext}`)
          if (iconClassNames) break
        }
      } else if (item.name) {
        iconClassNames = fileIcons.getClassWithColor(item.name)
      }

      // Because `markdown mode in Codemirror` don't have extensions.
      // if still can not get the className, add a common className 'atom-icon light-cyan'
      if (!iconClassNames) {
        iconClassNames = item.name === 'markdown' ? fileIcons.getClassWithColor('fackname.md') : 'atom-icon light-cyan'
      }
      const iconSelector =
        'span' +
        iconClassNames
          .split(/\s/)
          .map((s: string) => `.${s}`)
          .join('')
      const icon = h('div.icon-wrapper', h(iconSelector))
      const text = h('div.language', item.name)
      const selector = activeItem === item ? 'li.item.active' : 'li.item'
      return h(
        selector,
        {
          dataset: {
            label: item.name,
          },
          on: {
            click: () => {
              this.selectItem(item)
            },
          },
        },
        [icon, text],
      )
    })

    if (children.length === 0) {
      children = [h('div.no-result', 'No result')]
    }
    const vnode = h('ul', children)

    if (oldVnode) {
      patch(oldVnode, vnode)
    } else {
      patch(scrollElement!, vnode)
    }
    this.oldVnode = vnode
  }

  getItemElement(item: ILang) {
    const { name } = item
    return this.floatBox!.querySelector(`[data-label="${name}"]`)
  }
}

export default CodePicker
