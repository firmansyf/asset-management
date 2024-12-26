import {InputText} from '@components/InputText'
import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {addEditFormPermission, configClass, hasPermission} from '@helpers'
import {Form, Formik} from 'formik'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import * as Yup from 'yup'

import {addTags, editTags} from './core/service'

const TagsSchema = Yup.object().shape({
  name: Yup.string().required('Tag Name is required').nullable(),
})

type PropsTags = {
  showModal: any
  tagsDetail: any
  reload: any
  setShowModal: any
  setReload: any
}
const AddEditTags: FC<PropsTags> = ({showModal, tagsDetail, setReload, setShowModal, reload}) => {
  const intl = useIntl()
  const require_filed_message = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})
  const addTagPermission: any = hasPermission('help-desk.tag.add') || false
  const editTagPermission: any = hasPermission('help-desk.tag.edit') || false

  const [loading, setLoading] = useState(false)
  const [errForm, setErrForm] = useState<any>(true)
  const [onClickForm, setOnClickForm] = useState<boolean>(true)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)

  useEffect(() => {
    if (showModal) {
      addEditFormPermission(
        setShowModal,
        setShowForm,
        tagsDetail,
        addTagPermission,
        editTagPermission,
        'Add Tag',
        'Edit Tag'
      )
    }
  }, [addTagPermission, editTagPermission, setShowModal, showModal, tagsDetail])

  useEffect(() => {
    if (showModal) {
      setLoadingForm(true)
      setTimeout(() => {
        setLoadingForm(false)
      }, 400)
    }
  }, [showModal])

  const successMessage = (message: any) => {
    setTimeout(() => ToastMessage({type: 'clear'}), 300)
    setTimeout(() => ToastMessage({type: 'success', message}), 400)
  }

  const handleOnSubmit: any = (val: any) => {
    const params = {
      name: val?.name,
    }
    setLoading(true)
    if (tagsDetail) {
      editTags(params, tagsDetail.guid)
        .then(({data: {message}}: any) => {
          setLoading(false)
          setShowModal(false)
          setShowForm(false)
          successMessage(message)
          setReload(reload + 1)
        })
        .catch(() => {
          setLoading(false)
        })
    } else {
      addTags(params)
        .then(({data: {message}}: any) => {
          setLoading(false)
          setShowModal(false)
          setShowForm(false)
          successMessage(message)
          setReload(reload + 1)
        })
        .catch((err: any) => {
          ToastMessage({type: 'error', message: err?.response?.data?.data?.fields?.name[0]})
          setLoading(false)
        })
    }
  }
  const closeModal = () => {
    setShowModal(false)
    setErrForm(true)
    setShowForm(false)
    ToastMessage({type: 'clear'})
  }
  return (
    <Modal dialogClassName='modal-md' show={showForm} onHide={closeModal}>
      <Formik
        initialValues={{name: tagsDetail?.name}}
        validationSchema={TagsSchema}
        enableReinitialize
        onSubmit={handleOnSubmit}
      >
        {({setSubmitting, isSubmitting, errors, isValidating}) => {
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
          }
          return (
            <Form className='justify-content-center' noValidate>
              <Modal.Header closeButton>
                <Modal.Title>{tagsDetail ? 'Edit' : 'Add'} Tag</Modal.Title>
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
                    <div className='col-md-12'>
                      <label htmlFor='name' className={`${configClass?.label} required`}>
                        Tag Name
                      </label>
                      <InputText
                        name='name'
                        type='text'
                        className={configClass?.form}
                        placeholder='Enter Tag Name'
                        errors={errors}
                        onClickForm={onClickForm}
                      />
                    </div>
                  </div>
                </Modal.Body>
              )}

              <Modal.Footer>
                <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                  {!loading && (
                    <span
                      className='indicator-label'
                      onClick={() => {
                        setOnClickForm(true)
                      }}
                    >
                      {tagsDetail ? 'Save' : 'Add'}
                    </span>
                  )}
                  {loading && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </Button>
                <Button className='btn-sm' variant='secondary' onClick={closeModal}>
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

export {AddEditTags}
