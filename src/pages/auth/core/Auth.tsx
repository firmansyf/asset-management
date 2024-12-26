// import qs from 'qs'
import {createContext, FC, useContext, useState} from 'react'

// import {LayoutSplashScreen} from '@metronic/layout/core'
import * as authHelper from './AuthHelpers'
import * as preferenceHelper from './PreferenceHelpers'
import * as userHelper from './UserHelpers'

const initAuthContextPropsState = {
  token: authHelper.getToken(),
  saveToken: undefined,
  currentUser: userHelper.getCurrentUser() || {},
  setCurrentUser: () => ({}),
  preference: preferenceHelper.getPreference() || {},
  setPreference: () => ({}),
  logout: () => '',
}

const AuthContext = createContext<any>(initAuthContextPropsState)

const useStore = () => useContext(AuthContext)

const AuthProvider: FC<any> = ({children}) => {
  const [token, setToken] = useState<any>(authHelper.getToken())
  const [currentUser, setCurrentUser] = useState<any>(userHelper.getCurrentUser())
  const [preference, setPreference] = useState<any>(preferenceHelper.getPreference())
  const saveToken = async (token: any) => {
    setToken(token)
    if (token) {
      authHelper.setToken(token)
    } else {
      authHelper.removeToken()
    }
  }
  const saveCurrentUser = (user: any) => {
    setCurrentUser((prev: any) => ({...prev, ...user}))
    if (user) {
      userHelper.setCurrentUser({...(currentUser || {}), ...user})
    } else {
      userHelper.removeCurrentUser()
    }
  }
  const savePreference = (pref: any) => {
    if (pref?.preference) {
      const prefUpdate: any = {...(preference?.preference || {}), ...(pref?.preference || {})}
      pref = {...pref, ...{preference: prefUpdate}}
    }
    setPreference((prev: any) => ({...prev, ...pref}))
    if (pref) {
      preferenceHelper.setPreference({...(preference || {}), ...pref})
    } else {
      preferenceHelper.removePreference()
    }
  }

  const logout = () => {
    saveToken(undefined)
    saveCurrentUser(undefined)
    savePreference(undefined)
    localStorage.clear()
    // setTimeout(() => {
    //   const search: any = qs.stringify(
    //     {request: btoa(window.location.pathname || '/')},
    //     {encode: false}
    //   )
    //   window.location.href = `/auth/login?${search}`
    // }, 100)
  }

  return (
    <AuthContext.Provider
      value={{token, saveToken, currentUser, saveCurrentUser, preference, savePreference, logout}}
    >
      {children}
    </AuthContext.Provider>
  )
}

export {AuthProvider, useStore}
