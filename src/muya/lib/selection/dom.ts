/** @format */

import { blockContainerElementNames, CLASS_OR_ID, emptyElementNames, LOWERCASE_TAGS } from '../config'
const CHOP_TEXT_REG = /(\*{1,3})([^*]+)(\1)/g

export const getTextContent = (node: HTMLElement, blackList: Array<string>) => {
  if (node.nodeType === 3) {
    return node.textContent
  } else if (!blackList) {
    return node.textContent
  }

  let text = ''
  if (blackList.some(className => node.classList && node.classList.contains(className))) {
    return text
  }
  if (node.nodeType === 3) {
    text += node.textContent
  } else if (node.nodeType === 1 && node.classList.contains('ag-inline-image')) {
    // handle inline image
    const raw = node.getAttribute('data-raw')
    const imageContainer = node.querySelector('.ag-image-container')!
    const hasImg = imageContainer.querySelector('img')
    const childNodes = imageContainer.childNodes
    if (childNodes.length && hasImg) {
      for (const child of childNodes) {
        if (child.nodeType === 1 && child.nodeName === 'IMG') {
          text += raw
        } else if (child.nodeType === 3) {
          text += child.textContent
        }
      }
    } else {
      text += raw
    }
  } else {
    const childNodes = node.childNodes
    for (const n of childNodes) {
      text += getTextContent((n as any) as HTMLElement, blackList)
    }
  }
  return text
}

export const getOffsetOfParagraph = (node: HTMLElement, paragraph: HTMLElement): number => {
  let offset = 0
  let preSibling = node

  if (node === paragraph) return offset

  do {
    preSibling = (preSibling.previousSibling as any) as HTMLElement
    if (preSibling) {
      offset += getTextContent(preSibling, [CLASS_OR_ID.AG_MATH_RENDER, CLASS_OR_ID.AG_RUBY_RENDER])!.length
    }
  } while (preSibling)
  return node === paragraph || node.parentNode === paragraph
    ? offset
    : offset + getOffsetOfParagraph((node.parentNode as any) as HTMLElement, paragraph)
}

export const findNearestParagraph = (node: HTMLElement) => {
  if (!node) {
    return null
  }
  do {
    if (isAganippeParagraph(node)) return node
    node = (node.parentNode as any) as HTMLElement
  } while (node)
  return null
}

export const findOutMostParagraph = (node: HTMLElement) => {
  do {
    const parentNode = node.parentNode
    if (isMuyaEditorElement(parentNode as HTMLElement) && isAganippeParagraph(node)) return node
    node = (parentNode as any) as HTMLElement
  } while (node)
}

export const isAganippeParagraph = (element: HTMLElement) => {
  return element && element.classList && element.classList.contains(CLASS_OR_ID.AG_PARAGRAPH)
}

export const isBlockContainer = (element: Node) => {
  return element && element.nodeType !== 3 && blockContainerElementNames.indexOf(element.nodeName.toLowerCase()) !== -1
}

export const isMuyaEditorElement = (element: HTMLElement) => {
  return element && element.id === CLASS_OR_ID.AG_EDITOR_ID
}

export const traverseUp = (current: HTMLElement, testElementFunction: { (node: HTMLElement): boolean }) => {
  if (!current) {
    return false
  }

  do {
    if (current.nodeType === 1) {
      if (testElementFunction(current)) {
        return current
      }
      // do not traverse upwards past the nearest containing editor
      if (isMuyaEditorElement(current)) {
        return false
      }
    }

    current = (current.parentNode as any) as HTMLElement
  } while (current)

  return false
}

export const getFirstSelectableLeafNode = (element: HTMLElement) => {
  while (element && element.firstChild) {
    element = (element.firstChild as any) as HTMLElement
  }

  // We don't want to set the selection to an element that can't have children, this messes up Gecko.
  element = traverseUp(element, (el: HTMLElement) => {
    return emptyElementNames.indexOf(el.nodeName.toLowerCase()) === -1
  }) as HTMLElement
  // Selecting at the beginning of a table doesn't work in PhantomJS.
  if (element.nodeName.toLowerCase() === LOWERCASE_TAGS.table) {
    const firstCell = element.querySelector('th, td')
    if (firstCell) {
      element = firstCell as HTMLElement
    }
  }
  return element
}

export const getClosestBlockContainer = (node: HTMLElement) => {
  return traverseUp(node, (node: HTMLElement) => {
    return isBlockContainer(node) || isMuyaEditorElement(node)
  })
}

export const getCursorPositionWithinMarkedText = (markedText: string, cursorOffset: number) => {
  const chunks = []
  let match
  let result: {
    type: 'OUT' | 'IN' | 'LEFT' | 'RIGHT'
    info?: string | number
  } = { type: 'OUT' }

  do {
    match = CHOP_TEXT_REG.exec(markedText)
    if (match) {
      chunks.push({
        index: match.index + match[1].length,
        leftSymbol: match[1],
        rightSymbol: match[3],
        lastIndex: CHOP_TEXT_REG.lastIndex - match[3].length,
      })
    }
  } while (match)

  chunks.forEach(chunk => {
    const { index, leftSymbol, rightSymbol, lastIndex } = chunk
    if (cursorOffset > index && cursorOffset < lastIndex) {
      result = { type: 'IN', info: leftSymbol } // rightSymbol is also ok
    } else if (cursorOffset === index) {
      result = { type: 'LEFT', info: leftSymbol.length }
    } else if (cursorOffset === lastIndex) {
      result = { type: 'RIGHT', info: rightSymbol.length }
    }
  })
  return result
}

export const compareParagraphsOrder = (paragraph1: HTMLElement, paragraph2: HTMLElement) => {
  return paragraph1.compareDocumentPosition(paragraph2) & Node.DOCUMENT_POSITION_FOLLOWING
}
