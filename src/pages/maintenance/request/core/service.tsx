import axios from '@api/axios'

export function getRequest(params: any) {
  return axios({
    method: 'get',
    url: 'maintenance/request',
    params,
  })
}

export function deleteRequest(guid: any) {
  return axios({
    method: 'delete',
    url: `maintenance/request/${guid}`,
  })
}

export function AddRequest(params: any) {
  return axios({
    method: 'post',
    url: 'maintenance/request',
    data: params,
  })
}

export function getDetailRequest(guid: any) {
  return axios({
    method: 'get',
    url: `maintenance/request/${guid}`,
  })
}

export function EditRequest(id: any, params: any) {
  return axios({
    method: 'put',
    url: `maintenance/request/${id}`,
    data: params,
  })
}

export function getWorker() {
  return axios({
    method: 'get',
    url: '/setting/worker',
  })
}

export function getMaintenanceCategory() {
  return axios({
    method: 'get',
    url: 'maintenance-category/filter',
  })
}

export function getPriorityMaintenance() {
  return axios({
    method: 'get',
    url: 'maintenance-priority/filter',
  })
}

export function updateStatusBulk(params: any) {
  return axios({
    method: 'post',
    url: 'maintenance/request/update-status-bulk',
    params,
  })
}

export function updateStatusSingle(params: any, guid: any) {
  return axios({
    method: 'put',
    url: `maintenance/request/${guid}/update-status`,
    data: params,
  })
}

export function getSetupColumnRequest(params: any) {
  return axios({
    method: 'get',
    url: 'maintenance/request/setup-column',
    params,
  })
}

// eslint-disable-next-line sonarjs/no-identical-functions
export function getSetupColumn(params: any) {
  return axios({
    method: 'get',
    url: 'maintenance/request/setup-column',
    params,
  })
}

export function saveSetupColumnRequest(params: any) {
  return axios({
    method: 'post',
    url: 'maintenance/request/setup-column',
    data: params,
  })
}

export function saveFormSettings(params: any) {
  return axios({
    method: 'post',
    url: 'maintenance/request/form-setting',
    data: params,
  })
}

export function getFormSettings() {
  return axios({
    method: 'get',
    url: 'maintenance/request/form-setting',
  })
}

export function getOptionsColumns(params: any) {
  return axios({
    method: 'get',
    url: 'maintenance/request/option',
    params,
  })
}
