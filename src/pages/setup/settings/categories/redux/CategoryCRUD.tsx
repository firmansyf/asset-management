import axios from '@api/axios'

export function getCategory(params: any) {
  return axios({
    method: 'get',
    params,
    url: 'setting/category/filter',
  })
}

export function addCategory(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'setting/category',
  })
}

export function editCategory(params: any, id: any) {
  return axios({
    method: 'put',
    params,
    url: 'setting/category/' + id,
  })
}

export function exportCategory(params: object) {
  return axios({
    method: 'post',
    params,
    url: 'setting/category/export',
  })
}

export function deleteCategory(params: any, id: string) {
  return axios({
    method: 'delete',
    data: params,
    url: `setting/category/${id}?confirmDelete=true`,
  })
}

export function checkCategoryDeleteStatus(id: string) {
  return axios({
    method: 'get',
    url: `setting/category/${id}/check-delete`,
  })
}

export function deleteCategoryReassign(params: any, id: string, reassignTo: string) {
  return axios({
    method: 'delete',
    data: params,
    url: `setting/category/${id}?reassignTo=${reassignTo}`,
  })
}

export function checkCategoryDeleteBulkStatus(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: `setting/category/check-delete-bulk`,
  })
}

export function deleteBulkCategoryReassign(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'setting/category/bulk-delete',
  })
}
