/* eslint-disable no-prototype-builtins */
function getObjectPropertyValueByKey(obj: any, key: string): any | undefined {
  const map = new Map(Object.entries(obj))
  if (obj.hasOwnProperty(key) && map) {
    return map.get(key)
  }
}

/**
 * Generates unique ID for give prefix.
 * @param {string} prefix Prefix for generated ID
 * @returns {boolean}
 */
function getUniqueIdWithPrefix(prefix: string | undefined): string {
  const result = Math.floor(Math.random() * new Date().getTime()).toString()
  if (!prefix) {
    return result
  }

  return `${prefix}${result}`
}

/* eslint-disable no-useless-escape */
function stringSnakeToCamel(str: string): string {
  return str?.replace(/(\-\w)/g, (m: any) => m?.[1]?.toUpperCase())
}

function toJSON(value: string | JSON): JSON | undefined {
  if (typeof value !== 'string') {
    return value
  }

  if (!value) {
    return undefined
  }

  // ("'" => "\"");
  const result: any = value
    ?.toString()
    ?.split('')
    ?.map((el: any) => (el !== "'" ? el : '"'))
    ?.join('')
  const jsonStr = result?.replace(
    /(\w+:)|(\w+ :)/g,
    (matched: any) => '"' + matched?.substring(0, matched?.length - 1) + '":'
  )
  try {
    return JSON.parse(jsonStr)
  } catch {
    return undefined
  }
}

export {getObjectPropertyValueByKey, getUniqueIdWithPrefix, stringSnakeToCamel, toJSON}
