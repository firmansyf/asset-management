import axios from '@api/axios'

export function addWarranty(params: any) {
  return axios({
    method: 'post',
    url: 'warranty',
    data: params,
  })
}

export function editWarranty(data: any, id: any) {
  return axios({
    method: 'put',
    url: 'warranty/' + id,
    data,
  })
}

export function getWarranty(params: any) {
  return axios({
    method: 'get',
    url: 'warranty',
    params,
  })
}

export function exportWarranty(params: any) {
  return axios({
    method: 'post',
    url: 'warranty/export',
    params,
  })
}

export function deleteWarranty(id: any) {
  return axios({
    method: 'delete',
    url: 'warranty/' + id,
  })
}

export function getDetailWarranty(id: string) {
  return axios({
    method: 'get',
    url: 'warranty/' + id,
  })
}

export function deleteBulkWarranty(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'bulk-delete/warranty',
  })
}

export function getDefaultColumn(params: any) {
  return axios({
    method: 'get',
    params,
    url: 'warranty/get-column',
  })
}

export function getSetupColumn(params: any) {
  return axios({
    method: 'get',
    params,
    url: 'warranty/setup-column',
  })
}

export function updateSetupColumn(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'warranty/setup-column',
  })
}

export function getOptionsColumns(params: any) {
  return axios({
    method: 'get',
    url: 'warranty/option',
    params,
  })
}
