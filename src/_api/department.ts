import axios from '@api/axios'

export function addDepartment(params: any) {
  return axios({
    method: 'post',
    url: 'setting/department',
    data: params,
  })
}

export function editDepartment(params: any, id: any) {
  return axios({
    method: 'put',
    url: 'setting/department/' + id,
    data: params,
  })
}

export function getDepartment(params: object) {
  return axios({
    method: 'get',
    params,
    url: 'setting/department/filter',
  })
}

export function deleteDepartment(id: any) {
  return axios({
    method: 'delete',
    url: 'setting/department/' + id,
  })
}

export function deleteBulkDepartment(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'bulk-delete/department',
  })
}

export function getDetailDepartment(id: string) {
  return axios({
    method: 'get',
    url: 'setting/department/' + id,
  })
}

export function exportDepartment(params: object) {
  return axios({
    method: 'post',
    params,
    url: 'setting/department/export',
  })
}

export function getDepartmentOptionsColumns(params: any) {
  return axios({
    method: 'get',
    url: 'setting/department/option',
    params,
  })
}
