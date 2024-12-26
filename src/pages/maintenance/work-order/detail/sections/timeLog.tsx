import {Accordion} from '@components/Accordion'
import {ToastMessage} from '@components/toast-message'
import {IMG} from '@helpers'
import {getDetailWorkOrder, StartTimeLog, StopTimeLog} from '@pages/maintenance/Service'
import {savePreference} from '@redux'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import {ProgressBar} from 'react-bootstrap'
import {shallowEqual, useSelector} from 'react-redux'

interface TimeLogProps {
  detail: any
  user: any
}

let TimeLog: FC<TimeLogProps> = ({detail, user}) => {
  const preference: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {activeLogWO} = preference || {}
  const [data, setData] = useState<any>([])
  const [refreshBar, setRefreshBar] = useState<boolean>(true)
  const [tempDuration, setTempDuration] = useState<number>(0)
  const [tempDurationSecond, setTempDurationSecond] = useState<number>(0)
  const [play, setPlay] = useState<string>(activeLogWO?.guid ? 'stop' : 'start')

  useEffect(() => {
    if (detail?.guid !== undefined) {
      getDetailWorkOrder(detail?.maintenance_guid || detail?.guid || '').then(
        ({data: {data: res}}: any) => {
          if (res) {
            setData(res)
            const minute: any = moment(new Date('1970-01-01 ' + res?.time_log?.duration)).format(
              'mm'
            )
            const second: any = moment(new Date('1970-01-01 ' + res?.time_log?.duration)).format(
              'HH:mm:ss'
            )
            setTempDuration(parseInt(minute))
            setTempDurationSecond(moment.duration(second).asSeconds())
          }
        }
      )
    }
  }, [detail, play, activeLogWO])

  useEffect(() => {
    if (Object.keys(activeLogWO || {})?.length > 0) {
      const minute: any = moment(new Date('1970-01-01 ' + activeLogWO?.time_log?.duration)).format(
        'mm'
      )
      const second: any = moment(new Date('1970-01-01 ' + activeLogWO?.time_log?.duration)).format(
        'HH:mm:ss'
      )

      setTempDuration(parseInt(minute))
      setTempDurationSecond(moment.duration(second).asSeconds())
    }
  }, [activeLogWO])

  const startSop: any = (m: any, playState: any) => {
    setRefreshBar(false)
    if (play === 'start' || playState === 'start') {
      StartTimeLog(m?.maintenance_guid || m?.guid || '')
        .then(() => {
          setPlay('stop')
          savePreference({activeLogWO: m})
          setRefreshBar(true)
        })
        .catch((err: any) => {
          setRefreshBar(true)
          const {message} = err?.response?.data || {}
          ToastMessage({message, type: 'error'})
        })
    } else {
      StopTimeLog(m?.maintenance_guid || m?.guid || '')
        .then(() => {
          setPlay('start')

          const arrayDispatch: any = {}
          savePreference({activeLogWO: arrayDispatch})
          setRefreshBar(true)
        })
        .catch((err: any) => {
          setRefreshBar(true)
          const {message} = err?.response?.data || {}
          ToastMessage({message, type: 'error'})
        })
    }
  }

  const estimation = (duration: any) => {
    const {day, hour, minute} = duration || {}
    let res = 0
    if (duration) {
      res = res + day * 144
      res = res + hour * 60
      res = res + minute
    }
    return duration?.minute !== undefined ? res : duration || 0
  }

  const estimationSecond = (duration: any) => {
    const {day, hour, minute} = duration || {}
    let res = 0
    if (duration) {
      res = res + day * 144
      res = res + hour * 60
      res = res + minute * 60
    }
    return duration?.minute !== undefined ? res : duration || 0
  }

  return (
    <div className='card border border-gray-300 mb-4'>
      <div className='card-body align-items-center p-0'>
        <Accordion id='timeLog' default='log'>
          <div data-value='log' data-label='Time Log'>
            <div className='row'>
              <div className='col-12'>
                <div className='row overflow-auto' style={{maxHeight: '50vh'}}>
                  <div className='col-12 mt-4'>
                    <div className='d-flex align-items-center p-3 bg-light rounded'>
                      <div className=''>
                        <p className='mb-2 text-capitalize'>
                          <b>Original Estimate Time : </b> {estimation(data?.duration)}m
                        </p>
                        <h5 className='mb-3 text-capitalize'>Total Time Tracked</h5>
                        <h1 className='mb-3'>
                          {activeLogWO?.time_log?.duration ||
                            data?.time_log?.duration ||
                            '00:00:00'}
                        </h1>
                        {refreshBar && (
                          <>
                            {Object.keys(activeLogWO || {})?.length > 1 ? (
                              <ProgressBar
                                variant='primary'
                                now={(tempDuration / estimation(data?.duration)) * 100}
                                key={1}
                                style={{border: '2px solid #ddd'}}
                              />
                            ) : tempDurationSecond > estimationSecond(data?.duration) ? (
                              <ProgressBar
                                variant='warning'
                                now={(tempDuration / estimation(data?.duration)) * 100}
                                key={1}
                                style={{border: '2px solid #ddd'}}
                              />
                            ) : (
                              <ProgressBar
                                variant='success'
                                now={(tempDuration / estimation(data?.duration)) * 100}
                                key={1}
                                style={{border: '2px solid #ddd'}}
                              />
                            )}
                          </>
                        )}
                        <div className='d-flex align-items-center mt-2'>
                          <IMG
                            path={
                              data?.time_log?.users[0]?.photos[0]?.url !== undefined
                                ? data?.time_log?.users[0]?.photos[0]?.url
                                : user?.photos[0]?.url !== undefined
                                ? user?.photos[0]?.url
                                : '/images/blank.png'
                            }
                            className='h-20px rounded-circle me-2'
                          />
                          <p className='m-0 fw-bold'>
                            {data?.time_log?.users[0]?.first_name !== undefined
                              ? `${data?.time_log?.users[0]?.first_name || ''} ${
                                  data?.time_log?.users[0]?.last_name || ''
                                }`
                              : `${user?.first_name || ''} ${user?.last_name || ''}`}
                          </p>
                        </div>
                      </div>
                      <div className='ms-auto'>
                        {activeLogWO?.guid === data?.guid ? (
                          <div
                            className={`btn btn-icon
                                ${play === 'start' ? 'btn-success' : 'btn-danger'}
                                w-35px h-35px rounded-circle mr-3`}
                            onClick={() => startSop(data, play)}
                          >
                            <i className={`las la-${play === 'start' ? 'play' : 'stop'} fs-3`} />
                          </div>
                        ) : (
                          <div
                            className={`btn btn-icon btn-success w-35px h-35px rounded-circle mr-3`}
                            onClick={() => startSop(data, 'stop')}
                          >
                            <i className={`las la-play fs-3`} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Accordion>
      </div>
    </div>
  )
}

TimeLog = memo(TimeLog, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default TimeLog
