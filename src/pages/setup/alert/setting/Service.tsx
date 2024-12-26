import axios from '@api/axios'

export function checkAlertSettingDuplicate(params: any) {
  return axios({
    method: 'post',
    url: `setting/alert/check-duplicate-module`,
    data: params,
  })
}

export function addAlertSetting(params: any) {
  return axios({
    method: 'post',
    url: `setting/alert`,
    data: params,
  })
}

export function editAlertSetting(params: any, id: any) {
  return axios({
    method: 'put',
    url: `setting/alert/${id}`,
    data: params,
  })
}

export function getAlertSetting(params: object) {
  return axios({
    method: 'get',
    url: `setting/alert`,
    params,
  })
}

export function deleteAlertSetting(id: string) {
  return axios({
    method: 'delete',
    url: `setting/alert/${id}`,
  })
}

export function getDetailAlertSetting(id: string) {
  return axios({
    method: 'get',
    url: `setting/alert/${id}`,
  })
}

export function exportAlertSetting(params: any) {
  return axios({
    method: 'post',
    url: `setting/alert/export`,
    params,
  })
}

export function deleteBulkAlertSetting(params: any) {
  return axios({
    method: 'post',
    url: `bulk-delete/alert`,
    data: params,
  })
}

export function getModuleAlertSetting(params: object) {
  return axios({
    method: 'get',
    url: `setting/module`,
    params,
  })
}

export function getTypeAlertSetting(params: object) {
  return axios({
    method: 'get',
    url: `setting/alert/type`,
    params,
  })
}

export function getTeamAlertSetting(params: object) {
  return axios({
    method: 'get',
    url: 'setting/team',
    params,
  })
}

export async function getAlertSettingColumn() {
  return axios({
    method: 'get',
    url: `setting/alert/setup-column`,
  })
}

export function updateAlertSettingColumn(data: any) {
  return axios({
    method: 'post',
    url: `setting/alert/setup-column`,
    data,
  })
}
