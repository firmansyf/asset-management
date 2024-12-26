import {Title} from '@components/form/Title'
import {ToastMessage} from '@components/toast-message'
import {preferenceDate} from '@helpers'
import {getOwnerSubscription} from '@pages/billing/Service'
import {useQuery} from '@tanstack/react-query'
import moment from 'moment'
import {FC} from 'react'

const NextBilling: FC<any> = () => {
  const pref_date: any = preferenceDate()

  const checkoutPaymentQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getOwnerSubscription'],
    queryFn: async () => {
      const res: any = await getOwnerSubscription()
      const dataResult: any = res?.data?.data
      return dataResult
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const data: any = checkoutPaymentQuery?.data || null

  return (
    <div className='d-flex flex-column-fluid p-5'>
      <div className='card w-100'>
        <div className='d-flex card-body bg-light p-7 w-100 shadow-sm p-3 mb-5 bg-body rounded border border-2'>
          <div className='row w-100'>
            <div className='col-12'>
              {data?.subscription?.on_trial === true ? (
                <>
                  <div className='col-auto pe-3 fw-boldest text-uppercase space-2'>
                    <h4 className='d-flex align-items-center text-primary m-0' data-cy='title'>
                      First Payment Schedule
                    </h4>
                  </div>
                  <div className='col separator my-5' style={{borderBottomWidth: '5px'}} />
                </>
              ) : (
                <Title title='Next Billing' sticky={false} className='my-2' />
              )}
              <div className='row m-4'>
                <div className='col-12'>
                  <p className='h4'>{`${data?.next_invoice?.currency || '-'} ${
                    data?.next_invoice?.total_amount || ''
                  }`}</p>
                  <span className='mt-3'>
                    {' '}
                    Next charge :{' '}
                    <strong>{moment(data?.next_invoice?.period_start).format(pref_date)}</strong>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export {NextBilling}
