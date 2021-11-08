/** @format */

import copyIcon from '../../../assets/pngicon/copy/2.png'
import { h } from '../snabbdom'

const renderCopyButton = () => {
  const selector = 'a.ag-code-copy'
  const iconVnode = h(
    'i.icon',
    h(
      'i.icon-inner',
      {
        style: {
          background: `url(${copyIcon}) no-repeat`,
          'background-size': '100%',
        },
      },
      '',
    ),
  )

  return h(
    selector,
    {
      attrs: {
        title: 'Copy content',
        contenteditable: 'false',
      },
    },
    iconVnode,
  )
}

export default renderCopyButton
