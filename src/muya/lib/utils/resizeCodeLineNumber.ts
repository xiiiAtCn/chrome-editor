/**
 * This file copy from prismjs/plugins/prism-line-number
 *
 * @format
 */

/**
 * Regular expression used for determining line breaks
 * @type {RegExp}
 */
const NEW_LINE_EXP = /\n(?!$)/g

/**
 * Returns style declarations for the element
 * @param {Element} element
 */
const getStyles = function (element: Element) {
  if (!element) {
    return null
  }

  return getComputedStyle(element)
}

/**
 * Resizes line numbers spans according to height of line of code
 * @param {Element} element <pre> element
 */
const resizeCodeBlockLineNumber = function (element: Element) {
  // FIXME: Heavy performance issues with this function, please see #1648.

  const codeStyles = getStyles(element)!
  const whiteSpace = codeStyles['whiteSpace']

  if (whiteSpace === 'pre' || whiteSpace === 'pre-wrap' || whiteSpace === 'pre-line') {
    const codeElement = element.querySelector('code')!
    const lineNumbersWrapper = element.querySelector('.line-numbers-rows')
    let lineNumberSizer = element.querySelector('.line-numbers-sizer') as HTMLElement
    const codeLines = codeElement.textContent!.split(NEW_LINE_EXP)

    if (!lineNumberSizer) {
      lineNumberSizer = document.createElement('span')
      lineNumberSizer.className = 'line-numbers-sizer'

      codeElement.appendChild(lineNumberSizer)
    }

    lineNumberSizer.style.display = 'block'

    codeLines.forEach(function (line, lineNumber) {
      lineNumberSizer.textContent = line || '\n'
      const lineSize = lineNumberSizer.getBoundingClientRect().height
      ;(lineNumbersWrapper!.children[lineNumber] as HTMLElement).style.height = lineSize + 'px'
    })

    lineNumberSizer.textContent = ''
    lineNumberSizer.style.display = 'none'
  }
}

export default resizeCodeBlockLineNumber
