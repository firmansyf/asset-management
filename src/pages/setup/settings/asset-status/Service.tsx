import axios from '@api/axios'

export function addAssetStatus(params: any) {
  return axios({
    method: 'post',
    url: 'setting/status',
    data: params,
  })
}

export function editAssetStatus(params: any, id: any) {
  return axios({
    method: 'put',
    url: 'setting/status/' + id,
    data: params,
  })
}

export function getAssetStatus(params: any) {
  return axios({
    method: 'get',
    url: 'setting/status/filter',
    params,
  })
}

export function deleteAssetStatus(id: string) {
  return axios({
    method: 'delete',
    url: 'setting/status/' + id,
  })
}

export function getDetailAssetStatus(id: string) {
  return axios({
    method: 'get',
    url: 'setting/status/' + id,
  })
}

export function deleteBulkAssetStatus(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'bulk-delete/asset-status',
  })
}

export function assetStatusExport(params: object) {
  return axios({
    method: 'post',
    params,
    url: 'setting/status/export',
  })
}

export function checkDeleteAssetStatus(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'setting/status/check-delete',
  })
}
