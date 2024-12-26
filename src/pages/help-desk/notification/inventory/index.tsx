import {PageTitle} from '@metronic/layout/core'
import CardNotification from '@pages/help-desk/notification/component/CardNotification'
import {FC} from 'react'
import {useIntl} from 'react-intl'

const NotificationInventory: FC<any> = () => {
  const intl: any = useIntl()

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'HELPDESK.NOTIFICATION.INVENTORY'})}
      </PageTitle>
      <CardNotification module={'inventory'} />
    </>
  )
}

export default NotificationInventory
