import {preferenceDate} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import moment from 'moment'
import {FC, useState} from 'react'
import {useIntl} from 'react-intl'

import {ListUpOrDownGrade} from './ListUpOrDownGrade'

const ChangePlan: FC = () => {
  const intl: any = useIntl()
  const pref_date: any = preferenceDate()

  const [country, setCountry] = useState<any>()
  const [defaultPlan, setDefaultPlan] = useState<string>('')
  const [ownerSubscription, setOwnerSubscription] = useState<any>([])

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'PAGETITLE.BILLING_PLAN_DETAIL'})}
      </PageTitle>
      <div style={{marginTop: '50px'}}>
        <div style={{paddingLeft: '45px'}}>
          <h5>Account Detail</h5>
        </div>
        <div style={{paddingLeft: '45px'}}>
          {' '}
          Current plan : <strong>{defaultPlan || ''} Plan</strong>
        </div>
        <div style={{paddingLeft: '45px'}}>
          Payment cycle :
          <strong>
            {` ${ownerSubscription?.plan?.billing_cycle?.charAt(0)?.toUpperCase() || ''}${
              ownerSubscription?.plan?.billing_cycle?.slice(1) || ''
            }`}
          </strong>
        </div>
        <div style={{paddingLeft: '45px'}}>
          Your next bill is
          <strong>{` ${country || ownerSubscription?.plan?.currency || ''} ${
            ownerSubscription?.plan?.price || ''
          } `}</strong>
          on{' '}
          <strong>
            {moment(ownerSubscription?.subscription?.ends_at || '')?.format(pref_date)}
          </strong>
        </div>
        <div className='mt-4'>
          <ListUpOrDownGrade
            country={country}
            setCountry={setCountry}
            defaultPlan={defaultPlan}
            setDefaultPlan={setDefaultPlan}
            ownerSubscription={ownerSubscription}
            setOwnerSubscription={setOwnerSubscription}
          />
        </div>
      </div>
    </>
  )
}

export default ChangePlan
