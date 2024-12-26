import axios from '@api/axios'

export function getAllWidget() {
  return axios({
    method: 'get',
    url: 'dashboard/widget-chart',
  })
}

export function getWidget(params: any) {
  return axios({
    method: 'get',
    url: 'widget',
    params,
  })
}

export function saveWidget(params: any) {
  return axios({
    method: 'put',
    data: params,
    url: 'widget',
  })
}

export function getDataWidget(guid: any, widget: string, params: any = {}) {
  return axios({
    method: 'get',
    params,
    url: `dashboard/widget/${widget}/${guid}`,
  })
}

export function getDataFeeds(unique_id: any, params: any) {
  return axios({
    method: 'get',
    params,
    url: `dashboard/widget/feeds/activity_log/${unique_id}`,
  })
}

export function clearDataFeeds(type: any) {
  return axios({
    method: 'post',
    url: `dashboard/widget/feeds/activity_log/${type}/clear`,
  })
}

export function getDataAuditAsset(params: any) {
  return axios({
    method: 'get',
    params,
    url: `dashboard/widget/audited-asset`,
  })
}

export function editDisplayedWidgets() {
  return axios({
    method: 'get',
    url: `/dashboard/widget/`,
  })
}

export function getInsuranceClaimYears() {
  return axios({
    method: 'get',
    url: `insurance_claim/years-ref`,
  })
}

export function resetDefaultDashboard() {
  return axios({
    method: 'delete',
    url: `widget/reset`,
  })
}
