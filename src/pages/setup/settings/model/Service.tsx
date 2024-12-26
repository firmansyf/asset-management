import axios from '@api/axios'

export function editModel(params: any, id: any) {
  return axios({
    method: 'put',
    url: 'setting/manufacturer/model/' + id,
    data: params,
  })
}

export function addModel(params: any) {
  return axios({
    method: 'post',
    url: 'setting/manufacturer/model',
    data: params,
  })
}

export function getModel(params: any, filtermanufacturer?: any) {
  if (filtermanufacturer) {
    params['filter[manufacturer_guid]'] = filtermanufacturer
  }

  return axios({
    method: 'get',
    url: 'setting/manufacturer/model/filter',
    params,
  })
}

export function deleteModel(id: string) {
  return axios({
    method: 'delete',
    url: 'setting/manufacturer/model/' + id,
  })
}

export function deleteBulkModel(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'bulk-delete/manufacturer-model',
  })
}

export function getDetailModel(id: string) {
  return axios({
    method: 'get',
    url: 'setting/manufacturer/model/' + id,
  })
}

export function exportModel(params: any) {
  return axios({
    method: 'post',
    params,
    url: 'setting/manufacturer/model/export',
  })
}

export function getModelOptionsColumns(params: any) {
  return axios({
    method: 'get',
    url: 'setting/manufacturer/model/option',
    params,
  })
}
