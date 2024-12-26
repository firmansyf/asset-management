import {logout} from '@redux'
import {initializeApp} from 'firebase/app'
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import {
  getDatabase,
  onChildChanged,
  onChildRemoved,
  onValue,
  ref,
  set,
  update,
} from 'firebase/database'
import {FC, memo, useEffect} from 'react'
import {shallowEqual, useSelector} from 'react-redux'

const config: any = {
  apiKey: 'AIzaSyDWam4n4rMVZ30iI_C3acnu8jBGg4MkBX4',
  authDomain: 'assetdata-9fab2.firebaseapp.com',
  databaseURL: 'https://assetdata-9fab2-default-rtdb.firebaseio.com',
  projectId: 'assetdata-9fab2',
  storageBucket: 'assetdata-9fab2.appspot.com',
  messagingSenderId: '1084279978825',
  appId: '1:1084279978825:web:1f9789ec9a43749b9df898',
  measurementId: 'G-D991QZECS7',
}

const init: any = initializeApp(config)
const auth: any = getAuth(init)

export const dispatchFireBase: any = (path: string, params = {}) => {
  if (path && Object.keys(params)) {
    const db: any = getDatabase(init)
    const target: any = ref(db, path)
    update(target, params)
    return true
  } else {
    return false
  }
}

let Firebase: FC<any> = ({children = null, trigger, fromTenant, onChange}) => {
  const currentUser: any = useSelector(({currentUser}: any) => currentUser, shallowEqual)
  const {guid, email} = currentUser || {}

  useEffect(() => {
    signInWithEmailAndPassword(auth, email, 'firebase')
      .then(({user}: any) => {
        const {app}: any = user?.auth || {}
        if (guid) {
          const db: any = getDatabase(app)
          const {hostname}: any = window?.location || undefined
          const tenant: any = hostname?.split('.')[0] || undefined

          const user_db: any = ref(db, `user_guid/${guid}`)
          const tenant_db: any = ref(db, `tenants/${tenant}`)

          // TRIGGER DELETE USER / TENANT
          onValue(
            user_db,
            (e: any) => {
              if (trigger === 'deleted_at' && e?.hasChild('deleted_at')) {
                logout()
                set(user_db, {})
                window?.location?.reload()
              }
              if (!e.exists() || !e?.hasChild('email') || !e?.hasChild('tenant')) {
                setTimeout(() => {
                  update(ref(db, 'user_guid'), {[guid]: {email, tenant}})
                }, 3000)
              }
            },
            {onlyOnce: false}
          )

          onValue(
            tenant_db,
            (e: any) => {
              if (trigger === 'deleted_at' && e?.hasChild('deleted_at')) {
                logout()
                set(tenant_db, {})
                window?.location?.reload()
              }
            },
            {onlyOnce: false}
          )

          // USER TRIGGER
          if (trigger && !fromTenant) {
            onChildChanged(user_db, (e: any) => {
              if (e?.key === trigger) {
                onChange && onChange(e?.val())
              }
            })
            onChildRemoved(user_db, (e: any) => {
              if (e?.key === trigger) {
                onChange && onChange(e?.val())
              }
            })
          }

          // TENANT TRIGGER
          if (trigger && fromTenant) {
            onChildChanged(tenant_db, (e: any) => {
              if (e?.key === trigger) {
                onChange && onChange(e?.val())
              }
            })
            onChildRemoved(tenant_db, (e: any) => {
              if (e?.key === trigger) {
                onChange && onChange(e?.val())
              }
            })
          }
        }
      })
      .catch((err: any) => {
        const message: any = err || {}
        if (message?.toString()?.match(/user-not-found/gi)?.length) {
          createUserWithEmailAndPassword(auth, email, 'firebase')
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [guid, email, trigger, fromTenant, onChange])
  return children
}

Firebase = memo(Firebase, (prev: any, next: any) => prev?.trigger === next?.trigger)
export {Firebase}
