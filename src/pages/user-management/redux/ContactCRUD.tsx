import axios from '@api/axios'

export function getContact(params: any) {
  return axios({
    method: 'GET',
    url: 'help-desk/contact',
    params,
  })
}

export function addContact(data: any) {
  return axios({
    method: 'POST',
    url: 'help-desk/contact',
    data,
  })
}

export function editContact(data: any, guid: any) {
  return axios({
    method: 'PUT',
    url: `help-desk/contact/${guid}`,
    data,
  })
}

export function deleteContact(guid: any) {
  return axios({
    method: 'delete',
    url: `help-desk/contact/${guid}`,
  })
}

export function deleteBulkContact(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'bulk-delete/contact',
  })
}

export function contactExport(params: any) {
  return axios({
    method: 'post',
    url: 'help-desk/contact/export',
    data: params,
  })
}

export function getContactColumn() {
  return axios({
    method: 'GET',
    url: 'help-desk/contact/setup-column',
  })
}

export function updateContactColumn(data: object) {
  return axios({
    method: 'POST',
    url: 'help-desk/contact/setup-column',
    data,
  })
}

export function getOptionsColumns(params: any) {
  return axios({
    method: 'get',
    url: 'help-desk/contact/option',
    params,
  })
}
