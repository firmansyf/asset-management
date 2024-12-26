import {StopTimeLog} from '@pages/maintenance/Service'
import {savePreference} from '@redux'
import cx from 'classnames'
import moment from 'moment'
import {FC, useEffect, useState} from 'react' //useCallback,
import {shallowEqual, useSelector} from 'react-redux'

const Index: FC<any> = () => {
  const preference: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {activeLogWO} = preference || {}
  const [data, setData] = useState<any>({})

  useEffect(() => {
    const timerInterval = setInterval(() => {
      if (activeLogWO?.guid) {
        const times: any = activeLogWO?.time_log?.duration?.split(':')
        const dataLog: any = {
          ...(activeLogWO?.guid ? activeLogWO : {}),
          time_log: {
            duration: moment()
              .set({hour: times[0], minute: times[1], second: times[2]})
              .add(1, 's')
              .format('HH:mm:ss'),
          },
        }
        savePreference({activeLogWO: dataLog})
        setData(() => dataLog)
      }
    }, 1000)
    if (!activeLogWO?.guid) {
      clearInterval(timerInterval)
      setData({})
    }
    return () => {
      clearInterval(timerInterval)
    }
  }, [activeLogWO])

  const stopPopupTimer = () => {
    StopTimeLog(data?.guid)
      .then(() => {
        savePreference({activeLogWO: {}})
        setData({})
      })
      .catch(() => '')
  }

  return (
    <div
      className={cx('position-fixed top-0 w-50 w-md-25 text-center mt-2 radius-50 shadow-lg', {
        'd-none': !data?.guid,
      })}
      style={{zIndex: 999, left: '50%', transform: 'translateX(-50%)'}}
    >
      <div className='d-flex align-items-center radius-50 bg-primary text-white p-2'>
        <div className='fw-bolder text-capitalize text-truncate ps-2'>{`${data?.wo_id} : ${data?.wo_title}`}</div>
        <div className='fw-bolder ms-auto me-2'>{data?.time_log?.duration}</div>
        <div
          className='btn btn-icon bg-danger w-25px h-25px radius-50 p-1'
          onClick={stopPopupTimer}
        >
          <i className='las la-stop text-white fs-3' />
        </div>
      </div>
    </div>
  )
}

export default Index
