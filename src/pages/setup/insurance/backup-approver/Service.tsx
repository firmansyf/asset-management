import axios from '@api/axios'

export function addApprover(params: any) {
  return axios({
    method: 'post',
    url: 'insurance_claim/backup_approver',
    data: params,
  })
}

export function editApprover(params: any, id: any) {
  return axios({
    method: 'put',
    url: 'insurance_claim/backup_approver/' + id,
    data: params,
  })
}

export function getApprover(params: object) {
  return axios({
    method: 'get',
    url: 'insurance_claim/backup_approver',
    params,
  })
}

export function getUserApprover(params: object) {
  return axios({
    method: 'get',
    url: 'user/filter',
    params,
  })
}

export function deleteApprover(id: string) {
  return axios({
    method: 'delete',
    url: 'insurance_claim/backup_approver/' + id,
  })
}

export function getDetailApprover(id: string) {
  return axios({
    method: 'get',
    url: 'insurance_claim/backup_approver/' + id,
  })
}

export function exportApprover(params: any) {
  return axios({
    method: 'post',
    url: 'insurance_claim/backup_approver/export',
    params,
  })
}

export function deleteBulkManufacturer(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'bulk-delete/insurance_claim/backup_approver',
  })
}
