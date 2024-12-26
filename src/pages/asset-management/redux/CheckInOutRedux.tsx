import axios from '@api/axios'

export function checkoutCreate(data: any) {
  return axios({
    method: 'post',
    url: 'asset-checkout',
    data,
  })
}
export function checkoutDetail(guid: string) {
  return axios({
    method: 'get',
    url: `asset-checkout/${guid}`,
  })
}
export function checkoutExtend(data: any) {
  return axios({
    method: 'post',
    url: 'asset-checkout/extend',
    data,
  })
}
export function checkinCreate(data: any) {
  return axios({
    method: 'post',
    url: 'asset-checkin',
    data,
  })
}
export function getHistoryCheckInOut(guid: any, params: any) {
  return axios({
    method: 'get',
    url: `asset/${guid}/checkout-history`,
    params,
  })
}
export function getEmployee(params: object) {
  return axios({
    method: 'get',
    params,
    url: 'employee',
  })
}
