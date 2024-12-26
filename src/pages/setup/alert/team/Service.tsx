import axios from '@api/axios'

export function addAlertTeam(params: any) {
  return axios({
    method: 'post',
    url: 'setting/team',
    data: params,
  })
}

export function editAlertTeam(params: any, id: any) {
  return axios({
    method: 'put',
    url: 'setting/team/' + id,
    data: params,
  })
}

export function getAlertTeam(params: object) {
  return axios({
    method: 'get',
    url: 'setting/team',
    params,
  })
}

export function deleteAlertTeam(id: string) {
  return axios({
    method: 'delete',
    url: 'setting/team/' + id,
  })
}

export function getDetailAlertTeam(id: string) {
  return axios({
    method: 'get',
    url: 'setting/team/' + id,
  })
}

export function exportAlertTeam(params: any) {
  return axios({
    method: 'post',
    url: 'setting/team/export',
    params,
  })
}

export function deleteBulkAlertTeam(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'bulk-delete/team',
  })
}

// Add Working Hour
export function getWorkingHourTeams(params: any) {
  return axios({
    method: 'get',
    url: 'help-desk/working_hour',
    params,
  })
}
