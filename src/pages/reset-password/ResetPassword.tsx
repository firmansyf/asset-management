import {setPassword} from '@api/AuthCRUD'
import {ToastMessage} from '@components/toast-message'
import {configClass, KTSVG, toAbsoluteUrl} from '@helpers'
import clsx from 'clsx'
import {useFormik} from 'formik'
import {FC, useEffect, useState} from 'react'
import * as Yup from 'yup'

const fullUri = window.location.host || ''
const subdomain = fullUri?.split('.')?.[0]
const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/
const specialLowerCaseRegex = /[a-z]/
const specialUpperCaseRegex = /[A-Z]/
const specialNumberRegex = /[1234567890]/
const minCharRegex =
  subdomain === 'petronas'
    ? /[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{14,}/
    : /[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]{8,}/
const textNumber = subdomain === 'petronas' ? '14' : '8'

const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .matches(specialCharRegex, '')
    .matches(specialNumberRegex, '')
    .matches(specialUpperCaseRegex, '')
    .matches(specialLowerCaseRegex, '')
    .required('New password is required.'),
  password_confirm: Yup.string()
    .oneOf([Yup.ref('password'), null as any], 'Repeat new password does not match.')
    .required('Those passwords didn’t match. Try again.'),
})

const initialValues: any = {
  password_confirm: '',
  password: '',
}

