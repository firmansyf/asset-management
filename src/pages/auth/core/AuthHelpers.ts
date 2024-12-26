const TOKEN_KEY = 'token'
const getToken = () => {
  if (!localStorage) {
    return
  }
  const token: any = localStorage.getItem(TOKEN_KEY)
  if (!token) {
    return
  }
  try {
    if (token) {
      return token
    }
  } catch (_err: any) {
    new Error('TOKEN LOCAL STORAGE PARSE ERROR')
  }
}

const setToken = (token: any) => {
  if (!localStorage) {
    return
  }
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch (_err: any) {
    new Error('TOKEN LOCAL STORAGE SAVE ERROR')
  }
}

const removeToken = () => {
  if (!localStorage) {
    return
  }
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch (_err: any) {
    new Error('TOKEN LOCAL STORAGE REMOVE ERROR')
  }
}

export function setupAxios(axios: any) {
  axios.defaults.headers.Accept = 'application/json'
  axios.interceptors.request.use(
    (config: {headers: {Authorization: string}}) => {
      const token = getToken()
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    },
    (err: any) => Promise.reject(err)
  )
}

export {getToken, removeToken, setToken, TOKEN_KEY}
