import {PageTitle} from '@metronic/layout/core'
import {FC} from 'react'
import {useIntl} from 'react-intl'

import CardNotification from '../component/CardNotification'
const NotificationInsurancePolicy: FC<any> = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'HELPDESK.NOTIFICATION.INSURANCE_POLICY'})}
      </PageTitle>
      <CardNotification module={'insurance'} />
    </>
  )
}
export default NotificationInsurancePolicy
