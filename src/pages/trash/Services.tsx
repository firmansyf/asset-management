import axios from '@api/axios'

export function restoreTrash(data: any) {
  return axios({
    method: 'PUT',
    data,
    url: 'all-trash/restore',
  })
}

export function getTrashModule() {
  return axios({
    method: 'GET',
    url: 'all-trash/list-module',
  })
}

export function getTrash(params?: object) {
  return axios({
    method: 'get',
    url: 'all-trash',
    params,
  })
}

export function deleteBulkTrash(data: any) {
  return axios({
    method: 'DELETE',
    data,
    url: 'all-trash/force-delete',
  })
}

export function emptyTrash() {
  return axios({
    method: 'DELETE',
    url: 'all-trash/empty',
  })
}
