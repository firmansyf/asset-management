import {preferenceDate} from '@helpers'
import {getOwnerSubscription} from '@pages/billing/Service'
import cx from 'classnames'
import moment from 'moment'
import {FC, useEffect, useState} from 'react'
import {Link} from 'react-router-dom'

const Index: FC<any> = ({isTrial, setIsTrial}) => {
  const [endTrial, setEndTrial] = useState(undefined)
  const [hasPaymentMethod, setHasPayementMethod] = useState<any>()
  const pref_date = preferenceDate()

  useEffect(() => {
    getOwnerSubscription()
      .then(({data: {data: res}}: any) => {
        const {subscription} = res || {}
        const {on_trial, trial_ends_at, has_payment_method} = subscription
        setIsTrial(on_trial)
        setHasPayementMethod(has_payment_method)
        setEndTrial(trial_ends_at || undefined)
      })
      .catch(() => '')
  }, [setIsTrial, pref_date])
  return (
    <>
      {/*
     <div className={cx('alert alert-warning py-2 radius-0 d-block text-center m-0 mb-2', {'d-none': !isTrial})}>
       <span className='fw-bolder'><i className='fa fa-info-circle me-2 text-warning' />Your trial is expiring in {moment(endTrial).diff(moment(), 'days')} days.</span>
       <Link to='/billing' className='fw-boldest text-primary ms-2'><u>Update Payment Details</u></Link>
     </div> 
     */}

      {setIsTrial && hasPaymentMethod === false && (
        <div
          className={cx('alert alert-warning py-2 radius-0 d-block text-center m-0', {
            'd-none': !isTrial,
          })}
        >
          <span className='fw-bolder'>
            <i className='fa fa-info-circle me-2 text-warning' />
            Your trial is expiring in {moment(endTrial).diff(moment(), 'days')} days.
          </span>
          <Link to='/billing' className='fw-boldest text-primary ms-2'>
            <u>Update Payment Details</u>
          </Link>
        </div>
      )}

      {setIsTrial && hasPaymentMethod === true && (
        <div
          className={cx('alert alert-primary py-2 radius-0 d-block text-center m-0', {
            'd-none': !isTrial,
          })}
        >
          <span className='fw-bolder'>
            Your trial is expiring in {moment(endTrial).diff(moment(), 'days')} days
          </span>
        </div>
      )}
    </>
  )
}

export default Index
