/* eslint-disable react-hooks/exhaustive-deps */
import {logout, savePreference} from '@redux'
import moment from 'moment'
import {FC, useCallback, useEffect, useRef, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIdleTimer} from 'react-idle-timer'
import {shallowEqual, useSelector} from 'react-redux'

const UserIdleTimer: FC<any> = () => {
  const timeout: number = 30
  const countdownTimer: any = 60
  const timeUnit: string = 'seconds'
  const idleTimer: any = useRef<any>(null)
  const [isVisibleSessionTimeout, setIsVisibleSessionTimeout] = useState<boolean>(false)
  const [isVisibleSessionTimedout, setIsVisibleSessionTimedout] = useState<boolean>(false)
  const [countdown, setCountdown] = useState<any>(countdownTimer)
  const [continued, setContinued] = useState<boolean>(false)
  const preference: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {userIdleTimer}: any = preference || {}

  const onLogout = useCallback(() => {
    logout()
    localStorage.removeItem('inactive')
    document.location.reload()
  }, [])

  const onActionUser = () => ''
  const onActiveUser = () => ''

  const onIdleUser = () => {
    setIntervaTimeout()
    setIsVisibleSessionTimeout(true)
  }

  const setIntervaTimeout = async () => {
    const currentDate: any = moment()
    if (!isVisibleSessionTimeout) {
      await savePreference({userIdleTimer: moment(currentDate).add(countdownTimer, timeUnit)})
    }
  }

  const continueSession = async () => {
    setContinued(true)
    await savePreference({userIdleTimer: undefined})
    setIntervaTimeout().then(() => setCountdown(countdownTimer))
  }

  useEffect(() => {
    if (userIdleTimer !== undefined) {
      if (countdown > 0) {
        setTimeout(() => {
          setCountdown(countdown - 1)
        }, 1000)
      }
      if (countdown === 0) {
        setIsVisibleSessionTimedout(true)
        setIsVisibleSessionTimeout(false)
        onLogout()
      }
    }
  }, [userIdleTimer, countdown, onLogout])

  useIdleTimer({
    ref: idleTimer,
    element: document,
    onActive: onActiveUser,
    onIdle: onIdleUser,
    onAction: onActionUser,
    debounce: 250,
    timeout: 1000 * 60 * timeout,
  })

  return (
    <>
      <Modal
        dialogClassName='modal-md'
        show={isVisibleSessionTimeout}
        onHide={() => {
          setIsVisibleSessionTimeout(false)
          continueSession()
        }}
      >
        <Modal.Header>
          <Modal.Title>Session Timeout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='px-4 mt-3 mb-3'>
            Your session will expire in {countdown} <br />
            Click <b>Continue session</b> to extend your session.
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className='btn-sm'
            variant='secondary'
            onClick={() => {
              setContinued(false)
              onLogout()
            }}
          >
            Logout now
          </Button>
          <Button
            className='btn-sm'
            variant='primary'
            onClick={() => {
              setIsVisibleSessionTimeout(false)
              continueSession()
            }}
          >
            Continue session
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal
        dialogClassName='modal-md'
        show={isVisibleSessionTimedout}
        onHide={() => {
          setIsVisibleSessionTimedout(false)
          !continued && onLogout()
        }}
      >
        <Modal.Header>
          <Modal.Title>Session Timed Out</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='px-4 mt-3 mb-3'>
            Your session has timed out and you have been logged off
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className='btn-sm'
            variant='secondary'
            onClick={() => {
              setIsVisibleSessionTimedout(false)
              setContinued(false)
              onLogout()
            }}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default UserIdleTimer
