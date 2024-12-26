import axios from '@api/axios'

export function getCannedForms(params: any) {
  return axios({
    method: 'get',
    params,
    url: 'help-desk/canned-form',
  })
}

export function getDetailCannedForms(guid: any) {
  return axios({
    method: 'get',
    url: `help-desk/canned-form/${guid}`,
  })
}

export function addCannedForms(params: any) {
  return axios({
    method: 'post',
    url: `help-desk/canned-form`,
    data: params,
  })
}

export function editCannedForms(guid: any, params: any) {
  return axios({
    method: 'put',
    url: `help-desk/canned-form/${guid}`,
    data: params,
  })
}

export function deleteCannedForms(guid: any) {
  return axios({
    method: 'delete',
    url: `help-desk/canned-form/${guid}`,
  })
}

export function PreviewCannedForms(guid: any) {
  return axios({
    method: 'get',
    url: `help-desk/canned-form/${guid}/priview`,
  })
}

export function sendEmailCannedForms(guid: any, _params: any) {
  return axios({
    method: 'post',
    url: `help-desk/canned-form/${guid}/send-email`,
  })
}

export function bulkDeleteCannedForms(params: any) {
  return axios({
    method: 'post',
    url: `bulk-delete/canned-form`,
    data: params,
  })
}

export function getCannedFormsOptionsColumns(params: any) {
  return axios({
    method: 'get',
    url: 'help-desk/canned-form/option',
    params,
  })
}
