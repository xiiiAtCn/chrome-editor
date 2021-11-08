/** @format */

import { filter } from 'fuzzaldrin'
import Prism from 'prismjs'
import languages from './languages'
import initLoadLanguage, { loadedCache, transfromAliasToOrigin } from './loadLanguage'

const prism = Prism
window.Prism = Prism
// @ts-ignore
import('prismjs/plugins/keep-markup/prism-keep-markup')

export type ILang = {
  name: string
  title: string
  alias?: Array<string> | string
  aliasTitles?: Record<string, string>
  option?: string
  ext: Array<string>
  require?: string | Array<string>
  peerDependencies?: string | Array<string>
}
const langs: Array<ILang> = []

for (const name of Object.keys(languages)) {
  const lang = languages[name]
  langs.push({
    name,
    ...lang,
  })
  if (lang.alias) {
    if (typeof lang.alias === 'string') {
      langs.push({
        name: lang.alias,
        ...lang,
      })
    } else if (Array.isArray(lang.alias)) {
      langs.push(
        ...lang.alias.map(a => ({
          name: a,
          ...lang,
        })),
      )
    }
  }
}

const loadLanguage = initLoadLanguage(Prism)

const search = (text: string) => {
  return filter(langs, text, { key: 'name' })
}

// pre load latex and yaml and html for `math block` \ `front matter` and `html block`
loadLanguage('latex')
loadLanguage('yaml')

export { search, loadLanguage, loadedCache, transfromAliasToOrigin, languages }

export default prism
