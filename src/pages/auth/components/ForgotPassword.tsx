import {forgotPassword} from '@api/AuthCRUD'
import {configClass, KTSVG} from '@helpers'
import clsx from 'clsx'
import {useFormik} from 'formik'
import {useState} from 'react'
import {useIntl} from 'react-intl'
import {Link} from 'react-router-dom'
import * as Yup from 'yup'

const initialValues = {
  email: '',
}

const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email('Wrong email format')
    .min(3, 'Minimum 3 symbols')
    .max(50, 'Maximum 50 symbols')
    .required('Email is required'),
})

export function ForgotPassword() {
  const intl: any = useIntl()

  const [email, setEmail] = useState<any>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [hasErrors, setHasErrors] = useState<boolean | undefined>(undefined)

  const formik: any = useFormik({
    initialValues,
    validationSchema: forgotPasswordSchema,
    onSubmit: (values, {setStatus, setSubmitting}) => {
      const {email}: any = values || {}
      setLoading(true)
      setHasErrors(undefined)
      setTimeout(() => {
        forgotPassword(email)
          .then(() => {
            setSuccess(true)
            setLoading(false)
            setHasErrors(false)
            setEmail(email || '')
          })
          .catch(() => {
            setLoading(false)
            setSuccess(false)
            setHasErrors(true)
            setSubmitting(false)
            setStatus('The login detail is incorrect')
          })
      }, 1000)
    },
  })

  return (
    <>
      {!success && (
        <div className='forgot-password-width rounded bg-white shadow-sm p-10 p-lg-8 mx-auto'>
          <div className='text-center mb-10'>
            <h1 className='text-dark mb-3'>Forgot Password ?</h1>
            <div className='text-black fw-bold fs-4'>
              {intl.formatMessage({id: 'ENTER_YOUR_EMAIL_TO_RESET_YOUR_PASSWORD'})}
            </div>
          </div>
          <form
            className='form w-100 fv-plugins-bootstrap5 fv-plugins-framework'
            noValidate
            id='kt_login_password_reset_form'
            onSubmit={formik?.handleSubmit}
          >
            {hasErrors === true && (
              <div className='mb-lg-15 alert alert-danger'>
                <div className='alert-text font-weight-bold'>
                  {intl.formatMessage({
                    id: 'SORRY_LOOKS_LIKE_THERE_ARE_SOME_ERRORS_DETECTED_PLEASE_TRY_AGAIN',
                  })}
                </div>
              </div>
            )}

            {hasErrors === false && (
              <div className='mb-10 bg-light-info p-8 rounded'>
                <div className='text-info'>
                  {intl.formatMessage({id: 'SENT_PASSWORD_RESET_PLEASE_CHECK_YOUR_EMAIL'})}
                </div>
              </div>
            )}

            <div className='fv-row mb-10'>
              <label className={configClass?.label}>Email</label>
              <input
                type='email'
                placeholder='Enter Email'
                autoComplete='off'
                {...formik?.getFieldProps('email')}
                className={clsx(
                  `${configClass?.form}`,
                  {'is-invalid': formik?.touched?.email && formik?.errors?.email},
                  {
                    'is-valid': formik?.touched?.email && !formik?.errors?.email,
                  }
                )}
              />
              {formik?.touched?.email && formik?.errors?.email && (
                <div className='fv-plugins-message-container'>
                  <div className='fv-help-block'>
                    <span role='alert'>{formik?.errors?.email}</span>
                  </div>
                </div>
              )}
            </div>

            <div className='d-flex flex-wrap justify-content-center pb-lg-0'>
              <button
                type='submit'
                data-cy='kt_password_reset_submit'
                className='btn btn-lg btn-primary fw-bolder me-4'
              >
                {loading ? (
                  <span className='indicator-progress'>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                ) : (
                  <span className='indicator-label'>Submit</span>
                )}
              </button>

              <Link to='/auth/login'>
                <button
                  type='button'
                  data-cy='kt_login_password_reset_form_cancel_button'
                  className='btn btn-lg btn-light-primary fw-bolder'
                  disabled={formik?.isSubmitting || !formik?.isValid}
                >
                  Cancel
                </button>
              </Link>
            </div>
          </form>
        </div>
      )}

      {success && (
        <div className='w-lg-500px rounded bg-white shadow-sm p-10 p-lg-8 mx-auto'>
          <div className='text-center'>
            <div>
              <KTSVG
                path={'/media/icons/duotone/Communication/Chat-check.svg'}
                className={'svg-icon-1 svg-icon-5x'}
              />
            </div>
            <div className='p-4 bg-light mt-3'>
              {intl.formatMessage({id: 'IF_THE_EMAIL_ADDRESS_EXISTS_AN_EMAIL_WILL_BE_SENT_TO'})}
              {email}
              {intl.formatMessage({id: 'WITH_THE_INSTRUCTIONS_TO_RESET_YOUR_PASSWORD'})}
            </div>
            <Link to='/auth/login'>
              <a className='btn btn-lg btn-light-primary fw-bolder mt-4'>Back to Login</a>
            </Link>
          </div>
        </div>
      )}
    </>
  )
}
