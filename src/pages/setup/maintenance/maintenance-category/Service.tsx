import axios from '@api/axios'

export function getMaintenanceCategory(params: object) {
  return axios({
    method: 'get',
    url: 'maintenance-category',
    params,
  })
}

export function getDetailMaintenanceCategory(guid: string) {
  return axios({
    method: 'get',
    url: `maintenance-category/${guid}`,
  })
}

export function addMaintenanceCategory(params: any) {
  return axios({
    method: 'post',
    url: 'maintenance-category',
    data: params,
  })
}

export function editMaintenanceCategory(params: any, guid: any) {
  return axios({
    method: 'put',
    url: `maintenance-category/${guid}`,
    data: params,
  })
}

export function exportMaintenanceCategory(params: any) {
  return axios({
    method: 'post',
    url: 'maintenance-category/export',
    params,
  })
}

export function deleteMaintenanceCategory(guid: string) {
  return axios({
    method: 'delete',
    url: `maintenance-category/${guid}`,
  })
}

export function deleteBulkMaintenanceCategory(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'bulk-delete/maintenance-category',
  })
}
