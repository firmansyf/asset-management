import {PageTitle} from '@metronic/layout/core'
import {FC} from 'react'
import {useIntl} from 'react-intl'

import CardNotification from '../component/CardNotification'
const NotificationMaintenance: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'HELPDESK.NOTIFICATION.MAINTENANCE'})}
      </PageTitle>
      <CardNotification module={'maintenance'} />
    </>
  )
}
export default NotificationMaintenance
