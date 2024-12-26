import {generateUrlAPI} from '@helpers'
import {storage} from '@redux'
import ax from 'axios'
import Cookies from 'js-cookie'
import qs from 'qs'

const axios = ax.create({
  baseURL: generateUrlAPI('/'),
  withCredentials: false,
  headers: {
    Accept: 'application/json, text/plain, */*',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    // 'Access-Control-Max-Age': 0,
    // 'Cache-Control': 'no-cache',
  },
})

const authStore: any =
  storage === 'cookie' ? Cookies.get('persist:auth') : localStorage.getItem('persist:auth')
const token: any = JSON.parse(authStore || '{}')?.token?.replace(/"/g, '')
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
}
axios.interceptors.request.use(
  (req: any) => {
    if (req.method === 'get' && req?.params) {
      req.paramsSerializer = () =>
        qs.stringify(req.params, {
          encode: false,
          arrayFormat: 'brackets',
          indices: false,
          strictNullHandling: true,
          skipNulls: true,
        })
    }
    return req
  },
  (error: any) => Promise.reject(error)
)
axios.interceptors.response.use(
  (res: any) => res,
  (error: any) => Promise.reject(error)
)

export default axios
