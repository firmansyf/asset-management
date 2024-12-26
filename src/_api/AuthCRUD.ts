import axios from '@api/axios'
import {API, PROTOCOL} from '@api/server'
import {generateUrl} from '@helpers'

export const key = 'BRnroYADsk'
export const key2 = 'YADsk'

// Server should return AuthModel
export function login(email: string, password: string) {
  // const en_pass = window.btoa(`${password}+${key}!`)
  const params = {
    email: email,
    // expire: 12 * 60, // 12 hours
    // type: 'automatic',
    password, //window.btoa(`${en_pass}+${key2}!!`),
  }

  return axios.post('a/login', params)
}

export function logout() {
  return axios({
    method: 'delete',
    url: 'a/logout',
  })
}

export function setPassword(password: string, password_confirm: string) {
  const urlParams = new URLSearchParams(window.location.search)
  const token_url = urlParams.get('token')
  const email_url = urlParams.get('email')
  const state_url = urlParams.get('state')
  const remember_token = urlParams.get('remember_token')
  const params = {
    password,
    password_confirm,
    email: email_url,
    state: state_url,
    remember_token,
  }
  return axios({
    method: 'put',
    url: 'a/password',
    data: params,
    headers: {
      Authorization: `Bearer ${token_url}`,
    },
  })
}

export function register(params: any) {
  return axios({
    method: 'post',
    url: `${PROTOCOL}${API.substring(1)}tenant`,
    data: params,
  })
}

export function forgotPassword(email: any) {
  return axios({
    method: 'post',
    url: 'a/password',
    data: {
      email,
      return_ok_url: generateUrl('set-password'),
    },
  })
}

export function requestPassword(email: string) {
  return axios.post<{result: boolean}>('forgot-password', {email})
}

export function getUserFromLogin(accessToken: any) {
  return axios({
    method: 'get',
    url: 'a/me',
    headers: {Authorization: 'Bearer ' + accessToken},
  })
}

export function getUserByToken() {
  return axios({
    method: 'get',
    url: 'a/me',
  })
}

export function updateUserProfile(params: any) {
  return axios({
    method: 'put',
    url: 'a/me',
    data: params,
  })
}

export function checkTenant(tenant: any) {
  return axios({
    method: 'get',
    url: `${PROTOCOL}${API.substring(1)}tenant/${tenant}`,
  })
}

export function expiredRegister(tenant: any) {
  return axios({
    method: 'post',
    url: 'api/v1/tenant/' + tenant + '/resend-activation',
    data: {
      return_ok_url: 'required',
      return_fail_url: 'nullable',
    },
  })
}

export function getPlanRegister(params: any) {
  return axios({
    method: 'get',
    url: `${PROTOCOL}${API.substring(1)}plan?${params}`,
  })
}

export function changePasswordExpiry(params: any) {
  return axios({
    method: 'put',
    url: `a/me/password-expiry`,
    data: params,
  })
}

export function checkTwoFactorAuth(params: any, accessToken: any) {
  return axios({
    method: 'post',
    url: `a/verification-code`,
    data: params,
    headers: {Authorization: 'Bearer ' + accessToken},
  })
}

export function countdownTwoFactorAuth(accessToken: any) {
  return axios({
    method: 'get',
    url: `a/show-time-otp`,
    headers: {Authorization: 'Bearer ' + accessToken},
  })
}

export function resendTwoFactorAuth(accessToken: any) {
  return axios({
    method: 'post',
    url: `a/resend-otp`,
    headers: {Authorization: 'Bearer ' + accessToken},
  })
}
