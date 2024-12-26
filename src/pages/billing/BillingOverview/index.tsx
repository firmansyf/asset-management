/* eslint-disable react-hooks/exhaustive-deps */
import Tooltip from '@components/alert/tooltip'
import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {toAbsoluteUrl} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {useQuery} from '@tanstack/react-query'
import {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

import {getCheckoutPayment, getPaymentContact} from '../ConfirmationPlanForm/Service'
import {getDataBillingHistory, getDetailCard, getOwnerSubscription} from '../Service'
import {History} from './History'
import {NextBilling} from './NextBilling'

const BillingOverview: FC = () => {
  const intl: any = useIntl()
  const navigate: any = useNavigate()
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {country: dataCountry} = preferenceStore || {}

  const [country, setCountry] = useState<any>()
  const [dataContact, setDataContact] = useState<any>({})
  const [dataPayment, setDataPayment] = useState<any>({})
  const [dataHistory, setDataHistory] = useState<any>([])

  let data: any = {}
  const detailCardQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getDetailCard'],
    queryFn: async () => {
      const res: any = await getDetailCard()
      const dataResult: any = res?.data?.data
      return dataResult?.length > 0 ? dataResult?.[0] : {}
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  data = detailCardQuery?.data || {}
  const loading: any = !detailCardQuery?.isFetched || false
  const OwnerSubscriptionQuery: any = useQuery({
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
  data = {...data, subscription: OwnerSubscriptionQuery?.data || {}}

  useEffect(() => {
    getPaymentContact().then(({data: res}: any) => {
      res && setDataContact(res)
    })

    getCheckoutPayment().then(({data: {data}}: any) => {
      const {card: res}: any = data || {}
      res && setDataPayment(res)
    })

    getDataBillingHistory({orderDir: 'asc', page: 1, limit: 5}).then(({data: {data: res}}: any) => {
      res?.length > 0 && setDataHistory(res)
    })
  }, [])

  useEffect(() => {
    const {billing_detail: contact}: any = dataContact || {}
    const {billing_detail: billing}: any = data || {}
    const countryData: any = contact?.address?.country || billing?.address?.country || ''
    if (dataCountry && countryData) {
      const resCountry: any = dataCountry?.find(({iso_code}: any) => iso_code === countryData)
      setCountry(resCountry?.name || undefined)
    }
  }, [dataContact, data, dataCountry])

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'PAGETITLE.BILLING_OVERVIEW'})}
      </PageTitle>
      {loading ? (
        <PageLoader />
      ) : (
        <>
          <div className='d-flex flex-column flex-column-fluid bgi-position-y-bottom bgi-no-repeat bgi-size-contain bgi-attachment-fixed'>
            <div className='d-flex flex-column flex-column-fluid p-7'>
              <p className='h2'>Your Plan</p>
              <div className='card mt-4'>
                <div className='d-flex card-body bg-light p-10 shadow-sm p-3 mb-5 bg-body rounded p-7 border border-2'>
                  <div className='row w-100'>
                    <div className='col-sm-12 col-md-5 col-lg-5 py-2'>
                      <p className='h4'>{data?.subscription?.plan?.name || ''}</p>
                      <span>
                        Payment Cycle :{' '}
                        <strong className='text-capitalize'>
                          {data?.subscription?.plan?.billing_cycle || ''}
                        </strong>
                      </span>
                      <div className='mt-4'>
                        {/* {data?.subscription?.plan?.unique_id !== 'free_plan' && (
                        <span> Your next bill is for {data?.subscription?.plan?.currency} {data?.subscription?.plan?.price} on {moment(data?.subscription?.subscription?.ends_at).format(dateTimeFormat)}</span>
                      )} */}
                        <div className='d-flex mx-5 align-items-center mt-3 '>
                          <img
                            alt='Logo'
                            className='h-45px'
                            src={toAbsoluteUrl('/media/icons/duotone/General/visa.png')}
                          />{' '}
                          &nbsp;&nbsp;
                          <div className=''>
                            <span>
                              **** **** **** {dataPayment?.last4 || data?.card?.last4 || 'N/A'}
                            </span>
                          </div>
                          <Tooltip placement='top' title='Edit Card Detail'>
                            <div
                              data-cy='editCardPayment'
                              className='d-flex align-items-center justify-content-center cursor-pointer bg-secondary rounded ms-3 shadow border border-primary border-dashed'
                              style={{textAlign: 'right', width: 35, height: 35}}
                              onClick={() =>
                                navigate(
                                  `/billing/confirm-form-card?change=detail
                                  &package=${data?.subscription?.plan?.name || ''}
                                  &price=${data?.subscription?.plan?.price || ''}
                                  &totalAsset=${data?.subscription?.plan?.limit_asset || ''}
                                  &PaymentCycle=${data?.subscription?.plan?.billing_cycle || ''}
                                  &uniqueId=${data?.subscription?.plan?.unique_id || ''}`
                                )
                              }
                            >
                              <i className='fa fa-lg fa-pencil-alt text-primary'></i>
                            </div>
                          </Tooltip>
                        </div>

                        <div className='ms-20'>
                          <span>
                            Expires :{' '}
                            <strong>
                              {dataPayment?.exp_month || data?.card?.exp_month || 'N/A'}/
                              {dataPayment?.exp_year || data?.card?.exp_year || 'N/A'}
                            </strong>
                          </span>
                        </div>
                        <div className='mx-20 mt-2 link-primary cursor-pointer'>
                          <span onClick={() => navigate(`/billing/detail`)}>
                            View Payment Details
                          </span>
                          <br />
                          <span>
                            Card Name : <strong>{dataPayment?.name || 'N/A'}</strong>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className='col-sm-12 col-md-7 col-lg-7 py-2'>
                      <div className='row'>
                        <div className='col-10'>
                          <div className='my-3 mx-7'>
                            <div className='fw-bolder text-dark mb-1'> Name </div>
                            <div className='text-dark'>
                              {dataContact?.first_name || data?.first_name || ''}{' '}
                              {dataContact?.last_name || data?.last_name || ''}
                            </div>
                          </div>
                          <div className='my-3 mx-7'>
                            <div className='fw-bolder text-dark mb-1'> Email </div>
                            <div className='text-dark'>
                              {dataContact?.billing_detail?.email ||
                                data?.billing_detail?.email ||
                                data?.contact_detail?.email ||
                                'N/A'}
                            </div>
                          </div>
                          <div className='my-3 mx-7'>
                            <div className='fw-bolder text-dark mb-1'> Phone Number </div>
                            <div className='text-dark'>
                              {`+${dataContact?.billing_detail?.phone}` ||
                                `+${data?.billing_detail?.phone}` ||
                                `+${data?.contact_detail?.phone_number}` ||
                                ' - '}
                            </div>
                          </div>
                          <div className='my-3 ms-7'>
                            <div className='fw-bolder text-dark mb-1'> Address </div>
                            <div className='text-dark'>
                              {(country ||
                                dataContact?.billing_detail?.address?.country ||
                                data?.billing_detail?.address?.country) && (
                                <div className='d-flex align-items-center'>
                                  <p className='m-0'>
                                    {country ||
                                      dataContact?.billing_detail?.address?.country ||
                                      data?.billing_detail?.address?.country ||
                                      '-'}
                                    ,
                                  </p>
                                  <Tooltip placement='top' title='Country'>
                                    <div style={{width: 10}}>
                                      <i className='fa fa-info-circle fa-sm text-gray-300 ms-2' />
                                    </div>
                                  </Tooltip>
                                </div>
                              )}
                              {(dataContact?.billing_detail?.address?.state ||
                                data?.billing_detail?.address?.state) && (
                                <div className='d-flex align-items-center'>
                                  <p className='m-0'>
                                    {dataContact?.billing_detail?.address?.state ||
                                      data?.billing_detail?.address?.state ||
                                      ''}
                                    ,
                                  </p>
                                  <Tooltip placement='top' title='State'>
                                    <div style={{width: 10}}>
                                      <i className='fa fa-info-circle fa-sm text-gray-300 ms-2' />
                                    </div>
                                  </Tooltip>
                                </div>
                              )}
                              {(dataContact?.billing_detail?.address?.line1 ||
                                data?.billing_detail?.address?.line1) && (
                                <div className='d-flex align-items-center'>
                                  <p className='m-0'>
                                    {dataContact?.billing_detail?.address?.line1 ||
                                      data?.billing_detail?.address?.line1 ||
                                      ''}
                                    ,
                                  </p>
                                  <Tooltip placement='top' title='Address'>
                                    <div style={{width: 10}}>
                                      <i className='fa fa-info-circle fa-sm text-gray-300 ms-2' />
                                    </div>
                                  </Tooltip>
                                </div>
                              )}
                              {(dataContact?.billing_detail?.address?.line2 ||
                                data?.billing_detail?.address?.line2) && (
                                <div className='d-flex align-items-center'>
                                  <p className='m-0'>
                                    {dataContact?.billing_detail?.address?.line2 ||
                                      data?.billing_detail?.address?.line2 ||
                                      ''}
                                    ,
                                  </p>
                                  <Tooltip placement='top' title='Extended Address'>
                                    <div style={{width: 10}}>
                                      <i className='fa fa-info-circle fa-sm text-gray-300 ms-2' />
                                    </div>
                                  </Tooltip>
                                </div>
                              )}
                              {(dataContact?.billing_detail?.address?.city ||
                                data?.billing_detail?.address?.city) && (
                                <div className='d-flex align-items-center'>
                                  <p className='m-0'>
                                    {dataContact?.billing_detail?.address?.city ||
                                      data?.billing_detail?.address?.city ||
                                      ''}
                                    ,
                                  </p>
                                  <Tooltip placement='top' title='City'>
                                    <div style={{width: 10}}>
                                      <i className='fa fa-info-circle fa-sm text-gray-300 ms-2' />
                                    </div>
                                  </Tooltip>
                                </div>
                              )}
                              {(dataContact?.billing_detail?.address?.postal_code ||
                                data?.billing_detail?.address?.postal_code) && (
                                <div className='d-flex align-items-center'>
                                  <p className='m-0'>
                                    {dataContact?.billing_detail?.address?.postal_code ||
                                      data?.billing_detail?.address?.postal_code ||
                                      ''}
                                    ,
                                  </p>
                                  <Tooltip placement='top' title='Postal Code'>
                                    <div style={{width: 10}}>
                                      <i className='fa fa-info-circle fa-sm text-gray-300 ms-2' />
                                    </div>
                                  </Tooltip>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className='col-2 d-flex justify-content-end'>
                          <Tooltip placement='top' title='Edit'>
                            <div
                              className='d-flex align-items-center justify-content-center w-35px h-35px cursor-pointer rounded bg-light-primary border-primary border border-dashed shadow p-3 mb-5 bg-body'
                              onClick={() =>
                                navigate(
                                  `/billing/confirm-form?change=detail
                                  &package=${data?.subscription?.plan?.name || ''}
                                  &price=${data?.subscription?.plan?.price || ''}
                                  &totalAsset=${data?.subscription?.plan?.limit_asset || ''}
                                  &PaymentCycle=${data?.subscription?.plan?.billing_cycle || ''}
                                  &uniqueId=${data?.subscription?.plan?.unique_id || ''}`
                                )
                              }
                            >
                              <i className='fa fa-lg fa-pencil-alt text-dark'></i>
                            </div>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='mx-2'>
            <div className='row'>
              <div className='col-sm-12 col-md-4 col-lg-4'>
                <NextBilling />
              </div>
              <div className='col-sm-12 col-md-5 col-lg-5'>
                {dataHistory?.length > 0 && <History data={dataHistory} />}
                {/* End History */}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default BillingOverview
