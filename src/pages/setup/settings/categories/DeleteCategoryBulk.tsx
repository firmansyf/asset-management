/* eslint-disable react/jsx-key */
import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken} from '@helpers'
import {Form, Formik} from 'formik'
import differenceWith from 'lodash/differenceWith'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

import {DeleteCategoryReassignBulk} from './DeleteCategoryReassignBulk'
import {deleteBulkCategoryReassign} from './redux/CategoryCRUD'

type DeleteCategoryBulkProps = {
  showModal: any
  setShowModal: any
  setReloadCategory: any
  reloadCategory: any
  dataChecked: any
  checkErrorStatusDeleteBulk: any
  cantDeleteInfo: any
  assignCategory: any
  setDataChecked: any
  totalPerPage: any
  totalPage: any
  page: any
  setPage: any
  setResetKeyword: any
}

const ModalDeleteCategoryBulk: FC<DeleteCategoryBulkProps> = ({
  showModal,
  setShowModal,
  setReloadCategory,
  reloadCategory,
  dataChecked,
  checkErrorStatusDeleteBulk,
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
  const [categoryOption, setCategoryOption] = useState([])

  const onClickDeleteModal = () => {
    if (checkErrorStatusDeleteBulk === true) {
      setShowModalDeleteReassign(true)

      const guids = dataChecked?.map((checked: any) => {
        return {guid: checked}
      })
      setCategoryOption(
        differenceWith(
          assignCategory,
          guids,
          (arrCategory: any, arrSelected: any) => arrCategory?.value === arrSelected?.guid
        ) as never[]
      )
    } else {
      setLoadingCategory(true)
      if (dataChecked) {
        deleteBulkCategoryReassign({guids: dataChecked})
          .then((res: any) => {
            ToastMessage({type: 'success', message: res?.data?.message})
            setLoadingCategory(false)
            setShowModal(false)
            const total_data_page: number = totalPage - totalPerPage
            if (total_data_page - dataChecked?.length <= 0) {
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

  const closeModal = () => {
    setShowModal(false)
  }

  return (
    <>
      <DeleteCategoryReassignBulk
        showModalDeleteReassign={showModalDeleteReassign}
        setShowModal={setShowModal}
        setShowModalDeleteReassign={setShowModalDeleteReassign}
        setReloadCategory={setReloadCategory}
        reloadCategory={reloadCategory}
        dataChecked={dataChecked}
        categoryOption={categoryOption}
        cantDeleteInfo={cantDeleteInfo}
        setDataChecked={setDataChecked}
      />

      <Modal dialogClassName='modal-md' show={showModal} onHide={() => closeModal()}>
        <Formik
          initialValues={{
            name: '',
          }}
          noValidate
          enableReinitialize
          onSubmit={onClickDeleteModal}
        >
          {() => (
            <Form className='justify-content-center' noValidate>
              <Modal.Header>
                <Modal.Title>Delete Category</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {checkErrorStatusDeleteBulk === true && (
                  <div className='text-black mb-3 text-left'>
                    Are you sure you want to delete
                    <strong> {dataChecked?.length} </strong> category data?
                    <br />
                    Category cannot be deleted because category
                    <strong>{' ['}</strong>
                    {Array.isArray(cantDeleteInfo) &&
                      cantDeleteInfo?.map((category: any, index) => (
                        <>
                          {index !== cantDeleteInfo?.length - 1 && (
                            <strong className='fw-bolder' key='{category}'>
                              {category},{' '}
                            </strong>
                          )}
                          {index === cantDeleteInfo?.length - 1 && (
                            <strong className='fw-bolder' key='{category}'>
                              {category}
                            </strong>
                          )}
                        </>
                      ))}
                    <strong>{'] '}</strong>
                    use in Asset, if you want to delete it please send data assign category
                    <div className='text-black mt-5 text-left'>
                      Please take note the tied data will be deleted too.
                    </div>
                  </div>
                )}

                {checkErrorStatusDeleteBulk === false && (
                  <div className='text-black mb-3 text-left'>
                    Are you sure you want to delete <strong> {dataChecked?.length} </strong>{' '}
                    category data?
                  </div>
                )}
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
                <Button className='btn-sm' variant='secondary' onClick={() => closeModal()}>
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

export {ModalDeleteCategoryBulk}
