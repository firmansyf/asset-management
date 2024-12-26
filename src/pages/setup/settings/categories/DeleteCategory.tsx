import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken} from '@helpers'
import {Form, Formik} from 'formik'
import differenceWith from 'lodash/differenceWith'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

import {DeleteCategoryReassign} from './DeleteCategoryReassign'
import {deleteCategory} from './redux/CategoryCRUD'

type ModalDeleteCategoryProps = {
  showModal: any
  setShowModal: any
  setReloadCategory: any
  reloadCategory: any
  categoryDetail: any
  categoryName: any
  categoryGuid: any
  checkErrorDeleteStatus: any
  cantDeleteInfo: any
  assignCategory: any
  setDataChecked: any
  totalPerPage: any
  totalPage: any
  page: any
  setPage: any
  setResetKeyword: any
}

const CategorySchema = Yup.object().shape({
  category: Yup.string().required('Category is required.'),
})

const ModalDeleteCategory: FC<ModalDeleteCategoryProps> = ({
  showModal,
  setShowModal,
  setReloadCategory,
  reloadCategory,
  categoryDetail,
  categoryName,
  categoryGuid,
  checkErrorDeleteStatus,
  cantDeleteInfo,
  assignCategory,
  setDataChecked,
  totalPerPage,
  totalPage,
  page,
  setPage,
  setResetKeyword,
}) => {
  const [loadingCategory, setLoadingCategory] = useState(false)
  const [showModalDeleteReassign, setShowModalDeleteReassign] = useState(false)
  const [totalRelatedAsset, setTotalRelatedAsset] = useState(0)
  const [totalRelatedType, setTotalRelatedType] = useState(0)
  const [categoryOption, setCategoryOption] = useState([])

  const handleOnSubmit = () => {
    if (categoryDetail) {
      if (checkErrorDeleteStatus === true) {
        setShowModalDeleteReassign(true)
        setTotalRelatedAsset(cantDeleteInfo.related_types.asset)
        setTotalRelatedType(cantDeleteInfo.related_types.type)

        const guids: any = [{guid: categoryGuid}]
        setCategoryOption(
          differenceWith(
            assignCategory,
            guids,
            (arrCategory: any, arrSelected: any) => arrCategory?.value === arrSelected.guid
          ) as never[]
        )
      } else {
        setLoadingCategory(true)
        const params = {
          deleted_reason: 'delete category',
        }
        if (categoryGuid) {
          deleteCategory(params, categoryGuid)
            .then((res: any) => {
              ToastMessage({type: 'success', message: res?.data?.message})
              setLoadingCategory(false)
              setShowModal(false)
              const total_data_page: number = totalPage - totalPerPage
              if (total_data_page - 1 <= 0) {
                if (page > 1) {
                  setPage(page - 1)
                } else {
                  setPage(page)
                  setResetKeyword(true)
                }
              } else {
                setPage(page)
              }
              setReloadCategory(reloadCategory + 1)
              setDataChecked([])
            })
            .catch((err: any) => {
              const {message} = err?.response?.data || {}
              setLoadingCategory(false)
              ToastMessage({type: 'error', message})
              errorExpiredToken(err)
            })
        }
      }
    }
  }

  return (
    <>
      <DeleteCategoryReassign
        showModalDeleteReassign={showModalDeleteReassign}
        setShowModal={setShowModal}
        setShowModalDeleteReassign={setShowModalDeleteReassign}
        setReloadCategory={setReloadCategory}
        reloadCategory={reloadCategory}
        categoryGuid={categoryGuid}
        categoryOption={categoryOption}
        totalRelatedAsset={totalRelatedAsset}
        totalRelatedType={totalRelatedType}
        categoryName={categoryName}
        setDataChecked={setDataChecked}
      />

      <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
        <Formik
          initialValues={{
            category: categoryDetail?.name || '',
          }}
          validationSchema={CategorySchema}
          enableReinitialize
          onSubmit={handleOnSubmit}
        >
          {() => (
            <Form className='justify-content-center' noValidate>
              <Modal.Header>
                <Modal.Title>Delete Category</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className='text-black mb-3 text-left'>
                  {!cantDeleteInfo.can_delete && <div>{cantDeleteInfo.reason}</div>}
                  {cantDeleteInfo.can_delete === undefined && (
                    <div>
                      Are you sure to delete
                      <span className='fw-bolder ms-1' style={{color: 'black'}}>
                        {categoryName}
                      </span>
                      ?
                    </div>
                  )}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                  {!loadingCategory && <span className='indicator-label'>Delete</span>}
                  {loadingCategory && (
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
          )}
        </Formik>
      </Modal>
    </>
  )
}

export {ModalDeleteCategory}
