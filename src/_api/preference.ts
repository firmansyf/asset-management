import axios from '@api/axios'

export function getPreference() {
  return axios({
    method: 'get',
    url: 'setting/preference',
  })
}

export function editPreference(params: any) {
  return axios({
    method: 'put',
    url: 'setting/preference',
    data: params,
  })
}

export function getCurrency() {
  return axios({
    method: 'get',
    url: 'setting/preference/currency',
  })
}

export function getPhoneCode() {
  return axios({
    method: 'get',
    url: 'setting/preference/phone-code',
  })
}

export function getCountry() {
  return axios({
    method: 'get',
    url: 'geo/country',
  })
}
