import axios from '@api/axios'

export function addCompany(params: any) {
  return axios({
    method: 'post',
    url: 'setting/company',
    data: params,
  })
}

export function editCompany(params: any, id: any) {
  return axios({
    method: 'put',
    url: 'setting/company/' + id,
    data: params,
  })
}

export function getCompany(params: object) {
  return axios({
    method: 'get',
    url: 'setting/company',
    params,
  })
}

export function checkDeleteStatus(id: string) {
  return axios({
    method: 'get',
    url: `setting/company/${id}/check-delete`,
  })
}

export function deleteCompany(params: any, id: string) {
  return axios({
    method: 'delete',
    url: `setting/company/${id}?confirmDelete=true`,
    data: params,
  })
}

export function deleteCompanyReassign(params: any, id: string, reassignTo: string) {
  return axios({
    method: 'delete',
    url: `setting/company/${id}?reassignTo=${reassignTo}`,
    data: params,
  })
}

export function getDetailCompany(id: string) {
  return axios({
    method: 'get',
    url: 'setting/company/' + id,
  })
}

export function checkDeleteBulkStatus(params: any) {
  return axios({
    method: 'post',
    url: `setting/company/check-delete-bulk`,
    data: params,
  })
}

export function deleteBulkCompany(params: any) {
  return axios({
    method: 'post',
    url: 'bulk-delete/company',
    data: params,
  })
}

// eslint-disable-next-line sonarjs/no-identical-functions
export function deleteBulkCompanyReassign(params: any) {
  return axios({
    method: 'post',
    url: 'bulk-delete/company',
    data: params,
  })
}

export function exportCompany(params: object) {
  return axios({
    method: 'post',
    url: 'setting/company/export',
    params,
  })
}

export function getCompanyOptionsColumns(params: any) {
  return axios({
    method: 'get',
    url: 'setting/company/option',
    params,
  })
}
