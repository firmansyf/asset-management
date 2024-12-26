import axios from '@api/axios'

export function getCustomReport(params: any) {
  return axios({
    method: 'get',
    url: 'custom-report',
    params,
  })
}
export function detailCustomReport(guid: string) {
  return axios({
    method: 'get',
    url: 'custom-report/' + guid,
  })
}
export function saveCustomReport(data: any) {
  return axios({
    method: 'post',
    url: 'custom-report',
    data,
  })
}
export function updateCustomReport(guid: any, data: any) {
  return axios({
    method: 'put',
    url: 'custom-report/' + guid,
    data,
  })
}
export function deleteCustomReport(guid: string) {
  return axios({
    method: 'delete',
    url: 'custom-report/' + guid,
  })
}
export function getAutomatedReport(params: any) {
  return axios({
    method: 'get',
    url: 'automation-report',
    params,
  })
}
export function getAutomatedSetting() {
  return axios({
    method: 'get',
    url: 'automation-report/get-setting',
  })
}
export function createAutomatedReport(data: any) {
  return axios({
    method: 'post',
    url: 'automation-report',
    data,
  })
}
export function updateAutomatedReport(data: any, guid: any) {
  return axios({
    method: 'put',
    url: `automation-report/${guid}`,
    data,
  })
}
export function deleteAutomatedReport(guid: any) {
  return axios({
    method: 'delete',
    url: `automation-report/${guid}`,
  })
}
