import axios from '@api/axios'

export function addBrand(params: any) {
  return axios({
    method: 'post',
    url: 'setting/manufacturer/brand',
    data: params,
  })
}

export function editBrand(params: any, id: any) {
  return axios({
    method: 'put',
    url: 'setting/manufacturer/brand/' + id,
    data: params,
  })
}

export function getBrand(params: object) {
  return axios({
    method: 'get',
    url: 'setting/manufacturer/brand/filter',
    params,
  })
}

export function deleteBrand(id: string) {
  return axios({
    method: 'delete',
    url: 'setting/manufacturer/brand/' + id,
  })
}

export function deleteBulkBrand(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'bulk-delete/manufacturer-brand',
  })
}

export function getDetailBrand(id: string) {
  return axios({
    method: 'get',
    url: 'setting/manufacturer/brand/' + id,
  })
}

export function exportBrand(params: object) {
  return axios({
    method: 'post',
    params,
    url: 'setting/manufacturer/brand/export',
  })
}

export function getBrandOptionsColumns(params: any) {
  return axios({
    method: 'get',
    url: 'setting/manufacturer/brand/option',
    params,
  })
}
