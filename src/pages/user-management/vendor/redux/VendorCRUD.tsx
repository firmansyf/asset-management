/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from '@api/axios'

export function addVendor(params: any) {
  return axios({
    method: 'post',
    url: 'setting/vendor',
    data: params,
  })
}

export function editVendor(data: any, id: any) {
  return axios({
    method: 'put',
    url: 'setting/vendor/' + id,
    data,
  })
}

export function getVendor(params: any) {
  return axios({
    method: 'get',
    url: `setting/vendor`,
    params,
  })
}

export function exportVendor(params: any) {
  return axios({
    method: 'post',
    url: 'setting/vendor/export',
    params,
  })
}

export function deleteVendor(id: any) {
  return axios({
    method: 'delete',
    url: 'setting/vendor/' + id,
  })
}

export function deleteBulkVendor(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'bulk-delete/vendor',
  })
}

export function getDetailVendor(id: string) {
  return axios({
    method: 'get',
    url: 'setting/vendor/' + id,
  })
}

export function getDefaultColumn(params: any) {
  return axios({
    method: 'get',
    params,
    url: 'setting/vendor/get-column',
  })
}

export function getSetupColumn(params: any) {
  return axios({
    method: 'get',
    params,
    url: 'setting/vendor/setup-column',
  })
}

export function updateSetupColumn(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'setting/vendor/setup-column',
  })
}

export function getOptionsColumns(params: any) {
  return axios({
    method: 'get',
    url: 'setting/vendor/option',
    params,
  })
}
