/* eslint-disable react-hooks/exhaustive-deps */
import {PageTitle} from '@metronic/layout/core'
import {FC} from 'react'
import {useIntl} from 'react-intl'

import {CardICleanUp} from './CardCleanUp'

const DataCleanUp: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.SETUP.SETTINGS.DATA-CLEAN-UP'})}
      </PageTitle>
      <CardICleanUp />
    </>
  )
}

export default DataCleanUp
