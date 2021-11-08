/** @format */

import htmlIcon from '../../../assets/pngicon/html/2.png'
import { CLASS_OR_ID } from '../../../config'
import { h } from '../snabbdom'

export const renderEditIcon = () => {
  // @ts-ignore
  const selector = `a.${CLASS_OR_ID.AG_CONTAINER_ICON}`
  const iconVnode = h(
    'i.icon',
    h(
      'i.icon-inner',
      {
        style: {
          background: `url(${htmlIcon}) no-repeat`,
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
        contenteditable: 'false',
      },
    },
    iconVnode,
  )
}
