import {Alert} from '@components/alert'
import {CalendarWidget} from '@components/calendar/Calendar'
import {ToastMessage} from '@components/toast-message'
import {errorValidation, preferenceDate} from '@helpers'
import {getReservationByDate} from '@pages/inventory/redux/InventoryCRUD'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import {useLocation} from 'react-router-dom'

import {ModalReservation} from '../modal-reservation'
import {DetailReservation} from '../modal-reservation/detail'
import {cancelReservation, editReservation} from '../modal-reservation/Service'

const ActionBtn: FC<any> = ({onClick, fa, variant}) => {
  return (
    <div
      data-cy={'btnReservation' + variant}
      className={`d-flex align-items-center justify-content-center h-25px w-25px border border-${
        variant || 'primary'
      } p-1 mx-1 cursor-pointer`}
      style={{borderRadius: 100}}
      onClick={onClick}
    >
      <i className={`fa fa-${fa || 'eye'} text-${variant || 'primary'}`} />
    </div>
  )
}

let Reservation: FC<any> = ({data, reloadReservation, setReloadReservation}) => {
  const {hash}: any = useLocation()
  const pref_date: any = preferenceDate()

  const [detail, setDetail] = useState<any>({})
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [eventCalendar, setEventCalendar] = useState<any>([])
  const [dataReservation, setDataReservation] = useState<any>([])
  const [showModalReservation, setShowModalReservation] = useState<boolean>(false)
  const [showModalDetailReservation, setShowModalDetailReservation] = useState<boolean>(false)
  const [showModalCancelReservation, setShowModalCancelReservation] = useState<boolean>(false)
  const [month, setMonth] = useState<any>({
    start: moment().startOf('month').format('YYYY-MM-DD'),
    end: moment().endOf('month').format('YYYY-MM-DD'),
  })

  useEffect(() => {
    const {guid} = data || {}
    if (guid) {
      const from_date: string | undefined = moment().startOf('year').format('YYYY-MM-DD')
      const to_date: string | undefined = moment().endOf('year').format('YYYY-MM-DD')
      getReservationByDate({from_date, to_date}, guid).then(({data: {data: res}}) => {
        if (res) {
          setDataReservation(res)
          const dataRes: any = res?.map((m: any) => {
            const {user_name: title, from_date: start, to_date}: any = m || {}

            return {
              original: m,
              title,
              start: moment(start).format('YYYY-MM-DD'),
              end: moment(to_date).add(1, 'days').format('YYYY-MM-DD'),
            }
          })
          setEventCalendar(dataRes as never[])
        }
      })
    }
  }, [data, reloadReservation])

  const updateReservation = (e: any) => {
    const {start, end, extendedProps}: any = e || {}
    const {original}: any = extendedProps || {}
    const values: any = original || {}

    start && (values.from_date = start)
    end &&
      (values.to_date = moment(end || '')
        ?.subtract(1, 'days')
        ?.format('YYYY-MM-DD'))

    editReservation(values, values?.guid)
      .then(({data: {message}}: any) => {
        ToastMessage({type: 'success', message})
        setReloadReservation(reloadReservation + 1)
      })
      .catch((err: any) => {
        Object.values(errorValidation(err))?.map((message: any) =>
          ToastMessage({type: 'error', message})
        )
      })
  }

  const confirmCancelReservation = () => {
    const {guid} = detail || {}
    cancelReservation(guid).then(({data: {message}}: any) => {
      setShowModalCancelReservation(false)
      ToastMessage({type: 'success', message})
      setReloadReservation(reloadReservation + 1)
    })
  }

  useEffect(() => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 2000)
  }, [hash])

  return (
    <>
      {isLoading ? (
        <div className='d-flex h-350px flex-center'>
          <span className='indicator-progress d-block text-center'>
            <span className='spinner-border spinner-border-sm w-50px h-50px align-middle'></span>
            <div className='mt-2 text-gray-500'>Please wait...</div>
          </span>
        </div>
      ) : (
        <>
          <div className='row pt-10 pb-5'>
            <div className='col-11 mx-10'>
              <CalendarWidget
                editable={true}
                events={eventCalendar}
                onSelectDate={(e: any) => e}
                onEventChange={updateReservation}
                onChangeMonth={(e: any) => {
                  setMonth({
                    start: e?.startOf('month')?.format('YYYY-MM-DD'),
                    end: e?.endOf('month')?.format('YYYY-MM-DD'),
                  })
                }}
                onEventClick={({extendedProps: {original}}: any) => {
                  original && setDetail(original)
                  setShowModalReservation(true)
                }}
              />
            </div>
          </div>

          <div className='row py-5 px-10'>
            <div className='col-12'>
              <span className='text-primary fw-bolder h2'>
                {moment(month?.start || '')?.format('YYYY')}
              </span>
              <hr />
            </div>

            {Array.isArray(dataReservation) &&
              dataReservation?.map((item: any, index: number) => (
                <div
                  className='col-12 my-2'
                  key={index}
                  onMouseEnter={() => {
                    setEventCalendar(
                      eventCalendar?.map((event: any) => {
                        const {
                          original: {guid},
                        }: any = event
                        event.backgroundColor = guid === item?.guid ? 'red' : null
                        event.borderColor = guid === item?.guid ? 'red' : null
                        return event
                      })
                    )
                  }}
                  onMouseLeave={() => {
                    setEventCalendar(
                      eventCalendar?.map((event: any) => {
                        event.backgroundColor = null
                        event.borderColor = null
                        return event
                      })
                    )
                  }}
                >
                  <div
                    className='d-flex align-items-center justify-content-between bg-light p-2'
                    style={{borderRadius: 10}}
                  >
                    <div className='px-1 fw-bolder'>{item?.user_name}</div>
                    <div className='d-flex'>
                      <ActionBtn
                        variant='primary'
                        fa='eye'
                        onClick={() => {
                          setDetail(item)
                          setShowModalDetailReservation(true)
                        }}
                      />
                      <ActionBtn
                        variant='warning'
                        fa='pencil-alt'
                        onClick={() => {
                          setDetail(item)
                          setShowModalReservation(true)
                        }}
                      />
                      <ActionBtn
                        variant='danger'
                        fa='trash'
                        onClick={() => {
                          setDetail(item)
                          setShowModalCancelReservation(true)
                        }}
                      />
                    </div>
                  </div>
                  <div className='d-flex align-items-center justify-content-end fw-normal fs-9 text-end text-gray-700 mt-1 mb-2'>
                    <div className=''>{moment(item?.from_date).format(pref_date)}</div>
                    <div className='mx-2'>-</div>
                    <div className=''>{moment(item?.to_date).format(pref_date)}</div>
                  </div>
                </div>
              ))}
          </div>
        </>
      )}

      <ModalReservation
        detail={detail}
        inventory={data}
        reserved={dataReservation}
        showModal={showModalReservation}
        setShowModal={setShowModalReservation}
        reloadReservation={reloadReservation}
        setReloadReservation={setReloadReservation}
      />

      <DetailReservation
        detail={detail}
        reloadReservation={reloadReservation}
        showModal={showModalDetailReservation}
        setShowModal={setShowModalDetailReservation}
      />

      <Alert
        loading={false}
        type={'cancel'}
        confirmLabel={'Yes'}
        title={'Cancel Reservation'}
        showModal={showModalCancelReservation}
        setShowModal={setShowModalCancelReservation}
        onConfirm={() => confirmCancelReservation()}
        body={'Are you sure you want to cancel this Reservation ?'}
        onCancel={() => setShowModalCancelReservation(false)}
      />
    </>
  )
}

Reservation = memo(
  Reservation,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {Reservation}
