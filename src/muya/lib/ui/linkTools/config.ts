/** @format */

import linkJumpIcon from '../../assets/pngicon/link_jump/2.png'
import unlinkIcon from '../../assets/pngicon/unlink/2.png'

export type Icon = {
  type: string
  icon: any
}

const icons: Array<Icon> = [
  {
    type: 'unlink',
    icon: unlinkIcon,
  },
  {
    type: 'jump',
    icon: linkJumpIcon,
  },
]

export default icons
