import axios from '@api/axios'

export function getCustomer(params: any) {
  return axios({
    method: 'get',
    params,
    url: 'setting/customer',
  })
}

export function getDetailCustomer(id: string) {
  return axios({
    method: 'get',
    url: 'setting/customer/' + id,
  })
}

export function addCustomer(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'setting/customer',
  })
}

export function editCustomer(params: any, id: any) {
  return axios({
    method: 'put',
    params,
    url: 'setting/customer/' + id,
  })
}

export function deleteCustomer(id: any) {
  return axios({
    method: 'delete',
    url: 'setting/customer/' + id,
  })
}

export function exportCustomer(params: object) {
  return axios({
    method: 'post',
    params,
    url: 'setting/customer/export',
  })
}

export function deleteBulkCustomer(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'bulk-delete/customer',
  })
}
