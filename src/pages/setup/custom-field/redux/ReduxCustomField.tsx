import axios from '@api/axios'

export function addCustomField(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'custom-field',
  })
}

export function editCustomField(params: any, id: any) {
  return axios({
    method: 'put',
    url: 'custom-field/' + id,
    data: params,
  })
}

export function addCustomFieldAsset(params: any) {
  return axios({
    method: 'post',
    url: 'setting/status',
    data: params,
  })
}

export function editCustomFieldAsset(params: any, id: any) {
  return axios({
    method: 'put',
    url: 'setting/type/sub/' + id,
    data: params,
  })
}

export function getCustomField(params: any) {
  return axios({
    method: 'get',
    url: 'custom-field/filter',
    params,
  })
}

export function deleteCustomFieldAsset(id: any) {
  return axios({
    method: 'delete',
    url: 'custom-field/' + id,
  })
}

export function deleteCustomFieldLocation(id: any) {
  return axios({
    method: 'delete',
    url: 'setting/status/' + id,
  })
}

export function exportCustomFieldAsset(params: any) {
  return axios({
    method: 'get',
    url: 'setting/status',
    params,
  })
}

// eslint-disable-next-line sonarjs/no-identical-functions
export function exportCustomFieldLocation(params: any) {
  return axios({
    method: 'get',
    url: 'setting/status',
    params,
  })
}

export function deleteBulkCustomField(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'bulk-delete/custom-field',
  })
}

export function checkDeleteCustomField(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'bulk-delete/custom-field/check-delete',
  })
}

export function getCustomFieldTypeList(params: any) {
  return axios({
    method: 'get',
    url: 'custom-field/list-type',
    params,
  })
}
