/** @format */

import Muya from '..'
import { collectFootnotes } from '../utils'
import { getLinkInfo } from '../utils/getLinkInfo'

class MouseEvent {
  muya: Muya

  constructor(muya: Muya) {
    this.muya = muya
    this.mouseBinding()
    this.mouseDown()
  }

  mouseBinding() {
    const { container, eventCenter } = this.muya
    const handler = (event: Event) => {
      const target = event.target as HTMLElement
      const parent = target.parentNode as HTMLElement
      const preSibling = target.previousElementSibling
      const parentPreSibling = parent ? parent.previousElementSibling : null
      const { hideLinkPopup, footnote } = this.muya.options
      const rect = parent.getBoundingClientRect()
      const reference = {
        getBoundingClientRect() {
          return rect
        },
      }

      if (
        !hideLinkPopup &&
        parent &&
        parent.tagName === 'A' &&
        parent.classList.contains('ag-inline-rule') &&
        parentPreSibling &&
        parentPreSibling.classList.contains('ag-hide')
      ) {
        eventCenter.dispatch('muya-link-tools', {
          reference,
          linkInfo: getLinkInfo(parent),
        })
      }

      if (
        footnote &&
        parent &&
        parent.tagName === 'SUP' &&
        parent.classList.contains('ag-inline-footnote-identifier') &&
        preSibling &&
        preSibling.classList.contains('ag-hide')
      ) {
        const identifier = target.textContent
        eventCenter.dispatch('muya-footnote-tool', {
          reference,
          identifier,
          footnotes: collectFootnotes(this.muya.contentState.blocks),
        })
      }
    }
    const leaveHandler = (event: Event) => {
      const target = event.target as HTMLElement
      const parent = target.parentNode as HTMLElement
      const preSibling = target.previousElementSibling
      const { footnote } = this.muya.options
      if (parent && parent.tagName === 'A' && parent.classList.contains('ag-inline-rule')) {
        eventCenter.dispatch('muya-link-tools', {
          reference: null,
        })
      }

      if (
        footnote &&
        parent &&
        parent.tagName === 'SUP' &&
        parent.classList.contains('ag-inline-footnote-identifier') &&
        preSibling &&
        preSibling.classList.contains('ag-hide')
      ) {
        eventCenter.dispatch('muya-footnote-tool', {
          reference: null,
        })
      }
    }

    eventCenter.attachDOMEvent(container, 'mouseover', handler)
    eventCenter.attachDOMEvent(container, 'mouseout', leaveHandler)
  }

  mouseDown() {
    const { container, eventCenter, contentState } = this.muya
    const handler = (event: globalThis.MouseEvent) => {
      const target = event.target as HTMLElement
      if (target.classList && target.classList.contains('ag-drag-handler')) {
        contentState.handleMouseDown(event)
      } else if (target && target.closest('tr')) {
        contentState.handleCellMouseDown(event)
      }
    }
    eventCenter.attachDOMEvent(container, 'mousedown', handler)
  }
}

export default MouseEvent
