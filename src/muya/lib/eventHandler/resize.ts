/** @format */

import Muya from '..'

// import resizeCodeBlockLineNumber from '../utils/resizeCodeLineNumber'
// import { throttle } from '../utils'

class Resize {
  muya: Muya
  constructor(muya: Muya) {
    this.muya = muya
    this.listen()
  }

  listen() {
    // FIXME: Disabled due to #1648.
    // const { codeBlockLineNumbers } = this.muya.options
    // if (!codeBlockLineNumbers) {
    //   return
    // }
    //
    // window.addEventListener('resize', throttle(() => {
    //   const codeBlocks = document.querySelectorAll('pre.line-numbers')
    //   if (codeBlocks.length) {
    //     for (const ele of codeBlocks) {
    //       resizeCodeBlockLineNumber(ele)
    //     }
    //   }
    // }, 300))
  }
}

export default Resize
