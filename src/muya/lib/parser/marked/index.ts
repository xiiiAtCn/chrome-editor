/** @format */

import Lexer from './lexer'
import options, { IOption } from './options'
import Parser from './parser'
import Renderer from './renderer'

/**
 * Marked
 */

function marked(src: string, opt: Partial<IOption>) {
  // throw error in case of non string input
  if (typeof src === 'undefined' || src === null) {
    throw new Error('marked(): input parameter is undefined or null')
  }
  if (typeof src !== 'string') {
    throw new Error('marked(): input parameter is of type ' + Object.prototype.toString.call(src) + ', string expected')
  }

  try {
    let temp = Object.assign({}, options, opt) as IOption
    return new Parser(temp).parse(new Lexer(opt).lex(src))
  } catch (e: any) {
    e.message += '\nPlease report this to https://github.com/marktext/marktext/issues.'
    if (opt.silent) {
      return '<p>An error occurred:</p><pre>' + encodeURIComponent(e.message + '') + '</pre>'
    }
    throw e
  }
}

export { Renderer, Lexer, Parser }

export default marked
