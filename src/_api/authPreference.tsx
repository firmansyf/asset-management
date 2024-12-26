import axios from '@api/axios'

export function getPreference(token: any) {
  return axios({
    method: 'get',
    url: 'setting/preference',
    headers: {Authorization: 'Bearer ' + token},
  })
}

export function getCurrency(token: any) {
  return axios({
    method: 'get',
    url: 'setting/preference/currency',
    headers: {Authorization: 'Bearer ' + token},
  })
}

export function getTimezone(token: any) {
  return axios({
    method: 'get',
    url: 'setting/preference/timezone',
    headers: {Authorization: 'Bearer ' + token},
  })
}

export function getDateFormat(token: any) {
  return axios({
    method: 'get',
    url: 'setting/preference/dateformat',
    headers: {Authorization: 'Bearer ' + token},
  })
}

export function getTimeFormat(token: any) {
  return axios({
    method: 'get',
    url: 'setting/preference/timeformat',
    headers: {Authorization: 'Bearer ' + token},
  })
}

export function getCountry(token: any) {
  return axios({
    method: 'get',
    url: 'geo/country',
    headers: {Authorization: 'Bearer ' + token},
  })
}

export function getFeature(token: object) {
  return axios({
    method: 'get',
    url: 'setting/feature',
    headers: {Authorization: 'Bearer ' + token},
  })
}

export function getPhoneCode(token: any) {
  return axios({
    method: 'get',
    url: 'setting/preference/phone-code',
    headers: {Authorization: 'Bearer ' + token},
  })
}
