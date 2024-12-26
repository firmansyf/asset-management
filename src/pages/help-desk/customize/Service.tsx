import axios from '@api/axios'

export function getCustomize(params: any) {
  return axios({
    method: 'get',
    url: 'notification/setup',
    params,
  })
}

export function postCustomize(params: any) {
  return axios({
    method: 'post',
    url: 'notification/setup',
    data: params,
  })
}

export function notificationCount() {
  return axios({
    method: 'get',
    url: 'notification/count',
  })
}
