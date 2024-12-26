import axios from '@api/axios'
import {generateUrlAPI} from '@helpers'

export function exportMyAssets(params: any) {
  return axios({
    method: 'get',
    url: generateUrlAPI('warranty'),
    params,
  })
}

export function getColumnsMyAsset() {
  return axios({
    method: 'get',
    url: 'asset/setup-column?type=my-asset',
  })
}

export function saveColumnsMyAsset(data: any) {
  return axios({
    method: 'post',
    data,
    url: `asset/setup-column?type=my-asset`,
  })
}
