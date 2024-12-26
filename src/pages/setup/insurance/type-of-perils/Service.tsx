import axios from '@api/axios'

export function addPeril(params: any) {
  return axios({
    method: 'post',
    url: 'insurance_claim/peril',
    data: params,
  })
}

export function editPeril(params: any, id: any) {
  return axios({
    method: 'put',
    url: 'insurance_claim/peril/' + id,
    data: params,
  })
}

export function getPeril(params: object) {
  return axios({
    method: 'get',
    url: 'insurance_claim/peril',
    params,
  })
}

export function deletePeril(id: string) {
  return axios({
    method: 'delete',
    url: 'insurance_claim/peril/' + id,
  })
}

export function getDetailPeril(id: string) {
  return axios({
    method: 'get',
    url: 'insurance_claim/peril/' + id,
  })
}

export function exportPeril(params: any) {
  return axios({
    method: 'post',
    url: 'insurance_claim/peril/export',
    params,
  })
}

export function deleteBulkPeril(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'insurance_claim/peril',
  })
}
