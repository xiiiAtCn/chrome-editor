/** @format */

import { Block, IRange, Token, WholeRender } from '@/typings/muya'
import Cursor from 'src/muya/lib/selection/cursor'
import { CLASS_OR_ID } from '../../../config'
import { getImageInfo } from '../../../utils'

// reference_image
export default function referenceImage(
  this: WholeRender,
  h: any,
  cursor: Cursor,
  block: Block,
  token: Token,
  outerClass: string,
) {
  const className = this.getClassName(outerClass, block, token, cursor)
  const imageClass = CLASS_OR_ID.AG_IMAGE_MARKED_TEXT
  const { start, end } = token.range!
  const tag = this.highlight(h, block, start, end, token)
  const { label, backlash, alt } = token
  const rawSrc = label + (backlash as IRange).second
  let href = ''
  let title = ''
  if (this.labels.has(rawSrc.toLowerCase())) {
    ;({ href, title } = this.labels.get(rawSrc.toLowerCase()))
  }
  const imageInfo = getImageInfo(href)
  const { src } = imageInfo
  let id
  let isSuccess
  let selector
  if (src) {
    ;({ id, isSuccess } = this.loadImageAsync(imageInfo, { alt }, className, CLASS_OR_ID.AG_COPY_REMOVE))
  }
  selector = id ? `span#${id}.${imageClass}` : `span.${imageClass}`
  selector += `.${CLASS_OR_ID.AG_OUTPUT_REMOVE}`
  if (isSuccess) {
    selector += `.${className}`
  } else {
    selector += `.${CLASS_OR_ID.AG_IMAGE_FAIL}`
  }

  return isSuccess
    ? [h(selector, tag), h(`img.${CLASS_OR_ID.AG_COPY_REMOVE}`, { props: { alt, src, title } })]
    : [h(selector, tag)]
}
