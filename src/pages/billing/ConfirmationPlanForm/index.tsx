/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable sonarjs/cognitive-complexity */
import {getCompany} from '@api/company'
import {ToastMessage} from '@components/toast-message'
import {configClass} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {Form, Formik} from 'formik'
import qs from 'qs'
import {FC, useEffect, useState} from 'react'
import {Button} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import {useLocation, useNavigate} from 'react-router-dom'
import {mixed as YupMixed, number as YupNumber, object as YupObject, string as YupString} from 'yup'

import {getOwnerSubscription} from '../Service'
import {AddressDetail} from './AddressDetail'
import {CardDetail} from './CardDetail'
import {ContactDetail} from './ContactDetail'
import {ModalConfirm} from './ModalPaymentConfirm'
import {checkout, checkoutPaymentContant, getDataCheckout, getPaymentContact} from './Service'
import {SubscriptionSummary} from './SubscriptionSummary'

const ConfirmationForm: FC<any> = () => {
  const intl: any = useIntl()
  const location: any = useLocation()
  const navigate: any = useNavigate()
  const {search} = location || {}
  const params: any = qs.parse(search?.substring(1) || '')
  const {change} = params || {}
  const {preference: preferenceStore, currentUser}: any = useSelector(
    ({preference, currentUser}: any) => ({preference, currentUser}),
    shallowEqual
  )
  const {preference: dataPreference, country: dataCountry} = preferenceStore || {}

  const [detail, setDetail] = useState<any>(currentUser)
  const [plan, setPlan] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [modalConfirm, setModalConfirm] = useState<boolean>(false)
  const [phoneCode, setPhoneCode] = useState<any>([])

  const [companyData, setCompanyData] = useState<any>({})
  const [dataBilling, setDataBilling] = useState<any>()
  const [defaultCompanyData, setDefaultCompanyData] = useState<any>({})
  const [defaultCountryData, setDefaultCountryData] = useState<any>({})
  const [phoneCodeMatchPref, setPhodeCodeMatchPref] = useState<any>()
  const [isCountry, setIsCountry] = useState<any>([])
  const [redirect, setRedirect] = useState<boolean>(false)
  const [errSubmitForm, setErrSubmitForm] = useState<boolean>(true)

  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})

  let valSchema: any = {
    first_name: YupString()
      .required('First Name is required')
      .max(45, 'This First Name can not be more than 45 characters')
      .nullable(),
    last_name: YupString()
      .required('Last Name is required')
      .max(45, 'This Last Name can not be more than 45 characters')
      .nullable(),
    company: YupMixed()
      .test('company', 'Company Name is required', (e: any) => e?.value || typeof e === 'string')
      .nullable(),
    email: YupString()
      .required('Email is required')
      .max(45, 'This Email can not be more than 45 characters')
      .nullable(),
    phone_number: YupNumber()
      .required('Phone Number is required')
      .test(
        'len',
        'This Phone Number can not be more than 16 characters',
        (val: any) => val?.toString()?.length <= 16
      )
      .nullable(),
    city: YupString()
      .required('City is required')
      .max(45, 'This City can not be more than 45 characters')
      .nullable(),
    country: YupMixed()
      .test('country', 'Country is required', (e: any) => e?.value || typeof e === 'string')
      .nullable(),
    line1: YupString()
      .required('Address 1 is required')
      .max(45, 'This Address 1 can not be more than 45 characters')
      .nullable(),
    line2: YupString()
      .required('Address 2 is required')
      .max(45, 'This Address 2 address can not be more than 45 characters')
      .nullable(),
    postcode: YupString()
      .required('Postal Code is required')
      .max(10, 'This Postal Code can not be more than 10 characters')
      .nullable(),
    state: YupString()
      .required('State is required')
      .max(45, 'This State can not be more than 45 characters')
      .nullable(),
  }

  if (change !== 'detail') {
    valSchema = {
      ...valSchema,
      card_name: YupString()
        .required('Name on Card is required')
        .max(45, 'This Name on Card can not be more than 45 characters')
        .nullable(),
      card_number: YupString()
        .required('Card Number is required')
        .max(16, 'This Card Number can not be more than 16 characters')
        .nullable(),
      exp_month: YupString().test({
        name: 'exp_month',
        test: function () {
          const {exp_month, exp_year} = this.parent || {}
          const reMonth = exp_month !== undefined ? exp_month?.replace('_', '') : ''
          const reYear = exp_year !== undefined ? exp_year?.replace('_', '') : ''
          if (reMonth?.length !== 2 || reYear?.length !== 4) {
            return this.createError({
              message: `Expiry Date is required`,
            })
          }
          return true
        },
      }),
      cvc: YupString().required('Security Code is required').nullable(),
    }
  } else {
    /* */
  }

  const validationSchema: any = YupObject().shape(valSchema)

  const handleOnSubmit = (values: any) => {
    setLoading(true)

    if (change === 'detail') {
      const param: any = {
        first_name: values?.first_name || '',
        last_name: values?.last_name || '',
        billing_details: {
          address: {
            city: values?.city || '',
            country: values?.country?.value || values?.country || '',
            line1: values?.line1 || '',
            line2: values?.line2 || '',
            postal_code: values?.postcode || '',
            state: values?.state || '',
          },
          email: values?.email || '',
          phone:
            values?.phone_code && values?.phone_number
              ? `${values?.phone_code} ${values?.phone_number}`
              : '',
          billing_company: values?.company?.value || values?.company || '',
        },
      }

      checkoutPaymentContant(param)
        .then(({data}: any) => {
          const {message}: any = data || {}
          ToastMessage({type: 'success', message})
          setRedirect(true)
          setLoading(false)
        })
        .catch((err: any) => {
          setLoading(false)
          const {devMessage, data}: any = err?.response?.data || {}
          if (!devMessage) {
            const {fields} = data || {}
            Object.keys(fields || {})?.map((item: any) => {
              ToastMessage({message: fields?.[item]?.[0], type: 'error'})
              return true
            })
          }
        })
    } else {
      const profile: any = {
        first_name: values?.first_name || '',
        last_name: values?.last_name || '',
      }
      const billing_details: any = {
        name: values?.card_name || '',
        email: values?.email || '',
        phone:
          values?.phone_code && values?.phone_number
            ? `${values?.phone_code} ${values?.phone_number}`
            : '',
        billing_company: values?.company?.value || values?.company || '',
        address: {
          city: values?.city || '',
          country: values?.country?.value || values?.country || '',
          line1: values?.line1 || '',
          line2: values?.line2 || '',
          postal_code: values?.postcode || '',
          state: values?.state || '',
        },
      }
      const card: any = {
        number: values?.card_number || '',
        exp_month: values?.exp_month || '',
        exp_year: values?.exp_year || '',
        cvc: values?.cvc || '',
      }

      checkout({...profile, billing_details, card})
        .then(({data}: any) => {
          const {message}: any = data || {}
          ToastMessage({type: 'success', message})
          setRedirect(true)
          setLoading(false)
        })
        .catch(({response}: any) => {
          setLoading(false)
          const {devMessage, data, httpStatus, message} = response?.data || {}
          if (!devMessage) {
            const {fields} = data || {}
            if (httpStatus === 400) {
              ToastMessage({message: message, type: 'error'})
            }

            Object.keys(fields || {})?.map((item: any) => {
              ToastMessage({message: fields?.[item]?.[0], type: 'error'})
              return true
            })
          }
        })
    }
  }

  useEffect(() => {
    getOwnerSubscription()
      .then(({data: {data: res}}: any) => {
        if (res?.plan) {
          const {plan}: any = res || {}
          const {name}: any = plan || {}
          if (name) {
            const plan_name = name?.split(' ')?.[0]
            setPlan({
              ...plan,
              name: plan_name,
            })
          }
        }
      })
      .catch(() => '')

    getDataCheckout({})
      .then(({data: {data: res}}: any) => {
        if (res?.[0]) {
          const {billing_detail}: any = res?.[0] || {}
          const {address, phone}: any = billing_detail || {}
          const {country} = address || {}
          setDetail((prev: any) => ({
            ...prev,
            country: country || '',
            phone: phone || '',
          }))
        }
      })
      .catch(() => '')

    getPaymentContact()
      .then(({data: res}: any) => {
        if (res && Object.keys(res || {})?.length > 0) {
          const {first_name, last_name, billing_detail}: any = res
          const {company, email, phone, name, address}: any = billing_detail || {}
          const {line1, line2, city, state, postal_code, country}: any = address || {}
          setDataBilling({
            first_name: first_name || '',
            last_name: last_name || '',
            company: company || '',
            email: email || '',
            phone_number: phone || '',
            line1: line1 || '',
            line2: line2 || '',
            city: city || '',
            state: state || '',
            postcode: postal_code || '',
            country_contact: country || '',
            card_name: name || '',
          })
        }
      })
      .catch(() => '')
  }, [])

  useEffect(() => {
    getCompany({})
      .then(({data: {data: res}}: any) => {
        if (res?.[0]) {
          setCompanyData(() => ({
            line1: res?.[0]?.address_one || '',
            line2: res?.[0]?.address_two || '',
            city: res?.[0]?.city || '',
            state: res?.[0]?.state || '',
            postcode: res?.[0]?.postcode || '',
            country: res?.[0]?.country || '',
          }))
        }
        const resCompany: any = res?.find(({name}: any) => name === dataBilling?.company)
        setDefaultCompanyData({value: resCompany?.guid, label: resCompany?.name})
      })
      .catch(() => '')
  }, [dataBilling])

  useEffect(() => {
    const defaultCountry: string = dataBilling?.country_contact
    if (defaultCountry && dataCountry) {
      const resCountry: any = dataCountry?.find(({name}: any) => name === defaultCountry)
      setDefaultCountryData({value: resCountry?.iso_code, label: resCountry?.name})
    }
  }, [dataBilling?.country_contact])

  useEffect(() => {
    if (dataPreference && dataPreference?.length > 0) {
      setPhodeCodeMatchPref(dataPreference)
    }
  }, [dataPreference])

  useEffect(() => {
    if (redirect) {
      navigate('/billing/billing-overview')
    }
  }, [redirect])

  const initialValues: any = {
    first_name: dataBilling?.first_name || currentUser?.first_name || '',
    last_name: dataBilling?.last_name || currentUser?.last_name || '',
    company: dataBilling?.company
      ? defaultCompanyData
      : {value: currentUser?.company?.guid || '', label: currentUser?.company?.name || ''},
    email: dataBilling?.email || currentUser?.email || '',
    phone_number:
      dataBilling?.phone_number?.split(' ')?.[1] || detail?.phone_number?.split(' ')?.[1] || '',
    phone_code:
      dataBilling?.phone_number?.split(' ')?.[0] ||
      detail?.phone_number?.split(' ')?.[0] ||
      phoneCodeMatchPref?.phone_code ||
      '',
    line1: dataBilling?.line1 || companyData?.line1 || '',
    line2: dataBilling?.line2 || companyData?.line2 || '',
    city: dataBilling?.city || companyData?.city || '',
    state: dataBilling?.state || companyData?.state || '',
    postcode: dataBilling?.postcode || companyData?.postcode || '',
    country: dataBilling?.country_contact
      ? defaultCountryData?.value
      : dataPreference?.country_code,
    card_name: '',
    card_number: '',
    exp_month: '',
    exp_year: '',
    cvc: '',
  }

  const pageTitleMsgId: any = 'PAGETITLE.BILLING_FORM'
  const pageTitle: any = change ? 'Edit Payment Details' : intl.formatMessage({id: pageTitleMsgId})

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {pageTitle}
        {/* {change ? 'Edit Payment Details' : `${intl.formatMessage({id: 'PAGETITLE.BILLING_FORM'})}`} */}
      </PageTitle>
      <Formik
        initialValues={initialValues}
        enableReinitialize
        validationSchema={validationSchema}
        onSubmit={(values: any) => handleOnSubmit(values)}
      >
        {({setFieldValue, errors, isValidating, isSubmitting, setSubmitting, values}: any) => {
          if (
            isSubmitting &&
            isValidating &&
            errSubmitForm &&
            Object.keys(errors || {})?.length > 1
          ) {
            ToastMessage({
              message: require_filed_message,
              type: 'error',
            })
            setSubmitting(false)
            setErrSubmitForm(false)
          }

          return (
            <Form className='justify-content-center' noValidate>
              <div className='row'>
                <div className='col-md-8'>
                  <ContactDetail
                    configClass={configClass}
                    values={values}
                    setFieldValue={setFieldValue}
                    detail={detail}
                    phoneCode={phoneCode}
                    setPhoneCode={setPhoneCode}
                  />

                  <AddressDetail
                    configClass={configClass}
                    country={isCountry}
                    setCountry={setIsCountry}
                  />

                  {change !== 'detail' && (
                    <CardDetail
                      configClass={configClass}
                      values={values}
                      setFieldValue={setFieldValue}
                      detail={detail}
                    />
                  )}

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
                    <SubscriptionSummary plan={plan} loading={loading} />
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

export default ConfirmationForm
