/* eslint-disable react-hooks/exhaustive-deps */
import {Title as Section} from '@components/form/Title'
import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {configClass} from '@helpers'
import {ScrollTopComponent} from '@metronic/assets/ts/components'
import {PageTitle} from '@metronic/layout/core'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, memo, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {useNavigate} from 'react-router-dom'
import * as Yup from 'yup'

import {addCannedResponse, editCannedResponse, getDetailCannedResponse} from '../Service'
import AddFile from './add-file/AddFile'
import FormFirst from './form-first/FormFirst'
import Preview from './preview/Preview'

const CardAddCannedResponse: FC<any> = ({urlSearchParams}) => {
  const intl = useIntl()
  const require_filed_message = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})
  const navigate: any = useNavigate()
  const params: any = Object.fromEntries(urlSearchParams.entries())
  const {id} = params || {}

  const [loading, setLoading] = useState(false)
  const [detailCannedResponse, setDetailCannedResponse] = useState<any>([])
  const [validation, _setValidation] = useState<any>()
  const [showModalPreview, setShowModalPreview] = useState<any>(false)
  const [message, setMessage] = useState<any>({bodyText: ''})
  const [errForm, setErrForm] = useState<any>(true)
  const [titleValue, setTitleValue] = useState<any>('')
  const [availableValue, setAvailableValue] = useState<any>('')
  const [description, setDescription] = useState<any>('')
  const [onClickForm, setOnClickForm] = useState<boolean>(true)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [redirect, setRedirect] = useState<boolean>(false)

  useEffect(() => {
    if (showModalPreview) {
      ToastMessage({type: 'clear'})
    }
  }, [showModalPreview])

  const AddCannedResponseSchema = Yup.object().shape({
    title: Yup.string().when({
      is: () => true,
      then: () => Yup.string().required('Response Title is required'),
    } as any),
    message: Yup.string().required('Message is required').nullable().min(9, 'Message is required'),
    available: Yup.string().required('Available For is required'),
  })

  const successMessage = (message: any) => {
    setTimeout(() => ToastMessage({type: 'clear'}), 300)
    setTimeout(() => ToastMessage({type: 'success', message}), 400)
  }

  const handleSubmit = (value: any) => {
    setLoading(true)
    const params: any = {
      name: value?.title || '',
      message: message?.bodyText || '',
      available_for: value?.available || '',
      files: value?.files || {},
    }

    if (id) {
      editCannedResponse(id, params)
        .then(({data: {message}}: any) => {
          setLoading(false)
          successMessage(message)
          setTimeout(() => {
            setRedirect(true)
          }, 2000)
        })
        .catch((err: any) => {
          setLoading(false)
          const {data, devMessage} = err?.response?.data || {}

          if (!devMessage) {
            const {fields} = data || {}
            Object.keys(fields || {})?.map((key: any) => {
              ToastMessage({message: fields[key]?.[0], type: 'error'})
              return true
            })
          }
        })
    } else {
      addCannedResponse(params)
        .then(({data: {message}}: any) => {
          setLoading(false)
          successMessage(message)
          setTimeout(() => {
            setRedirect(true)
          }, 2000)
        })
        .catch((err: any) => {
          setLoading(false)
          const {data, devMessage} = err?.response?.data || {}
          // if (message) {
          //   setValidation(errorValidation(err))
          //   ToastMessage({message: message, type: 'error'})
          // }

          if (!devMessage) {
            const {fields} = data || {}
            Object.keys(fields || {})?.map((key: any) => {
              ToastMessage({message: fields[key]?.[0], type: 'error'})
              return true
            })
          }
        })
    }
  }

  useEffect(() => {
    redirect && navigate('/setup/help-desk/canned-response')
  }, [redirect])

  useEffect(() => {
    setLoadingForm(true)
    if (id) {
      getDetailCannedResponse(id)
        .then(({data: {data: res}}: any) => {
          if (res) {
            setDetailCannedResponse(res)
          }
          setTimeout(() => {
            setLoadingForm(false)
          }, 800)
        })
        .catch(() => {
          setTimeout(() => {
            setLoadingForm(false)
          }, 800)
        })
    } else {
      setTimeout(() => {
        setLoadingForm(false)
      }, 500)
    }
  }, [id])

  useEffect(() => {
    if (detailCannedResponse?.guid !== undefined) {
      setMessage({bodyText: detailCannedResponse?.message})
      setTitleValue(detailCannedResponse?.name)
      setAvailableValue(detailCannedResponse?.available_for)
      setDescription({bodyText: detailCannedResponse?.message})
    }
  }, [detailCannedResponse])

  const initValue: any = {
    title: titleValue,
    available: detailCannedResponse?.available || availableValue,
    message: detailCannedResponse?.message || '',
  }

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  return (
    <>
      {loadingForm ? (
        <PageLoader />
      ) : (
        <>
          <Formik
            initialValues={initValue}
            validationSchema={AddCannedResponseSchema}
            enableReinitialize
            onSubmit={handleSubmit}
          >
            {({values, setFieldValue, setSubmitting, isSubmitting, errors, isValidating}) => {
              if (isSubmitting && errForm && Object.keys(errors || {})?.length > 0) {
                ToastMessage({
                  message: require_filed_message,
                  type: 'error',
                })
                setErrForm(false)
                setSubmitting(false)
              }
              if (
                isSubmitting &&
                isValidating &&
                !errForm &&
                Object.keys(errors || {})?.length > 0
              ) {
                ToastMessage({
                  message: require_filed_message,
                  type: 'error',
                })
              }

              if (isSubmitting && Object.keys(errors || {})?.length > 0) {
                ScrollTopComponent.goTop()
                return false
              }

              return (
                <Form className='justify-content-center' noValidate>
                  <div className='card card-custom'>
                    <div className='card-body'>
                      <Section title='Canned Response Details' sticky={false} />
                      <FormFirst
                        setFieldValue={setFieldValue}
                        detail={detailCannedResponse}
                        isMessage={message}
                        setMessage={setMessage}
                        setTitleValue={setTitleValue}
                        errors={errors}
                        values={values}
                        description={description}
                        onClickForm={onClickForm}
                      />

                      <AddFile
                        validation={validation}
                        setFieldValue={setFieldValue}
                        files={detailCannedResponse?.files}
                      />

                      <div className='row mt-5'>
                        <div className='col-sm-12 col-md-2 col-lg-2'>
                          <label htmlFor='available' className={`${configClass?.label} required`}>
                            Available For
                          </label>
                        </div>
                        <div className='col-sm-12 col-md-10 col-lg-10'>
                          <div className='col-12 mb-2'>
                            <label className='d-flex align-items-center'>
                              <div className='form-check form-check-custom form-check-solid'>
                                <Field
                                  type='radio'
                                  value='only_me'
                                  name='available'
                                  className='form-check-input'
                                  checked={values?.available === 'only_me'}
                                  onChange={({currentTarget: {value}}: any) =>
                                    setFieldValue('available', value)
                                  }
                                />
                                <span className='text-uppercase fw-bolder fs-8 mb-1 text-black-600 ms-3'>
                                  Only Me
                                </span>
                              </div>
                            </label>
                          </div>

                          <div className='col-12 mb-2'>
                            <label className='d-flex align-items-center'>
                              <div className='form-check form-check-custom form-check-solid'>
                                <Field
                                  type='radio'
                                  value='all_user'
                                  className='form-check-input'
                                  checked={values?.available === 'all_user'}
                                  onChange={({currentTarget: {value}}: any) =>
                                    setFieldValue('available', value)
                                  }
                                />
                                <span className='text-uppercase fw-bolder fs-8 mb-1 text-black-600 ms-3'>
                                  All User
                                </span>
                              </div>
                            </label>
                          </div>
                        </div>
                        <div className='fv-plugins-message-container invalid-feedback'>
                          <ErrorMessage name='available' />
                        </div>
                      </div>
                    </div>

                    <div className='card-footer d-flex justify-content-end'>
                      <button
                        type={`button`}
                        className='btn btn-sm btn-primary me-2'
                        onClick={() => {
                          setShowModalPreview(true)
                        }}
                      >
                        Preview
                      </button>
                      <button
                        type='button'
                        className='btn btn-sm btn-secondary me-2'
                        onClick={() => {
                          // setErrForm(true)
                          navigate('/setup/help-desk/canned-response')
                        }}
                      >
                        Cancel
                      </button>

                      <button type='submit' className='btn btn-sm btn-primary me-2'>
                        {!loading && (
                          <span
                            className='indicator-label'
                            onClick={() => {
                              setOnClickForm(true)
                            }}
                          >
                            {detailCannedResponse.guid ? 'Save' : 'Add'}
                          </span>
                        )}
                        {loading && (
                          <span className='indicator-progress' style={{display: 'block'}}>
                            Please wait...
                            <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                          </span>
                        )}
                      </button>
                    </div>
                  </div>
                </Form>
              )
            }}
          </Formik>

          <Preview
            showModal={showModalPreview}
            setShowModal={setShowModalPreview}
            message={message}
            ResponseGuid={id}
          />
        </>
      )}
    </>
  )
}

let AddCannedResponse: FC = () => {
  const intl = useIntl()
  const urlSearchParams = new URLSearchParams(window.location.search)
  const params = Object.fromEntries(urlSearchParams.entries())
  const {id}: any = params || {}

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({
          id: id ? 'PAGETITLE.EDIT_CANNED_RESPONSE' : 'PAGETITLE.ADD_CANNED_RESPONSE',
        })}
      </PageTitle>
      <CardAddCannedResponse urlSearchParams={urlSearchParams} />
    </>
  )
}

AddCannedResponse = memo(
  AddCannedResponse,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default AddCannedResponse
