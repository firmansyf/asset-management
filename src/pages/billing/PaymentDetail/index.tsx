/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import {Title} from '@components/form/Title'
import {ToastMessage} from '@components/toast-message'
import {convertDateTimeCustom, IMG} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {getCheckoutPayment, getPaymentContact} from '@pages/billing/ConfirmationPlanForm/Service'
import {cancelSubscribe, getOwnerSubscription} from '@pages/billing/Service'
import {useQuery} from '@tanstack/react-query'
import cx from 'classnames'
import moment from 'moment'
import {FC, useEffect, useState} from 'react'
import {Button} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

const PaymentDetail: FC = () => {
  const intl: any = useIntl()
  const navigate: any = useNavigate()
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {preference: dataPreference} = preferenceStore || {}

  const [data, setData] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [dateTimeFormat, setDateTimeCustom] = useState<any>('DD-MM-YYYY HH:mm:ss')
  const [redirect, setRedirect] = useState<boolean>(false)

  const msg_alert: any = [
    'Cancellation will be effective at the end of your current billing perriod on ',
    <strong key='str1'>
      {moment(data?.next_invoice?.period_end || '')?.format(dateTimeFormat)}
    </strong>,
    <br key='br1' />,
    <strong key='cancel_subscription'>Note :</strong>,
    ' This action cannot be undone?',
  ]

  const customClass: any = {
    label: 'space-3 text-uppercase fw-bolder fs-8 mb-1 text-black-600',
    body: 'bg-gray-100 p-2 rounded h-100',
    grid: 'col-md-12 my-3',
    grid2: 'col-md-6 my-2',
    size: 'sm',
  }

  const bilingValValidation = (value_1: any, value_2: any) => {
    if (value_1) {
      return value_1
    } else {
      return value_2
    }
  }

  const handelCancelSubscription = (_e: any) => {
    setLoading(true)
    cancelSubscribe()
      .then(({data: {message}}: any) => {
        setLoading(false)
        ToastMessage({type: 'success', message})
        setTimeout(() => {
          setRedirect(true)
        }, 1300)
      })
      .catch(({response}: any) => {
        setLoading(false)
        const {message}: any = response?.data || {}
        ToastMessage({type: 'error', message})
      })
  }

  const changePlan = () => {
    navigate('/billing/change-plan')
  }

  const checkoutPaymentQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getCheckoutPayment'],
    queryFn: async () => {
      const res: any = await getCheckoutPayment()
      const dataResult: any = res?.data?.data?.card
      return dataResult
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const dataPayment: any = checkoutPaymentQuery?.data || null

  const paymentContactQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getPaymentContact'],
    queryFn: async () => {
      const res: any = await getPaymentContact()
      const dataResult: any = res?.data?.data
      let dataRes: any = {}
      if (dataResult && Object.keys(dataResult || {})?.length > 0) {
        const {first_name, last_name, billing_detail}: any = dataResult
        const {company, email, phone, name, address}: any = billing_detail || {}
        const {line1, line2, city, state, postal_code, country}: any = address || {}
        dataRes = {
          first_name: bilingValValidation(first_name, ''),
          last_name: bilingValValidation(last_name, ''),
          company: bilingValValidation(company, ''),
          email: bilingValValidation(email, ''),
          phone_number: bilingValValidation(phone, ''),
          line1: bilingValValidation(line1, ''),
          line2: bilingValValidation(line2, ''),
          city: bilingValValidation(city, ''),
          state: bilingValValidation(state, ''),
          postcode: bilingValValidation(postal_code, ''),
          country: bilingValValidation(country, ''),
          card_name: bilingValValidation(name, ''),
        }
      }
      return dataRes
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const dataBilling: any = paymentContactQuery?.data || null

  useEffect(() => {
    getOwnerSubscription()
      .then(({data}: any) => {
        const {data: res}: any = data
        setData((e: any) => ({...e, ...res}))
      })
      .catch(() => '')
  }, [])

  useEffect(() => {
    if (dataPreference) {
      setDateTimeCustom(convertDateTimeCustom(dataPreference?.date_format, null))
    }
  }, [dataPreference])

  useEffect(() => {
    if (redirect) {
      navigate('/billing/billing-overview')
    }
  }, [redirect])

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'PAGETITLE.BILLING_PAYMENTDETAIL'})}
      </PageTitle>
      <div className='d-flex m-10'>
        <div className='row w-100 p-7'>
          <div className='title'>
            <p className='h3'>Payment Details</p>
          </div>
          <br />
          <div className='h3 mt-5'>
            <p className='h3'>
              Current Plan : <strong>{data?.plan?.name}</strong>
            </p>
          </div>
          {/* Contact Detail */}
          <div className=''>
            <Title title='Contact Details' sticky={false} className='my-2' />
            <div className='row mt-5'>
              <div className='col-md'>
                <div className='row'>
                  <div className={customClass?.grid}>
                    <div className={customClass?.body}>
                      <div className='fw-bolder text-dark mb-1'>First Name</div>
                      <div className='text-dark'>{dataBilling?.first_name || ' - '}</div>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className={customClass?.grid}>
                    <div className={customClass?.body}>
                      <div className='fw-bolder text-dark mb-1'>Company Name</div>
                      <div className='text-dark'>{dataBilling?.company || 'N/A'}</div>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className={customClass?.grid}>
                    <div className={customClass?.body}>
                      <div className='fw-bolder text-dark mb-1'>Phone number</div>
                      <div className='text-dark'>
                        {dataBilling?.phone_number !== '' ? `+${dataBilling?.phone_number}` : 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='col-md'>
                <div className='row'>
                  <div className={customClass?.grid}>
                    <div className={customClass?.body}>
                      <div className='fw-bolder text-dark mb-1'>Last Name</div>
                      <div className='text-dark'>{dataBilling?.last_name || 'N/A'}</div>
                    </div>
                  </div>
                </div>

                <div className='row'>
                  <div className={customClass?.grid}>
                    <div className={customClass?.body}>
                      <div className='fw-bolder text-dark mb-1'>Email</div>
                      <div className='text-dark'>{dataBilling?.email || 'N/A'}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* End  */}

            {/* Address Details */}
            <div className=''>
              <Title title='Address Details' sticky={false} className='my-2' />
              <div className='row'>
                <div className={customClass?.grid2}>
                  <div className={customClass?.body}>
                    <div className='fw-bolder text-dark mb-1'>Country</div>
                    <div className='text-dark'>{dataBilling?.country || 'N/A'}</div>
                  </div>
                </div>

                <div className={customClass?.grid2}>
                  <div className={customClass?.body}>
                    <div className='fw-bolder text-dark mb-1'>State</div>
                    <div className='text-dark'>{dataBilling?.state || 'N/A'}</div>
                  </div>
                </div>

                <div className={customClass?.grid2}>
                  <div className={customClass?.body}>
                    <div className='fw-bolder text-dark mb-1'>Address</div>
                    <div className='text-dark'>{dataBilling?.line1 || 'N/A'}</div>
                  </div>
                </div>

                <div className={customClass?.grid2}>
                  <div className={customClass?.body}>
                    <div className='fw-bolder text-dark mb-1'>Extended Address</div>
                    <div className='text-dark'>{dataBilling?.line2 || 'N/A'}</div>
                  </div>
                </div>

                <div className={customClass?.grid2}>
                  <div className={customClass?.body}>
                    <div className='fw-bolder text-dark mb-1'>City</div>
                    <div className='text-dark'>{dataBilling?.city || 'N/A'}</div>
                  </div>
                </div>

                <div className={customClass?.grid2}>
                  <div className={customClass?.body}>
                    <div className='fw-bolder text-dark mb-1'>Zip/Postal Code</div>
                    <div className='text-dark'>{dataBilling?.postcode || 'N/A'}</div>
                  </div>
                </div>
              </div>
              {/* End */}

              {/* Card Details */}
              <div className=''>
                <Title title='Card Details' sticky={false} className='my-2' />
                <div className='row'>
                  <div className='col-lg-6'>
                    <div className='row'>
                      <div className={customClass?.grid}>
                        <div className='bg-gray-100 p-3 rounded h-100'>
                          <div className={customClass?.body}>
                            <label className={cx(customClass?.label)}>Name on Card</label>
                            <p>{dataPayment?.name || 'N/A'}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='row'>
                      <div className={customClass?.grid}>
                        <div className={customClass?.body}>
                          <label className={cx(customClass?.label)}>Expiry date</label>
                          <p>
                            {dataPayment?.exp_month || 'N/A'}/{dataPayment?.exp_year || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='col-lg-6'>
                    <div className='row'>
                      <div className={customClass?.grid}>
                        <div className='bg-gray-100 p-3 rounded h-100'>
                          <div className='fw-bolder text-dark'>Card Number</div>
                          <div className='d-flex my-1'>
                            <IMG path={'/media/svg/card-logos/visa.svg'} className={'h-30px'} />
                            &nbsp; &nbsp;
                            <span className='d-inline'>
                              {' '}
                              xxx xxx xxxx {dataPayment?.last4 || 'N/A'}
                            </span>
                          </div>
                          {/* <div className='text-dark'>{data?.billing_detail?.name || 'N/A'}</div> */}
                        </div>
                      </div>
                    </div>

                    <div className='row'>
                      <div className={customClass?.grid}>
                        <div className={customClass?.body}>
                          <label className={cx(customClass?.label)}> Security Code </label>
                          <p>{'***'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* End */}

              <div className='button float-end mt-3'>
                <Button className='btn-sm' type='submit' variant='primary' onClick={changePlan}>
                  <span
                    onClick={() => navigate(`/billing/change-plan`)}
                    className='indicator-label'
                  >
                    Change Plan
                  </span>
                </Button>
                &nbsp; &nbsp;
                <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(true)}>
                  Cancel Subscription
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Alert
        body={msg_alert}
        type={'condfirm'}
        loading={loading}
        showModal={showModal}
        confirmLabel={'Confirm'}
        setShowModal={setShowModal}
        title={'Are you sure to cancel subscription ?'}
        onConfirm={(e: any) => handelCancelSubscription(e)}
        onCancel={() => {
          setShowModal(false)
          ToastMessage({type: 'clear'})
        }}
      />
    </>
  )
}

export default PaymentDetail
