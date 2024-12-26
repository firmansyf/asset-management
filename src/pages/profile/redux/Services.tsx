import axios from '@api/axios'

export function changePassword(params: any) {
  return axios({
    method: 'put',
    url: 'a/me/password',
    data: params,
  })
}
export function mailForgotPassword(params: any) {
  return axios({
    method: 'post',
    url: 'a/password',
    data: params,
  })
}
