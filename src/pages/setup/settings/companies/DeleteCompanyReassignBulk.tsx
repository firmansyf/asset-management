/* eslint-disable react/jsx-key */
import {deleteBulkCompanyReassign, getCompany} from '@api/company'
import {Select} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorExpiredToken} from '@helpers'
import {Form, Formik} from 'formik'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

type DeleteCompanyReassignProps = {
  showModalDeleteReassign: any
  setShowModal: any
  setShowModalDeleteReassign: any
  setReloadCompany: any
  reloadCompany: any
  dataChecked: any
  cantDeleteInfo: any
  setDataChecked: any
  removeOption: any
}

const DeleteCompanyReassignBulk: FC<DeleteCompanyReassignProps> = ({
  showModalDeleteReassign,
  setShowModal,
  setShowModalDeleteReassign,
  setReloadCompany,
  reloadCompany,
  dataChecked,
  cantDeleteInfo,
  setDataChecked,
  removeOption,
}) => {
  const [loadingCompany, setLoadingCompany] = useState<boolean>(false)
  const [reassignCompany, setReassignCompany] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')

  const onClickDeleteModal = (e: any) => {
    if (e.company_guid === '') {
      setErrorMessage('Select Company name is required')
    }

    setLoadingCompany(true)
    const params = {
      reassignTo: reassignCompany,
      guids: dataChecked,
    }
    if (dataChecked) {
      deleteBulkCompanyReassign(params)
        .then((res: any) => {
          ToastMessage({type: 'success', message: res?.data?.message})
          setLoadingCompany(false)
          setShowModalDeleteReassign(false)
          setDataChecked([])
          setShowModal(false)
          setReloadCompany(reloadCompany + 1)
        })
        .catch((err: any) => {
          errorExpiredToken(err)
          ToastMessage({message: err?.response?.data?.message, type: 'error'})
          setLoadingCompany(false)
        })
    }
  }

  const onClose = () => {
    setShowModalDeleteReassign(false)
    setReassignCompany('')
  }

  return (
    <Modal dialogClassName='modal-md' show={showModalDeleteReassign} onHide={onClose}>
      <Formik
        initialValues={{
          company_guid: reassignCompany || '',
        }}
        onSubmit={onClickDeleteModal}
      >
        {({setFieldValue}) => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Delete Company</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
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
              </div>
              <div className='text-gray-500 mb-10 text-left'>
                is currently assigned to many data. Please reassign the assets to other company
                before deleting this company. ?
              </div>
              <div className='col-md-12'>
                <label htmlFor='name' className={`${configClass?.label} required`}>
                  Reassign to company
                </label>
                <Select
                  sm={true}
                  id='select-company'
                  name='company_guid'
                  className='col p-0'
                  api={getCompany}
                  params={{orderCol: 'name', orderDir: 'asc'}}
                  reload={reloadCompany}
                  isClearable={false}
                  placeholder='Select Company'
                  defaultValue={undefined}
                  removeOption={removeOption}
                  onChange={(e: any) => {
                    setFieldValue('company_guid', e?.value)
                    setReassignCompany(e?.value)
                    setErrorMessage('')
                  }}
                  parse={(e: any) => {
                    return {
                      value: e?.guid,
                      label: e?.name,
                    }
                  }}
                />
                {errorMessage !== '' && (
                  <div className='fv-plugins-message-container invalid-feedback'>
                    {errorMessage}
                  </div>
                )}
              </div>
              <div className='text-gray-500 mt-10 text-left'>
                Note: this action cannot be undone.
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                {!loadingCompany && (
                  <span className='indicator-label'>Reassign Company and Delete</span>
                )}
                {loadingCompany && (
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

export {DeleteCompanyReassignBulk}
