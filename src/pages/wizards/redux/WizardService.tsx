import axios from '@api/axios'

export function getCompany() {
  return axios({
    method: 'get',
    url: 'setting/company',
  })
}

export function editCompany(params: any, id: string) {
  return axios({
    method: 'put',
    data: params,
    url: 'setting/company/' + id,
  })
}

export function getPreference() {
  return axios({
    method: 'get',
    url: 'setting/preference',
  })
}

export function editPreference(params: any) {
  return axios({
    method: 'put',
    url: 'setting/preference',
    data: params,
  })
}

export function getCountry() {
  return axios({
    method: 'get',
    url: 'geo/country',
  })
}

export function getTimezone() {
  return axios({
    method: 'get',
    url: 'setting/preference/timezone',
  })
}

export function getCurrency() {
  return axios({
    method: 'get',
    url: 'setting/preference/currency',
  })
}

export function getCategory(params: any) {
  return axios({
    method: 'get',
    params,
    url: 'setting/category/filter',
  })
}

export function addCategory(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'setting/category',
  })
}

export function editCategory(params: any, id: any) {
  return axios({
    method: 'put',
    params,
    url: 'setting/category/' + id,
  })
}

export function deleteCategory(id: any) {
  return axios({
    method: 'delete',
    url: 'setting/category/' + id,
  })
}

export function deleteBulkCategory(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'setting/category/bulk-delete',
  })
}

export function getLocation(params: any) {
  return axios({
    method: 'get',
    params,
    url: 'location/filter',
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

export function getSubLocation(params: any, filterlocation: any = '') {
  let filter = ''
  if (filterlocation) {
    filter = 'filter%5Blocation_guid%5D=' + filterlocation
  }
  return axios({
    method: 'get',
    params,
    url: 'location-sub/filter?' + filter,
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

export function getDatabases() {
  return axios({
    method: 'get',
    url: 'setting/database/asset',
  })
}

export function setupDatabasesAsset(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'setting/database/asset',
  })
}

export function getCustomField(params: any) {
  return axios({
    method: 'get',
    params,
    url: 'custom-field/filter',
  })
}

export function addCustomField(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'custom-field',
  })
}

export function editCustomField(params: any, id: any) {
  return axios({
    method: 'put',
    url: 'custom-field/' + id,
    data: params,
  })
}

export function deleteCustomField(id: any) {
  return axios({
    method: 'delete',
    url: 'custom-field/' + id,
  })
}

export function editDatabases(params: any) {
  return axios({
    method: 'put',
    params,
    url: 'databases',
  })
}

export function getFeature() {
  return axios({
    method: 'get',
    url: 'setting/feature',
  })
}

export function editFeature(unique_name: any, value: boolean) {
  return axios({
    method: 'put',
    data: {value},
    url: 'setting/feature/' + unique_name,
  })
}

export function editProfile(params: any) {
  return axios({
    method: 'put',
    url: 'a/me',
    data: params,
  })
}
