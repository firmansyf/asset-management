import {PageLoader} from '@components/loader/cloud'
import {PageLink, PageTitle} from '@metronic/layout/core'
import {useQuery} from '@tanstack/react-query'
import {FC, useState} from 'react'
import {useIntl} from 'react-intl'

import {CardEmailTmp} from './cardEmailTmp'
import {getEmailName} from './service'

const CustomEmailTemplate: FC = () => {
  const intl: any = useIntl()
  const breadCrumbs: Array<PageLink> = []

  const [guids, setGuid] = useState<any>()
  const [showModalEmailSettings, setShowModalEmailSettings] = useState<boolean>(false)

  const emailNameQuery: any = useQuery({
    queryKey: ['getEmailName', {guids}],
    queryFn: async () => {
      if (guids) {
        const res: any = await getEmailName(guids)
        const dataResult: any = res?.data?.data
        return dataResult
      } else {
        return {}
      }
    },
  })

  const dataEmail: any = emailNameQuery?.data || {}

  if (!emailNameQuery?.isFetched) {
    return <PageLoader />
  }
  return (
    <>
      <PageTitle breadcrumbs={breadCrumbs}>
        {intl.formatMessage({id: 'MENU.SETUP.CUSTOM_EMAIL_TEMPLATE'})}
      </PageTitle>
      <CardEmailTmp
        data={dataEmail}
        guids={guids}
        setGuid={setGuid}
        setShowModalEmailSettings={setShowModalEmailSettings}
        showModalEmailSettings={showModalEmailSettings}
        loading={!emailNameQuery?.isFetched}
      />
    </>
  )
}

export default CustomEmailTemplate
