import {configureStore, createSlice} from '@reduxjs/toolkit'
import Cookies from 'js-cookie'
import {
  // FLUSH,
  // PAUSE,
  // PERSIST,
  persistReducer,
  persistStore,
  // PURGE,
  // REGISTER,
  // REHYDRATE,
} from 'redux-persist'
import storageLocal from 'redux-persist/lib/storage'
import {CookieStorage} from 'redux-persist-cookie-storage'
import thunk from 'redux-thunk'

// Storage
export const storage: string = 'local' //cookie

// Original Reducer
const reducer = createSlice({
  name: 'user',
  initialState: {
    token: undefined,
    currentUser: {},
    preference: {},
  },
  reducers: {
    saveToken: (state: any, action: any) => {
      state.token = action?.payload
    },
    saveCurrentUser: (state: any, action: any) => {
      state.currentUser = {...state.currentUser, ...action?.payload}
    },
    savePreference: (state: any, action: any) => {
      let pref: any = action?.payload
      if (pref?.preference) {
        const prefUpdate: any = {
          ...(state?.preference?.preference || {}),
          ...(pref?.preference || {}),
        }
        pref = {...pref, ...{preference: prefUpdate}}
      }
      state.preference = {...state?.preference, ...pref}
    },
    logout: (state: any) => {
      state.token = undefined
      state.currentUser = {}
      state.preference = {}
      localStorage.clear()
    },
  },
})

// Persist Reducer
const persistedReducer = persistReducer(
  {
    key: 'auth',
    version: 1,
    whitelist: ['token', 'currentUser', 'preference'],
    storage:
      storage === 'cookie'
        ? new CookieStorage(Cookies, {
            expiration: {
              default: 100,
            },
          })
        : storageLocal,
  },
  reducer.reducer
)

// Store - Redux
export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk],
  // middleware: (getDefaultMiddleware: any) =>
  //   getDefaultMiddleware({
  //     serializableCheck: {
  //       ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  //     },
  //   }),
})

// Store - Persist
export const persistor = persistStore(store)

// Dispatcher
export const {
  saveToken: updateToken,
  saveCurrentUser: updateUser,
  savePreference: updatePreference,
  logout: logoutApp,
} = reducer?.actions

export const saveToken = (e: any) => store.dispatch(updateToken(e))
export const saveCurrentUser = (e: any) => store.dispatch(updateUser(e))
export const savePreference = (e: any) => store.dispatch(updatePreference(e))
export const logout = () => store.dispatch(logoutApp())
