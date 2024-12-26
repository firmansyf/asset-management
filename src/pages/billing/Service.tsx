import axios from '@api/axios'

export function getPlan(params: any) {
  return axios({
    method: 'get',
    url: `plan?filter[currency]=${params.currency}&filter[limit_asset]=${params.totalAsset}&filter[billing_cycle]=${params.billingCycle}`,
  })
}

export function getOwnerSubscription() {
  return axios({
    method: 'get',
    url: 'setting/owner/subscription',
  })
}

export function updateOwnerSubscription(params: any) {
  return axios({
    method: 'put',
    url: 'setting/owner/subscription',
    data: params,
  })
}

export function getDetailPlanUsed(params: any, id?: any) {
  return axios({
    method: 'put',
    data: params,
    url: 'asset/' + id,
  })
}

export function getDetailCard() {
  return axios({
    method: 'get',
    url: 'setting/owner/payment-method',
  })
}

export function cancelSubscribe() {
  return axios({
    method: 'delete',
    url: 'setting/owner/subscription',
  })
}

export function getBillingHistory(params: any) {
  return axios({
    method: 'put',
    data: params,
    url: 'asset/',
  })
}

export function getDataBillingHistory(params: any) {
  return axios({
    method: 'get',
    params,
    url: 'setting/owner/invoice',
  })
}

export function cancelSubscription(params: any) {
  return axios({
    method: 'delete',
    url: 'setting/owner/subscription',
    params,
  })
}
