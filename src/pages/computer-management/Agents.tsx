import {PageTitle} from '@metronic/layout/core'
import {FC} from 'react'
import {useIntl} from 'react-intl'

const ComputerAgents: FC = () => (
  <div className='card card-custom h-100'>
    <div className='card-header p-6'>Download Agents</div>
  </div>
)

const Agents: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.COMPUTER_MANAGEMENT.COMPUTER_AGENT'})}
      </PageTitle>
      <ComputerAgents />
    </>
  )
}

export default Agents
