import axios from '@api/axios'
import axiosV2 from '@api/axiosV2'

export function getWorkOrder(params: any) {
  return axiosV2({
    method: 'get',
    url: 'maintenance',
    params,
  })
}

export function getWorkOrderV1(params: any) {
  return axios({
    method: 'get',
    url: 'maintenance',
    params,
  })
}

export function getDetailWorkOrder(guid: any) {
  return axios({
    method: 'get',
    url: 'maintenance/' + guid,
  })
}

export function saveWorkOrder(params: any) {
  return axios({
    method: 'post',
    url: 'maintenance',
    data: params,
  })
}

export function editWorkOrder(params: any, guid: any) {
  return axios({
    method: 'put',
    url: 'maintenance/' + guid,
    data: params,
  })
}

export function exportWorkOrder(params: any) {
  return axios({
    method: 'post',
    url: 'maintenance/export',
    data: params,
  })
}

export function getSetupColumnWorkOrder(params: any) {
  return axios({
    method: 'get',
    url: 'maintenance/setup-column',
    params,
  })
}

export function saveSetupColumnWorkOrder(params: any) {
  return axios({
    method: 'post',
    url: 'maintenance/setup-column',
    data: params,
  })
}

export function deleteWorkOrder(guid: any) {
  return axios({
    method: 'delete',
    url: 'maintenance/' + guid,
  })
}

export function getMaintenanceCategory(params: any) {
  return axios({
    method: 'get',
    url: 'maintenance-category/filter',
    params,
  })
}

export function getMaintenanceStatus(params: any) {
  return axios({
    method: 'get',
    url: 'maintenance-status/filter',
    params,
  })
}

export function getMaintenanceShedule(params: any) {
  return axios({
    method: 'get',
    url: 'maintenance-schedule/filter',
    params,
  })
}

export function getMaintenancePriority(params: any) {
  return axios({
    method: 'get',
    url: 'maintenance-priority/filter',
    params,
  })
}

export function getWorker(params: any) {
  return axios({
    method: 'get',
    url: 'setting/worker',
    params,
  })
}

export function setMaintenanceTask(params: any) {
  return axios({
    method: 'post',
    url: 'maintenance-task',
    data: params,
  })
}

export function putMaintenanceTask(params: any) {
  return axios({
    method: 'put',
    url: 'maintenance-task',
    data: params,
  })
}

export function deleteMaintenanceTask(guid: any) {
  return axios({
    method: 'delete',
    url: `maintenance-task/${guid}`,
  })
}

export function getMaintenanceTaskStatus(params: any) {
  return axios({
    method: 'get',
    url: 'maintenance-task-status/filter',
    params,
  })
}

export function StartTimeLog(guid: object) {
  return axios({
    method: 'POST',
    url: `maintenance/${guid}/log/start`,
  })
}

export function StopTimeLog(guid: object) {
  return axios({
    method: 'POST',
    url: `maintenance/${guid}/log/stop`,
  })
}

export function getWorkOrderColumn() {
  return axios({
    method: 'get',
    url: `maintenance/setup-column`,
  })
}

export function updateWorkOrderColumn(data: any) {
  return axios({
    method: 'post',
    url: `maintenance/setup-column`,
    data,
  })
}

export function duplicate(data: any) {
  return axios({
    method: 'post',
    url: `maintenance/duplicate`,
    data,
  })
}

export function updateBookmark(data: any, guid: any) {
  return axios({
    method: 'PUT',
    url: `maintenance/${guid}/bookmark`,
    data,
  })
}

export function archive(data: any) {
  return axios({
    method: 'post',
    url: `maintenance/archive`,
    data,
  })
}

export function processLog(guid: any) {
  return axios({
    method: 'get',
    url: `maintenance/${guid}/history`,
  })
}

export function updateArchive(params: any, data: any) {
  return axios({
    method: 'post',
    url: `maintenance/${params}`,
    data,
  })
}

export function sendUnLinkWorkOrder(guid: any, data: object) {
  return axios({
    method: 'PUT',
    url: `maintenance/${guid}/unlink`,
    data,
  })
}

export function sendLinkWorkOrder(guid: any, data: object) {
  return axios({
    method: 'PUT',
    url: `maintenance/${guid}/link`,
    data,
  })
}

export function getFilterWorkOrder() {
  return axios({
    method: 'get',
    url: `maintenance/dropdown/quick-filter`,
  })
}

export function updateFlagWorkOrder(data: any, guid: any) {
  return axios({
    method: 'PUT',
    url: `maintenance/${guid}/flag`,
    data,
  })
}

export function updateCompleteWorkOrder(data: any, guid: any) {
  return axios({
    method: 'PUT',
    url: `maintenance/${guid}/complete`,
    data,
  })
}

export function downloadFormWorkOrder(id: any) {
  return axios({
    method: 'POST',
    url: 'maintenance/' + id + '/download',
  })
}

export function ShareEndcode(data: any) {
  return axios({
    method: 'POST',
    url: `/maintenance/encode`,
    data,
  })
}

export function getPreventive(params: any) {
  return axios({
    method: 'get',
    url: 'maintenance-preventive',
    params,
  })
}

export function getDetailPreventive(guid: any) {
  return axios({
    method: 'get',
    url: `maintenance-preventive/${guid}`,
  })
}

export function printWorkOrder(guid: any) {
  return axios({
    method: 'get',
    url: `maintenance/${guid}/print`,
  })
}

export function sendEmailDetail(params: any, guid: any) {
  return axios({
    method: 'post',
    url: `maintenance/${guid}/send-email`,
    data: params,
  })
}

export function getMeter(params: any) {
  return axios({
    method: 'get',
    url: 'maintenance-meter',
    params,
  })
}

