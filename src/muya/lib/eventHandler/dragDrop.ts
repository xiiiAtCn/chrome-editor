/** @format */

import Muya from '..'

class DragDrop {
  muya: Muya
  constructor(muya: Muya) {
    this.muya = muya
    this.dragOverBinding()
    this.dropBinding()
    this.dragendBinding()
    this.dragStartBinding()
  }

  dragStartBinding() {
    const { container, eventCenter } = this.muya

    const dragStartHandler = (event: DragEvent) => {
      if ((event.target! as HTMLElement).tagName === 'IMG') {
        return event.preventDefault()
      }
    }

    eventCenter.attachDOMEvent(container, 'dragstart', dragStartHandler)
  }

  dragOverBinding() {
    const { container, eventCenter, contentState } = this.muya

    const dragoverHandler = (event: DragEvent) => {
      contentState.dragoverHandler(event)
    }

    eventCenter.attachDOMEvent(container, 'dragover', dragoverHandler)
  }

  dropBinding() {
    const { container, eventCenter, contentState } = this.muya

    const dropHandler = (event: DragEvent) => {
      contentState.dropHandler(event)
    }

    eventCenter.attachDOMEvent(container, 'drop', dropHandler)
  }

  dragendBinding() {
    const { eventCenter, contentState } = this.muya

    const dragleaveHandler = (event: DragEvent) => {
      contentState.dragleaveHandler(event)
    }

    eventCenter.attachDOMEvent((window as any) as HTMLElement, 'dragleave', dragleaveHandler)
  }
}

export default DragDrop
