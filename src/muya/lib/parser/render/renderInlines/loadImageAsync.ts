/** @format */

import { ImageInfo, WholeRender } from '@/typings/muya'
import { CLASS_OR_ID } from '../../../config'
import { getUniqueId, loadImage } from '../../../utils'
import { insertAfter, operateClassName } from '../../../utils/domManipulate'

export default function loadImageAsync(
  this: WholeRender,
  imageInfo: ImageInfo,
  attrs: { alt: string; title: string; width: number | string; height: number | string },
  className?: string,
  imageClass?: string,
) {
  const { src, isUnknownType } = imageInfo
  let id: string
  let isSuccess
  let w
  let h

  if (!this.loadImageMap.has(src)) {
    id = getUniqueId()
    loadImage(src, isUnknownType)
      .then(({ url, width, height }) => {
        const imageText: HTMLElement = document.querySelector(`#${id}`)!
        const img = document.createElement('img')
        img.src = url
        if (attrs.alt) img.alt = attrs.alt.replace(/[`*{}[\]()#+\-.!_>~:|<>$]/g, '')
        if (attrs.title) img.setAttribute('title', attrs.title)
        if (attrs.width && typeof attrs.width === 'number') {
          img.setAttribute('width', String(attrs.width))
        }
        if (attrs.height && typeof attrs.height === 'number') {
          img.setAttribute('height', String(attrs.height))
        }
        if (imageClass) {
          img.classList.add(imageClass)
        }

        if (imageText) {
          if (imageText.classList.contains('ag-inline-image')) {
            const imageContainer = imageText.querySelector('.ag-image-container')
            const oldImage = imageContainer!.querySelector('img')
            if (oldImage) {
              oldImage.remove()
            }
            imageContainer!.appendChild(img)
            imageText.classList.remove('ag-image-loading')
            imageText.classList.add('ag-image-success')
          } else {
            insertAfter(img, imageText)
            operateClassName(imageText, 'add', className || '')
          }
        }
        if (this.urlMap.has(src)) {
          this.urlMap.delete(src)
        }
        this.loadImageMap.set(src, {
          id,
          isSuccess: true,
          width,
          height,
        })
      })
      .catch(() => {
        const imageText: HTMLElement = document.querySelector(`#${id}`)!
        if (imageText) {
          operateClassName(imageText, 'remove', CLASS_OR_ID.AG_IMAGE_LOADING)
          operateClassName(imageText, 'add', CLASS_OR_ID.AG_IMAGE_FAIL)
          const image = imageText.querySelector('img')
          if (image) {
            image.remove()
          }
        }
        if (this.urlMap.has(src)) {
          this.urlMap.delete(src)
        }
        this.loadImageMap.set(src, {
          id,
          isSuccess: false,
        })
      })
  } else {
    const imageInfo = this.loadImageMap.get(src)!
    id = imageInfo.id
    isSuccess = imageInfo.isSuccess
    w = imageInfo.width
    h = imageInfo.height
  }

  return { id, isSuccess, width: w, height: h }
}
