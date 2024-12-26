import axios from '@api/axios'
import {serialize} from '@helpers'

export function getShifts(params: any) {
  return axios({
    method: 'get',
    params,
    url: 'help-desk/shift',
  })
}

export function getDetailShifts(id: any) {
  return axios({
    method: 'get',
    url: 'help-desk/shift/' + id,
  })
}

export function addShifts(params: any) {
  return axios({
    method: 'post',
    url: 'help-desk/shift',
    data: params,
  })
}

export function editShifts(params: any, id: any) {
  return axios({
    method: 'put',
    url: 'help-desk/shift/' + id,
    data: params,
  })
}

export function getWorkingHours(params: any) {
  return axios({
    method: 'get',
    params,
    url: 'help-desk/working_hour',
  })
}

export function deleteShifts(id: any) {
  return axios({
    method: 'delete',
    url: 'help-desk/shift/' + id,
  })
}

export function bulkDeleteShifts(params: any) {
  return axios({
    method: 'POST',
    url: 'help-desk/shift/bulk-delete',
    data: params,
  })
}

export function exportShifts(params: any) {
  return axios({
    method: 'POST',
    url: 'help-desk/shift/export?' + serialize(params),
    // ,
    // data: params
  })
}

export function getShiftOptionsColumns(params: any) {
  return axios({
    method: 'get',
    url: 'help-desk/shift/option',
    params,
  })
}
