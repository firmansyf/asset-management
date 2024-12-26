import {PageTitle} from '@metronic/layout/core'
import moment from 'moment'
import {FC, useState} from 'react'
import {useIntl} from 'react-intl'

import {ListPlan} from './ListPlant'

const BillingMenu: FC = () => {
  const intl = useIntl()
  const [ownerSubscription, setOwnerSubscription] = useState<any>([])
  const [endTrial, setEndTrial] = useState(undefined)
  const status_plan = 'Trial'
  const status_message = `Your trial is expiring in ${moment(endTrial).diff(
    moment(),
    'days'
  )} days.`

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'PAGETITLE.BILLING_MENU'})}</PageTitle>
      <div style={{marginTop: '50px'}}>
        <div style={{paddingLeft: '45px'}}>
          <h5>Account Detail</h5>
        </div>
        <div style={{paddingLeft: '45px'}}>
          {' '}
          Current plan :{' '}
          <strong>
            {ownerSubscription}({status_plan})
          </strong>
        </div>
        <div style={{paddingLeft: '45px'}}> {status_message}</div>
        <div className='mt-4'>
          <ListPlan
            setOwnerSubscription={setOwnerSubscription}
            ownerSubscription={ownerSubscription}
            setEndTrial={setEndTrial}
          />
        </div>
      </div>
    </>
  )
}

export {BillingMenu}
