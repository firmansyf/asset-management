import axios from '@api/axios'
import axiosV2 from '@api/axiosV2'

export const DELETE_USER_URL = `user`

export function getAsset(params: any) {
  return axiosV2({
    method: 'get',
    url: 'report/asset',
    params,
  })
}

export function getAssetV1(params: any) {
  return axios({
    method: 'get',
    url: 'report/asset',
    params,
  })
}

export function getAssetOptions(params: any) {
  return axios({
    method: 'get',
    url: 'report/asset/option',
    params,
  })
}

export function printAsset(guid: string) {
  return axios({
    method: 'get',
    url: `asset/${guid}/print`,
  })
}

export function getAssetHistory(params: any) {
  return axios({
    method: 'get',
    url: 'report/asset-history',
    params,
  })
}

export function getAssetDetail(id: any) {
  return axios({
    method: 'get',
    url: 'asset/' + id,
  })
}

export function getAssetDetailHistory(guid: string, params: any) {
  return axios({
    method: 'get',
    url: `asset/${guid}/history`,
    params,
  })
}

export function deleteAsset(id: any) {
  return axios({
    method: 'delete',
    url: 'asset/' + id,
  })
}

export function deleteBulkAsset(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'bulk-delete/asset',
  })
}

export function getColumn() {
  return axios({
    method: 'get',
    url: `asset`,
  })
}

export function exportAsset(data: object) {
  return axios({
    method: 'post',
    data,
    url: 'report/asset/export',
  })
}

export function exportMyAsset(data: any) {
  return axios({
    method: 'post',
    url: 'report/asset/export',
    data,
  })
}

export function sendEmailDetail(params: any, asset_guid: any) {
  return axios({
    method: 'post',
    url: 'asset/' + asset_guid + '/send-email',
    data: params,
  })
}

export function getAssetColumn() {
  return axios({
    method: 'get',
    url: `asset/setup-column`,
  })
}

export function updateAssetColumn(data: any) {
  return axios({
    method: 'post',
    data,
    url: `asset/setup-column`,
  })
}

export function exportAssetHistory(data: any) {
  return axios({
    method: 'post',
    url: 'report/asset-history/export',
    data,
  })
}

export function sendAddReservation(params: any) {
  return axios({
    method: 'post',
    url: 'asset-reservation',
    data: params,
  })
}

export function getAssetReservation(params: any) {
  return axios({
    method: 'get',
    url: 'asset-reservation',
    params,
  })
}

export function sendUpdateReservation(params: any, guid: any) {
  return axios({
    method: 'put',
    url: 'asset-reservation/' + guid,
    data: params,
  })
}

export function getAvailabilityCalendar(params: any) {
  return axios({
    method: 'get',
    url: 'asset/availability-calendar',
    params,
  })
}

export function sendAssetLinked(guid: string, params: any) {
  return axios({
    method: 'post',
    url: `asset-linked/${guid}`,
    data: params,
  })
}

export function removeAssetLinked(guid: string, params: any) {
  return axios({
    method: 'post',
    url: `asset-linked/${guid}/bulk-delete`,
    data: params,
  })
}

export function getAssetLinked(guid: string) {
  return axios({
    method: 'get',
    url: `asset-linked/${guid}`,
  })
}

export function addRequestSendEmail(params: any) {
  return axios({
    method: 'post',
    url: `asset/add-request`,
    data: params,
  })
}

export function generateQRCode(params: any) {
  return axios({
    method: 'post',
    url: `qrcode`,
    data: params,
  })
}

export function myAsset(params: any) {
  return axiosV2({
    method: 'get',
    url: 'my-asset',
    params,
  })
}

export function getNewAssetApproval(params: any) {
  return axios({
    method: 'get',
    url: 'asset/approval?filter[approval_type]=New Asset',
    params,
  })
}

export function getUpdatedAssetApproval(params: any) {
  return axios({
    method: 'get',
    url: 'asset/approval?filter[approval_type]=Asset Updated',
    params,
  })
}

export function getReviwUpdateAsset(params: any, guid: any) {
  return axios({
    method: 'get',
    url: `asset/${guid}/review-update`,
    params,
  })
}

export function approveAssetReview(guid: string, params: any) {
  return axios({
    method: 'post',
    url: `asset/${guid}/approval`,
    data: params,
  })
}

export function rejectAssetReview(guid: string, params: any) {
  return axios({
    method: 'post',
    url: `asset/${guid}/reject`,
    data: params,
  })
}

export function getAssetNewApprovalOptColumns(params: any) {
  return axios({
    method: 'get',
    url: 'asset/approval/option?filter[approval_type]=New%Asset',
    params,
  })
}

export function getAssetUpdateApprovalOptColumns(params: any) {
  return axios({
    method: 'get',
    url: 'asset/approval/option?filter[approval_type]=Asset%Updated',
    params,
  })
}

export function getAssetHistoryOption(params: any) {
  return axios({
    method: 'get',
    url: 'asset/filter-option',
    params,
  })
}
