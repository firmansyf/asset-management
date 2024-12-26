import axios from '@api/axios'

export function getCustomForm() {
  return axios({
    method: 'get',
    url: `custom-form/inventory`,
  })
}

export const getInventoryDetail = (id: any) => axios(`inventory/${id}`)

export const addEditInventory = (data: any, id?: any, isClone?: boolean) => {
  const chooseMenthod: any = id ? 'put' : 'post'
  const chooseUrl: any = isClone ? '/duplicate' : ''
  return axios({
    method: isClone ? 'post' : chooseMenthod,
    url: id ? `inventory/${id}${chooseUrl}` : 'inventory',
    data,
  })
}
