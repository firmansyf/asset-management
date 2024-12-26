import axios from '@api/axios'

export function getWorkingHour(params: any) {
  return axios({
    method: 'get',
    url: 'help-desk/working_hour',
    params,
  })
}

export function addWorkingHour(data: any) {
  return axios({
    method: 'POST',
    url: 'help-desk/working_hour',
    data,
  })
}

export function editWorkingHour(data: any, guid: any) {
  return axios({
    method: 'PUT',
    url: `help-desk/working_hour/${guid}`,
    data,
  })
}

export function detailWorkingHour(guid: any) {
  return axios(`help-desk/working_hour/${guid}`)
}

export function deleteWorkingHour(guid: any) {
  return axios({
    method: 'DELETE',
    url: `help-desk/working_hour/${guid}`,
  })
}

export function deleteBulkWorkingHour(data: any) {
  return axios({
    method: 'post',
    url: 'bulk-delete/working_hour',
    data,
  })
}

export function exportWorkingHour(data: any) {
  return axios({
    method: 'POST',
    url: 'help-desk/working_hour/export',
    data,
  })
}

export function getWorkingHourOptionsColumns(params: any) {
  return axios({
    method: 'get',
    url: 'help-desk/working_hour/option',
    params,
  })
}
