/* eslint-disable sonar/no-wildcard-import */
/* eslint-disable react-hooks/exhaustive-deps */
import {getCompany} from '@api/company'
import {ToastMessage} from '@components/toast-message'
import {errorValidation} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {Form, Formik} from 'formik'
import qs from 'qs'
import {FC, useEffect, useState} from 'react'
import {Button} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import {useLocation, useNavigate} from 'react-router-dom'
import * as Yup from 'yup'

import {getOwnerSubscription} from '../Service'
import {CardDetail} from './CardDetail'
import {ModalConfirm} from './ModalPaymentConfirm'
import {checkoutPayment, getCheckoutPayment, getDataCheckout} from './Service'
import {SubscriptionSummary} from './SubscriptionSummary'

const validationSchema: any = Yup.object().shape({
  card_name: Yup.string()
    .required('Name on Card is required')
    .max(45, 'This Name on Card can not be more than 45 characters')
    .nullable(),
  card_number: Yup.string()
    .required('Card Number is required')
    .max(16, 'This Card Number can not be more than 16 characters')
    .nullable(),
  exp_month: Yup.string().test({
    name: 'exp_month',
    test: function () {
      const {exp_month, exp_year} = this.parent || {}
      const reMonth = exp_month !== undefined ? exp_month.replace('_', '') : ''
      const reYear = exp_year !== undefined ? exp_year.replace('_', '') : ''
      if (reMonth?.length !== 2 || reYear?.length !== 4) {
        return this.createError({
          message: `Expired Date is required`,
        })
      }
      return true
    },
  }),
  cvc: Yup.string().required('Security Code is required').nullable(),
})

