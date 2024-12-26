import axios from '@api/axios'

export function getCannedResponse(params: any) {
  return axios({
    method: 'get',
    params,
    url: 'help-desk/canned-response',
  })
}

export function getDetailCannedResponse(guid: any) {
  return axios({
    method: 'get',
    url: `help-desk/canned-response/${guid}`,
  })
}

export function addCannedResponse(params: any) {
  return axios({
    method: 'post',
    url: `help-desk/canned-response`,
    data: params,
  })
}

export function editCannedResponse(guid: any, params: any) {
  return axios({
    method: 'put',
    url: `help-desk/canned-response/${guid}`,
    data: params,
  })
}

export function deleteCannedResponse(guid: any) {
  return axios({
    method: 'delete',
    url: `help-desk/canned-response/${guid}`,
  })
}

export function PreviewCannedResponse(guid: any) {
  return axios({
    method: 'get',
    url: `help-desk/canned-response/${guid}/priview`,
  })
}

export function sendEmailCannedResponse(guid: any, _params: any) {
  return axios({
    method: 'post',
    url: `help-desk/canned-response/${guid}/send-email`,
  })
}

export function bulkDeleteCannedResponse(params: any) {
  return axios({
    method: 'post',
    url: `bulk-delete/canned-response`,
    data: params,
  })
}

export function getCannedResponseOptionsColumns(params: any) {
  return axios({
    method: 'get',
    url: 'help-desk/canned-response/option',
    params,
  })
}
