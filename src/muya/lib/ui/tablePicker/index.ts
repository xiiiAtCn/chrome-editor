/** @format */

import Muya from '../..'
import { EVENT_KEYS } from '../../config'
import { h, patch } from '../../parser/render/snabbdom'
import BaseFloat from '../baseFloat'
import './index.css'

type ITable = {
  row: number
  column: number
}

class TablePicker extends BaseFloat {
  static pluginName = 'tablePicker'

  checkerCount: ITable

  oldVnode: any
  current: ITable | null
  select: ITable | null
  tableContainer: HTMLElement

  constructor(muya: Muya) {
    const name = 'ag-table-picker'
    super(muya, name)
    this.checkerCount = {
      row: 6,
      column: 8,
    }
    this.oldVnode = null
    this.current = null
    this.select = null
    const tableContainer = (this.tableContainer = document.createElement('div'))
    this.container.appendChild(tableContainer)
    this.listen()
  }

  listen() {
    const { eventCenter } = this.muya
    super.listen()
    eventCenter.subscribe('muya-table-picker', (data: ITable, reference: HTMLElement, cb: (args: any) => void) => {
      if (!this.status) {
        this.childShow(data, reference, cb)
        this.render()
      } else {
        this.hide()
      }
    })
  }

  render() {
    const { row, column } = this.checkerCount
    const { row: cRow, column: cColumn } = this.current!
    const { row: sRow, column: sColumn } = this.select!
    const { tableContainer, oldVnode } = this
    const tableRows = []
    let i
    let j
    for (i = 0; i < row; i++) {
      let rowSelector = 'div.ag-table-picker-row'
      const cells = []
      for (j = 0; j < column; j++) {
        let cellSelector = 'span.ag-table-picker-cell'
        if (i <= cRow && j <= cColumn) {
          cellSelector += '.current'
        }
        if (i <= sRow && j <= sColumn) {
          cellSelector += '.selected'
        }
        cells.push(
          h(cellSelector, {
            key: j.toString(),
            dataset: {
              row: i.toString(),
              column: j.toString(),
            },
            on: {
              mouseenter: (event: MouseEvent) => {
                const { target } = event
                const r = (target! as HTMLElement).getAttribute('data-row')
                const c = (target! as HTMLElement).getAttribute('data-column')
                this.select = { row: Number(r), column: Number(c) }
                this.render()
              },
              click: () => {
                this.selectItem()
              },
            },
          }),
        )
      }

      tableRows.push(h(rowSelector, cells))
    }

    const tableFooter = h('div.footer', [
      h('input.row-input', {
        props: {
          type: 'text',
          value: +this.select!.row + 1,
        },
        on: {
          keyup: (event: KeyboardEvent) => {
            this.keyupHandler(event, 'row')
          },
        },
      }),
      'x',
      h('input.column-input', {
        props: {
          type: 'text',
          value: +this.select!.column + 1,
        },
        on: {
          keyup: (event: KeyboardEvent) => {
            this.keyupHandler(event, 'column')
          },
        },
      }),
      h(
        'button',
        {
          on: {
            click: () => {
              this.selectItem()
            },
          },
        },
        'OK',
      ),
    ])

    const vnode = h('div', [h('div.checker', tableRows), tableFooter])

    if (oldVnode) {
      patch(oldVnode, vnode)
    } else {
      patch(tableContainer, vnode)
    }
    this.oldVnode = vnode
  }

  keyupHandler(event: KeyboardEvent, type: 'row' | 'column') {
    let number = +this.select![type]
    const value = +(event.target as HTMLInputElement).value
    if (event.key === EVENT_KEYS.ArrowUp) {
      number++
    } else if (event.key === EVENT_KEYS.ArrowDown) {
      number--
    } else if (event.key === EVENT_KEYS.Enter) {
      this.selectItem()
    } else if (typeof value === 'number') {
      number = value - 1
    }
    if (number !== +this.select![type]) {
      this.select![type] = Math.max(number, 0)
      this.render()
    }
  }

  childShow(current: ITable, reference: HTMLElement, cb: (...args: any) => void) {
    // current { row, column } zero base
    this.current = this.select = current
    super.show(reference, cb)
  }

  selectItem() {
    const { cb } = this
    const { row, column } = this.select!
    cb(Math.max(row, 0), Math.max(column, 0))
    this.hide()
  }
}

export default TablePicker
