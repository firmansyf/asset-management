import axios from '@api/axios'

const API_URL = process.env.REACT_APP_API_URL

export const GET_USER_BY_ACCESSTOKEN_URL = `${API_URL}/users`
export const LOGIN_URL = `${API_URL}/login`
export const GOOGLE_LOGIN_URL = `${API_URL}/login/google`
// export const GET_USER_BY_ACCESSTOKEN_URL = 'https://petronasnew2.be.assetd.xyz/api/v1/a/me'
// export const LOGIN_URL = 'https://petronasnew2.be.assetd.xyz/api/v1/a/hash-login'
export const REGISTER_URL = `${API_URL}/register`
export const REQUEST_PASSWORD_URL = `${API_URL}/forget_password` //forgot_password
export const STORE_PASSWORD_URL = `${API_URL}/reset_password` //forgot_password

// Server should return AuthModel
export function login(data: any) {
  return axios({
    method: 'POST',
    url: LOGIN_URL,
    data,
  })
}
// Server should return AuthModel
export function loginByGoogle(data: any) {
  return axios({
    method: 'POST',
    url: GOOGLE_LOGIN_URL,
    data,
  })
}

// Server should return AuthModel
export function register(data: any) {
  return axios({
    method: 'POST',
    url: REGISTER_URL,
    data,
  })
}

// Server should return object => { result: boolean } (Is Email in DB)
export function requestPassword(email: string) {
  return axios.post<{result: boolean}>(REQUEST_PASSWORD_URL, {
    email,
  })
}

// Server should return object => { result: boolean } (Is Email in DB)
export function resetPassword(params: any) {
  return axios.post<{result: boolean}>(STORE_PASSWORD_URL, params)
}

export function getUserByToken(user_id: any, token: string) {
  return axios({
    method: 'GET',
    url: GET_USER_BY_ACCESSTOKEN_URL + `/${user_id}`,
    headers: {Authorization: token},
  })
}
