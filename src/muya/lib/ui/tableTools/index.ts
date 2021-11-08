/** @format */

import Muya from '../..'
import { h, patch } from '../../parser/render/snabbdom'
import BaseFloat, { IFloatOption } from '../baseFloat'
import { ITool, toolList } from './config'
import './index.css'

const defaultOptions: IFloatOption = {
  placement: 'right-start',
  modifiers: {
    offset: {
      offset: '0, 5',
    },
  },
  showArrow: false,
}

class TableBarTools extends BaseFloat {
  static pluginName = 'tableBarTools'

  oldVnode: any

  tableInfo: {
    barType: 'left' | 'bottom'
  } | null

  tableBarContainer: HTMLElement

  constructor(muya: Muya, options = {}) {
    const name = 'ag-table-bar-tools'
    const opts = Object.assign({}, defaultOptions, options)
    super(muya, name, opts)
    this.options = opts
    this.oldVnode = null
    this.tableInfo = null
    this.floatBox.classList.add('ag-table-bar-tools')
    const tableBarContainer = (this.tableBarContainer = document.createElement('div'))
    this.container.appendChild(tableBarContainer)
    this.listen()
  }

  listen() {
    super.listen()
    const { eventCenter } = this.muya
    eventCenter.subscribe('muya-table-bar', ({ reference, tableInfo }: { reference: HTMLElement; tableInfo: any }) => {
      if (reference) {
        this.tableInfo = tableInfo
        this.show(reference)
        this.render()
      } else {
        this.hide()
      }
    })
  }

  render() {
    const { tableInfo, oldVnode, tableBarContainer } = this
    const renderArray = toolList[tableInfo!.barType]
    const children = renderArray.map(item => {
      const { label } = item

      const selector = 'li.item'
      return h(
        selector,
        {
          dataset: {
            label: item.action,
          },
          on: {
            click: (event: MouseEvent) => {
              this.selectItem(event, item)
            },
          },
        },
        label,
      )
    })

    const vnode = h('ul', children)

    if (oldVnode) {
      patch(oldVnode, vnode)
    } else {
      patch(tableBarContainer, vnode)
    }
    this.oldVnode = vnode
  }

  selectItem(event: Event, item: ITool) {
    event.preventDefault()
    event.stopPropagation()

    const { contentState } = this.muya
    contentState.editTable(item)
    this.hide()
  }
}

export default TableBarTools
