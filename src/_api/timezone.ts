import axios from '@api/axios'

export function getTimezone() {
  return axios({
    method: 'get',
    url: 'setting/preference/timezone',
  })
}

export function getDateFormat() {
  return axios({
    method: 'get',
    url: 'setting/preference/dateformat',
  })
}

export function getTimeFormat() {
  return axios({
    method: 'get',
    url: 'setting/preference/timeformat',
  })
}
