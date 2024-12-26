import {deleteCompany} from '@api/company'
import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken} from '@helpers'
import {Form, Formik} from 'formik'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

import {DeleteCompanyReassign} from './DeleteCompanyReassign'

type DeleteCompanyProps = {
  showModal: any
  setShowModal: any
  setReloadCompany: any
  reloadCompany: any
  companyName: any
  companyGuid: any
  checkErrorDeleteStatus: any
  cantDeleteInfo: any
  assignCompany: any
  setDataChecked: any
  totalPage: any
  totalPerPage: any
  setPage: any
  page: any
  setResetKeyword: any
}

const DeleteCompany: FC<DeleteCompanyProps> = ({
  showModal,
  setShowModal,
  setReloadCompany,
  reloadCompany,
  companyName,
  companyGuid,
  checkErrorDeleteStatus,
  cantDeleteInfo,
  setDataChecked,
  totalPage,
  totalPerPage,
  setPage,
  page,
  setResetKeyword,
}) => {
  const [loadingCompany, setLoadingCompany] = useState<boolean>(false)
  const [showModalDeleteReassign, setShowModalDeleteReassign] = useState<boolean>(false)
  const [totalRelated, setTotalRelated] = useState<string>('')
  const [removeOption, setRemoveOption] = useState<any>([])

  const onClickDeleteModal = () => {
    if (checkErrorDeleteStatus === true) {
      setShowModalDeleteReassign(true)
      setRemoveOption([
        {
          value: companyGuid,
          label: companyName,
        },
      ])

      switch (cantDeleteInfo.related_type) {
        case 'users':
          setTotalRelated(cantDeleteInfo.total_related.user)
          break
        case 'departments':
          setTotalRelated(cantDeleteInfo.total_related.department)
          break
        case 'employees':
          setTotalRelated(cantDeleteInfo.total_related.employee)
          break
        case 'pre_assets':
          setTotalRelated(cantDeleteInfo.total_related.pre_asset)
          break
        case 'assets':
          setTotalRelated(cantDeleteInfo.total_related.asset)
          break
        default:
          break
      }
    } else {
      setLoadingCompany(true)
      const params = {
        deleted_reason: 'delete company',
      }
      if (companyGuid) {
        deleteCompany(params, companyGuid)
          .then((res: any) => {
            ToastMessage({type: 'success', message: res?.data?.message})
            setLoadingCompany(false)
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
      <DeleteCompanyReassign
        showModalDeleteReassign={showModalDeleteReassign}
        setShowModal={setShowModal}
        setShowModalDeleteReassign={setShowModalDeleteReassign}
        setReloadCompany={setReloadCompany}
        reloadCompany={reloadCompany}
        companyGuid={companyGuid}
        cantDeleteInfo={cantDeleteInfo}
        totalRelated={totalRelated}
        companyName={companyName}
        setDataChecked={setDataChecked}
        removeOption={removeOption}
        totalPage={totalPage}
        totalPerPage={totalPerPage}
        page={page}
        setPage={setPage}
        setResetKeyword={setResetKeyword}
      />

      <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
        <Formik
          initialValues={{
            name: companyName || '',
          }}
          enableReinitialize
          onSubmit={onClickDeleteModal}
        >
          {() => (
            <Form className='justify-content-center' noValidate>
              <Modal.Header>
                <Modal.Title>Delete Company</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className='text-black-500 mb-3 text-left'>
                  Are you sure to delete
                  <b> {companyName} </b> ?
                  {cantDeleteInfo?.reason !== undefined && (
                    <div> {cantDeleteInfo?.reason.replace(/[&/\\#,+()$~%.'":*?<>{}]/g, '')} </div>
                  )}
                </div>
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

export {DeleteCompany}
