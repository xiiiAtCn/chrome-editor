/** @format */

export const cumputeCheckboxStatus = function (parentCheckbox: HTMLElement) {
  const children = parentCheckbox.parentElement!.lastElementChild!.children
  const len = children.length
  for (let i = 0; i < len; i++) {
    const checkbox = children[i].firstElementChild as HTMLInputElement
    if (checkbox!.checked === false) {
      return false
    }
  }
  return true
}
