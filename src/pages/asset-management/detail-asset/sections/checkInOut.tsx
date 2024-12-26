import {Title as CardTitle} from '@components/form/Title'
import {hasPermission, preferenceDate} from '@helpers'
import {checkoutDetail} from '@pages/asset-management/redux/CheckInOutRedux'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'

import CheckInOutModal from '../modal-check-in-out/checkInOutModal'
import ExtendCheckoutModal from '../modal-check-in-out/extendCheckoutModal'
import HistoryCheckInOut from '../modal-check-in-out/HistoryCheckInOut'

let CheckInOut: FC<any> = ({data, setReload, isFeature}) => {
  const pref_date: any = preferenceDate()

  const [type, setType] = useState<any>()
  const [name, setName] = useState<any>()
  const [showModalCheckInOut, setShowModalCheckInOut] = useState<boolean>(false)
  const [showModalExtendCheckout, setShowModalExtendCheckout] = useState<boolean>(false)
  const [showModalHistoryCheckInOut, setShowModalHistoryCheckInOut] = useState<boolean>(false)

  const checkInOutAction = (action: string) => {
    setType(action)
    setShowModalCheckInOut(true)
  }

  useEffect(() => {
    if (data?.asset_checkout?.guid) {
      checkoutDetail(data?.asset_checkout?.guid).then(({data: {data}}: any) => {
        setName(
          data?.employee?.name ||
            data?.location?.name ||
            data?.department?.name ||
            data.assigned_user?.name ||
            ''
        )
      })
    }
  }, [data?.asset_checkout?.guid])

  return (
    <div className='mb-6'>
      <div
        className='card bg-white border border-gray-200 border-2 h-100'
        data-cy='card-check-in-out'
      >
        <div className='card-header align-items-center px-4 position-relative'>
          <div className='card-header align-items-center px-0 pt-4'>
            <div>
              <CardTitle
                title='Check Out/In'
                sticky={false}
                icon={''}
                uppercase={false}
                space='0'
              />
            </div>
            <div className='w-100 mb-3' style={{lineHeight: 1}}>
              <small className='text-muted'>Status : </small>
              <small className='text-dark fw-bolder text-capitalize'>
                {data?.asset_checkout
                  ? `Checked out ${name ? `to ${name}` : ''}`
                  : data?.checkin_status}
              </small>
            </div>
          </div>
          <div className='position-absolute bottom-0 end-0 px-3 py-1'>
            <u
              className='cursor-pointer text-primary fw-bold'
              onClick={() => setShowModalHistoryCheckInOut(true)}
            >
              History
            </u>
          </div>
        </div>
        <div className='card-body px-4 py-3'>
          <div className='my-4 text-center'>
            {data?.asset_checkout ? (
              <>
                {hasPermission('asset-management.check') && isFeature?.asset_checkin === 1 ? (
                  <div className='btn btn-sm btn-success' onClick={() => checkInOutAction('in')}>
                    Check In
                  </div>
                ) : (
                  <button
                    disabled
                    className='btn btn-sm btn-secondary'
                    onClick={() => checkInOutAction('in')}
                  >
                    Check In
                  </button>
                )}
              </>
            ) : (
              <>
                {hasPermission('asset-management.check') && isFeature?.asset_checkin === 1 ? (
                  <div
                    className='btn btn-sm btn-danger'
                    data-cy='btnCheckout'
                    onClick={() => checkInOutAction('out')}
                  >
                    Check Out
                  </div>
                ) : (
                  <button disabled className='btn btn-sm btn-secondary'>
                    Check Out
                  </button>
                )}
              </>
            )}
          </div>
          {data?.asset_checkout && (
            <>
              <div className='d-flex align-items-end justify-content-between'>
                <div className=''>
                  <p className='m-0 small'>Due Date :</p>
                  <p className='m-0 fw-bolder'>
                    {data?.asset_checkout?.due_date
                      ? data?.asset_checkout?.due_date.split(' ')?.[0] &&
                        moment(data?.asset_checkout?.due_date.split(' ')?.[0]).format(pref_date)
                      : '-'}
                  </p>
                </div>
              </div>
              <div className='d-flex align-items-end justify-content-between'>
                <div className=''>
                  <p className='m-0 small'>Checkout Date :</p>
                  <p className='m-0 fw-bolder'>
                    {data?.asset_checkout?.checkout_date
                      ? data?.asset_checkout?.checkout_date.split(' ')?.[0] &&
                        moment(data?.asset_checkout?.checkout_date.split(' ')?.[0]).format(
                          pref_date
                        )
                      : '-'}
                  </p>
                </div>
                <u
                  className='cursor-pointer text-primary fw-bold'
                  data-cy='CheckinCheckoutHistory'
                  onClick={() => setShowModalExtendCheckout(true)}
                >
                  Extend Checkout
                </u>
              </div>
            </>
          )}
        </div>
      </div>
      <CheckInOutModal
        type={type}
        showModal={showModalCheckInOut}
        setShowModal={setShowModalCheckInOut}
        data={data}
        setReload={setReload}
      />
      <ExtendCheckoutModal
        type={type}
        showModal={showModalExtendCheckout}
        setShowModal={setShowModalExtendCheckout}
        data={data}
        setReload={setReload}
      />
      <HistoryCheckInOut
        showModal={showModalHistoryCheckInOut}
        setShowModal={setShowModalHistoryCheckInOut}
        data={data}
      />
    </div>
  )
}

CheckInOut = memo(
  CheckInOut,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default CheckInOut
