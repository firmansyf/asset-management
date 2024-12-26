import axios from '@api/axios'

export function getSubLocation(params: any) {
  return axios({
    method: 'get',
    params,
    url: 'location-sub/filter?',
  })
}

export function deleteSubLocation(id: any) {
  return axios({
    method: 'delete',
    url: 'location-sub/' + id,
  })
}

export function addSubLocation(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'location-sub',
  })
}

export function editSubLocation(params: any, id: any) {
  return axios({
    method: 'put',
    data: params,
    url: 'location-sub/' + id,
  })
}

export function deleteBulkSubLocation(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'bulk-delete/location-sub',
  })
}

export function exportSubLocation(params: any) {
  return axios({
    method: 'post',
    params,
    url: 'location-sub/export?',
  })
}

export function getSubLocationDetail(guid: any) {
  return axios({
    method: 'get',
    url: 'location-sub/' + guid,
  })
}

export function getOptionsColumns(params: any) {
  return axios({
    method: 'get',
    url: 'location-sub/option',
    params,
  })
}
