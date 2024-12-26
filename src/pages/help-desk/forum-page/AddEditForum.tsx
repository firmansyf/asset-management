/* eslint-disable react-hooks/exhaustive-deps */
import TextEditor from '@components/form/TextEditorSun'
import {InputText} from '@components/InputText'
import {PageLoader} from '@components/loader/cloud'
import {Select} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {configClass} from '@helpers'
import {Form, Formik} from 'formik'
import {FC, useCallback, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import {useNavigate} from 'react-router-dom'
import * as Yup from 'yup'

import {AddForums, EditForums, getForumCategory} from './service'

type Props = {
  detailForum: any
  showModal: any
  setShowModal: any
  reload: any
  setReload: any
}

const regexForStripHTML: any = /(<([^>]+)>)/gi

const forumSchema: any = Yup.object().shape({
  title: Yup.string()
    .required('Summary is required')
    .nullable()
    .min(5, 'The Summary must be at least 5 characters'),
  description: Yup.mixed()
    .test({
      name: 'description',
      test: function () {
        const {description} = this.parent || {}
        const descr: any = description?.replaceAll(regexForStripHTML, '')
        if (descr === undefined) {
          return this.createError({
            message: `Message is required`,
          })
        } else if (descr?.length > 0 && descr?.length < 9) {
          return this.createError({
            message: `The Message must be at least 9 characters.`,
          })
        }
        return true
      },
    })
    .nullable(),
})

const AddEditForum: FC<Props> = ({detailForum, showModal, setShowModal, reload, setReload}) => {
  const intl: any = useIntl()
  const navigate: any = useNavigate()

  const [loading, setLoading] = useState<boolean>(false)
  const [errForm, setErrForm] = useState<boolean>(true)
  const [onClickForm, setOnClickForm] = useState<boolean>(true)
  const [formIsLoading, setFormIsLoading] = useState<boolean>(true)

  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})

  const initValues: any = {
    title: detailForum?.title || '',
    description: detailForum?.content || '',
  }

  const successMessage = (message: any) => {
    setTimeout(() => ToastMessage({type: 'clear'}), 300)
    setTimeout(() => ToastMessage({type: 'success', message}), 400)
  }

  const handleOnSubmit = useCallback(
    (values: any) => {
      setLoading(true)
      const {guid}: any = detailForum || {}
      const params: any = {
        title: values?.title || '',
        body: values?.description || '',
        forum_category_guid: values?.forum_category_guid || '',
      }

      if (guid) {
        EditForums(params, guid)
          .then(({data: {message}}: any) => {
            setLoading(false)
            setReload(!reload)
            setShowModal(false)
            successMessage(message)
          })
          .catch(() => setLoading(false))
      } else {
        AddForums(params)
          .then(({data: {message, data}}: any) => {
            setLoading(false)
            setReload(!reload)
            setShowModal(false)
            successMessage(message)
            if (data?.guid) {
              setTimeout(() => navigate(`/help-desk/forum/detail-forum/${data?.guid || ''}`), 2000)
            }
          })
          .catch(() => setLoading(false))
      }
    },
    [setShowModal, reload, setReload, detailForum]
  )

  const onClose = () => {
    setShowModal(false)
    setOnClickForm(false)
    ToastMessage({type: 'clear'})
  }

  useEffect(() => {
    setFormIsLoading(true)
    showModal && setTimeout(() => setFormIsLoading(false), 300)
  }, [showModal])

  return (
    <Modal dialogClassName='modal-lg' show={showModal} onHide={onClose}>
      <Formik
        enableReinitialize
        onSubmit={handleOnSubmit}
        initialValues={initValues}
        validationSchema={forumSchema}
      >
        {({values, setFieldValue, isSubmitting, setSubmitting, errors, isValidating}: any) => {
          if (isSubmitting && errForm && Object.keys(errors || {})?.length > 0) {
            ToastMessage({
              message: require_filed_message,
              type: 'error',
            })
            setErrForm(false)
            setSubmitting(false)
          }

          if (isSubmitting && isValidating && !errForm && Object.keys(errors || {})?.length > 0) {
            ToastMessage({
              message: require_filed_message,
              type: 'error',
            })
            setErrForm(false)
          }

          return (
            <Form className='justify-content-center' noValidate>
              <Modal.Header closeButton>
                <Modal.Title>{detailForum?.guid ? 'Edit Forum' : 'Add Forum'}</Modal.Title>
              </Modal.Header>
              {formIsLoading ? (
                <div className='row'>
                  <div className='col-12 text-center'>
                    <PageLoader height={250} />
                  </div>
                </div>
              ) : (
                <Modal.Body>
                  <div className='row'>
                    <div className='col-md-12'>
                      <label htmlFor='name' className={`${configClass?.label} required`}>
                        Summary
                      </label>
                      <InputText
                        name='title'
                        type='text'
                        placeholder='Enter Summary'
                        errors={errors}
                        className={configClass?.form}
                        onClickForm={onClickForm}
                      />
                    </div>

                    <div className='col-md-12 mt-3'>
                      <label htmlFor='name' className={`${configClass?.label} required`}>
                        Message
                      </label>
                      <TextEditor
                        id='editor'
                        options={{minHeight: '150px'}}
                        placeholder='Enter Message Here'
                        defaultData={values?.description || ''}
                        onChange={(e: any) => {
                          setTimeout(() => {
                            if (e !== '<div>​<br></div>' && e !== '<div><br></div>') {
                              setFieldValue('description', e)
                            } else {
                              setFieldValue('description', '')
                            }
                          }, 800)
                        }}
                      />

                      {errors?.description && (
                        <div className='fv-plugins-message-container invalid-feedback'>
                          {errors?.description}
                        </div>
                      )}
                    </div>

                    <div className='col-md-5 mt-3'>
                      <Select
                        sm={true}
                        api={getForumCategory}
                        params={false}
                        reload={false}
                        className='col p-0'
                        name='forum_category_guid'
                        placeholder='Select Forum Category'
                        parse={({guid, name}: any) => ({value: guid || '', label: name || ''})}
                        onChange={({value}: any) =>
                          setFieldValue('forum_category_guid', value || '')
                        }
                        defaultValue={{
                          value: detailForum?.category?.guid || '',
                          label: detailForum?.category?.name || '',
                        }}
                      />
                    </div>
                  </div>
                </Modal.Body>
              )}
              <Modal.Footer>
                <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                  {!loading && (
                    <span className='indicator-label' onClick={() => setOnClickForm(true)}>
                      {detailForum?.guid ? 'Save' : 'Add'}
                    </span>
                  )}
                  {loading && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </Button>
                <Button className='btn-sm' variant='secondary' onClick={onClose}>
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

export {AddEditForum}
