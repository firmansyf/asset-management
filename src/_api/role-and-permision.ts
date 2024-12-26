import axios from '@api/axios'

export function addRole(params: any) {
  return axios({
    method: 'post',
    url: 'setting/role',
    data: params,
  })
}

export function editRole(params: any, id: any) {
  return axios({
    method: 'put',
    url: 'setting/role/' + id,
    data: params,
  })
}

export function getRole(params: object) {
  return axios({
    method: 'get',
    params,
    url: 'setting/role',
  })
}

export function deleteRole(id: any) {
  return axios({
    method: 'delete',
    url: 'setting/role/' + id,
  })
}

export function deleteBulkRole(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'bulk-delete/role',
  })
}

export function getDetailRole(id: string) {
  return axios({
    method: 'get',
    url: 'setting/role/' + id,
  })
}

export function exportRole(params: object) {
  return axios({
    method: 'post',
    params,
    url: 'setting/role/export',
  })
}

export function getPermissionRole(id: string) {
  return axios({
    method: 'get',
    url: 'setting/role/permission-by-id?role_id=' + id,
  })
}

export function updatePermission(params: any, id: any) {
  return axios({
    method: 'post',
    url: 'setting/role/update-permission/' + id,
    data: params,
  })
}

export function getPermissionRoleByName(name: any) {
  return axios({
    method: 'get',
    url: 'setting/role/permission-by-name?role_name=' + name,
  })
}
