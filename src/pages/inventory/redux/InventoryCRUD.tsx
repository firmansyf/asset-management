import axios from '@api/axios'
import axiosV2 from '@api/axiosV2'

export function addInventory(params: any) {
  return axios({
    method: 'post',
    url: 'inventory',
    data: params,
  })
}

export function editInventory(params: any, id: any) {
  return axios({
    method: 'put',
    url: 'inventory/' + id,
    params,
  })
}

export function getInventory(params: any) {
  return axiosV2({
    method: 'get',
    url: 'inventory',
    params,
  })
}

export function exportInventory(params: any) {
  return axios({
    method: 'post',
    url: 'inventory/export',
    params,
  })
}

export function deleteInventory(id: any) {
  return axios({
    method: 'delete',
    url: 'inventory/' + id,
  })
}

export function getDetailInventory(id: string) {
  return axios({
    method: 'get',
    url: 'inventory/' + id,
  })
}

export function deleteBulkInventory(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'bulk-delete/inventory',
  })
}

export function sendEmailDetail(params: any, inventory_guid: any) {
  return axios({
    method: 'post',
    url: 'inventory/' + inventory_guid + '/send-email',
    data: params,
  })
}

export function getReservationByDate(params: any, inventory_guid: any) {
  return axios({
    method: 'get',
    url: 'inventory/' + inventory_guid + '/reservation',
    params,
  })
}

export function getCommentInventory(inventory_guid: any) {
  return axios({
    method: 'get',
    url: 'inventory/' + inventory_guid + '/comment_box',
  })
}

export function getSetupColumnInventory(params: any) {
  return axios({
    method: 'get',
    url: 'inventory/setup-column',
    params,
  })
}

export function sendCommentInventory(params: any, inventory_guid: any) {
  return axios({
    method: 'post',
    url: 'inventory/' + inventory_guid + '/comment_box',
    data: params,
  })
}

export function saveSetupColumns(params: any) {
  return axios({
    method: 'post',
    url: 'inventory/setup-column',
    data: params,
  })
}

export function printInventory(inventory_guid: any) {
  return axios({
    method: 'get',
    url: 'inventory/' + inventory_guid + '/print',
  })
}

export function sendRemoveStock(params: any, inventory_guid: any) {
  return axios({
    method: 'post',
    url: 'inventory/' + inventory_guid + '/remove-stock',
    data: params,
  })
}

export function sendAddStock(params: any, inventory_guid: any) {
  return axios({
    method: 'post',
    url: 'inventory/add-stock/' + inventory_guid,
    data: params,
  })
}

export function getHistoryStock(inventory_guid: any) {
  return axios({
    method: 'get',
    url: 'inventory/' + inventory_guid + '/stock-history',
  })
}

export function getStockDetail(params: any, inventory_guid: any) {
  return axios({
    method: 'get',
    url: 'inventory/' + inventory_guid + '/stock-detail',
    params,
  })
}

export function addStockDetail(data: any, inventory_guid: any) {
  return axios({
    method: 'post',
    url: 'inventory/' + inventory_guid + '/stock-detail',
    data,
  })
}

export function addInventoryClone(params: any, guid: any) {
  return axios({
    method: 'post',
    url: `inventory/${guid}/duplicate`,
    data: params,
  })
}

export function getOptionsColumns(params: any) {
  return axios({
    method: 'get',
    url: 'inventory/option',
    params,
  })
}
