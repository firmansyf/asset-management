import {InputText} from '@components/InputText'
import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {addEditFormPermission, configClass, hasPermission, useTimeOutMessage} from '@helpers'
import {Form, Formik} from 'formik'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import * as Yup from 'yup'

import {addCategory, editCategory} from './redux/CategoryCRUD'

type ModalAddCategoryProps = {
  showModal: any
  setShowModal: any
  setReloadCategory: any
  reloadCategory: any
  categoryDetail: any
  SetAddDataModal?: any
  modalType?: any
}

interface CategoryTypes {
  category: string
}

const CategorySchema = Yup.object().shape({
  category: Yup.string().required('Asset Category is required'),
})

const AddEditCategory: FC<ModalAddCategoryProps> = ({
  showModal,
  setShowModal,
  setReloadCategory,
  reloadCategory,
  categoryDetail,
  SetAddDataModal,
  modalType,
}) => {
  const intl: any = useIntl()
  const require_filed_message: any = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})

  const [errSubmitForm, setErrSubmitForm] = useState<boolean>(true)
  const [onClickForm, setOnClickForm] = useState<boolean>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [showForm, setShowForm] = useState<boolean>(false)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)

  const addCategoryPermission: any = hasPermission('setting.category.add') || false
  const editCategoryPermission: any = hasPermission('setting.category.edit') || false

  useEffect(() => {
    if (showModal) {
      addEditFormPermission(
        setShowModal,
        setShowForm,
        categoryDetail,
        addCategoryPermission,
        editCategoryPermission,
        'Add Category',
        'Edit Category'
      )
    }
  }, [addCategoryPermission, categoryDetail, editCategoryPermission, setShowModal, showModal])

  useEffect(() => {
    if (showModal) {
      setLoadingForm(true)
      setTimeout(() => {
        setLoadingForm(false)
      }, 400)
    }
  }, [showModal])

  const handleOnSubmit = (values: CategoryTypes, actions: any) => {
    setLoading(true)
    const params = {
      name: values?.category || '',
    }
    if (categoryDetail) {
      editCategory(params, categoryDetail?.guid)
        .then(({data: {message}}: any) => {
          setLoading(false)
          setShowModal(false)
          setShowForm(false)
          setReloadCategory(reloadCategory + 1)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)
        })
        .catch((err: any) => {
          const {data, message} = err?.response?.data || {}
          setLoading(false)
          actions.setSubmitting(false)
          data?.fields && ToastMessage({type: 'error', message: data?.fields?.name[0]})
          data?.fields === undefined && ToastMessage({message: message, type: 'error'})
        })
    } else {
      addCategory(params)
        .then(({data: {message, data}}: any) => {
          setLoading(false)
          setShowModal(false)
          setShowForm(false)
          setReloadCategory(reloadCategory + 1)
          useTimeOutMessage('clear', 200)
          useTimeOutMessage('success', 250, message)

          if (modalType === 'asset') {
            SetAddDataModal({
              value: data?.guid || '',
              label: values?.category || '',
              modules: 'asset.category',
            })
          }
        })
        .catch((err: any) => {
          const {data, message} = err?.response?.data || {}
          setLoading(false)
          actions.setSubmitting(false)
          data?.fields && ToastMessage({type: 'error', message: data?.fields?.name[0]})
          data?.fields === undefined && ToastMessage({message: message, type: 'error'})
        })
    }
  }

  const onClose = () => {
    setShowModal(false)
    setErrSubmitForm(true)
    setOnClickForm(false)
    setShowForm(false)
    useTimeOutMessage('clear', 200)
  }

  return (
    <Modal dialogClassName='modal-md' show={showForm} onHide={onClose}>
      <Formik
        initialValues={{
          category: categoryDetail?.name || '',
        }}
        validationSchema={CategorySchema}
        enableReinitialize
        onSubmit={handleOnSubmit}
      >
        {({errors, isSubmitting, setSubmitting, isValidating}: any) => {
          if (isSubmitting && errSubmitForm && Object.keys(errors || {})?.length > 0) {
            ToastMessage({
              message: `${require_filed_message}`,
              type: 'error',
            })
            setErrSubmitForm(false)
            setSubmitting(false)
          }

          if (
            isSubmitting &&
            isValidating &&
            !errSubmitForm &&
            Object.keys(errors || {})?.length > 0
          ) {
            ToastMessage({
              message: `${require_filed_message}`,
              type: 'error',
            })
          }
          return (
            <Form className='justify-content-center' noValidate>
              <Modal.Header>
                <Modal.Title>{categoryDetail ? 'Edit' : 'Add'} Asset Category</Modal.Title>
              </Modal.Header>
              {loadingForm ? (
                <div className='row'>
                  <div className='col-12 text-center'>
                    <PageLoader height={250} />
                  </div>
                </div>
              ) : (
                <Modal.Body>
                  <div className='text-dark mb-3'>
                    {`If you want to add a new category of assets, you’re in the right spot. please fill in the fields below.`}
                  </div>
                  <div className='mt-5'>
                    <div className='form-group row align-items-center'>
                      <label htmlFor='name' className={`${configClass?.label} required col-lg-12`}>
                        Asset Category
                      </label>
                      <div className='col-lg-12'>
                        <InputText
                          name='category'
                          type='text'
                          className={configClass?.form}
                          placeholder='Enter Category'
                          // errors={errors}
                          onClickForm={onClickForm}
                        />
                        {errors?.category && (
                          <div className='fv-plugins-message-container invalid-feedback mb-2 mt-2'>
                            {errors?.category}
                          </div>
                        )}
                      </div>
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
                      {categoryDetail ? 'Save' : 'Add'}
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

const ModalAddCategory = memo(
  AddEditCategory,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {ModalAddCategory}
