/** @format */

import languages from './languages'
let peerDependentsMap: Record<string, Array<string>> | null = null
export const loadedCache = new Set(['markup', 'css', 'clike', 'javascript'])
const prismComponentCache = new Map()

function getPeerDependentsMap() {
  const peerDependentsMap: Record<string, Array<string>> = {}
  Object.keys(languages).forEach(function (language) {
    if (language === 'meta') {
      return false
    }
    let peerDependencies = languages[language].peerDependencies
    if (peerDependencies) {
      if (!Array.isArray(peerDependencies)) {
        peerDependencies = [peerDependencies!]
      } else {
        peerDependencies.forEach(function (peerDependency) {
          if (!peerDependentsMap[peerDependency]) {
            peerDependentsMap[peerDependency] = []
          }
          peerDependentsMap[peerDependency].push(language)
        })
      }
    }
  })
  return peerDependentsMap
}

function getPeerDependents(mainLanguage: string) {
  if (!peerDependentsMap) {
    peerDependentsMap = getPeerDependentsMap()
  }
  return peerDependentsMap[mainLanguage] || []
}

// Look for the origin languge by alias
export const transfromAliasToOrigin = (arr: Array<string>) => {
  const result = []
  for (const lang of arr) {
    if (languages[lang]) {
      result.push(lang)
    } else {
      const language = Object.keys(languages).find(name => {
        const l = languages[name]
        if (l.alias) {
          return l.alias === lang || (Array.isArray(l.alias) && l.alias.includes(lang))
        }
        return false
      })

      if (language) {
        result.push(language)
      } else {
        // The lang is not exist, the will handle in `initLoadLanguage`
        result.push(lang)
      }
    }
  }
  return result
}

function initLoadLanguage(Prism: any) {
  return async function loadLanguages(
    arr: Array<string> | string | undefined,
    withoutDependencies?: boolean,
  ): Promise<
    Array<{
      status: string
      lang: string
    }>
  > {
    // If no argument is passed, load all components
    if (!arr) {
      arr = Object.keys(languages).filter(function (language) {
        return language !== 'meta'
      })
    }
    if (arr && !arr.length) {
      return Promise.reject(new Error('The first parameter should be a list of load languages or single language.'))
    }

    if (!Array.isArray(arr)) {
      arr = [arr]
    }

    const promises = []
    const transformedLangs = transfromAliasToOrigin(arr)
    for (const language of transformedLangs) {
      // handle not existed
      if (!languages[language]) {
        promises.push(
          Promise.resolve({
            lang: language,
            status: 'noexist',
          }),
        )
        continue
      }
      // handle already cached
      if (loadedCache.has(language)) {
        promises.push(
          Promise.resolve({
            lang: language,
            status: 'cached',
          }),
        )
        continue
      }

      // Load dependencies first
      if (!withoutDependencies && languages[language].require) {
        const results = await loadLanguages(languages[language].require)
        promises.push(...results)
      }

      delete Prism.languages[language]
      if (!prismComponentCache.has(language)) {
        await import('prismjs/components/prism-' + language)
        prismComponentCache.set(language, Prism.languages[language])
      } else {
        Prism.languages[language] = prismComponentCache.get(language)
      }
      loadedCache.add(language)
      promises.push(
        Promise.resolve({
          status: 'loaded',
          lang: language,
        }),
      )

      // Reload dependents
      const dependents = getPeerDependents(language).filter(function (dependent) {
        // If dependent language was already loaded,
        // we want to reload it.
        if (Prism.languages[dependent]) {
          delete Prism.languages[dependent]
          loadedCache.delete(dependent)
          return true
        }
        return false
      })
      if (dependents.length) {
        const results = await loadLanguages(dependents, true)
        promises.push(...results)
      }
    }

    return Promise.all(promises)
  }
}

export default initLoadLanguage
