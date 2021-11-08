/** @format */

// import virtualize from 'snabbdom-virtualize/strings'
import {
  attributesModule,
  classModule,
  datasetModule,
  eventListenersModule,
  init,
  propsModule,
  styleModule,
  toVNode,
} from 'snabbdom'
import toHTML from 'snabbdom-to-html' // helper function for convert vnode to HTML String
export { h, toVNode } from 'snabbdom'
export { toHTML }

export const patch = init([
  classModule,
  attributesModule,
  styleModule,
  propsModule,
  datasetModule,
  eventListenersModule,
])
export const htmlToVNode = (html: string) => {
  // helper function for convert html to vnode
  const wrapper = document.createElement('div')
  wrapper.innerHTML = html
  return toVNode(wrapper).children
}
