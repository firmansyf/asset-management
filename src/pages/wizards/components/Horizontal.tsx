/* eslint-disable react-hooks/exhaustive-deps */
import {getUserByToken} from '@api/AuthCRUD'
import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken, errorValidation, hasPermission, KTSVG, toAbsoluteUrl} from '@helpers'
import {ScrollTopComponent, StepperComponent} from '@metronic/assets/ts/components'
import {saveCurrentUser, savePreference} from '@redux'
import {Form, Formik} from 'formik'
import {orderBy, remove} from 'lodash'
import {FC, memo, useCallback, useEffect, useRef, useState} from 'react'
import {Button} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import Swal from 'sweetalert2'

import {
  editCompany,
  editPreference,
  editProfile,
  getCompany,
  getDatabases,
  getFeature,
  getLocationStatus,
  setupDatabasesAsset,
} from '../redux/WizardService'
import {createAccountSchemas, intialValue} from './CreateAccountWizardHelper'
import {ModalAddCategory} from './ModalAddCategory'
import {ModalAddLocation} from './ModalAddLocation'
import {ModalAddSubLocation} from './ModalAddSubLocation'
import {ModalCustomField} from './ModalCustomField'
import {Complete} from './steps/Complete'
import {Step1} from './steps/Step1'
import {Step2} from './steps/Step2'
import {Step3} from './steps/Step3'
import {Step4} from './steps/Step4'
import {Step5} from './steps/Step5'
import {Step6} from './steps/Step6'
import UserMenu from './UserMenu'

type HorizontalProps = {
  title: any
  subtitle: any
  no: any
  step: any
}

const StepperItem: FC<HorizontalProps> = ({title = 'Title', subtitle = '', no = 0, step = ''}) => {
  return (
    <div
      className={`stepper-item ${step === no ? 'current' : step > no ? 'completed' : ''} ${
        no === 6 ? 'step-6' : ''
      }`}
      data-kt-stepper-element='nav'
      style={no === 7 ? {display: 'none'} : {}}
    >
      <div className='stepper-line w-40px' />
      <div className='stepper-icon w-40px h-40px rounded-circle'>
        <i className='stepper-check fas fa-check' />
        <span className='stepper-number'>{no || 0}</span>
      </div>
      <div className='stepper-label col'>
        <h5 className='stepper-title m-0' style={{fontSize: '10pt'}}>
          {title || ''}
        </h5>
        {subtitle && <div className='stepper-desc fw-bold'>{subtitle || ''}</div>}
      </div>
    </div>
  )
}

