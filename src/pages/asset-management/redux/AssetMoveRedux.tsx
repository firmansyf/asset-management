import axios from '@api/axios'

export function saveMoveAsset(params: object) {
  return axios({
    method: 'post',
    url: 'move-asset',
    data: params,
  })
}

export function getMoveAsset(params: any) {
  return axios({
    method: 'get',
    url: `move-asset`,
    params,
  })
}

export function getMoveAssetDetail(guid: any) {
  return axios({
    method: 'get',
    url: `move-asset/${guid}`,
  })
}
