import axios from '@api/axios'

export function getListDropdownEmailTmp() {
  return axios({
    method: 'get',
    url: 'email-template',
  })
}

export function getEmailName(guid: any) {
  return axios({
    method: 'get',
    url: `email-template/${guid}`,
  })
}

export function defaultEmailName(guid: any) {
  return axios({
    method: 'get',
    url: `email-template/${guid}/default`,
  })
}

export function updateTemplateEmailName(params: any, guid: any) {
  return axios({
    method: 'put',
    url: `email-template/${guid}`,
    data: params,
  })
}

export function createTemplateEmailSettings(params: any) {
  return axios({
    method: 'post',
    url: 'email-template/setting',
    data: params,
  })
}

export function getTemplateEmailSettings() {
  return axios({
    method: 'get',
    url: 'email-template/setting',
    // data: params,
  })
}

// Email Asset
export function emailAssetCheckin(params: any) {
  return axios({
    method: 'post',
    url: 'asset-checkin',
    data: params,
  })
}

export function emailAssetCheckout(params: any) {
  return axios({
    method: 'post',
    url: 'asset-checkout',
    data: params,
  })
}

export function emailAssetReservation(params: any) {
  return axios({
    method: 'post',
    url: 'asset-reservation',
    data: params,
  })
}
// End Email Asset

// Email Insurance Policy
export function createEmailInsurancePolicy(params: any, guid: any) {
  return axios({
    method: 'post',
    url: `insurance/${guid}/send-email`,
    data: params,
  })
}

export function getEmailInsurancePolicy() {
  return axios({
    method: 'get',
    url: 'insurance/push-alert',
  })
}
// End Email Insurance Policy