let Horizontal: FC<any> = () => {
  const intl: any = useIntl()
  const buttonRef: any = useRef(null)
  const stepper: any = useRef<StepperComponent | null>(null)
  const stepperRef: any = useRef<HTMLDivElement | null>(null)
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {
    country: dataCountry,
    currency: dataCurrency,
    timezone: dataTimezone,
    preference: dataPreference,
  }: any = preferenceStore || {}

  // const [timezone, setTimezone] = useState([])
  // const [currency, setCurrency] = useState([])
  const [feature, setFeature] = useState<any>([])
  const [database, setDatabase] = useState<any>([])
  const [indexNext, setIndexNext] = useState<any>(0)
  const [errForm, setErrForm] = useState<boolean>(true)
  const [preference, setPreference] = useState<any>([])
  const [arrOption, setArrayOption] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [fieldAsset, setFieldAssetData] = useState<any>([])
  const [companyPhoto, setCompanyPhoto] = useState<any>([])
  const [locationStatus, setLocationStatus] = useState<any>()
  const [locationDetail, setLocationDetail] = useState<any>()
  const [categoryDetail, setDetailCategory] = useState<any>([])
  const [loadingSkip, setLoadingSkip] = useState<boolean>(false)
  const [reloadCategory, setReloadCategory] = useState<number>(0)
  const [matchPreference, setMatchPreference] = useState<any>({})
  const [reloadLocation, setReloadLocation] = useState<number>(0)
  const [subLocationDetail, setSubLocationDetail] = useState<any>()
  const [showModal, setShowModalLocation] = useState<boolean>(false)
  const [initValues, setCurrentValue] = useState<any>(intialValue[0])
  const [customFieldDetail, setDetailCustomField] = useState<any>([])
  const [reloadSubLocation, setReloadSubLocation] = useState<number>(0)
  const [reloadCustomField, setReloadCustomField] = useState<number>(0)
  const [showModalCategory, setShowModalCategory] = useState<boolean>(false)
  const [currentSchema, setCurrentSchema] = useState<any>(createAccountSchemas[0])
  const [showModalSubLocation, setShowModalSubLocation] = useState<boolean>(false)
  const [showModalCustomField, setShowModalCustomField] = useState<boolean>(false)
  const [companyCountry, setCompanyCountry] = useState<any>({})
  const [skipMessage, setSkipMessage] = useState<string>('')

  const companyEdit: any = hasPermission('setting.company.edit') || false
  const databaseEdit: any = hasPermission('setting.database.edit') || false
  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})

  const filterSubLocation = () => ''

  const prevStep = () => {
    if (!stepper?.current) {
      return
    }
    const index: any = stepper?.current?.currentStepIndex || 0
    setIndexNext(index - 1)

    stepper?.current?.goPrev()
    setCurrentSchema(createAccountSchemas?.[stepper?.current?.currentStepIndex - 1])
    getDataIndex()
  }

  const nextStep = () => {
    if (!stepper?.current) {
      return
    }

    if (stepper?.current?.currentStepIndex !== stepper?.current?.totatStepsNumber) {
      const index: any = stepper?.current?.currentStepIndex || 0
      if (stepper?.current?.currentStepIndex === 5) {
        setLoading(true)
        if (databaseEdit) {
          setupDatabasesAsset({fields: fieldAsset?.length === 0 ? database : fieldAsset})
            .then(() => {
              setLoading(false)
              goNextStep(index)
            })
            .catch(() => setLoading(false))
        } else {
          setLoading(false)
          ToastMessage({
            type: 'success',
            message: 'User does not have the right permissions to update Asset Database Fields',
          })
        }
      } else {
        goNextStep(index)
      }
    } else {
      setLoading(true)
      editProfile({registration_wizard_status: 0, preference})
        .then(() => {
          setLoading(false)
          getUserByToken()
            .then(({data: {data: res_user}}: any) => {
              saveCurrentUser(res_user)
              window.location.href = '/dashboard'
            })
            .catch((e: any) => errorExpiredToken(e))
        })
        .catch((err: any) => {
          Object.values(errorValidation(err))?.map((message: any) =>
            ToastMessage({message, type: 'error'})
          )
        })
    }

    setCurrentSchema(createAccountSchemas?.[stepper?.current?.currentStepIndex])
    getDataIndex()
  }

  const submitStep = (values: any) => {
    if (!stepper?.current) {
      return
    }
    setLoading(true)
    setCurrentSchema(createAccountSchemas[stepper?.current?.currentStepIndex])
    const index: any = stepper?.current?.currentStepIndex || 0

    if (index === 1) {
      const params_company: any = {
        tax_number: '',
        city: values?.city || '',
        registration_number: null,
        state: values?.state || '',
        name: values?.company || '',
        photo: values?.photo || null,
        street: values?.street || '',
        country_code: values?.country || '',
        postcode: values?.postal_code || '',
        address_1: values?.address_one || '',
        address_2: values?.address_two || '',
        financial_year_begin:
          (values?.financial_month || 1)?.toString()?.padStart(2, '0') +
          '-' +
          (values?.financial_day || 1)?.toString()?.padStart(2, '0'),
        status: 1,
        remove_photo: values?.photo === null ? true : false,
      }

      if (companyEdit) {
        editCompany(params_company, values?.company_guid)
          .then(() => {
            const params_preference: any = {
              currency: values?.currency,
              date_format: values?.date_format,
              time_format: values?.time_format,
              timezone: values?.timezone,
              country_code: values?.country,
            }
            const params_pref: any = {
              ...params_preference,
              country: companyCountry?.label || null,
              country_code: companyCountry?.value || null,
            }

            editPreference(params_preference)
              .then(() => {
                savePreference({preference: params_pref})
                goNextStep(2)
                setLoading(false)
              })
              .catch((err: any) => {
                errorExpiredToken(err)
                Object.values(errorValidation(err))?.map((message: any) =>
                  ToastMessage({message, type: 'error'})
                )
              })
          })
          .catch((err: any) => {
            setLoading(false)
            errorExpiredToken(err)
            const {response} = err || {}
            const {devMessage, data} = response?.data || {}
            const {fields} = data || {}

            if (!devMessage && fields && Object.keys(fields || {})?.length > 0) {
              Object.keys(fields || {})?.map((item: any) => {
                if (item === 'postcode') {
                  ToastMessage({
                    message:
                      fields?.[item]?.[0] || 'The postcode should not be more than 10 digits.',
                    type: 'error',
                  })
                }

                if (item !== 'postcode') {
                  ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
                }
                return true
              })
            }
          })
      } else {
        setLoading(false)
        ToastMessage({
          type: 'error',
          message: 'User does not have the right permissions to update Company',
        })
      }
    }
  }

  const goNextStep = (index: any) => {
    if (!stepper?.current) {
      return
    }

    const index2: any = stepper?.current?.currentStepIndex || 0
    setIndexNext(index2 + 1)
    if (index !== stepper?.current?.totatStepsNumber) {
      stepper?.current?.goNext()
      getDataIndex()
    } else {
      setTimeout(() => (window.location.href = '/dashboard'), 2000)
    }
  }

  const getDataStep1 = useCallback(() => {
    setLoading(true)

    getCompany()
      .then((e: any) => {
        const {data: res}: any = e || {}
        const {data: data_company}: any = res || {}
        const data: any = dataPreference || {}

        if (Array.isArray(data_company) && data_company?.[0] && data) {
          const company: any = data_company?.[0]
          const financial_month: any = company?.financial_year_begin?.date
            ? parseInt(company?.financial_year_begin?.date?.split('-')?.[0])
            : 1
          const financial_day: any = company?.financial_year_begin?.date
            ? parseInt(company?.financial_year_begin?.date?.split('-')[1])
            : 1

          setCompanyCountry({value: company?.country?.code, label: company?.country?.name})

          setCurrentValue({
            city: company?.city || '',
            state: company?.state || '',
            company: company?.name || '',
            timezone: data?.timezone || '',
            currency: data?.currency || '',
            company_guid: company?.guid || '',
            financial_day: financial_day || 0,
            // address: company?.address || '',
            date_format: data?.date_format || '',
            time_format: data?.time_format || '',
            postal_code: company?.postcode || '',
            financial_month: financial_month || '',
            address_one: company?.address_one || '',
            address_two: company?.address_two || '',
            registration_number: company?.registration_number || '',
            country: company?.country?.code || data?.country_code || '',
          })

          setCompanyPhoto(company?.photo || '')
        }
        setLoading(false)
      })
      .catch((e: any) => {
        setLoading(false)
        errorExpiredToken(e)
      })
  }, [dataCountry, dataTimezone, dataCurrency, dataPreference])

  const getDataStep2 = () => {
    getLocationStatus()
      .then(({data: {data: res_location_status}}: any) => {
        res_location_status && setLocationStatus(res_location_status)
      })
      .catch((e: any) => errorExpiredToken(e))
  }

  const getDataStep3 = useCallback(() => '', [])

  const getDataStep4 = useCallback(() => {
    setLoading(true)
    setTimeout(() => setLoading(false), 1000)
  }, [])

  const getDataStep5 = useCallback(() => {
    setLoading(true)
    getDatabases()
      .then(({data: {data: res_database}}: any) => {
        setDatabase(orderBy(res_database, 'is_required', 'desc') as never[])
        setLoading(false)
      })
      .catch((e: any) => {
        setLoading(false)
        errorExpiredToken(e)
      })
  }, [])

  const getDataStep6 = () => {
    getFeature()
      .then(({data: {data}}: any) => {
        remove(data, (data: any) => data?.unique_name === 'purchase_order')
        remove(data, (data: any) => data?.unique_name === 'item_code')
        setFeature(orderBy(data, ['name'], ['asc']))
        setTimeout(() => setLoading(false), 1000)
      })
      .catch((e: any) => errorExpiredToken(e))
  }

  const onSkipWizard = () => {
    setLoadingSkip(true)
    editProfile({registration_wizard_status: 0, preference})
      .then((res: any) => {
        setSkipMessage(res?.data?.message)
      })
      .catch((err: any) => {
        Object.values(errorValidation(err))?.map((message: any) =>
          ToastMessage({message, type: 'error'})
        )
      })

    Swal.fire({
      icon: 'warning',
      text: 'Are you sure you want to skip the wizard setup?',
      allowOutsideClick: false,
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonColor: '#050990',
      confirmButtonText: 'Skip',
      cancelButtonText: 'Cancel',
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return getUserByToken()
          .then(({data: {data: res_user}}) => {
            ToastMessage({type: 'success', message: skipMessage})
            saveCurrentUser(res_user)
            setLoadingSkip(false)
          })
          .catch((e: any) => {
            errorExpiredToken(e)
          })
      },
    }).then((result: any) => {
      if (result?.isConfirmed) {
        window.location.href = '/dashboard'
      } else {
        setLoadingSkip(false)
      }
    })
  }

  const finishOnStep6 = () => {
    editProfile({registration_wizard_status: 0, preference})
      .then(() => {
        Swal.fire({
          html: `
          <img src='/media/icons/duotone/Assetdata/CheckIcon.svg' width='240' />
          <h2 class='text-primary'>You're Done!</h2>
          `,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = '/dashboard'
        })
        // automatically redirect if no action in 3 seconds
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 3000)
      })
      .catch((err: any) => {
        Object.values(errorValidation(err))?.map((message: any) =>
          ToastMessage({message, type: 'error'})
        )
      })
  }

  const getDataIndex = useCallback(() => {
    ToastMessage({type: 'clear'})
    if (!stepper?.current) {
      return
    }

    const index: any = stepper?.current?.currentStepIndex || 0
    switch (index) {
      case 1:
        getDataStep1()
        break
      case 2:
        getDataStep2()
        break
      case 3:
        getDataStep3()
        break
      case 4:
        getDataStep4()
        break
      case 5:
        getDataStep5()
        break
      case 6:
        getDataStep6()
        break
      default:
        break
    }
  }, [getDataStep1])

  useEffect(() => {
    const loadStepper = () => {
      stepper.current = StepperComponent.createInsance(stepperRef?.current as HTMLDivElement)

      if (!stepper?.current) {
        return
      }
      getDataIndex()
    }

    if (!stepperRef?.current) {
      return
    }
    loadStepper()

    if (dataPreference) {
      const {date_format, timezone, time_format}: any = dataPreference || {}
      const preference_data: any = {
        timezone: timezone || '-',
        date_format: date_format || '-',
        time_format: time_format || '-',
      }
      setPreference(preference_data || {})
      setMatchPreference(dataPreference || {})
    }
  }, [stepperRef, getDataIndex, dataPreference])

  return (
    <div
      ref={stepperRef}
      data-kt-stepper='true'
      id='kt_create_account_stepper'
      className='stepper stepper-pills stepper-column'
    >
      <div className='row'>
        {(!stepper?.current || stepper?.current?.currentStepIndex <= 6) && (
          <div className='col-md-3'>
            <div
              className='card radius-0 shadow-none sticky-top border-end border-5 border-f5'
              style={{
                top: stepperRef?.current ? `${stepperRef?.current?.offsetTop}px` : '11.5rem',
                zIndex: 9,
              }}
            >
              <div className='card-body py-0 px-4'>
                <div className='btn d-block p-0 mb-10 ms-n3'>
                  <img
                    alt='Logo'
                    className='h-auto w-100'
                    src={toAbsoluteUrl('/media/logos/logo-assetdata.png')}
                  />
                </div>
                <div className='stepper-nav'>
                  <StepperItem
                    no={1}
                    title='Company'
                    subtitle={undefined}
                    step={stepper?.current?.currentStepIndex}
                  />

                  <StepperItem
                    no={2}
                    title='Locations'
                    subtitle={undefined}
                    step={stepper?.current?.currentStepIndex}
                  />

                  <StepperItem
                    no={3}
                    title='Sub Locations'
                    subtitle={undefined}
                    step={stepper?.current?.currentStepIndex}
                  />

                  <StepperItem
                    no={4}
                    subtitle={undefined}
                    title='Asset Categories'
                    step={stepper?.current?.currentStepIndex}
                  />

                  <StepperItem
                    no={5}
                    subtitle={undefined}
                    title='Asset Database and Custom Fields'
                    step={stepper?.current?.currentStepIndex}
                  />

                  <StepperItem
                    no={6}
                    title='Features'
                    subtitle={undefined}
                    step={stepper?.current?.currentStepIndex}
                  />

                  <StepperItem
                    no={7}
                    title='Complete'
                    subtitle={undefined}
                    step={stepper?.current?.currentStepIndex}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          className={
            stepper?.current && stepper?.current?.currentStepIndex <= 6
              ? 'col-md-9'
              : 'col-md-8 offset-md-2'
          }
        >
          {stepper?.current?.currentStepIndex <= 6 && (
            <div
              className='position-sticky top-0 text-center mb-5 bg-fa p-5 radius-10'
              style={{zIndex: 9}}
            >
              <div className='row'>
                <div className='col-1 order-last'>
                  <UserMenu />
                </div>

                <div className='col-11 order-first'>
                  <div className='d-flex align-items-center justify-content-center mb-2'>
                    <h1 className='m-0 text-primary'>Setup Wizard</h1>
                  </div>

                  <p className='fw-bold m-0 fs-6'>
                    <span className='fw-bolder fs-4 me-1 text-primary'>Welcome !</span>
                    {intl.formatMessage({
                      id: 'NOW_COMPLETE_THIS_INFORMATION_TO_HELP_YOU_SETUP_YOUR_ACCOUNT_THE_WAY_YOU_WANT_IT',
                    })}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className='card shadow-none'>
            <div className='card-body pb-0 px-3'>
              <Formik
                validationSchema={currentSchema}
                initialValues={initValues}
                enableReinitialize
                onSubmit={submitStep}
              >
                {({setFieldValue, isSubmitting, isValidating, errors, values}: any) => {
                  if (isSubmitting && errForm && Object.keys(errors || {})?.length > 0) {
                    setErrForm(false)
                  }

                  if (
                    isSubmitting &&
                    isValidating &&
                    !errForm &&
                    stepper?.current?.currentStepIndex === 1 &&
                    Object.keys(errors || {})?.length > 0
                  ) {
                    ToastMessage({message: require_filed_message, type: 'error'})
                    setErrForm(false)
                  }

                  if (isSubmitting && Object.keys(errors || {})?.length > 0) {
                    ScrollTopComponent.goTop()
                  }
                  return (
                    <Form className='justify-content-center' noValidate>
                      <div className='current' data-kt-stepper-element='content'>
                        <Step1
                          errors={errors}
                          values={values}
                          initialValues={initValues}
                          companyPhoto={companyPhoto}
                          setFieldValue={setFieldValue}
                          setCompanyCountry={setCompanyCountry}
                        />
                      </div>

                      <div data-kt-stepper-element='content'>
                        <Step2
                          reload={reloadLocation}
                          setLocationDetail={setLocationDetail}
                          reloadSubLocation={reloadSubLocation}
                          setReloadSubLocation={setReloadSubLocation}
                          setShowModalLocation={setShowModalLocation}
                        />
                      </div>

                      <div data-kt-stepper-element='content'>
                        <Step3
                          reload={reloadSubLocation}
                          filterSubLocation={filterSubLocation}
                          setSubLocationDetail={setSubLocationDetail}
                          setShowModalSubLocation={setShowModalSubLocation}
                        />
                      </div>

                      <div data-kt-stepper-element='content'>
                        <Step4
                          reloadCategory={reloadCategory}
                          setDetailCategory={setDetailCategory}
                          setShowModalCategory={setShowModalCategory}
                        />
                      </div>

                      <div data-kt-stepper-element='content'>
                        <Step5
                          database={database}
                          setArrayOption={setArrayOption}
                          setFieldAssetData={setFieldAssetData}
                          reloadCustomField={reloadCustomField}
                          setDetailCustomField={setDetailCustomField}
                          setShowModalCustomField={setShowModalCustomField}
                        />
                      </div>

                      <div data-kt-stepper-element='content'>
                        <Step6 feature={feature} />
                      </div>

                      <div data-kt-stepper-element='content'>
                        <Complete onBack={prevStep} onComplete={nextStep} index={indexNext} />
                      </div>

                      {stepper?.current &&
                        stepper?.current?.currentStepIndex >= 0 &&
                        stepper?.current?.currentStepIndex <= 6 && (
                          <div
                            className='d-flex flex-stack p-8 mx-n5'
                            style={{
                              bottom: 0,
                              zIndex: 9,
                              background: `#fff`,
                              borderRadius: '10px',
                              // background: `#fff url(${toAbsoluteUrl(`/media/svg/shapes/abstract-3.svg`)}) center / cover no-repeat`
                            }}
                          >
                            <div className='mr-2'>
                              <button
                                type='button'
                                onClick={prevStep}
                                data-kt-stepper-action='previous'
                                className='btn btn-lg btn-light-primary me-3'
                              >
                                <KTSVG
                                  className='svg-icon-4 me-1'
                                  path='/media/icons/duotone/Navigation/Left-2.svg'
                                />
                                Back
                              </button>
                            </div>

                            <div>
                              <button
                                type='button'
                                onClick={onSkipWizard}
                                disabled={loadingSkip}
                                className='btn btn-lg btn-light-primary me-3'
                              >
                                {!loadingSkip && (
                                  <span className='indicator-label'>
                                    <KTSVG
                                      className='svg-icon-4 me-1'
                                      path='/media/icons/duotone/Navigation/Exchange.svg'
                                    />
                                    Skip Wizard
                                  </span>
                                )}

                                {loadingSkip && (
                                  <span className='indicator-progress' style={{display: 'block'}}>
                                    Please wait...
                                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                  </span>
                                )}
                              </button>
                              {stepper?.current?.currentStepIndex < 6 ? (
                                <Button
                                  id={indexNext}
                                  ref={buttonRef}
                                  disabled={loading}
                                  variant='btn btn-lg btn-primary'
                                  type={
                                    stepper?.current?.currentStepIndex === 1 ? 'submit' : 'button'
                                  }
                                  onClick={() => {
                                    stepper?.current?.currentStepIndex > 1 && nextStep()
                                    setTimeout(() => buttonRef?.current?.blur(), 500)
                                  }}
                                >
                                  {!loading && (
                                    <span className='indicator-label'>
                                      Continue
                                      <KTSVG
                                        className='svg-icon-3 ms-2 me-0'
                                        path='/media/icons/duotone/Navigation/Right-2.svg'
                                      />
                                    </span>
                                  )}
                                  {loading && (
                                    <span className='indicator-progress' style={{display: 'block'}}>
                                      Please wait...
                                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                    </span>
                                  )}
                                </Button>
                              ) : (
                                <Button
                                  id={indexNext}
                                  type={'button'}
                                  ref={buttonRef}
                                  disabled={loading}
                                  onClick={finishOnStep6}
                                  variant='btn btn-lg btn-primary'
                                >
                                  {!loading && <span className='indicator-label'>Complete</span>}
                                  {loading && (
                                    <span className='indicator-progress' style={{display: 'block'}}>
                                      Please wait...
                                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                                    </span>
                                  )}
                                </Button>
                              )}
                            </div>
                          </div>
                        )}
                    </Form>
                  )
                }}
              </Formik>
            </div>
          </div>
        </div>
      </div>

      <ModalAddLocation
        showModal={showModal}
        reloadLocation={reloadLocation}
        locationStatus={locationStatus}
        locationDetail={locationDetail}
        matchPreference={matchPreference}
        setReloadLocation={setReloadLocation}
        setShowModalLocation={setShowModalLocation}
      />

      <ModalAddSubLocation
        showModal={showModalSubLocation}
        reloadSubLocation={reloadSubLocation}
        subLocationDetail={subLocationDetail}
        setShowModal={setShowModalSubLocation}
        setReloadSubLocation={setReloadSubLocation}
      />

      <ModalAddCategory
        showModal={showModalCategory}
        categoryDetail={categoryDetail}
        reloadCategory={reloadCategory}
        setShowModal={setShowModalCategory}
        setReloadCategory={setReloadCategory}
      />

      <ModalCustomField
        arrOption={arrOption}
        setArrayOption={setArrayOption}
        showModal={showModalCustomField}
        customFieldDetail={customFieldDetail}
        reloadCustomField={reloadCustomField}
        setShowModal={setShowModalCustomField}
        setReloadCustomField={setReloadCustomField}
      />
    </div>
  )
}

Horizontal = memo(
  Horizontal,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)

export default Horizontal
