import axios from '@api/axios'

export function updateDatabaseAsset(params: any) {
  return axios({
    method: 'post',
    url: 'setting/database/asset',
    data: params,
  })
}

export function updateDatabaseLocation(params: any) {
  return axios({
    method: 'post',
    url: 'setting/database/location',
    data: params,
  })
}

export function updateDatabaseEmployee(params: any) {
  return axios({
    method: 'post',
    url: 'setting/database/employees',
    data: params,
  })
}

export function updateDatabaseWarranty(params: any) {
  return axios({
    method: 'post',
    url: 'setting/database/warranty',
    data: params,
  })
}

export function updateDatabaseInsurance(params: any) {
  return axios({
    method: 'post',
    url: 'setting/database/insurance',
    data: params,
  })
}

export function getDatabaseAsset(params: object) {
  return axios({
    method: 'get',
    url: 'setting/database/asset',
    params,
  })
}

export function getDatabaseLocation(params: object) {
  return axios({
    method: 'get',
    url: 'setting/database/location',
    params,
  })
}

export function getDatabaseEmployee(params: object) {
  return axios({
    method: 'get',
    url: 'setting/database/employees',
    params,
  })
}

export function getDatabaseWarranty(params: object) {
  return axios({
    method: 'get',
    url: 'setting/database/warranty',
    params,
  })
}

export function getDatabaseInsurance(params: object) {
  return axios({
    method: 'get',
    url: 'setting/database/insurance',
    params,
  })
}

export function getDatabaseInventory(params: object) {
  return axios({
    method: 'get',
    url: 'setting/database/inventory',
    params,
  })
}

export function updateDatabaseInventory(params: any) {
  return axios({
    method: 'post',
    url: 'setting/database/inventory',
    data: params,
  })
}

export function getDatabaseTicket(params: object) {
  return axios({
    method: 'get',
    url: 'setting/database/ticket',
    params,
  })
}

export function updateDatabaseTicket(params: any) {
  return axios({
    method: 'post',
    url: 'setting/database/ticket',
    data: params,
  })
}

export function getDatabaseWorkOrder(params: object) {
  return axios({
    method: 'get',
    url: 'setting/database/work_order',
    params,
  })
}

export function updateDatabaseWorkOrder(params: any) {
  return axios({
    method: 'post',
    url: 'setting/database/work_order',
    data: params,
  })
}

export function getDatabaseRequest(params: object) {
  return axios({
    method: 'get',
    url: 'setting/database/maintenance_request',
    params,
  })
}

export function updateDatabaseRequest(params: any) {
  return axios({
    method: 'post',
    url: 'setting/database/maintenance_request',
    data: params,
  })
}

export function updateDatabaseVendor(params: any) {
  return axios({
    method: 'post',
    url: 'setting/vendor',
    data: params,
  })
}
export function getDatabaseVendor(params: object) {
  return axios({
    method: 'get',
    url: 'setting/vendor',
    params,
  })
}
