import axios from '@api/axios'
export function getMenu(params?: object) {
  return axios({
    method: 'get',
    url: 'menu/user',
    params,
  })
}
export function getDefaultMenu(params?: object) {
  return axios({
    method: 'get',
    url: 'menu/default',
    params,
  })
}
export function updateMenu(data: any) {
  return axios({
    method: 'post',
    url: 'menu',
    data,
  })
}
