import {Select} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken} from '@helpers'
import {Form, Formik} from 'formik'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

import {deleteCategoryReassign, getCategory} from './redux/CategoryCRUD'

type DeleteCategoryReassignProps = {
  showModalDeleteReassign: any
  setShowModal: any
  setShowModalDeleteReassign: any
  setReloadCategory: any
  reloadCategory: any
  categoryGuid: any
  categoryOption: any
  totalRelatedType: any
  totalRelatedAsset: any
  categoryName: any
  setDataChecked: any
}

const DeleteCategoryReassign: FC<DeleteCategoryReassignProps> = ({
  showModalDeleteReassign,
  setShowModal,
  setShowModalDeleteReassign,
  setReloadCategory,
  reloadCategory,
  categoryGuid,
  categoryOption: _categoryOption,
  totalRelatedAsset,
  totalRelatedType,
  categoryName,
  setDataChecked,
}) => {
  const [loadingCategory, setLoadingCategory] = useState(false)
  const [reassignCategory, setReassignCategory] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const onClickDeleteModal = (e: any) => {
    if (e.category_guid === '') {
      setErrorMessage('Select Category name is required')
    }

    setLoadingCategory(true)
    const params = {
      deleted_reason: 'delete category',
    }
    if (categoryGuid) {
      deleteCategoryReassign(params, categoryGuid, reassignCategory)
        .then((res: any) => {
          ToastMessage({type: 'success', message: res?.data?.message})
          setLoadingCategory(false)
          setShowModalDeleteReassign(false)
          setShowModal(false)
          setReloadCategory(reloadCategory + 1)
          setDataChecked([])
        })
        .catch((err: any) => {
          errorExpiredToken(err)
          ToastMessage({message: err?.response?.data?.message, type: 'error'})
          setLoadingCategory(false)
        })
    }
  }

  const onChange = (e: any) => {
    setReassignCategory(e?.value)
    setErrorMessage('')
  }

  const onClose = () => {
    setShowModalDeleteReassign(false)
    setReassignCategory('')
  }

  return (
    <Modal dialogClassName='modal-md' show={showModalDeleteReassign} onHide={onClose}>
      <Formik
        initialValues={{
          category_guid: reassignCategory || '',
        }}
        onSubmit={onClickDeleteModal}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Delete Category</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <h3>{categoryName}</h3>
              <div className='text-black mb-10 text-left'>
                is currently assigned to
                {totalRelatedAsset !== 0 && <span>{totalRelatedAsset} asset(s)</span>}
                {totalRelatedAsset !== 0 && totalRelatedType !== 0 && <span> and </span>}
                {totalRelatedType !== 0 && <span>{totalRelatedType} type(s)</span>}. Please reassign
                the assets to other category before deleting it.
              </div>
              <div className='col-md-12'>
                <label htmlFor='name' className='text-dark required'>
                  Reassign to category
                </label>
                <Select
                  sm={true}
                  name='category_guid'
                  id='select-reassign-category'
                  className='mt-3'
                  api={getCategory}
                  reload={false}
                  params={false}
                  placeholder='Select Category'
                  defaultValue={undefined}
                  onChange={onChange}
                  parse={({guid: value, name: label}: any) => ({value, label})}
                />
                {errorMessage !== '' && (
                  <div className='fv-plugins-message-container invalid-feedback'>
                    {errorMessage}
                  </div>
                )}
              </div>
              <div className='text-black mt-10 text-left'>Note: this action cannot be undone.</div>
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                {!loadingCategory && (
                  <span className='indicator-label'>Reassign Category and Delete</span>
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
        )}
      </Formik>
    </Modal>
  )
}

export {DeleteCategoryReassign}
