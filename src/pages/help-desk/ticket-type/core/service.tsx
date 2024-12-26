import axios from '@api/axios'

export function getTicketType(params: any) {
  return axios({
    method: 'get',
    url: 'help-desk/ticket-type',
    params,
  })
}

export function addTicketType(params: any) {
  return axios({
    method: 'post',
    url: 'help-desk/ticket-type',
    params,
  })
}

export function editTicketType(params: any, guid: any) {
  return axios({
    method: 'put',
    url: `help-desk/ticket-type/${guid}`,
    data: params,
  })
}

export function deleteTicketType(guid: any) {
  return axios({
    method: 'delete',
    url: `help-desk/ticket-type/${guid}`,
  })
}

export function bulkDeleteTicketType(params: any) {
  return axios({
    method: 'post',
    url: 'bulk-delete/ticket-type',
    data: params,
  })
}

export function getDetailTicketType(guid: any) {
  return axios({
    method: 'get',
    url: `help-desk/ticket-type/${guid}`,
  })
}

export function exportTicketType(params: any) {
  return axios({
    method: 'post',
    url: 'help-desk/ticket-type/export',
    params,
  })
}

export function getTicketTypeOptionsColumns(params: any) {
  return axios({
    method: 'get',
    url: 'help-desk/ticket-type/option',
    params,
  })
}
