import axios from '@api/axios'

export function addManufacturer(params: any) {
  return axios({
    method: 'post',
    url: 'setting/manufacturer',
    data: params,
  })
}

export function editManufacturer(params: any, id: any) {
  return axios({
    method: 'put',
    url: 'setting/manufacturer/' + id,
    data: params,
  })
}

export function getManufacturer(params: object) {
  return axios({
    method: 'get',
    url: 'setting/manufacturer/filter',
    params,
  })
}

export function deleteManufacturer(id: string) {
  return axios({
    method: 'delete',
    url: 'setting/manufacturer/' + id,
  })
}

export function getDetailManufacturer(id: string) {
  return axios({
    method: 'get',
    url: 'setting/manufacturer/' + id,
  })
}

export function exportManufacturer(params: any) {
  return axios({
    method: 'post',
    url: 'setting/manufacturer/export',
    params,
  })
}

export function deleteBulkManufacturer(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'bulk-delete/manufacturer',
  })
}
