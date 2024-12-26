import axios from '@api/axios'

export function getListSlaPolicy(params: any) {
  return axios({
    method: 'get',
    params,
    url: 'help-desk/sla-policy',
  })
}

export function getDetailSLA(guid: any) {
  return axios({
    method: 'get',
    url: `help-desk/sla-policy/${guid}`,
  })
}

export function addSLA(params: any) {
  return axios({
    method: 'post',
    url: `help-desk/sla-policy`,
    data: params,
  })
}

export function editSLA(params: any, guid: any) {
  return axios({
    method: 'put',
    url: `help-desk/sla-policy/${guid}`,
    data: params,
  })
}

export function getWorkingHour(params: any) {
  return axios({
    method: 'get',
    url: 'help-desk/working_hour',
    params,
  })
}

export function deleteSlaPolicy(guid: any) {
  return axios({
    method: 'delete',
    url: `help-desk/sla-policy/${guid}`,
  })
}

export function bulkDeleteSlaPolicy(params: any) {
  return axios({
    method: 'post',
    url: 'bulk-delete/sla-policy',
    data: params,
  })
}

export function exportData(params: any) {
  return axios({
    method: 'post',
    url: 'help-desk/sla-policy/export',
    data: params,
  })
}
