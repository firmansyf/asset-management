import axios from '@api/axios'

export function getCustomForm() {
  return axios({
    method: 'get',
    url: `custom-form/asset`,
  })
}

export const getAssetDetail = (id: any) => axios(`asset/${id}`)

export const addEditAsset = (data: any, id?: any) => {
  return axios({
    method: id ? 'put' : 'post',
    url: id ? `asset/${id}` : 'asset',
    data,
  })
}
