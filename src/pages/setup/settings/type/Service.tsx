import axios from '@api/axios'

export function addType(params: any) {
  return axios({
    method: 'post',
    url: 'setting/type',
    data: params,
  })
}

export function editType(params: any, id: any) {
  return axios({
    method: 'put',
    url: 'setting/type/' + id,
    data: params,
  })
}

export function getType(params: object) {
  return axios({
    method: 'get',
    url: 'setting/type/filter',
    params,
  })
}

export function deleteType(id: string) {
  return axios({
    method: 'delete',
    url: 'setting/type/' + id,
  })
}

export function getDetailType(id: string) {
  return axios({
    method: 'get',
    url: 'setting/type/' + id,
  })
}

export function deleteBulkType(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'bulk-delete/type',
  })
}

export function exportType(params: object) {
  return axios({
    method: 'post',
    params,
    url: 'setting/type/export',
  })
}

export function getTypeOptionsColumns(params: any) {
  return axios({
    method: 'get',
    url: 'setting/type/option',
    params,
  })
}
