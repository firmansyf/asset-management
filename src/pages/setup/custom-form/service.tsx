import axios from '@api/axios'

export function getCustomForm(moduleName?: string | undefined) {
  return axios({
    method: 'get',
    url: `custom-form/${moduleName}`,
  })
}
export function saveCustomForm(data: any) {
  return axios({
    method: 'put',
    url: `custom-form`,
    data,
  })
}
export function createOrUpdateGroup(data: any, guid?: string | undefined) {
  return axios({
    method: guid ? 'PUT' : 'POST',
    url: guid ? `custom-form/group/${guid}` : `custom-form/group`,
    data,
  })
}
export function deleteGroup(guid: string | undefined) {
  return axios({
    method: 'DELETE',
    url: `custom-form/group/${guid}`,
  })
}
