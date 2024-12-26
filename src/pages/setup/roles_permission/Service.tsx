import axios from '@api/axios'
import {generateUrlAPI} from '@helpers'

export function getRole(params: object) {
  return axios({
    method: 'get',
    params,
    url: generateUrlAPI('setting/role'),
  })
}

export function addRole(params: object) {
  return axios({
    method: 'post',
    params,
    url: generateUrlAPI('setting/role'),
  })
}

export function getPermissionByName(name: any) {
  return axios({
    method: 'get',
    url: generateUrlAPI('setting/role/permission-by-name?role_name=' + name),
  })
}

export function getPermissionByID(id: any) {
  return axios({
    method: 'get',
    url: generateUrlAPI('setting/role/permission-by-id?role_id=' + id),
  })
}

export function updatePermission(id: any) {
  return axios({
    method: 'get',
    url: generateUrlAPI('setting/role/update-permission/' + id),
  })
}
