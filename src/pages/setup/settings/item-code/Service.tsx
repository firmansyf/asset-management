import axios from '@api/axios'

export function addItemCode(params: any) {
  return axios({
    method: 'post',
    url: 'setting/itemcode',
    data: params,
  })
}

export function editItemCode(params: any, id: any) {
  return axios({
    method: 'put',
    url: 'setting/itemcode/' + id,
    data: params,
  })
}

export function getItemCode(params: object) {
  return axios({
    method: 'get',
    url: 'setting/itemcode',
    params,
  })
}

export function deleteItemCode(id: string) {
  return axios({
    method: 'delete',
    url: 'setting/itemcode/' + id,
  })
}

export function deleteBulkItemCode(params: any) {
  return axios({
    method: 'post',
    data: params,
    url: 'setting/itemcode/bulk-delete',
  })
}

export function getDetailItemCode(id: string) {
  return axios({
    method: 'get',
    url: 'setting/itemcode/' + id,
  })
}

export function exportItemCode(params: object) {
  return axios({
    method: 'post',
    params,
    url: 'setting/itemcode/export',
  })
}

export function getColumn() {
  return axios({
    method: 'get',
    url: `setting/itemcode/setup-column`,
  })
}

export function updateColumn(data: any) {
  return axios({
    method: 'post',
    data,
    url: `setting/itemcode/setup-column`,
  })
}

export function getItemCodeOptionsColumns(params: any) {
  return axios({
    method: 'get',
    url: 'setting/itemcode/option',
    params,
  })
}
