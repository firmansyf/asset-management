import {PageTitle} from '@metronic/layout/core'
import {FC} from 'react'
import {useIntl} from 'react-intl'

import CardNotification from '../component/CardNotification'
const NotificationWarranty: FC<any> = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'HELPDESK.NOTIFICATION.WARRANTY'})}
      </PageTitle>
      <CardNotification module={'warranty'} />
    </>
  )
}
export default NotificationWarranty
