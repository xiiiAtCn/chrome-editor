/** @format */

import { getUniqueId } from '../utils'

type K = keyof HTMLElementEventMap

export type ICustom =
  | 'muya-float'
  | 'stateChange'
  | 'preview-image'
  | 'muya-code-picker'
  | 'muya-emoji-picker'
  | 'muya-format-picker'
  | 'muya-link-tools'
  | 'contextmenu'
  | 'muya-table-bar'
  | 'format-click'
  | 'muya-image-selector'
  | 'select-image'
  | 'muya-image-toolbar'
  | 'muya-footnote-tool'
  | 'muya-transformer'
  | 'muya-quick-insert'
  | 'muya-front-menu'
  | 'muya-table-picker'
  | 'muya-image-picker'
  | 'focus'
  | 'blur'
  | 'crashed'
  | 'change'
  | 'selectionChange'
  | 'selectionFormats'
class EventCenter {
  events: Array<{
    eventId: string
    target: HTMLElement
    event: K
    listener: any
    capture: boolean | AddEventListenerOptions
  }>
  listeners: Record<
    K | string,
    Array<{ listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any; once: boolean }>
  >
  constructor() {
    this.events = []
    // todo
    this.listeners = {}
  }

  /**
   * [attachDOMEvent] bind event listener to target, and return a unique ID,
   * this ID
   */

  attachDOMEvent<T extends K>(
    target: HTMLElement,
    event: T,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[T]) => any,
    capture: boolean = false,
  ) {
    if (this.checkHasBind(target, event, listener, capture)) return false
    const eventId = getUniqueId()
    target.addEventListener<T>(event, listener, capture)
    this.events.push({
      eventId,
      target,
      event,
      listener,
      capture,
    })
    return eventId
  }

  /**
   * [detachDOMEvent removeEventListener]
   * @param  {[type]} eventId [unique eventId]
   */
  detachDOMEvent(eventId: string) {
    if (!eventId) return false
    const index = this.events.findIndex(e => e.eventId === eventId)
    if (index > -1) {
      const { target, event, listener, capture } = this.events[index]
      target.removeEventListener<K>(event, listener, capture)
      this.events.splice(index, 1)
    }
  }

  /**
   * [detachAllDomEvents remove all the DOM events handler]
   */
  detachAllDomEvents() {
    this.events.forEach(event => this.detachDOMEvent(event.eventId))
  }

  /**
   * inner method for subscribe and subscribeOnce
   */
  _subscribe(event: ICustom, listener: any, once = false) {
    const listeners = this.listeners[event]
    const handler = { listener, once }
    if (listeners && Array.isArray(listeners)) {
      listeners.push(handler)
    } else {
      this.listeners[event] = [handler]
    }
  }

  /**
   * [subscribe] subscribe custom event
   */
  subscribe(event: ICustom, listener: any) {
    this._subscribe(event, listener)
  }

  /**
   * [unsubscribe] unsubscribe custom event
   */
  unsubscribe(event: ICustom, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any) {
    const listeners = this.listeners[event]
    if (Array.isArray(listeners) && listeners.find(l => l.listener === listener)) {
      const index = listeners.findIndex(l => l.listener === listener)
      listeners.splice(index, 1)
    }
  }

  /**
   * [subscribeOnce] usbscribe event and listen once
   */
  subscribeOnce(event: ICustom, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any) {
    this._subscribe(event, listener, true)
  }

  /**
   * dispatch custom event
   */
  dispatch(event: ICustom, ...data: Array<any>) {
    const eventListener = this.listeners[event]
    if (eventListener && Array.isArray(eventListener)) {
      eventListener.forEach(({ listener, once }) => {
        // @ts-ignore
        listener(...data)
        if (once) {
          this.unsubscribe(event, listener)
        }
      })
    }
  }

  // Determine whether the event has been bind
  checkHasBind<T extends K>(
    cTarget: HTMLElement,
    cEvent: T,
    cListener: (this: HTMLElement, ev: HTMLElementEventMap[T]) => any,
    cCapture: boolean,
  ) {
    for (const { target, event, listener, capture } of this.events) {
      if (target === cTarget && event === cEvent && listener === cListener && capture === cCapture) {
        return true
      }
    }
    return false
  }
}

export default EventCenter
