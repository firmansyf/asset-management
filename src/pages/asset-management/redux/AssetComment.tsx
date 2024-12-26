import axios from '@api/axios'

export function getAssetComment(asset_guid: any) {
  return axios({
    method: 'get',
    url: 'asset/' + asset_guid + '/comment_box',
  })
}
export function postAssetComment(params: any, asset_guid: any) {
  return axios({
    method: 'post',
    url: 'asset/' + asset_guid + '/comment_box',
    data: params,
  })
}
