/** @format */

import { IFootnote, ILink } from '@/typings/muya'

export class BlockSrc extends Array {
  links!: Record<string, ILink>
  footnotes!: Map<string, IFootnote>
}