const passMessage: any = [
  {
    id: 1,
    regex: /[!@#$%^&*(),.?":{}|<>]/,
    message: 'At least one special character.',
    status: false,
  },
  {id: 2, regex: /[a-z]/, message: 'At least one lowercase letter.', status: false},
  {id: 3, regex: /[A-Z]/, message: 'At least one uppercase letter.', status: false},
  {id: 4, regex: /[0-9]/, message: 'At least one number.', status: false},
  {id: 5, regex: minCharRegex, message: `Min ${textNumber} character.`, status: false},
]

const ResetPassword: FC = () => {
  const label: any = 'Set Password'

  const [loading, setLoading] = useState<boolean>(false)
  const [isSuccess, setSuccess] = useState<boolean>(false)
  const [passwordShown, setPasswordShown] = useState<boolean>(false)
  const [repeatPasswordShown, setRepeatPasswordShown] = useState<boolean>(false)
  const [showValidation, setShowValidation] = useState<boolean>(false)
  const [newPasswordMessage, setNewPasswordMessage] = useState<any>([])

  const formik: any = useFormik({
    initialValues,
    validationSchema: resetPasswordSchema,
    onSubmit: (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      setTimeout(() => {
        setPassword(values?.password, values?.password_confirm)
          .then(({data}) => {
            const {message} = data
            setSuccess(true)
            setStatus(message)
            setTimeout(() => {
              window.location.href = '/auth/login'
            }, 3000)
          })
          .catch((e: any) => {
            const {response} = e
            const {data} = response || {}
            const {message} = data || {}
            setLoading(false)
            setSubmitting(false)
            setSuccess(false)
            setStatus(
              message ||
                'Your New Password can not be same as your Current Password. Please Choose New Password'
            )
            ToastMessage({
              type: 'error',
              message:
                message ||
                'Your New Password can not be same as your Current Password. Please Choose New Password',
            })
          })
      }, 1000)
    },
  })

  const togglePassword = () => {
    setPasswordShown(!passwordShown)
  }

  const toggleRepeatPassword = () => {
    setRepeatPasswordShown(!repeatPasswordShown)
  }

  const onChange = (e: any) => {
    setShowValidation(true)
    passMessage?.map((message: any) => {
      const regex = message?.regex
      if (regex?.test(e)) {
        return (message.status = true)
      } else {
        return (message.status = false)
      }
    })
  }

  useEffect(() => {
    setNewPasswordMessage(passMessage as never)
  }, [])

  return (
    <div
      className='d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed'
      style={{
        backgroundImage: 'url(/media/patterns/bg-blue-ui.png)',
        backgroundColor: '#00048f',
        backgroundRepeat: 'repeat',
      }}
    >
      <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'>
        {/* begin::Logo */}
        <a href='#' className='mb-12'>
          <img
            alt='Logo'
            src={toAbsoluteUrl('/media/logos/logo-assetdata.png')}
            className='h-60px'
            style={{
              filter: 'brightness(0) invert(1)',
            }}
          />
        </a>
        {/* end::Logo */}
        {/* begin::Wrapper */}
        <div className='w-lg-500px bg-white rounded shadow-sm p-10 p-lg-15 mx-auto'>
          <form className='form w-100' onSubmit={formik.handleSubmit} noValidate id='form-auth'>
            {formik.status && (
              <div
                className={clsx('mb-lg-15 alert ', isSuccess ? 'alert-success' : 'alert-danger')}
              >
                <div className='alert-text font-weight-bold'>{formik.status}</div>
              </div>
            )}

            {/* begin::Form group */}
            <div className='fv-row mb-10'>
              <div className='d-flex justify-content-between mt-n5'>
                <div className='d-flex flex-stack mb-2'>
                  {/* begin::Label */}
                  <label className={`${configClass?.label} required`}>New Password</label>
                  {/* end::Label */}
                </div>
              </div>
              <div
                className='pass-wrapper d-flex align-items-center input-group input-group-solid'
                style={{
                  background: '#eef3f7',
                }}
              >
                <input
                  data-test='password'
                  type={passwordShown ? 'text' : 'password'}
                  // placeholder='Enter New Password'
                  {...formik.getFieldProps('password')}
                  className={configClass?.form}
                  onChangeCapture={({target}: any) => {
                    const {value} = target || {}
                    const passwd: any = `${value || ''}`
                    onChange(passwd)
                  }}
                />
                <span className='visible me-2' onClick={togglePassword}>
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
                </span>
              </div>
              {showValidation && (
                <div>
                  {Array.isArray(newPasswordMessage) &&
                    newPasswordMessage?.map(({message, status}: any, index: number) => {
                      if (status) {
                        return (
                          <p className='text-success' key={index}>
                            <KTSVG
                              path={'/media/icons/duotone/Code/Done-circle.svg'}
                              className={'svg-icon svg-icon-1x svg-icon-success'}
                            />
                            <span className='mx-1'>{message}</span>
                          </p>
                        )
                      } else {
                        return (
                          <p className='text-danger me-3' key={index}>
                            <KTSVG
                              path={'/media/icons/duotone/Code/Error-circle.svg'}
                              className={'svg-icon svg-icon-1x svg-icon-danger'}
                            />
                            <span className='mx-1'>{message}</span>
                          </p>
                        )
                      }
                    })}
                </div>
              )}

              {formik.touched.password &&
                formik.errors.password &&
                formik.errors.password === 'New password is required.' && (
                  <div className='fv-plugins-message-container'>
                    <div className='fv-help-block'>
                      <KTSVG
                        path={'/media/icons/duotone/Code/Warning-1-circle.svg'}
                        className={'svg-icon svg-icon-1x svg-icon-danger'}
                      />
                      <span role='alert' className='mx-1'>
                        {formik.errors.password}
                      </span>
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
                  <label className={`${configClass?.label} required`}>Repeat New Password</label>
                  {/* end::Label */}
                </div>
              </div>
              <div
                className='pass-wrapper d-flex align-items-center input-group input-group-solid'
                style={{
                  background: '#eef3f7',
                }}
              >
                <input
                  data-test='password_confirm'
                  type={repeatPasswordShown ? 'text' : 'password'}
                  autoComplete='off'
                  // placeholder='Enter Repeat New Password'
                  {...formik.getFieldProps('password_confirm')}
                  className={configClass?.form}
                />
                <span className='visible me-2' onClick={toggleRepeatPassword}>
                  {repeatPasswordShown && (
                    <KTSVG
                      path={'/media/icons/duotone/General/eye-open-light.svg'}
                      className={'svg-icon svg-icon-2x svg-icon-primary'}
                    />
                  )}

                  {!repeatPasswordShown && (
                    <KTSVG
                      path={'/media/icons/duotone/General/eye-closed-light.svg'}
                      className={'svg-icon svg-icon-2x svg-icon-dark-75'}
                    />
                  )}
                </span>
              </div>
              {formik.touched.password_confirm && formik.errors.password_confirm && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <KTSVG
                      path={'/media/icons/duotone/Code/Warning-1-circle.svg'}
                      className={'svg-icon svg-icon-1x svg-icon-danger'}
                    />
                    <span role='alert' className='mx-1'>
                      {formik.errors.password_confirm}
                    </span>
                  </div>
                </div>
              )}
            </div>
            {/* end::Form group */}

            {/* begin::Action */}
            <div className='text-center'>
              <button
                type='submit'
                id='kt_sign_in_submit'
                className='btn btn-lg btn-primary w-100 mb-5'
                disabled={formik.isSubmitting || !formik.isValid}
              >
                {!loading && <span className='indicator-label'>{label}</span>}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </button>
            </div>
            {/* end::Action */}
          </form>
        </div>
      </div>
    </div>
  )
}

export {ResetPassword}
