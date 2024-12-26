import axios from '@api/axios'

export function addReservation(data: any, inventoryGuid: any) {
  return axios({
    method: 'post',
    url: `inventory/add-reservation/${inventoryGuid}`,
    data,
  })
}

export function editReservation(data: any, reservationGuid: any) {
  return axios({
    method: 'put',
    url: `inventory/reservation/${reservationGuid}`,
    data,
  })
}

export function getReservation(params: any, inventory_guid: any) {
  return axios({
    method: 'get',
    url: 'inventory/' + inventory_guid + '/reservation',
    params,
  })
}

export function cancelReservation(reservationGuid: any) {
  return axios({
    method: 'delete',
    url: `inventory/reservation/${reservationGuid}`,
  })
}

export function detailReservation(reservationGuid: any) {
  return axios({
    method: 'get',
    url: `inventory/reservation/${reservationGuid}`,
  })
}
