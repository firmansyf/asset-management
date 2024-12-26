import {getPlanRegister, register} from '@api/AuthCRUD'
import {configClass, KTSVG} from '@helpers'
import clsx from 'clsx'
import {useFormik} from 'formik'
import {filter, includes, size} from 'lodash'
import {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import Select from 'react-select'
import Swal from 'sweetalert2'
import * as Yup from 'yup'

const specialCharRegex: any = /^[A-Za-z0-9]+$/

const registrationSchema: any = Yup.object().shape({
  firstname: Yup.string().required('First Name is required'),
  lastname: Yup.string().required('Last Name is required'),
  email: Yup.string().required('Email is required').email('This is not a valid email address'),
  // companySize: Yup.object().required('Company Size is required'),
  fqdn: Yup.string()
    .required('Site is required')
    .matches(specialCharRegex, 'Site may only contain letters and numbers')
    .test(
      'len',
      'Site must be at least 3 characters',
      (val: any) => (val || '')?.toString()?.length >= 3
    )
    .test(
      'len',
      'Site may not be greater than 18 characters',
      (val: any) => (val || '')?.toString()?.length < 19
    ),
  acceptTerms: Yup.bool().required('Agree with the Term & Conditions is required'),
  companyName: Yup.string().when('accountType', {
    is: 1,
    then: () => Yup.string().required('Company Name is required'),
  } as any),
  planId: Yup.object().required('Plan is required'),
})

const Registration: FC = () => {
  const intl: any = useIntl()
  const urlSearchParams: any = new URLSearchParams(window.location.search)
  const params: any = Object.fromEntries(urlSearchParams.entries())
  const {totalAssets, billed, plan}: any = params || {}

  const checkedBusiness = useState<boolean>(true)
  const [typing, setTyping] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [defaultPlan, setDefaultPlan] = useState<any>('')
  const [tncAgree, setTncAgree] = useState<boolean>(false)
  const [isSuccess, setSuccess] = useState<boolean>(false)
  const [isExists, setIsExists] = useState<boolean>(false)
  const [assetDataPlan, setAssetDataPlan] = useState<any>([])
  const [planMessage, setPlanMessage] = useState<boolean>(false)
  // const [dataCompanySize, setCompanySize] = useState<any>('')

  const initialValues: any = {
    firstname: '',
    lastname: '',
    email: '',
    fqdn: '',
    companyName: '',
    companySize: '',
    accountType: 1,
    acceptTerms: false,
    planId: defaultPlan || '',
  }

  // const onChangeSite = debounce((tenant: any) => {
  //   if (tenant === '' || tenant?.length < 3) {
  //     setIsExists(false)
  //     setTyping(false)
  //   } else {
  //     checkTenant(tenant).then((res: any) => {
  //       setIsExists(res?.data?.exists)
  //       setTyping(res?.data?.exists)
  //     })
  //   }
  // }, 500)

  useEffect(() => {
    let param = ''
    if (totalAssets && billed) {
      param = `filter_ip_address=true&filter[limit_asset]=${totalAssets}&filter[billing_cycle]=${billed}`
    } else {
      if (plan === 'free') {
        param = `filter[limit_asset]=${totalAssets}`
      } else {
        param = `filter_ip_address=true&filter[limit_asset]=500&filter[billing_cycle]=monthly`
      }
    }

    if (param) {
      getPlanRegister(param).then(({data: {data: res}}: any) => {
        if (res) {
          setAssetDataPlan(res)
          const dataPlan: any = filter(res, (data_plan: any) =>
            includes(plan, data_plan?.unique_id)
          )
          setDefaultPlan(dataPlan[0]?.id)

          if (plan !== '' && plan !== undefined) {
            let selected_plan = ''
            if (plan === 'advanced') {
              selected_plan = '5'
            } else if (plan === 'professional') {
              selected_plan = '4'
            } else if (plan === 'free') {
              selected_plan = '1'
            } else {
              selected_plan = '3'
            }
            const dataPlan: any = filter(res, (data_plan: any) =>
              includes(selected_plan, data_plan?.plan_group)
            )
            setDefaultPlan({value: dataPlan[0]?.id, label: dataPlan[0]?.name})
          } else {
            setDefaultPlan('')
          }

          setAssetDataPlan(
            res?.map(({id, name}: any) => ({
              value: id,
              label: name,
            }))
          )
        }
      })
    }
  }, [totalAssets, billed, plan])

  const onClick = (e: any) => {
    if (e?.target?.value === 'false') {
      setTncAgree(true)
    } else {
      setTncAgree(false)
    }
  }

  const formik: any = useFormik({
    initialValues: initialValues,
    enableReinitialize: true,
    validationSchema: registrationSchema,
    onSubmit: (values: any, {setStatus, setSubmitting}) => {
      const params = {
        account_type: values?.accountType, // 1 business
        company_name: values?.companyName,
        company_size: '',
        email: values?.email,
        first_name: values?.firstname,
        fqdn: values?.fqdn,
        isAggress: values?.acceptTerms ? 'on' : 'off',
        last_name: values?.lastname,
        plan_id: values?.planId?.value, // 24 plan id for develop
        return_ok_url: `https://${values?.fqdn}.${process.env.REACT_APP_BASE_DOMAIN}/set-password`,
      }

      setLoading(true)
      setTimeout(() => {
        register(params)
          .then(() => {
            setSuccess(true)
            setLoading(false)
          })
          .catch((error: any) => {
            setLoading(false)
            setSubmitting(false)
            Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: error?.response?.data?.data?.fields?.fqdn?.[0],
              showConfirmButton: false,
            })
            setStatus(
              error?.response?.data?.message === 'Duplicated entry'
                ? 'Site or Email is has been taken.'
                : error?.response?.data?.data?.fields?.fqdn?.[1]
            )
          })
      }, 1000)
    },
  })

  const styleOpt: any = () => ({
    control: (provided: any) => ({
      ...provided,
      '&:hover, &:focus': {
        borderColor: '#eef3f7',
        backgroundColor: '#eef3f7',
      },
      display: 'flex',
      flexWrap: 'nowrap',
      width: '100%',
      borderRadius: 5,
      borderColor: '#eef3f7',
      padding: 2.5,
      cursor: 'default',
      minHeight: 10,
      boxShadow: 'unset',
      backgroundColor: '#eef3f7',
      fontSize: '1.1rem',
      fontWeight: 500,
    }),
    singleValue: (provided: any, _state: any) => ({
      ...provided,
      color: '#5e6278',
      fontSize: '1.1rem',
      fontWeight: 500,
    }),
    valueContainer: (provided: any, _state: any) => ({
      ...provided,
      lineHeight: 1.5,
    }),
    placeholder: (provided: any, _state: any) => ({
      ...provided,
      color: '#a1a6b6',
      fontWeight: 500,
      fontSize: '1.1rem',
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state?.isSelected ? '#060990' : 'unset',
      '&:hover': {
        backgroundColor: '#060990',
        color: 'white',
      },
      fontWeight: 500,
    }),
  })

  return (
    <>
      {isSuccess && (
        <div>
          <div className='text-center'>
            <img src='/media/icons/duotone/Assetdata/CheckIcon.svg' width={240} />
          </div>

          <div className='text-center'>
            <p style={{fontSize: 22, color: '#fff', marginTop: '20px'}}>
              {intl.formatMessage({
                id: 'YOU_RE_SIGNED_UP',
              })}
            </p>

            <div className='d-flex w-full align-items-center'>
              <p style={{fontSize: 16, color: '#fff', marginTop: '15px'}}>
                {/* {intl.formatMessage({
                  id: 'PLEASE_CLICK_NO_THE_LINK_THAT_HAS_JUST_BEEN_SENT_TO_YOUR_EMAIL_TO_ACTIVATE_YOUR_ACCOUNT',
                })} */}
                Please click on the link that has just been sent <br /> to your email to activate
                your account.
              </p>
            </div>
          </div>
        </div>
      )}

      {!isSuccess && (
        <div className='w-xl-700px w-lg-900px bg-white rounded shadow-sm p-8 mx-auto'>
          <form
            className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
            noValidate
            id='kt_login_signup_form'
            onSubmit={formik?.handleSubmit}
          >
            <div className='mb-6 text-center'>
              <h1 className='text-dark mb-3'>Create an Account</h1>
              {/* <div className='text-gray-400 fw-bold fs-4'>
              Already have an account?
              <Link to='/auth/login' className='link-primary fw-bolder' style={{marginLeft: '5px'}}>
                Forgot Password ?
              </Link>
            </div> */}
            </div>

            {formik?.status && (
              <div className='mb-lg-8'>
                {typing &&
                  (isExists ? (
                    <div className='mb-lg-8 alert alert-danger'>
                      <div className='alert-text font-weight-bold'>{formik?.status}</div>
                    </div>
                  ) : (
                    ''
                  ))}
              </div>
            )}

            {/* begin::Form group Firstname */}
            <div className='row fv-row'>
              <div className='col-md-6 first-name mb-4'>
                <label className={`${configClass?.label} required`}>First Name</label>
                <input
                  // placeholder='First Name'
                  type='text'
                  autoComplete='off'
                  {...formik?.getFieldProps('firstname')}
                  className={clsx(`${configClass?.form}`, {
                    // 'is-invalid': formik?.touched.firstname && formik?.errors?.firstname,
                  })}
                  style={{
                    background: '#eef3f7',
                  }}
                />
                {formik?.touched?.firstname && formik?.errors?.firstname && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block fs-8'>
                      <span role='alert'>{formik?.errors?.firstname}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className='col-md-6 last-name mb-4'>
                {/* begin::Form group Lastname */}
                <label className={`${configClass?.label} required`}>Last Name</label>
                <input
                  // placeholder='Last Name'
                  type='text'
                  autoComplete='off'
                  {...formik?.getFieldProps('lastname')}
                  className={clsx(`${configClass?.form}`, {
                    // 'is-invalid': formik?.touched.lastname && formik?.errors?.lastname,
                  })}
                  style={{
                    background: '#eef3f7',
                  }}
                />
                {formik?.touched?.lastname && formik?.errors?.lastname && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block fs-8'>
                      <span role='alert'>{formik?.errors?.lastname}</span>
                    </div>
                  </div>
                )}
                {/* end::Form group */}
              </div>
            </div>
            {/* end::Form group */}

            <div className='row fv-row'>
              {/* begin::Form group Email */}
              <div className='col-md-6 mb-4 email'>
                <label className={`${configClass?.label} required`}>Email</label>
                <input
                  // placeholder='Email Address'
                  type='email'
                  autoComplete='off'
                  {...formik?.getFieldProps('email')}
                  className={clsx(`${configClass?.form}`, {
                    // 'is-invalid': formik?.touched.email && formik?.errors?.email
                  })}
                  style={{background: '#eef3f7'}}
                  onChange={({target: {value}}: any) => {
                    formik?.setFieldValue('email', value?.toLowerCase())
                  }}
                />
                {((formik?.touched?.email && formik?.errors?.email) || formik?.status) && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block fs-8'>
                      <span role='alert'>{formik?.errors?.email}</span>
                    </div>
                  </div>
                )}
              </div>
              {/* end::Form group */}

              {/* Company size */}
              <div className='col-md-6 mb-4 plan-id'>
                <label className={`${configClass?.label} required`}>Plan</label>
                <Select
                  name='planId'
                  // placeholder='Choose Plan'
                  placeholder=' '
                  styles={styleOpt()}
                  options={assetDataPlan}
                  value={formik?.values?.planId}
                  onChange={(props: any) => {
                    formik?.setFieldValue('planId', props)
                  }}
                  inputId='registerPlan'
                  onFocus={() => setPlanMessage(true)}
                />
                {/* formik?.touched.planId &&  */}
                {(formik?.errors?.planId || formik?.status) && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block fs-8'>
                      {planMessage && <span role='alert'>{formik?.errors?.planId}</span>}
                    </div>
                  </div>
                )}
              </div>
              {/* end::Company size */}

              {/* begin::Form group Company */}
              {checkedBusiness && (
                <div className='col-md-6 mb-4 company-name'>
                  <label className={`${configClass?.label} required`}>Company Name</label>
                  <input
                    // placeholder='Company Name'
                    type='text'
                    autoComplete='off'
                    {...formik?.getFieldProps('companyName')}
                    className={clsx(`${configClass?.form}`, {
                      // 'is-invalid': formik?.touched.companyName && formik?.errors?.companyName
                    })}
                    style={{
                      background: '#eef3f7',
                    }}
                  />
                  {((formik?.touched?.companyName && formik?.errors?.companyName) ||
                    formik?.status) && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block fs-8'>
                        <span role='alert'>{formik?.errors?.companyName}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
              {/* end::Form group */}

              {/* begin::Form group Company */}
              <div className='col-md-6 mb-4 site'>
                <label className={`${configClass?.label} required`}>Site</label>
                <div
                  className='row align-items-center mx-0 input-group input-group-solid'
                  style={{
                    background: '#eef3f7',
                  }}
                >
                  <div className='col px-0 d-flex align-items-center'>
                    <input
                      // placeholder='Site Address'
                      type='text'
                      {...formik?.getFieldProps('fqdn')}
                      // onChange={({target: {value}}: any) => {
                      //   formik?.setFieldValue('fqdn', value?.replace(/\s/g, '')?.toLowerCase())
                      //   onChangeSite(value?.replace(/\s/g, '')?.toLowerCase())
                      // }}
                      value={formik?.values?.fqdn}
                      className={clsx(
                        configClass?.form,
                        {'is-invalid': (formik?.touched?.fqdn && formik?.errors?.fqdn) || isExists},
                        {'is-valid': formik?.touched?.fqdn && !formik?.errors?.fqdn}
                      )}
                      style={{
                        background: '#eef3f7',
                      }}
                    />

                    {isExists === true ? (
                      <div className='me-2'>
                        <KTSVG
                          path={'/media/icons/duotone/Code/Warning-1-circle.svg'}
                          className={'svg-icon svg-icon-1x svg-icon-danger'}
                        />
                      </div>
                    ) : (
                      ''
                    )}
                    {formik?.values?.fqdn !== '' && !formik?.errors?.fqdn
                      ? isExists === false && (
                          <div className='me-2'>
                            <KTSVG
                              path={'/media/icons/duotone/Code/Done-circle.svg'}
                              className={'svg-icon svg-icon-1x svg-icon-success'}
                            />
                          </div>
                        )
                      : ''}
                  </div>
                  <div className='col-auto fw-bold text-dark fs-6 border-start border-gray-400'>
                    .AssetData.io
                  </div>
                </div>
                <div>
                  <strong>
                    <small>Example : https://yourcompanyname.AssetData.io</small>
                  </strong>
                </div>
                <div>
                  {((formik?.touched?.fqdn && formik?.errors?.fqdn) || formik?.status) && (
                    <div className='fv-plugins-message-container'>
                      <div className='fv-help-block fs-8'>
                        <span role='alert'>{formik?.errors?.fqdn}</span>
                      </div>
                    </div>
                  )}
                  {typing && (
                    <p>
                      {isExists ? (
                        <>
                          {formik?.status === undefined && (
                            <span style={{color: '#f1416c'}}>
                              {intl.formatMessage({
                                id: 'SITE_ALREADY_BEEN_TAKEN',
                              })}
                            </span>
                          )}
                        </>
                      ) : (
                        <span style={{color: 'green'}}>
                          {intl.formatMessage({
                            id: 'SITE_IS_AVAILABLE',
                          })}
                        </span>
                      )}
                    </p>
                  )}
                </div>
              </div>
              {/* end::Form group */}
            </div>

            {/* begin::Form group */}
            <div className='fv-row mb-7 the-checkbox'>
              <div className='form-check form-check-custom form-check-solid'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  id='kt_login_toc_agree'
                  onClick={onClick}
                  {...formik?.getFieldProps('acceptTerms')}
                />
                <label
                  className='form-check-label fw-bold text-dark fs-6'
                  htmlFor='kt_login_toc_agree'
                >
                  {intl.formatMessage({
                    id: 'I_AGREE_TO_THE',
                  })}
                  <a
                    href='https://assetdata.io/term-of-use/'
                    target='_blank'
                    rel='noreferrer'
                    className='ms-1 link-primary'
                  >
                    {intl.formatMessage({id: 'TERMS_AND_CONDITIONS'})}
                  </a>
                  .
                </label>

                {formik?.touched?.acceptTerms && formik?.errors?.acceptTerms && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                      <span role='alert'>{formik?.errors?.acceptTerms}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* end::Form group */}

            {/* begin::Form group */}
            <div className='row'>
              {/* <div className='col-6 cancel'>
              <Link to='/auth/login'>
                <button
                  type='button'
                  id='kt_login_signup_form_cancel_button'
                  className='btn btn-lg btn-light-primary w-100'
                >
                  Cancel
                </button>
              </Link>
            </div> */}
              <div className='col-12 submit'>
                <button
                  type='submit'
                  id='kt_sign_up_submit'
                  className='btn btn-lg btn-primary w-100'
                  disabled={
                    isExists ||
                    formik?.isSubmitting ||
                    !formik?.isValid ||
                    !formik?.values?.acceptTerms ||
                    size(formik?.errors) > 0 ||
                    !tncAgree
                  }
                >
                  {!loading && <span className='indicator-label'>Register Now</span>}
                  {loading && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </button>
              </div>
            </div>
            {/* end::Form group */}
          </form>
        </div>
      )}
    </>
  )
}

export {Registration}
