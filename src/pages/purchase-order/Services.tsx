/* eslint-disable sonar/declarations-in-global-scope */
import axios from '@api/axios'

export function getPO(params?: any) {
  return axios({
    method: 'get',
    url: 'purchase-order',
    params,
  })
}

export function getColumnsPO() {
  return axios({
    method: 'get',
    url: 'purchase-order/setup-column',
  })
}

export function addEditPO(data: any, id?: any) {
  return axios({
    method: id ? 'put' : 'post',
    url: id ? `purchase-order/${id}` : `purchase-order`,
    data,
  })
}

export function saveColumnPO(data?: any) {
  return axios({
    method: 'post',
    url: 'purchase-order/setup-column',
    data,
  })
}

export function exportPO(data?: any) {
  return axios({
    method: 'post',
    url: 'purchase-order/export',
    data,
  })
}

export function deletePO(guid: any) {
  return axios({
    method: 'delete',
    url: `purchase-order/${guid}`,
  })
}

export function deleteBulkPO(guids: any) {
  return axios({
    method: 'post',
    url: `bulk-delete/purchase-order`,
    data: {guids},
  })
}

export function getDetailPO(guid: any) {
  return axios({
    method: 'get',
    url: `purchase-order/${guid}`,
  })
}

export function updatePurchaseOrder(guid: any, data: any) {
  return axios({
    method: 'put',
    url: `purchase-order/${guid}/order`,
    data,
  })
}

export function updateDeliveryCheck(guid: any, data: any) {
  return axios({
    method: 'put',
    url: `purchase-order/${guid}/delivery_check`,
    data,
  })
}

export function updatePurchaseOrderPayment(guid: any, data: any) {
  return axios({
    method: 'put',
    url: `purchase-order/${guid}/payment`,
    data,
  })
}

export function updatePONegotiation(guid: any, data: any) {
  return axios({
    method: 'put',
    url: `purchase-order/${guid}/negotiation`,
    data,
  })
}

export function getAssetLite(params: any) {
  return axios({
    method: 'get',
    params,
    url: 'asset-lite',
  })
}

export function approvalPO(guid: any, data: any) {
  return axios({
    method: 'put',
    url: `purchase-order/${guid}/approval`,
    data,
  })
}

export function printPO(guid: any) {
  return axios({
    method: 'get',
    url: `purchase-order/${guid}/print`,
  })
}

export function getOptionsColumns(params: any) {
  return axios({
    method: 'get',
    url: 'purchase-order/option',
    params,
  })
}
