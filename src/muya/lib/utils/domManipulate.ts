/**
 * [description `add` or `remove` className of element
 *
 * @format
 */

type ICtrl = 'add' | 'remove'

export const operateClassName = (element: HTMLElement, ctrl: ICtrl, className: string) => {
  element.classList[ctrl](className)
}

export const insertBefore = (newNode: HTMLElement, originNode: HTMLElement) => {
  const parentNode = originNode.parentNode
  parentNode!.insertBefore(newNode, originNode)
}

// DOM operations
export const insertAfter = (newNode: HTMLElement, originNode: HTMLElement) => {
  const parentNode = originNode.parentNode

  if (originNode.nextSibling) {
    parentNode!.insertBefore(newNode, originNode.nextSibling)
  } else {
    parentNode!.appendChild(newNode)
  }
}
