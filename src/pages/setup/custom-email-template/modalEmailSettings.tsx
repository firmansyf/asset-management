import TextEditor from '@components/form/TextEditorSun'
import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {configClass, FieldMessageError, toAbsoluteUrl, useTimeOutMessage} from '@helpers'
import {ScrollTopComponent} from '@metronic/assets/ts/components'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import * as Yup from 'yup'

import {Photos} from './photos'
import {createTemplateEmailSettings} from './service'

interface Props {
  showModal: any
  setShowModal: any
  detail?: any
  reload?: any
  setReload?: any
}

const EmailSettingSchema: any = Yup.object().shape({
  reply_to_email: Yup.string().test({
    name: 'reply_to_email',
    test: function () {
      const {reply_to, reply_to_email} = this.parent || {}
      if (reply_to && reply_to_email === undefined) {
        return this.createError({
          message: `Reply To Email is required`,
        })
      }
      return true
    },
  }),
})

const ModalEmailSettings: FC<Props> = ({showModal, setShowModal, detail, reload, setReload}) => {
  const intl: any = useIntl()

  const [loading, setLoading] = useState<boolean>(false)
  const [required, setRequired] = useState<boolean>(false)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)

  const require_filed_message = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})

  const initValues: any = {
    reply_to: false,
    reply_to_email: '',
    header_logo: detail?.header_logo,
    signature: '',
    company_logo: detail?.company_logo,
  }

  const handleOnSubmit = (value: any) => {
    setLoading(true)
    const getValueOrDefault = (value: any) => (value !== null ? value : '')
    const params: any = {
      reply_to: value?.reply_to || false,
      reply_to_email: getValueOrDefault(value?.reply_to_email),
      header_logo: getValueOrDefault(value?.header_logo),
      signature: getValueOrDefault(value?.signature),
      company_logo: getValueOrDefault(value?.company_logo),
    }

    createTemplateEmailSettings(params)
      .then(({data: {message}}: any) => {
        setLoading(false)
        setShowModal(false)
        ToastMessage({message, type: 'success'})
        setReload(!reload)
      })
      .catch((e: any) => {
        setLoading(false)
        FieldMessageError(e, [])
      })
  }

  useEffect(() => {
    showModal && setLoadingForm(true)
    showModal && setTimeout(() => setLoadingForm(false), 1000)
  }, [showModal])

  const onHide = () => {
    setShowModal(false)
    useTimeOutMessage('clear', 1500)
  }

  return (
    <>
      <Modal dialogClassName='modal-md' show={showModal} onHide={onHide}>
        <Formik
          enableReinitialize
          initialValues={initValues}
          validationSchema={EmailSettingSchema}
          onSubmit={handleOnSubmit}
        >
          {({setFieldValue, isSubmitting, values, errors, isValidating}: any) => {
            if (isSubmitting && isValidating && Object.keys(errors || {})?.length > 0) {
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
                <Modal.Header closeButton>
                  <Modal.Title>Email Settings</Modal.Title>
                </Modal.Header>
                {loadingForm ? (
                  <div className='row'>
                    <div className='col-12 text-center'>
                      <PageLoader height={250} />
                    </div>
                  </div>
                ) : (
                  <Modal.Body>
                    <div className='row'>
                      <div className='col d-flex align-items-center'>
                        <input
                          id='reply_to'
                          name='reply_to'
                          type='checkbox'
                          className='mx-2 mlc-0 form-check-input'
                          value={values?.reply_to || false}
                          onChange={({target: {checked}}: any) => {
                            setFieldValue('reply_to', checked || false)
                            setRequired(checked || false)
                          }}
                        />
                        <label htmlFor='reply_to' className={`${configClass?.label} required`}>
                          Reply to{' '}
                        </label>
                      </div>

                      <div className='fv-plugins-message-container invalid-feedback mt-2'>
                        <ErrorMessage name='reply_to' />
                      </div>
                    </div>

                    <div className='row'>
                      <div className='col'>
                        <label
                          htmlFor='reply_to_email'
                          className={`${configClass?.label} ${required && 'required'}`}
                        >
                          Reply to email
                        </label>
                        <Field
                          type='email'
                          name='reply_to_email'
                          placeholder='Enter Email'
                          className={configClass?.form}
                        />
                      </div>

                      <div className='fv-plugins-message-container invalid-feedback mt-2'>
                        <ErrorMessage name='reply_to_email' />
                      </div>
                    </div>

                    <div className='row mt-2 mb-2'>
                      <div className='col d-flex flex-column'>
                        <label htmlFor='header_logo' className={configClass?.label}>
                          Header Logo{' '}
                        </label>
                        <div className='mx-3'>
                          <div className='flex-column'>
                            <input
                              type='radio'
                              name='header_logo'
                              className='me-3 form-check-input'
                              value={values?.header_logo}
                              checked={values?.header_logo === '1' ? true : false}
                              onChange={({target: {checked}}: any) =>
                                setFieldValue('header_logo', checked === true ? '1' : '2')
                              }
                            />
                            <span>AssetData Logo</span> <br />
                            {values?.header_logo === '1' && (
                              <img
                                alt='Logo'
                                className='h-30px my-2 ms-7'
                                src={toAbsoluteUrl('/media/logos/assetdataV1.png')}
                              />
                            )}
                          </div>
                          <div className='mt-2'>
                            <input
                              type='radio'
                              name='header_logo'
                              className='me-3 form-check-input'
                              value={values?.header_logo}
                              checked={values?.header_logo === '2' ? true : false}
                              onChange={({target: {checked}}: any) => {
                                setFieldValue('header_logo', checked === true ? '2' : '1')
                              }}
                            />
                            <span>Company Logo</span>
                            {values?.header_logo === '2' && <Photos photoDetail={detail} />}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='row mt-5'>
                      <div className='col'>
                        <label htmlFor='signature' className={`${configClass?.label}`}>
                          Signature
                        </label>
                        <TextEditor
                          id='editor'
                          options={{minHeight: '100px'}}
                          defaultData={values?.signature}
                          placeholder='Custom your signature'
                          onChange={(e: any) => setFieldValue('signature', e)}
                        />
                      </div>
                    </div>
                  </Modal.Body>
                )}
                <Modal.Footer>
                  <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                    {!loading && <span className='indicator-label'>Save</span>}
                    {loading && (
                      <span className='indicator-progress' style={{display: 'block'}}>
                        Please wait...
                        <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                      </span>
                    )}
                  </Button>
                  <Button className='btn-sm' variant='secondary' onClick={onHide}>
                    Cancel
                  </Button>
                </Modal.Footer>
              </Form>
            )
          }}
        </Formik>
      </Modal>

      <style>
        {`.mlc-0 { 
          margin-left: 0 !important;
        }`}
      </style>
    </>
  )
}

export {ModalEmailSettings}
