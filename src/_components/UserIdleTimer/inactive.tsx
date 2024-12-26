import {logout, savePreference} from '@redux'
import moment from 'moment'
import {FC, memo, useCallback, useEffect, useRef, useState} from 'react'
import {useIdleTimer} from 'react-idle-timer'
import {shallowEqual, useSelector} from 'react-redux'

let UserInactiveTimer: FC<any> = () => {
  const currentDate: any = moment()
  const inactiveTimer = useRef<any>(null)
  const [inactiveTime, setInactiveTime] = useState<any>(
    localStorage.getItem('inactive') ? new Date(localStorage.getItem('inactive') || '') : undefined
  )

  const preference: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {userIdleTimer} = preference || {}

  const onLogout = useCallback(() => {
    localStorage.removeItem('inactive')
    logout()
    document.location.reload()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onActionUser = () => ''
  const onActiveUser = () => ''

  const onInactiveUser = () => {
    localStorage.removeItem('inactive')
    localStorage.setItem('inactive', currentDate)
    setInactiveTime(currentDate)

    if (inactiveTime !== null) {
      savePreference({userInactiveTimer: inactiveTime})
    }
  }

  useEffect(() => {
    if (inactiveTime !== null && userIdleTimer === null) {
      const start = moment(inactiveTime)
      const end = moment(currentDate)
      const duration = moment.duration(end.diff(start))
      const diff = duration.asMinutes()

      if (Math.ceil(diff) > 30) {
        onLogout()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userIdleTimer, inactiveTime, currentDate])

  useIdleTimer({
    ref: inactiveTimer,
    element: document,
    onActive: onActiveUser,
    onIdle: onInactiveUser,
    onAction: onActionUser,
    debounce: 250,
    timeout: 3000,
  })

  return null
}

UserInactiveTimer = memo(
  UserInactiveTimer,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default UserInactiveTimer
