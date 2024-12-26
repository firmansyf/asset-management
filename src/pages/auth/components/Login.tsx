import {getUserFromLogin, login} from '@api/AuthCRUD'
import {
  getCountry,
  getCurrency,
  getDateFormat,
  getFeature,
  getPhoneCode,
  getPreference,
  getTimeFormat,
  getTimezone,
} from '@api/authPreference'
import {checkRequest, configClass, KTSVG} from '@helpers'
import {saveCurrentUser, savePreference, saveToken} from '@redux'
import axios from 'axios'
import clsx from 'clsx'
import {Field, Form, Formik} from 'formik'
import {FC, useState} from 'react'
import {Button} from 'react-bootstrap'
import {createSearchParams, Link, useNavigate} from 'react-router-dom'
import * as Yup from 'yup'

const loginSchema: any = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
  password: Yup.string()
    // .min(8, 'Minimum characters is 8')
    .max(50, 'Maximum 50 symbols')
    .required('Password is required'),
})

const Login: FC = () => {
  const navigate: any = useNavigate()
  const params: any = new URLSearchParams(window.location.search)
  const nextRequest: any = params.get('request')

  const [status, setStatus] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(false)
  const [passwordShown, setPasswordShown] = useState<boolean>(false)

  const togglePassword = () => {
    setPasswordShown(!passwordShown)
  }

  const handleOnSubmit = (values: any) => {
    localStorage.clear()
    if (checkRequest(nextRequest)) {
      window.location.href = '/error/404'
    }

    setLoading(true)
    setTimeout(() => {
      login(values.email, values.password)
        .then(async ({data: {token, is_otp, is_petronas}}) => {
          if (is_otp) {
            window.location.href = `/auth/2fa?request=${nextRequest}&response=${token}`
          } else {
            const {
              data: {data: user},
            }: any = await getUserFromLogin(token)

            // const {address, browser, ip, os}: any = (await getClientInfo()) || {}

            // await dispatchFireBase(`user_guid/${user?.guid}`, {
            //   login: {last_login: Date.now(), address, browser, ip, os},
            // })

            if (user?.is_change_password) {
              return navigate({
                pathname: '/auth/password-expiry',
                search: createSearchParams({token})?.toString(),
              })
            }

            await axios
              .all([
                getDateFormat(token),
                getTimeFormat(token),
                getTimezone(token),
                getCountry(token),
                getPreference(token),
                getCurrency(token),
                getFeature(token),
                getPhoneCode(token),
              ])
              .then(
                axios.spread(
                  (
                    {data: {data: date_format}}: any,
                    {data: {data: time_format}}: any,
                    {data: {data: timezone}}: any,
                    {data: {data: country}}: any,
                    {data: {data: preference}}: any,
                    {data: {data: currency}}: any,
                    {data: {data: feature}}: any,
                    {data: {data: phone_code}}: any
                  ) => {
                    savePreference({
                      date_format,
                      time_format,
                      timezone,
                      country,
                      preference,
                      currency,
                      feature,
                      phone_code,
                    })
                  }
                )
              )
              .finally(async () => {
                await saveCurrentUser(user)
                await saveToken(token)

                const {registration_wizard_status} = user || {}

                if (registration_wizard_status === 1) {
                  setTimeout(() => {
                    window.location.href = '/setup/wizard'
                  }, 300)
                  setLoading(false)
                } else if (nextRequest) {
                  if (atob(nextRequest) === '/' && is_petronas === 1) {
                    setTimeout(() => {
                      window.location.href = '/insurance-claims/all'
                    }, 300)
                  } else {
                    setTimeout(() => {
                      window.location.href = atob(nextRequest)
                    }, 300)
                  }
                  setTimeout(() => {
                    window.location.href = atob(nextRequest)
                  }, 300)
                  setLoading(false)
                } else {
                  setTimeout(() => {
                    window.location.href = '/dashboard'
                  }, 300)
                  setLoading(false)
                }
              })
          }

          // localStorage.setItem('rm0', rememberMe)
          // localStorage.setItem('rm1', rememberMe ? encryptAES(values.email, cryptoKey) : '')
          // localStorage.setItem('rm2', rememberMe ? encryptAES(values.password, cryptoKey) : '')
        })
        .catch((e: any) => {
          const {response} = e
          const {data} = response || {}
          const {message} = data || {}
          setLoading(false)
          setStatus(message)
        })
    }, 1000)
  }

  // useEffect(() => {
  //   const loginRemember = localStorage.getItem('rm0')
  //   if(loginRemember === "true") {
  //     setRememberEmail(decryptAES(localStorage.getItem('rm1'), cryptoKey))
  //     setRememberPwd(decryptAES(localStorage.getItem('rm2'), cryptoKey))
  //     setRememberMe(true)
  //   }
  // }, [])

  return (
    <Formik
      initialValues={{
        email: '',
        password: '',
      }}
      validationSchema={loginSchema}
      enableReinitialize
      onSubmit={handleOnSubmit}
    >
      {(formik: any) => {
        const {touched, errors, isValid}: any = formik || {}
        return (
          <div className='w-lg-500px rounded bg-white shadow-sm p-10 p-lg-8 mx-auto'>
            <Form className='justify-content-center' noValidate id='form-auth'>
              {status !== null && (
                <div className='alert alert-danger mb-lg-15'>
                  <div className='alert-text font-weight-bold'>{status || '-'}</div>
                </div>
              )}

              {/* begin::Form group */}
              <div className='fv-row mb-10'>
                <label data-cy='labelLoginEmail' className={configClass?.label}>
                  Email
                </label>
                <Field
                  // placeholder='Email'
                  className={clsx(configClass?.form, {
                    'is-invalid': touched?.email && errors?.email,
                  })}
                  style={{
                    background: '#eef3f7',
                  }}
                  type='email'
                  name='email'
                  data-cy='inputLoginEmail'
                  autoComplete='off'
                />
                {touched?.email && errors?.email && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                      <span role='alert'>{errors?.email || ''}</span>
                    </div>
                  </div>
                )}
              </div>
              {/* end::Form group */}

              {/* begin::Form group */}
              <div className='fv-row mb-10'>
                <div className='d-flex justify-content-between mt-n5'>
                  <div className='d-flex flex-stack mb-2'>
                    {/* begin::Label */}
                    <label data-cy='labelLoginPassword' className={configClass?.label}>
                      Password
                    </label>
                    {/* end::Label */}
                  </div>
                </div>
                <div className='pass-wrapper'>
                  <Field
                    type={passwordShown ? 'text' : 'password'}
                    // placeholder='Password'
                    autoComplete='off'
                    name='password'
                    data-cy='inputLoginPassword'
                    className={configClass?.form}
                    style={{
                      background: '#eef3f7',
                    }}
                  />
                  <i className='visible' data-cy='btnVisibility' onClick={togglePassword}>
                    {passwordShown && (
                      <KTSVG
                        path={'/media/icons/duotone/General/eye-open-light.svg'}
                        className={'svg-icon svg-icon-2x svg-icon-primary'}
                      />
                    )}
                    {!passwordShown && (
                      <KTSVG
                        path={'/media/icons/duotone/General/eye-closed-light.svg'}
                        className={'svg-icon svg-icon-2x svg-icon-dark-75'}
                      />
                    )}
                  </i>
                </div>
                {touched?.password && errors?.password && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                      <span role='alert'>{formik?.errors?.password || ''}</span>
                    </div>
                  </div>
                )}

                {/* begin::Link */}
                <Link
                  tabIndex={-1}
                  data-cy='btnLinkForgotPassword'
                  to='/auth/forgot-password'
                  className='link-primary fs-6 fw-bolder forgot-password'
                  style={{marginLeft: '5px'}}
                >
                  Forgot Password ?
                </Link>
                {/* end::Link */}
              </div>
              {/* end::Form group */}

              {/* <div className="fv-row mb-5 mt-n5">
                <div className="form-check">
                  <Field
                    className="form-check-input"
                    name='remember'
                    type="checkbox"
                    checked={rememberMe}
                    onClick={(e: any) => onClick(e.target.checked)}
                  />
                  <label className="form-check-label">
                    Remember Me
                  </label>
                </div>
              </div>  */}
              {/* begin::Action */}
              <div className='text-center'>
                <Button
                  type='submit'
                  id='kt_sign_in_submit'
                  className='btn btn-lg btn-primary w-100 mb-5'
                  disabled={!isValid}
                >
                  {!loading && <span className='indicator-label'>Login</span>}
                  {loading && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </Button>
              </div>
              {/* end::Action */}
            </Form>
          </div>
        )
      }}
    </Formik>
  )
}

export {Login}
