import axios from '@api/axios'

export function getNotification(params: any) {
  return axios({
    method: 'get',
    params,
    url: 'notification',
  })
}

export function getUser(id: string) {
  return axios({
    method: 'get',
    url: 'user/' + id,
  })
}

export function postReadNotification(params: any) {
  return axios({
    method: 'post',
    url: 'notification/bulk-read',
    data: params,
  })
}

export function deleteNotification(guid: string) {
  return axios({
    method: 'delete',
    url: 'notification/' + guid,
  })
}

export function deleteBulkNotification(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'notification/bulk-delete',
  })
}
