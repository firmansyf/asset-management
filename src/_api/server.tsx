// |-------------------- SET DB SERVER HERE --------------------|
// dev, stg, or live
const SERVER: any = 'dev'
const PROTOCOL: any = 'https://'
// |------------------------------------------------------------|

let {REACT_APP_API_URL: API}: any = process.env || {}
let {REACT_APP_API_URL_MEILI: API_MEILI}: any = process.env || {}

const {NODE_ENV}: any = process.env || {}
const justDomain: any = /(?=.*\.)asset[a-z]{0,}(?=.*\.)\.[a-z]{0,}(?=.*\/)/gi

// api server v1
if (API && NODE_ENV === 'development' && SERVER === 'dev') {
  API = API.replace(justDomain, 'assetd.xyz')
}
if (API && NODE_ENV === 'development' && SERVER === 'stg') {
  API = API.replace(justDomain, 'assetd.zone')
}
if (API && NODE_ENV === 'development' && SERVER === 'live') {
  API = API.replace(justDomain, 'assetdata.io')
}

// api server v2 meilisearch
if (API_MEILI && NODE_ENV === 'development' && SERVER === 'dev') {
  API_MEILI = API_MEILI.replace(justDomain, 'assetd.xyz')
}
if (API_MEILI && NODE_ENV === 'development' && SERVER === 'stg') {
  API_MEILI = API_MEILI.replace(justDomain, 'assetd.zone')
}
if (API_MEILI && NODE_ENV === 'development' && SERVER === 'live') {
  API_MEILI = API_MEILI.replace(justDomain, 'assetdata.io')
}

export {API, API_MEILI, PROTOCOL}
