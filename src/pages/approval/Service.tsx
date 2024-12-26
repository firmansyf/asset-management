import axios from '@api/axios'

export function getApproveInsuranceClaim(params: any) {
  return axios({
    method: 'get',
    url: 'insurance_claim/approval',
    params,
  })
}

export function getApproveMaintenance(params: any) {
  return axios({
    method: 'get',
    url: 'maintenance/approval',
    params,
  })
}

export function getApproveHistory(params: any) {
  return axios({
    method: 'get',
    url: 'approval/history',
    params,
  })
}
