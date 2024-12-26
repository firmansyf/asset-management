import {PageTitle} from '@metronic/layout/core'
import CardNotification from '@pages/help-desk/notification/component/CardNotification'
import {FC} from 'react'
import {useIntl} from 'react-intl'

const NotificationAsset: FC<any> = () => {
  const intl: any = useIntl()

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'HELPDESK.NOTIFICATION.ASSET'})}
      </PageTitle>
      <CardNotification module={'asset'} />
    </>
  )
}

export default NotificationAsset
