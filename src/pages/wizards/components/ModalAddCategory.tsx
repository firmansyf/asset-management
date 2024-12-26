import {ToastMessage} from '@components/toast-message'
import {configClass, errorValidation} from '@helpers'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, memo, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import * as Yup from 'yup'

import {addCategory, editCategory} from '../redux/WizardService'

type ModalAddCategoryProps = {
  showModal: any
  setShowModal: any
  setReloadCategory: any
  reloadCategory: any
  categoryDetail: any
}

const CategorySchema = Yup.object().shape({
  name: Yup.string().required('Category is required.'),
})

const AddCategory: FC<ModalAddCategoryProps> = ({
  showModal,
  setShowModal,
  setReloadCategory,
  reloadCategory,
  categoryDetail,
}) => {
  const intl = useIntl()
  const require_filed_message: string = intl.formatMessage({id: 'MANDATORY_FORM_MESSAGE'})
  const [loadingCategory, setLoadingLocation] = useState<boolean>(false)
  const [errForm, setErrForm] = useState<any>(true)

  const onClose = () => {
    setShowModal(false)
    setErrForm(true)
    ToastMessage({type: 'clear'})
  }

  const onSubmit = (value: any, actions: any) => {
    setLoadingLocation(true)
    const params: any = {
      name: value.name,
    }
    if (categoryDetail) {
      editCategory(params, categoryDetail?.guid)
        .then((res: any) => {
          if (res.status === 200) {
            ToastMessage({message: res?.data?.message, type: 'success'})
            setLoadingLocation(false)
            setShowModal(false)
            setReloadCategory(reloadCategory + 1)
          }
        })
        .catch((e: any) => {
          Object.values(errorValidation(e))?.map((message: any) =>
            ToastMessage({message, type: 'error'})
          )
          actions.setSubmitting(false)
          setLoadingLocation(false)
        })
    } else {
      addCategory(params)
        .then((res: any) => {
          if (res.status === 201) {
            ToastMessage({message: res?.data?.message, type: 'success'})
            setLoadingLocation(false)
            setShowModal(false)
            setReloadCategory(reloadCategory + 1)
          }
        })
        .catch((e: any) => {
          Object.values(errorValidation(e))?.map((message: any) =>
            ToastMessage({message, type: 'error'})
          )
          actions.setSubmitting(false)
          setLoadingLocation(false)
        })
    }
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={onClose}>
      <Formik
        initialValues={{
          name: categoryDetail?.name || '',
        }}
        validationSchema={CategorySchema}
        enableReinitialize
        onSubmit={(value, actions) => onSubmit(value, actions)}
      >
        {({isSubmitting, setSubmitting, isValidating, errors}) => {
          if (isSubmitting && errForm && Object.keys(errors || {})?.length > 0) {
            ToastMessage({message: require_filed_message, type: 'error'})
            setErrForm(false)
            setSubmitting(false)
          }
          if (isSubmitting && isValidating && !errForm && Object.keys(errors || {})?.length > 0) {
            ToastMessage({message: require_filed_message, type: 'error'})
            setErrForm(false)
          }
          return (
            <Form className='justify-content-center' noValidate>
              <Modal.Header>
                <Modal.Title>{categoryDetail ? 'Edit' : 'Add'} Asset Category</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className='text-black-400 mb-3'>
                  {intl.formatMessage({
                    id: 'IF_YOU_WANT_TO_ADD_A_NEW_CATEGORY_OF_ASSETS_YOU_RE_IN_THE_RIGHT_SPOT_PLEASE_FILL_IN_THE_FIELDS_BELOW',
                  })}
                </div>
                <div className='mt-3'>
                  <div className='form-group row mb-4'>
                    <div className='col'>
                      <label className={`${configClass?.label} required text-end`}>
                        Asset Category
                      </label>
                      <Field
                        type='text'
                        name='name'
                        className={configClass?.form}
                        placeholder='Enter Category'
                      />
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='name' />
                      </div>
                    </div>
                  </div>
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                  {!loadingCategory && (
                    <span className='indicator-label'>{categoryDetail ? 'Save' : 'Add'}</span>
                  )}
                  {loadingCategory && (
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
  AddCategory,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {ModalAddCategory}