export function getDetailMeter(guid: any) {
  return axios({
    method: 'get',
    url: `maintenance-meter/${guid}`,
  })
}

export function getSetupColumnMeter(params: any) {
  return axios({
    method: 'get',
    url: 'maintenance-meter/setup-column',
    params,
  })
}

export function addMeter(params: any) {
  return axios({
    method: 'post',
    url: 'maintenance-meter',
    data: params,
  })
}

export function editMeter(params: any, guid: any) {
  return axios({
    method: 'put',
    url: `maintenance-meter/${guid}`,
    data: params,
  })
}

export function exportMeter(params: any) {
  return axios({
    method: 'post',
    url: 'maintenance-meter/export',
    data: params,
  })
}

export function setMaintenanceCategory(params: any) {
  return axios({
    method: 'post',
    url: 'maintenance-category',
    data: params,
  })
}

export function putMaintenanceCategory(params: any, guid: any) {
  return axios({
    method: 'put',
    url: `maintenance-category/filter/${guid}`,
    params,
  })
}

export function savePreventive(params: any) {
  return axios({
    method: 'post',
    url: 'maintenance-preventive',
    data: params,
  })
}

export function editPreventive(params: any, guid: any) {
  return axios({
    method: 'put',
    url: `maintenance-preventive/${guid}`,
    data: params,
  })
}

export function getSetupColumnPreventive(params: any) {
  return axios({
    method: 'get',
    url: 'maintenance-preventive/setup-column',
    params,
  })
}

export function saveSetupColumnPreventive(params: any) {
  return axios({
    method: 'post',
    url: 'maintenance-preventive/setup-column',
    data: params,
  })
}

export function getWorkOrderComment(guid: any) {
  return axios({
    method: 'get',
    url: 'maintenance/' + guid + '/comment_box',
  })
}

export function postWorkOrderComment(params: any, guid: any) {
  return axios({
    method: 'post',
    url: 'maintenance/' + guid + '/comment_box',
    data: params,
  })
}

export function getMeterComment(guid: any) {
  return axios({
    method: 'get',
    url: 'maintenance-meter/' + guid + '/comment_box',
  })
}

export function postMeterComment(data_params: any, guid: any) {
  return axios({
    method: 'post',
    url: 'maintenance-meter/' + guid + '/comment_box',
    data: data_params,
  })
}

export function saveSetupColumnMeter(data: any) {
  return axios({
    method: 'POST',
    url: 'maintenance-meter/setup-column',
    data,
  })
}

export function printMeter(guid: any) {
  return axios({
    method: 'get',
    url: `maintenance-meter/${guid}/print`,
  })
}

export function PostReadingMeter(guid: any, data: any) {
  return axios({
    method: 'POST',
    url: `maintenance-meter/${guid}/history`,
    data,
  })
}

export function deleteMeter(guid: any) {
  return axios({
    method: 'delete',
    url: 'maintenance-meter/' + guid,
  })
}

export function deleteBulkMeter(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'bulk-delete/maintenance-meter',
  })
}

export function getRequestComment(guid: any) {
  return axios({
    method: 'get',
    url: 'maintenance/request/' + guid + '/comment_box',
  })
}

export function postRequestComment(params: any, guid: any) {
  return axios({
    method: 'post',
    url: 'maintenance/request/' + guid + '/comment_box',
    data: params,
  })
}

export function deletePreventive(guid: any) {
  return axios({
    method: 'delete',
    url: 'maintenance-preventive/' + guid,
  })
}

export function deleteBulkPreventive(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'bulk-delete/maintenance-preventive',
  })
}

export function sendUnLinkMeter(guid: any, data: object) {
  return axios({
    method: 'PUT',
    url: `maintenance-meter/${guid}/unlink`,
    data,
  })
}

export function sendLinkMeter(guid: any, data: object) {
  return axios({
    method: 'PUT',
    url: `maintenance-meter/${guid}/link`,
    data,
  })
}

export function getAssetLite(params: any) {
  const guid: any = params?.guid !== undefined ? params?.guid : ''
  Object.prototype.hasOwnProperty.call(params, 'guid') && delete params['guid']
  if (params['keyword'] === '**') {
    params.keyword = ''
  }

  return axios({
    method: 'GET',
    url: `asset-lite?location_guid=${guid}`,
    params,
  })
}

export function getFeedback(guid: any) {
  return axios({
    method: 'get',
    url: `maintenance/${guid}/feedback`,
  })
}

export function saveFeedback(guid: any, params: any) {
  return axios({
    method: 'post',
    url: `maintenance/${guid}/feedback`,
    data: params,
  })
}

export function getInvenWo() {
  return axios({
    method: 'get',
    url: 'maintenance-inventory/dropdown',
  })
}

export function addInventoryWO(params: any) {
  return axios({
    method: 'post',
    url: 'maintenance-inventory',
    data: params,
  })
}

export function getListTableInvenWo(maintenance_guid: any) {
  return axios({
    method: 'get',
    url: `maintenance-inventory?filter[maintenance_guid]=${maintenance_guid}`,
  })
}

export function editInventoryWO(guid: any, params: any) {
  return axios({
    method: 'put',
    url: `maintenance-inventory/${guid}`,
    data: params,
  })
}

export function deleteMaintenenceInventory(guid: any) {
  return axios({
    method: 'delete',
    url: `maintenance-inventory/${guid}`,
  })
}

export function getOptionsColumns(params: any) {
  return axios({
    method: 'get',
    url: 'maintenance/option',
    params,
  })
}

export function getMeterOptionsColumns(params: any) {
  return axios({
    method: 'get',
    url: 'maintenance-meter/option',
    params,
  })
}

export function getPreventiveOptionsColumns(params: any) {
  return axios({
    method: 'get',
    url: 'maintenance-preventive/option',
    params,
  })
}
