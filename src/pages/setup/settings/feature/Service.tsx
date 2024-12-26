import axios from '@api/axios'
export function getFeature(params: object) {
  return axios({
    method: 'get',
    url: 'setting/feature',
    params,
  })
}
export function updateFeature(unique_name: string, params: any) {
  return axios({
    method: 'PUT',
    url: `setting/feature/${unique_name}`,
    data: params,
  })
}

export function getFeatureAsset(params: object) {
  return axios({
    method: 'GET',
    url: 'setting/feature/my-asset',
    params,
  })
}
export function putFeatureAsset(params: object) {
  return axios({
    method: 'PUT',
    url: 'setting/feature/my-asset',
    data: params,
  })
}
