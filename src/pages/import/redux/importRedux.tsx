import axios from '@api/axios'

export function downloadTemplate(params: object) {
  return axios({
    method: 'get',
    params,
    url: 'import/download-template',
  })
}

export function uploadData(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'import/upload',
  })
}

export function showData(id: string) {
  return axios({
    method: 'get',
    url: 'import/' + id + '/show',
  })
}

export function mappingData(params: any, id: string) {
  return axios({
    method: 'put',
    data: params,
    url: 'import/' + id + '/map',
  })
}

export function previewData(params: any, id: string) {
  return axios({
    method: 'get',
    params,
    url: 'import/' + id + '/preview',
  })
}

export function storeData(params: any, id: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'import/' + id + '/store',
  })
}

export function errorData(params: any) {
  return axios({
    method: 'get',
    params,
    url: 'import-error',
  })
}
