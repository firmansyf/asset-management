import {cekTokenExpired, deleteConfirm} from '@api/UserCRUD'
import {InputText} from '@components/InputText'
import {customStyles} from '@components/select/config'
import {ToastMessage} from '@components/toast-message'
import {configClass, toAbsoluteUrl} from '@helpers'
import {logout} from '@redux'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import qs from 'qs'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import {useLocation, useNavigate} from 'react-router-dom'
import Select from 'react-select'
import * as Yup from 'yup'

const deleteSchema = Yup.object().shape({
  pass: Yup.string().required('Password is required'),
})

const ModalDelete: FC<any> = ({showModal, setShowModal, detailValue, reason}) => {
  const intl: any = useIntl()
  const navigate: any = useNavigate()
  const user: any = useSelector(({currentUser}: any) => currentUser, shallowEqual)
  const {token: getToken}: any = qs.parse(window.location?.search, {ignoreQueryPrefix: true}) || {}
  const [loading, setLoading] = useState<boolean>(false)
  const [errSubmitForm, setErrSubmitForm] = useState<boolean>(true)
  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})
  // const getToken: any = window.location?.pathname?.slice(16)

  // if (user === undefined) {
  //   navigate('/auth/login?request=ZGVsZXRlLWNvbmZpcm0=')
  // }

  const onSubmit = (values: any) => {
    setLoading(true)
    const params = {
      token: getToken || '',
      reason: reason || '',
      password: values?.pass || '',
    }
    deleteConfirm(params)
      .then(() => {
        const message: any = 'Your account has been successfully deleted'
        ToastMessage({type: 'success', message})
        setLoading(false)
        navigate('/deleted-confirm')
        setTimeout(() => {
          logout()
        }, 1000)
      })
      .catch(({response}: any) => {
        setLoading(false)
        const {message, code} = response?.data || {}

        if (code === 'err_token_access_expired') {
          ToastMessage({type: 'error', message})
          navigate('/expired-time')
        } else {
          ToastMessage({type: 'error', message: 'Incorrect password'})
        }
      })
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={{
          pass: detailValue?.password || '',
        }}
        validationSchema={deleteSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({setSubmitting, errors, isSubmitting}: any) => {
          if (isSubmitting && errSubmitForm && Object.keys(errors || {})?.length > 0) {
            ToastMessage({
              message: require_filed_message,
              type: 'error',
            })
            setErrSubmitForm(false)
            setSubmitting(false)
          }

          if (isSubmitting && !errSubmitForm && Object.keys(errors || {})?.length > 0) {
            setErrSubmitForm(true)
          }

          return (
            <Form className='justify-content-center' noValidate>
              <Modal.Header closeButton>
                <Modal.Title>
                  {intl.formatMessage({id: 'TO_CONFIRM_PLEASE_ENTER_YOUR_PASSWORD'})}
                </Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div>
                  <div>Email</div>
                  <div className='badge bg-light text-dark fw-bolder'>{user?.email || 'N/A'}</div>
                </div>
                <div className=''>
                  <label htmlFor='name' className={`${configClass?.label} required`}>
                    Password
                  </label>
                  <InputText name='pass' type='password' placeholder='Enter your password' />
                  <div className='fv-plugins-message-container invalid-feedback'>
                    <ErrorMessage name='pass' />
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  disabled={loading}
                  className='btn-sm'
                  type='submit'
                  form-id=''
                  variant='primary'
                >
                  {!loading && <span className='indicator-label'> Submit </span>}
                  {loading && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </Button>
                <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
              </Modal.Footer>
            </Form>
          )
        }}
      </Formik>
    </Modal>
  )
}

