/* eslint-disable react/jsx-key */
import {deleteBulkCompany} from '@api/company'
import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken} from '@helpers'
import {Form, Formik} from 'formik'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

import {DeleteCompanyReassignBulk} from './DeleteCompanyReassignBulk'

type DeleteCompanyBulkProps = {
  showModal: any
  setShowModal: any
  setReloadCompany: any
  reloadCompany: any
  dataChecked: any
  checkErrorStatusDeleteBulk: any
  cantDeleteInfo: any
  assignCompany: any
  setDataChecked: any
  dataCheckedSelect: any
  totalPage: any
  totalPerPage: any
  page: any
  setPage: any
  setResetKeyword: any
}

const DeleteCompanyBulk: FC<DeleteCompanyBulkProps> = ({
  showModal,
  setShowModal,
  setReloadCompany,
  reloadCompany,
  dataChecked,
  checkErrorStatusDeleteBulk,
  cantDeleteInfo,
  setDataChecked,
  dataCheckedSelect,
  totalPage,
  totalPerPage,
  page,
  setPage,
  setResetKeyword,
}) => {
  const [loadingCompany, setLoadingCompany] = useState<boolean>(false)
  const [showModalDeleteReassign, setShowModalDeleteReassign] = useState<boolean>(false)
  const [removeOption, setRemoveOption] = useState<any>([])

  const onClickDeleteModal = () => {
    if (checkErrorStatusDeleteBulk === true) {
      setShowModalDeleteReassign(true)
      setRemoveOption(dataCheckedSelect)
    } else {
      setLoadingCompany(true)
      if (dataChecked) {
        deleteBulkCompany({guids: dataChecked})
          .then((res: any) => {
            ToastMessage({type: 'success', message: res?.data?.message})
            setLoadingCompany(false)
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
            setShowModal(false)
            setReloadCompany(reloadCompany + 1)
            setDataChecked([])
          })
          .catch((e: any) => {
            errorExpiredToken(e)
          })
      }
    }
  }

  return (
    <>
      <DeleteCompanyReassignBulk
        showModalDeleteReassign={showModalDeleteReassign}
        setShowModal={setShowModal}
        setShowModalDeleteReassign={setShowModalDeleteReassign}
        setReloadCompany={setReloadCompany}
        reloadCompany={reloadCompany}
        dataChecked={dataChecked}
        cantDeleteInfo={cantDeleteInfo}
        setDataChecked={setDataChecked}
        removeOption={removeOption}
      />

      <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
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
                <Modal.Title>Delete Company</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {checkErrorStatusDeleteBulk === true && (
                  <div className='text-black-500 mb-3 text-left'>
                    Are you sure to delete
                    <strong> {dataChecked?.length} </strong> company data?
                    <br />
                    {Array.isArray(cantDeleteInfo) &&
                      cantDeleteInfo?.map((company: any, index) => (
                        <>
                          {index !== cantDeleteInfo?.length - 1 && (
                            <strong key='{company}'> {company}, </strong>
                          )}
                          {index === cantDeleteInfo?.length - 1 && (
                            <strong key='{company}'> {company} </strong>
                          )}
                        </>
                      ))}
                    cannot be deleted
                    <div style={{color: 'gray'}}>
                      Please take note the tied data will be deleted too.
                    </div>
                  </div>
                )}

                {checkErrorStatusDeleteBulk === false && (
                  <div className='text-dark mb-3 text-left'>
                    Are you sure you want to delete
                    <span style={{color: 'black'}}> {dataChecked?.length} </span> company data?
                  </div>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                  {!loadingCompany && <span className='indicator-label'>Delete</span>}
                  {loadingCompany && (
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

export {DeleteCompanyBulk}
