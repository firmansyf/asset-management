import axios from '@api/axios'

export function editProfile(params: any) {
  return axios({
    method: 'put',
    data: params,
    url: 'a/me/avatar',
  })
}

export function getPhoneCode() {
  return axios({
    method: 'get',
    url: 'setting/preference/phone-code',
  })
}

export function deleteAccount() {
  return axios({
    method: 'post',
    url: 'a/delete-account',
  })
}

export function getUserSession(params: object) {
  return axios({
    method: 'get',
    url: 'a/me/session',
    params,
  })
}
