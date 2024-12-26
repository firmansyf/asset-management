import {API, API_MEILI} from '@api/server'
export function getCurrentUrl(pathname: string) {
  return pathname?.split(/[?#]/)[0]
}

// |-------------------- SET DB SERVER HERE --------------------|
// dev, stg, or live
const SERVER: any = 'live'
// |------------------------------------------------------------|

let {REACT_APP_API_URL}: any = process.env || {}
const {NODE_ENV}: any = process.env || {}
const justDomain: any = /(?=.*\.)asset[a-z]{0,}(?=.*\.)\.[a-z]{0,}(?=.*\/)/gi

if (REACT_APP_API_URL && NODE_ENV === 'development' && SERVER === 'dev') {
  REACT_APP_API_URL = REACT_APP_API_URL.replace(justDomain, 'assetd.xyz')
}
if (REACT_APP_API_URL && NODE_ENV === 'development' && SERVER === 'stg') {
  REACT_APP_API_URL = REACT_APP_API_URL.replace(justDomain, 'assetd.zone')
}
if (REACT_APP_API_URL && NODE_ENV === 'development' && SERVER === 'live') {
  REACT_APP_API_URL = REACT_APP_API_URL.replace(justDomain, 'assetdata.io')
}

export function generateUrlAPI(pathname: string) {
  const fullUri = window.location.host
  const TENANT = fullUri?.split('.')?.[0]
  if (process.env.NODE_ENV === 'development' || API) {
    return `http://${API}${pathname}`
  } else {
    const {protocol} = window.location
    const API_URL = `${window.location.host.replace(TENANT, 'be')}/api/v1`
    return `${protocol}//${TENANT}.${API_URL}/${pathname}`
  }
}

export function generateUrlAPIVersionTwo(pathname: string) {
  const fullUri = window.location.host
  const TENANT = fullUri?.split('.')?.[0]
  if (process.env.NODE_ENV === 'development' || API_MEILI) {
    return `http://${TENANT}${API_MEILI}${pathname}`
  } else {
    const {protocol} = window.location
    const API_URL = `${window.location.host.replace(TENANT, 'be')}/api/v2`
    return `${protocol}//${TENANT}.${API_URL}/${pathname}`
  }
}

export function generateUrlServer(pathname: string) {
  const fullUri = window.location.host
  const TENANT = fullUri?.split('.')[0]
  if (process.env.NODE_ENV === 'development' || API) {
    return `http://${TENANT}${API}${pathname}`
  } else {
    const {protocol} = window.location
    const API_URL = `${window.location.host.replace(TENANT, 'be')}`
    return `${protocol}//${TENANT}.${API_URL}/${pathname}`
  }
}

export function generateUrl(pathname: string) {
  const CONFIG = process.env
  const fullUri = window.location.host
  const TENANT = fullUri?.split('.')[0]
  return `http://${TENANT}.${CONFIG.REACT_APP_BASE_DOMAIN}/${pathname}`
}

export function errorExpiredToken(e: any, actions?: any) {
  const {response} = e
  const {status, data: res} = response || {}
  const {data} = res || {}
  const {fields} = data || {}

  if (status === 401) {
    window.location.href = '/auth/login'
  }
  if (actions) {
    Object.keys(fields || {})?.forEach((e: any) => {
      actions.setFieldError(e, fields[e][0])
    })
  }
}

export function errorValidation(e: any) {
  const {response} = e
  const {data} = response || {}
  const res: any = {}
  if (data && data?.data?.fields) {
    Object.keys(data?.data?.fields || {})?.forEach((map: any) => {
      res[map] = data?.data?.fields[map]?.[0]
    })
  } else if (data?.message) {
    res.message = data?.message
  }
  return res
}

export function checkIsActive(pathname: string, url: string) {
  const current = getCurrentUrl(pathname)
  if (!current || !url) {
    return false
  }

  const pathUrl: Array<string> = current.split('/')
  if (pathUrl[1] === 'asset-management' && pathUrl[2] === 'detail') {
    return false
  }

  if (current === '/asset-management/add' || current === '/asset-management/edit') {
    return false
  }

  if (current === url) {
    return true
  }

  if (decodeURI(pathname) === url) {
    return true
  }

  if (current.indexOf(url) > -1) {
    return true
  }

  return false
}

export function serialize(obj: any, prefix?: any) {
  const str: any = []
  for (const p in obj) {
    if (obj[p]) {
      const k = prefix ? prefix + '[' + p + ']' : p,
        v = obj[p]
      if (v) {
        str.push(
          v !== null && v !== undefined && typeof v === 'object'
            ? serialize(v, k)
            : encodeURIComponent(k) + '=' + encodeURIComponent(v)
        )
      }
    }
  }

  return str.filter((e: any) => e !== '').join('&')
}
