import axios from '@api/axios'
import {serialize} from '@helpers'

export function getCountryCode(params: any) {
  return axios({
    method: 'get',
    url: 'geo/country',
    data: params,
  })
}

export function addInsurancePolicies(params: any) {
  return axios({
    method: 'post',
    url: 'insurance',
    data: params,
  })
}

export function editInsurancePolicies(params: any, guid: string) {
  return axios({
    method: 'put',
    url: 'insurance/' + guid,
    data: params,
  })
}

export function getInsurancePolicies(params: object) {
  return axios({
    method: 'get',
    url: 'insurance/filter?' + serialize(params),
  })
}

export function deleteInsurancePolicies(id: any) {
  return axios({
    method: 'delete',
    url: 'insurance/' + id,
  })
}

export function deleteBulkInsurancePolicies(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'bulk-delete/insurance',
  })
}

export function getDetailInsurancePolicies(id: string) {
  return axios({
    method: 'get',
    url: 'insurance/' + id,
  })
}

export function exportInsurancePolicies(params: any) {
  return axios({
    method: 'post',
    url: 'insurance/export',
    params: params,
  })
}

export function getAssetInsurancePolicies(params: any) {
  return axios({
    method: 'get',
    params,
    url: 'asset-lite',
  })
}

export function postAttachAsset(params: any, guid: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'location/' + guid + '/attachAsset',
  })
}

export function deleteAttachAsset(loc_guid: any, asset_guid: any) {
  return axios({
    method: 'delete',
    url: 'location/' + loc_guid + '/asset/' + asset_guid,
  })
}

export function getSetupColumnInsurancePolice(params: any) {
  return axios({
    method: 'get',
    url: 'insurance/setup-column',
    params,
  })
}

export function saveSetupColumnsInsurancePolice(params: any) {
  return axios({
    method: 'post',
    url: 'insurance/setup-column',
    data: params,
  })
}

export function getDocumentInsurancePolicies(id: string, params: any) {
  return axios({
    method: 'get',
    url: 'insurance/' + id + '/doc',
    params,
  })
}

export function getAssetSelectedInsurancePolicies(id: string, params: any) {
  return axios({
    method: 'get',
    url: 'insurance/' + id + '/asset',
    params,
  })
}

export function printInsurance(guid: string) {
  return axios({
    method: 'get',
    url: `insurance/${guid}/print`,
  })
}

export function getAttachAssetInsurance(guid: any) {
  return axios({
    method: 'get',
    url: 'insurance/' + guid + '/asset',
  })
}

export function postAttachAssetInsurance(params: any, guid: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'insurance/' + guid + '/asset',
  })
}

export function deleteAttachAssetInsurance(ins_guid: any, asset_guid: any) {
  return axios({
    method: 'delete',
    url: 'insurance/' + ins_guid + '/asset/' + asset_guid,
  })
}

export function bulkDeleteAttachAssetInsurance(params: any) {
  return axios({
    method: 'delete',
    url: 'insurance',
    data: params,
  })
}

export function deleteDocumentInsurance(ins_guid: any, doc_guid: any) {
  return axios({
    method: 'delete',
    url: 'insurance/' + ins_guid + '/doc/' + doc_guid,
  })
}

export function postDocumentInsurance(params: any, guid: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'insurance/' + guid + '/doc',
  })
}

export function getPoliciesComment(guid: any) {
  return axios({
    method: 'get',
    url: 'insurance/' + guid + '/comment_box',
  })
}

export function postPoliciesComment(params: any, guid: any) {
  return axios({
    method: 'post',
    url: 'insurance/' + guid + '/comment_box',
    data: params,
  })
}

export function sendEmailDetail(params: any, ins_guid: any) {
  return axios({
    method: 'post',
    url: 'insurance/' + ins_guid + '/send-email',
    data: params,
  })
}

export function getPolicyOptionsColumns(params: any) {
  return axios({
    method: 'get',
    url: 'insurance/option',
    params,
  })
}
