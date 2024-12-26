import axios from '@api/axios'

export function addSupplier(params: any) {
  return axios({
    method: 'post',
    url: 'setting/supplier',
    data: params,
  })
}

export function editSupplier(params: any, id: any) {
  return axios({
    method: 'put',
    url: 'setting/supplier/' + id,
    data: params,
  })
}

export function getSupplier(params: object) {
  return axios({
    method: 'get',
    url: 'setting/supplier/filter',
    params,
  })
}

export function deleteSupplier(id: string) {
  return axios({
    method: 'delete',
    url: 'setting/supplier/' + id,
  })
}

export function getDetailSupplier(id: string) {
  return axios({
    method: 'get',
    url: 'setting/supplier/' + id,
  })
}

export function deleteBulkSupplier(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'bulk-delete/supplier',
  })
}

export function exportSupplier(params: any) {
  return axios({
    method: 'post',
    params,
    url: 'setting/supplier/export',
  })
}

export function getPhoneCode() {
  return axios({
    method: 'get',
    url: 'setting/preference/phone-code',
  })
}

export function getSupplierColumn() {
  return axios({
    method: 'get',
    url: `setting/supplier/setup-column`,
  })
}

export function updateSupplierColumn(data: any) {
  return axios({
    method: 'post',
    data,
    url: `setting/supplier/setup-column`,
  })
}
