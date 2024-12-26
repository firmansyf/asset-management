import axios from '@api/axios'

export function mergeManufacture(data: any) {
  return axios({
    method: 'post',
    data,
    url: `merge/manufacturer`,
  })
}

export function mergeModel(data: any) {
  return axios({
    method: 'post',
    data,
    url: `merge/model`,
  })
}

export function mergeBrand(data: any) {
  return axios({
    method: 'post',
    data,
    url: `merge/brand`,
  })
}
