import {updateTimer} from '@pages/help-desk/ticket/Service'
import {savePreference} from '@redux'
import cx from 'classnames'
import moment from 'moment'
import {FC, useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'

const Index: FC<any> = () => {
  const preference: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {activeLog} = preference || {}
  const [data, setData] = useState<any>({})
  const [counter, setCounter] = useState<any>(0)
  useEffect(() => {
    const hitUpdate = 5
    const timerInterval = setInterval(() => {
      if (activeLog?.guid) {
        const times: any = activeLog?.time?.split(':')
        const dataLog: any = {
          ...(activeLog?.guid ? activeLog : {}),
          time: moment()
            .set({hour: times[0], minute: times[1], second: times[2]})
            .add(1, 's')
            .format('HH:mm:ss'),
        }
        savePreference({activeLog: dataLog})
        setData(() => {
          setCounter((prev: number) => (prev >= hitUpdate ? 0 : prev + 0.5))
          return dataLog
        })
      }
    }, 1000)
    if (!activeLog?.guid) {
      clearInterval(timerInterval)
      setData({})
      setCounter(0)
    }
    return () => {
      clearInterval(timerInterval)
    }
  }, [activeLog])

  useEffect(() => {
    if (counter >= 4.5 && data?.guid) {
      updateTimer(data?.guid, {time: data?.time})
    }
  }, [data?.guid, data?.time, counter])

  return (
    <div
      className={cx('position-fixed top-0 w-50 w-md-25 text-center mt-2 radius-50 shadow-lg', {
        'd-none': !data?.guid,
      })}
      style={{zIndex: 999, left: '50%', transform: 'translateX(-50%)'}}
    >
      <div className='d-flex align-items-center radius-50 bg-primary text-white p-2'>
        <div className='fw-bolder text-capitalize text-truncate ps-2'>{data?.name}</div>
        <div className='fw-bolder ms-auto me-2'>{data?.time}</div>
        <div
          className='btn btn-icon bg-danger w-25px h-25px radius-50 p-1'
          onClick={() => {
            savePreference({activeLog: {}})
            setData({})
          }}
        >
          <i className='las la-stop text-white fs-3' />
        </div>
      </div>
    </div>
  )
}

export default Index
