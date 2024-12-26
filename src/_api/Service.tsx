import axios from '@api/axios'
import axiosV2 from '@api/axiosV2'

export function getLocation(params: any) {
  return axiosV2({
    method: 'get',
    params,
    url: 'location/filter',
  })
}

export function getLocationV1(params: any) {
  return axios({
    method: 'get',
    params,
    url: 'location/filter',
  })
}

export function getLocationDetail(guid: any) {
  return axios({
    method: 'get',
    url: 'location/' + guid,
  })
}

export function getLocationStatus() {
  return axios({
    method: 'get',
    url: 'location-availability/filter',
  })
}

export function editLocation(params: any, guid: any) {
  return axios({
    method: 'put',
    data: params,
    url: 'location/' + guid,
  })
}

export function addLocation(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'location',
  })
}

export function deleteLocation(id: any) {
  return axios({
    method: 'delete',
    url: 'location/' + id,
  })
}

export function getLocationColumn() {
  return axios({
    method: 'get',
    url: `location/setup-column`,
  })
}

export function updateLocationColumn(data: any) {
  return axios({
    method: 'post',
    data,
    url: `location/setup-column`,
  })
}

export function getSubLocation(params: any) {
  return axios({
    method: 'get',
    params,
    url: 'location-sub/filter',
  })
}

export function deleteSubLocation(id: any) {
  return axios({
    method: 'delete',
    url: 'location-sub/' + id,
  })
}

export function addSubLocation(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'location-sub',
  })
}

export function editSubLocation(params: any, id: any) {
  return axios({
    method: 'put',
    data: params,
    url: 'location-sub/' + id,
  })
}

export function getCountry() {
  return axios({
    method: 'get',
    url: 'geo/country',
  })
}

export function exportLocation(params: any) {
  return axios({
    method: 'post',
    params,
    url: 'location/export',
  })
}

export function deleteBulkLocation(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'bulk-delete/location',
  })
}

export function getAssetLocation(params: any) {
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

export function getSetupColumnLocation(params: any) {
  return axios({
    method: 'get',
    url: 'location/setup-column',
    params,
  })
}
export function saveSetupColumnsLocation(params: any) {
  return axios({
    method: 'post',
    url: 'location/setup-column',
    data: params,
  })
}

export function approveBulkInsurance(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'insurance_claim/approval/approve',
  })
}

export function printLocation(guid: string) {
  return axios({
    method: 'get',
    url: `location/${guid}/print`,
  })
}

export function getCompanyColumn() {
  return axios({
    method: 'get',
    url: `setting/company/setup-column`,
  })
}

export function updateCompanyColumn(data: any) {
  return axios({
    method: 'post',
    data,
    url: `setting/company/setup-column`,
  })
}

export function sendEmailDetail(params: any, location_guid: any) {
  return axios({
    method: 'post',
    url: 'location/' + location_guid + '/send-email',
    data: params,
  })
}

export function getLocationComment(guid: any) {
  return axios({
    method: 'get',
    url: 'location/' + guid + '/comment_box',
  })
}

export function postLocationComment(params: any, guid: any) {
  return axios({
    method: 'post',
    url: 'location/' + guid + '/comment_box',
    data: params,
  })
}

export function sendUpdatePeril(data: any, guid: any) {
  return axios({
    method: 'post',
    url: `insurance_claim/${guid}/move-peril-document`,
    data,
  })
}

export function getListFilterDate() {
  return axios({
    method: 'get',
    url: 'list-filter-date',
  })
}

export function getOptionsColumns(params: any) {
  return axios({
    method: 'get',
    url: 'location/option',
    params,
  })
}

export function resetSetupColumns(data: any) {
  return axios({
    method: 'post',
    data,
    url: `setting/setup-column-clear`,
  })
}

export function getAssetBulkTemp(params: any, type: any) {
  return axios({
    method: 'get',
    params,
    url: `asset-temporary?type=${type}`,
  })
}

export function storeAssetBulkTemp(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: `asset-temporary/bulk-store`,
  })
}

export function deleteAssetBulkTemp(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'asset-temporary/bulk-delete',
  })
}

export function cleanAssetBulkTemp(params: any) {
  return axios({
    method: 'delete',
    data: params,
    url: 'asset-temporary/all-delete',
  })
}