const ConfirmationFormCard: FC = () => {
  const location = useLocation()
  const {search}: any = location || {}
  const navigate = useNavigate()
  const params: any = qs.parse(search.substring(1))
  const {change}: any = params || {}
  const intl = useIntl()
  const {preference: dataPreference, currentUser}: any = useSelector(
    ({preference, currentUser}: any) => ({preference, currentUser}),
    shallowEqual
  )

  const [detail, setDetail] = useState<any>(currentUser)
  const [plan, setPlan] = useState<any>({})
  const [, setDataPayment] = useState<any>({}) //dataPayment
  const [data, setInitialData] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [modalConfirm, setModalConfirm] = useState<any>(false)
  const [redirect, setRedirect] = useState<boolean>(false)

  useEffect(() => {
    if (dataPreference) {
      setInitialData(dataPreference)
    } else {
      setInitialData({})
    }
  }, [dataPreference])

  useEffect(() => {
    if (redirect) {
      navigate('/billing/billing-overview')
    }
  }, [redirect])

  const handleOnSubmit = (values: any, _actions: any) => {
    setLoading(true)
    const card: any = {
      number: values?.card_number || '',
      exp_month: values?.exp_month || '',
      exp_year: values?.exp_year || '',
      cvc: values?.cvc || '',
      name: values?.card_name || '',
    }

    checkoutPayment({card})
      .then(({data}: any) => {
        setLoading(false)
        const {message} = data || {}
        ToastMessage({type: 'success', message})
        setRedirect(true)
        setLoading(false)
      })
      .catch((err: any) => {
        setLoading(false)
        Object.values(errorValidation(err || {})).forEach((message: any) =>
          ToastMessage({type: 'error', message})
        )
      })
  }

  useEffect(() => {
    getCheckoutPayment()
      .then(
        ({
          data: {
            data: {card: res},
          },
        }: any) => {
          res && setDataPayment(res)
        }
      )
      .catch(() => '')
  }, [])

  useEffect(() => {
    getOwnerSubscription().then(({data: {data: res}}: any) => {
      if (res?.plan) {
        const {plan}: any = res || {}
        const {name}: any = plan || {}
        if (name) {
          const plan_name: any = name?.split(' ')?.[0]
          setPlan({
            ...plan,
            name: plan_name,
          })
        }
      }
    })
  }, [])

  useEffect(() => {
    getDataCheckout({}).then(({data: {data: res}}: any) => {
      if (res[0]) {
        const {contact_detail, billing_detail, first_name: f_name, last_name: l_name}: any = res[0]
        const {company, email, first_name, last_name}: any = contact_detail || {}
        const {phone, address, name: card_name, company: comp}: any = billing_detail || {}
        const {city, country, state, line1, line2, postal_code}: any = address || {}

        setDetail((prev: any) => ({
          ...prev,
          first_name: valueValidation(f_name, first_name),
          last_name: valueValidation(l_name, last_name),
          company: valueValidation(comp, company),
          email: email,
          phone_number: phone,
          line1: line1,
          line2: line2,
          city: city,
          state: state,
          postcode: postal_code,
          country: country,
          card_name,
        }))
      } else {
        getCompany({})
          .then(({data: {data: res}}: any) => {
            if (res[0]) {
              setDetail((prev: any) => ({
                ...prev,
                line1: res[0]?.address,
                city: res[0]?.city,
                state: res[0]?.state,
                postcode: res[0]?.postcode,
                country: res[0]?.country?.name,
              }))
            }
          })
          .catch((err: any) => err)
      }
    })
  }, [])

  const valueValidation = (value_1: any, value_2: any) => {
    if (value_1) {
      return value_1
    } else {
      return value_2
    }
  }

  const initValValidation = (value: any) => {
    if (value) {
      return value
    } else {
      return ''
    }
  }

  const initialValues: any = {
    first_name: initValValidation(detail?.first_name),
    last_name: initValValidation(detail?.last_name),
    company: detail?.company?.name || detail?.company || '',
    email: detail?.email || '',
    phone_number:
      detail?.phone_number !== undefined && detail?.phone_number !== null
        ? detail?.phone_number?.split(' ')[1]
        : '',
    phone_code:
      detail?.phone_number !== undefined && detail?.phone_number !== null
        ? detail?.phone_number?.split(' ')?.[0]
        : data.phone_code,
    line1: initValValidation(detail?.line1),
    line2: initValValidation(detail?.line2),
    city: initValValidation(detail?.city),
    state: initValValidation(detail?.state),
    postcode: initValValidation(detail?.postcode),
    country: initValValidation(detail?.country),
    card_name: initValValidation(detail?.card_name),
    card_number: initValValidation(detail?.card_number),
    exp_month: detail?.exp_month,
    exp_year: detail?.exp_year,
    cvc: detail?.cvc,
  }

  const configClass: any = {
    label: 'space-3 text-uppercase fw-bolder fs-8 mb-1 text-black-600',
    grid: 'col-md-6 col-xl-4 mb-5',
    size: 'sm',
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {change ? 'Edit Payment Details' : intl.formatMessage({id: 'PAGETITLE.BILLING_FORM'})}
      </PageTitle>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values: any, actions: any) => handleOnSubmit(values, actions)}
      >
        {({values, setFieldValue}) => {
          return (
            <Form className='justify-content-center' noValidate>
              <div className='row'>
                <div className='col-md-8'>
                  <CardDetail
                    configClass={configClass}
                    values={values}
                    setFieldValue={setFieldValue}
                    detail={detail}
                  />
                  {change === 'detail' && (
                    <div className='row'>
                      <div className='col-lg-6'>
                        <div
                          onClick={() => navigate(-1)}
                          className='btn btn-block w-100 btn-sm btn-secondary'
                        >
                          Cancel
                        </div>
                      </div>
                      <div className='col-lg-6'>
                        <Button
                          disabled={loading}
                          className='btn-sm w-100'
                          type='submit'
                          data-cy='saveBilling'
                          variant='primary'
                        >
                          {!loading && <span className='indicator-label'>Save</span>}
                          {loading && (
                            <span className='indicator-progress' style={{display: 'block'}}>
                              Please wait...
                              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                            </span>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                {change !== 'detail' && (
                  <div className='col-md-4'>
                    <SubscriptionSummary loading={loading} plan={plan} onSubscribe={() => ''} />
                  </div>
                )}
              </div>
            </Form>
          )
        }}
      </Formik>
      <ModalConfirm showModal={modalConfirm} setShowModal={setModalConfirm} />
    </>
  )
}

export default ConfirmationFormCard
