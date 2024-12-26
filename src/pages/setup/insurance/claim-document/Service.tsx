import axios from '@api/axios'

export function addDocument(params: any) {
  return axios({
    method: 'post',
    url: 'insurance_claim/document',
    data: params,
  })
}

export function editDocument(params: any, id: any) {
  return axios({
    method: 'put',
    url: 'insurance_claim/document/' + id,
    data: params,
  })
}

export function getDocument(params: object) {
  return axios({
    method: 'get',
    url: 'insurance_claim/document',
    params,
  })
}

export function deleteDocument(id: string) {
  return axios({
    method: 'delete',
    url: 'insurance_claim/document/' + id,
  })
}

export function getDetailDocument(id: string) {
  return axios({
    method: 'get',
    url: 'insurance_claim/document/' + id,
  })
}

export function exportManufacturer(params: any) {
  return axios({
    method: 'post',
    url: 'insurance_claim/document/export',
    params,
  })
}

export function deleteBulkManufacturer(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'bulk-delete/insurance_claim/document',
  })
}
