import axios from '@api/axios'
import axiosV2 from '@api/axiosV2'

export function exportEmployee(params: object) {
  return axios({
    method: 'post',
    params,
    url: 'employee/export',
  })
}

export function getEmployee(params: object) {
  return axiosV2({
    method: 'get',
    params,
    url: 'employee',
  })
}

export function deleteEmployee(id: string) {
  return axios({
    method: 'delete',
    url: 'employee/' + id,
  })
}

export function deleteBulkEmployee(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'bulk-delete/employee',
  })
}

export function getEmployeeDetail(guid: any) {
  return axios({
    method: 'get',
    url: 'employee/' + guid,
  })
}

export function getSetupColumnsEmployee() {
  return axios({
    method: 'get',
    url: `employee/setup-column`,
  })
}

export function updateSetupColumnsEmployee(data: any) {
  return axios({
    method: 'post',
    data,
    url: `employee/setup-column`,
  })
}

export function getColumnEmployee(params: any) {
  return axios({
    method: 'get',
    params,
    url: `employee/setup-column`,
  })
}

export function addEmployee(params: any) {
  return axios({
    method: 'post',
    url: 'employee',
    data: params,
  })
}

export function editEmployee(params: any, guid: any) {
  return axios({
    method: 'put',
    url: 'employee/' + guid,
    data: params,
  })
}

export function getEmployeeV1(params: object) {
  return axios({
    method: 'get',
    params,
    url: 'employee',
  })
}

export function getOptionsColumns(params: any) {
  return axios({
    method: 'get',
    url: 'employee/option',
    params,
  })
}
