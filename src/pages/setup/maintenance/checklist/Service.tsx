import axios from '@api/axios'

export function getMaintenanceChecklist(params: object) {
  return axios({
    method: 'get',
    url: 'checklist',
    params,
  })
}

export function getDetailMaintenanceChecklist(guid: string) {
  return axios({
    method: 'get',
    url: `checklist/${guid}`,
  })
}

export function addMaintenanceChecklist(params: any) {
  return axios({
    method: 'post',
    url: 'checklist',
    data: params,
  })
}

export function editMaintenanceChecklist(params: any, guid: any) {
  return axios({
    method: 'put',
    url: `checklist/${guid}`,
    data: params,
  })
}

export function exportMaintenanceChecklist(params: any) {
  return axios({
    method: 'post',
    url: 'checklist/export',
    params,
  })
}

export function deleteMaintenanceChecklist(guid: string) {
  return axios({
    method: 'delete',
    url: `checklist/${guid}`,
  })
}

export function deleteBulkMaintenanceChecklist(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'bulk-delete/checklist',
  })
}

export function getMaintenanceType() {
  return axios({
    method: 'get',
    url: 'maintenance-task/type',
  })
}

export function getMaintenanceChecklistType() {
  return axios({
    method: 'get',
    url: 'checklist/list-field',
  })
}

export function getOptionsColumns(params: any) {
  return axios({
    method: 'get',
    url: 'checklist/option',
    params,
  })
}