const DeleteAccountConfirm: FC = () => {
  const intl = useIntl()
  const navigate = useNavigate()
  const {search}: any = useLocation()
  const {token} = qs.parse(search, {ignoreQueryPrefix: true})

  const [detailValue] = useState<any>()
  const [reason, setReason] = useState<any>()
  const [reasonTitle, setReasonTitle] = useState<string>('')
  const [showModal, setShowModal] = useState<boolean>(false)
  const [showComponent, setShowComponent] = useState<boolean>(false)

  const options: any = [
    {value: 1, label: 'I am using a different Asset Management platform'},
    {value: 2, label: 'I am not using it anymore'},
    {value: 3, label: 'I have concern about the privacy of my data'},
    {value: 4, label: 'I prefer not to say'},
    {value: 5, label: 'Other'},
  ]

  const reasonSchema: any = Yup.object().shape({
    reason: Yup.string().required('Reason is required'),
    other: Yup.string().when({
      is: () => reason === 5,
      then: () => Yup.string().required('Other reason is required'),
    } as any),
  })

  const onSubmit = (value: any) => {
    setShowModal(true)
    if (reason === 5) {
      setReasonTitle(value?.other || '')
    }
  }

  useEffect(() => {
    cekTokenExpired(token)
      .then(() => setShowComponent(true))
      .catch(({response}: any) => {
        const {code} = response?.data || {}
        const cekCode: any = code || {}
        if (cekCode === 'err_token_access_expired') {
          navigate('/expired-time')
        } else {
          navigate('/auth/login?request=ZGVsZXRlLWNvbmZpcm0=')
        }
      })
  }, [token, navigate])

  return (
    <>
      <Formik
        initialValues={{
          reason: '',
          other: '',
        }}
        validationSchema={reasonSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {({setFieldValue}) => {
          return (
            <>
              {showComponent && (
                <Form className='justify-content-center' noValidate>
                  <div
                    className='d-flex flex-column flex-column-fluid bgi-position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed'
                    style={{
                      backgroundImage: 'url(/media/patterns/bg-blue-ui.png)',
                      backgroundColor: '#00048f',
                      backgroundRepeat: 'repeat',
                      height: '100vh',
                    }}
                  >
                    <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'>
                      <a href='#' className='mb-5'>
                        <img
                          alt='Logo'
                          src={toAbsoluteUrl('/media/logos/logo-assetdata.png')}
                          className='h-60px'
                          style={{
                            filter: 'brightness(0) invert(1)',
                          }}
                        />
                      </a>
                      <div
                        className='d-flex flex-column w-auto w-sm-50 Box'
                        style={{
                          backgroundColor: '#fff',
                          padding: '20px',
                          boxShadow: '0 0 2px 2px #eee',
                          borderRadius: '5px',
                        }}
                      >
                        <div className='header-title'>
                          <h3>Account Deletion</h3>
                        </div>
                        <div className='description mt-4'>
                          <span>
                            <strong>Note : </strong>
                            {intl.formatMessage({id: 'DELETE_ACCOUNT_CONFIRM_DESCRIPTION'})}
                          </span>
                        </div>
                        <div className='mt-4 mb-3'>
                          <label className={`${configClass?.label} required col-lg-7`}>
                            <strong>
                              {intl.formatMessage({id: 'WHY_ARE_YOU_DELETING_YOUR_ACCOUNT'})}
                            </strong>
                          </label>
                          <Select
                            options={options}
                            name='reason'
                            placeholder='Select Reason'
                            styles={customStyles('sm', {
                              option: {
                                activeBackgroundColor: '#060990',
                                activeColor: 'white',
                                fontSize: '1rem',
                              },
                            })}
                            onChange={({value, label}: any) => {
                              setReason(value || '')
                              setReasonTitle(label || '')
                              setFieldValue('reason', value || '')
                            }}
                          />
                          <div className='fv-plugins-message-container invalid-feedback'>
                            <ErrorMessage name='reason' />
                          </div>
                          {reason === 5 && (
                            <>
                              <Field
                                component='textarea'
                                rows='4'
                                name='other'
                                placeholder='Enter Other Reason'
                                className={configClass?.form}
                              />
                              <div className='fv-plugins-message-container invalid-feedback'>
                                <ErrorMessage name='other' />
                              </div>
                            </>
                          )}
                        </div>
                        <div
                          className='button'
                          style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            padding: '5px 0',
                            marginTop: '5px',
                          }}
                        >
                          <Button
                            onClick={() => {
                              navigate('/auth/login')
                            }}
                            className='btn-sm btn-lg btn-light-primary me-3'
                            style={{marginRight: '5px'}}
                            form-id=''
                            variant='primary'
                          >
                            <span className='indicator-label'> Cancel </span>
                          </Button>
                          <Button
                            className='btn-sm btn-lg btn-primary'
                            data-cy='btnContinue'
                            type='submit'
                            variant='primary'
                          >
                            Continue
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </>
          )
        }}
      </Formik>

      <ModalDelete
        showModal={showModal}
        setShowModal={setShowModal}
        detailValue={detailValue}
        reason={reasonTitle}
      />
    </>
  )
}

export {DeleteAccountConfirm}
