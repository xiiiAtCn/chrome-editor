/** @format */

import Muya from '../..'
import { h, patch } from '../../parser/render/snabbdom'
import BaseFloat, { IFloatOption } from '../baseFloat'
import icons, { Icon } from './config'
import './index.css'

const defaultOptions: IFloatOption = {
  placement: 'bottom',
  modifiers: {
    offset: {
      offset: '0, 5',
    },
  },
  showArrow: false,
}

class LinkTools extends BaseFloat {
  static pluginName = 'linkTools'

  oldVnode: any

  linkInfo: any

  icons: Array<Icon>

  hideTimer: number

  linkContainer: HTMLElement

  options: IFloatOption & {
    jumpClick: (option: any) => void
  }

  constructor(
    muya: Muya,
    options?: IFloatOption & {
      jumpClick: (option: any) => void
    },
  ) {
    const opts = Object.assign({}, defaultOptions, options)
    const name = 'ag-link-tools'
    super(muya, name, opts)
    this.oldVnode = null
    this.linkInfo = null
    this.options = opts
    this.icons = icons
    this.hideTimer = 0
    const linkContainer = (this.linkContainer = document.createElement('div'))
    this.container.appendChild(linkContainer)
    this.listen()
  }

  listen() {
    const { eventCenter } = this.muya
    super.listen()
    eventCenter.subscribe('muya-link-tools', ({ reference, linkInfo }: { reference: HTMLElement; linkInfo: Icon }) => {
      if (reference) {
        this.linkInfo = linkInfo
        setTimeout(() => {
          this.show(reference)
          this.render()
        }, 0)
      } else {
        if (this.hideTimer) {
          clearTimeout(this.hideTimer)
        }
        this.hideTimer = window.setTimeout(() => {
          this.hide()
        }, 500)
      }
    })

    const mouseOverHandler = () => {
      if (this.hideTimer) {
        clearTimeout(this.hideTimer)
      }
    }

    const mouseOutHandler = () => {
      this.hide()
    }

    eventCenter.attachDOMEvent(this.container, 'mouseover', mouseOverHandler)
    eventCenter.attachDOMEvent(this.container, 'mouseleave', mouseOutHandler)
  }

  render() {
    const { icons, oldVnode, linkContainer } = this
    const children = icons.map(i => {
      let icon
      let iconWrapperSelector: string
      if (i.icon) {
        // SVG icon Asset
        iconWrapperSelector = 'div.icon-wrapper'
        icon = h(
          'i.icon',
          h(
            'i.icon-inner',
            {
              style: {
                background: `url(${i.icon}) no-repeat`,
                'background-size': '100%',
              },
            },
            '',
          ),
        )
      }
      const iconWrapper = h(iconWrapperSelector!, icon)
      let itemSelector = `li.item.${i.type}`

      return h(
        itemSelector,
        {
          on: {
            click: (event: MouseEvent) => {
              this.selectItem(event, i)
            },
          },
        },
        iconWrapper,
      )
    })

    const vnode = h('ul', children)

    if (oldVnode) {
      patch(oldVnode, vnode)
    } else {
      patch(linkContainer, vnode)
    }
    this.oldVnode = vnode
  }

  selectItem(event: MouseEvent, item: Icon) {
    event.preventDefault()
    event.stopPropagation()
    const { contentState } = this.muya
    switch (item.type) {
      case 'unlink':
        contentState.unlink(this.linkInfo)
        this.hide()
        break
      case 'jump':
        this.options.jumpClick(this.linkInfo)
        this.hide()
        break
    }
  }
}

export default LinkTools
