import axios from '@api/axios'

export function checkout(data: any) {
  return axios({
    method: 'PUT',
    url: 'setting/owner/payment-method',
    data,
  })
}

export function getDataCheckout(data: any) {
  return axios({
    method: 'GET',
    url: 'setting/owner/payment-method',
    data,
  })
}

export function subscribeUpdate(data: any) {
  return axios({
    method: 'post',
    url: 'setting/owner/subscription',
    data,
  })
}

// eslint-disable-next-line sonarjs/no-identical-functions
export function subscribe(data: any) {
  return axios({
    method: 'post',
    url: 'setting/owner/subscription',
    data,
  })
}

export function getCheckoutPayment() {
  return axios({
    method: 'GET',
    url: 'setting/owner/payment',
  })
}

export function checkoutPaymentContant(data: any) {
  return axios({
    method: 'PUT',
    url: 'setting/owner/payment-contact',
    data,
  })
}

export function getPaymentContact() {
  return axios({
    method: 'GET',
    url: 'setting/owner/payment-contact',
  })
}

export function checkoutPayment(data: any) {
  return axios({
    method: 'PUT',
    url: 'setting/owner/payment',
    data,
  })
}
