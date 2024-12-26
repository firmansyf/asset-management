import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {useQuery} from '@tanstack/react-query'
import {FC, useEffect} from 'react'

import BillingOverview from './BillingOverview'
import ConfirmationForm from './ConfirmationPlanForm'
import {getDetailCard} from './Service'

const Billing: FC<any> = () => {
  const currentPlanQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getDetailCard'],
    queryFn: async () => {
      const res: any = await getDetailCard()
      const dataResult: any = res?.data?.data
      return dataResult?.length > 0 ? true : false
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const currentplan: any = currentPlanQuery?.data || []
  const loading: any = !currentPlanQuery?.isFetched || false

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  if (loading) {
    return <PageLoader />
  } else {
    if (!currentplan) {
      return <ConfirmationForm />
    } else {
      return <BillingOverview />
    }
  }
}

export default Billing
