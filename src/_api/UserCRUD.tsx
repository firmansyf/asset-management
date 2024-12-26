import axios from '@api/axios'
import axiosV2 from '@api/axiosV2'

export function getSetupColumnUser() {
  return axios({
    method: 'get',
    url: `user/setup-column`,
  })
}

export function saveSetupColumnUser(data: any) {
  return axios({
    method: 'post',
    url: `user/setup-column`,
    data,
  })
}

export function getColumnUser(params: any) {
  return axios({
    method: 'get',
    params,
    url: 'user/setup-column',
  })
}

export function addUser(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'user',
  })
}

export function editUser(params: any, id: string) {
  return axios({
    method: 'put',
    data: params,
    url: 'user/' + id,
  })
}

export function getUser(params: any) {
  return axiosV2({
    method: 'get',
    params,
    url: 'user/filter',
  })
}

export function getUserV1(params: any) {
  return axios({
    method: 'get',
    params,
    url: 'user/filter',
  })
}

export function getUserWithFilter(params: object, filter_status: any, filter_role: any) {
  let filterStatus = ''
  let filterRole = ''
  if (filter_status) {
    filterStatus = 'filter%5Buser_status%5D=' + filter_status
  }

  if (filter_role !== '') {
    if (filter_status !== '') {
      filterRole = '&filter%5Brole_name%5D=' + filter_role
    } else {
      filterRole = 'filter%5Brole_name%5D=' + filter_role
    }
  }

  return axios({
    method: 'get',
    params,
    url: 'user/filter?' + filterStatus + filterRole,
  })
}

export function deleteUser(id: string, params: any) {
  return axios({
    method: 'delete',
    params,
    url: `user/${id}`,
  })
}
export function deleteBulkUsers(params: any) {
  return axios({
    method: 'post',
    params,
    url: 'bulk-delete/user',
  })
}

export function bulkSuspendUser(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: `user/bulk-suspend`,
  })
}

export function suspendUser(guid: any) {
  return axios({
    method: 'put',
    url: `user/${guid}/suspend`,
  })
}

export function exportUser(params: object) {
  return axios({
    method: 'post',
    params,
    url: 'user/export',
  })
}

export function exportUserWithFilter(params: object, filter_status: any, filter_role: any) {
  let filterStatus = ''
  let filterRole = ''
  if (filter_status) {
    filterStatus = 'filter%5Buser_status%5D=' + filter_status
  }

  if (filter_role !== '') {
    if (filter_status !== '') {
      filterRole = '&filter%5Brole_name%5D=' + filter_role
    } else {
      filterRole = 'filter%5Brole_name%5D=' + filter_role
    }
  }
  return axios({
    method: 'post',
    params,
    url: 'user/export?' + filterStatus + filterRole,
  })
}

// export function getDetailUSER(id: string) {
//   return axios(GET_DETAIL_USER_URL+id);
// }

export function resendActivation(tenant: any, params: any) {
  return axios({
    method: 'post',
    data: params,
    url: `tenant/${tenant}/resend-activation`,
  })
}

export function resendVerificationEmail(guid: any) {
  return axios({
    method: 'post',
    url: `user/${guid}/verify`,
  })
}

export function activateEmail(guid: any) {
  return axios({
    method: 'put',
    url: `user/${guid}/activate`,
  })
}

// Delete Confirm
export function deleteConfirm(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'a/delete-confirm',
  })
}

export function getUserEmployee(params: any) {
  return axios({
    method: 'get',
    url: 'list-user-employee',
    params,
  })
}

export function getUserDetail(guid: any) {
  return axios({
    method: 'get',
    url: `user/${guid}`,
  })
}

export function cekTokenExpired(token: any) {
  return axios({
    method: 'get',
    url: `a/delete-account/${token}`,
  })
}

export function postBulkSelectUser(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: `user/bulk-store-temporary`,
  })
}

export function getTemporaryUserUserList(params: any) {
  return axios({
    method: 'get',
    url: `list-user-temporary`,
    params,
  })
}

export function deleteBulkTemporaryUsers(params: any) {
  return axios({
    method: 'post',
    params,
    url: 'user/bulk-destroy-temporary',
  })
}

export function deleteAllTemporaryUsers(params: any) {
  return axios({
    method: 'delete',
    url: 'list-user-temporary',
    params,
  })
}

export function getOptionsColumns(params: any) {
  return axios({
    method: 'get',
    url: 'user/option',
    params,
  })
}
