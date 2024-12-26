/* eslint-disable @typescript-eslint/no-explicit-any */
import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken} from '@helpers'
import {Form, Formik} from 'formik'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

import {deleteVendor} from './redux/VendorCRUD'

type DeleteVendorProps = {
  showModal: any
  setShowModal: any
  setReloadVendor: any
  reloadVendor: any
  vendorName: any
  vendorGuid: any
  setDataChecked: any
  totalPage: any
  pageFrom: any
  setPage: any
  page: any
  setResetKeyword: any
}

const WarrantySchema = Yup.object().shape({
  name: Yup.string().required('This asset status name is required').nullable(),
})

const DeleteVendor: FC<DeleteVendorProps> = ({
  showModal,
  setShowModal,
  setReloadVendor,
  reloadVendor,
  vendorName,
  vendorGuid,
  setDataChecked,
  totalPage,
  pageFrom,
  setPage,
  page,
  setResetKeyword,
}) => {
  const [loadingCategory, setLoadingLocation] = useState(false)
  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={{
          name: vendorName || '',
        }}
        validationSchema={WarrantySchema}
        enableReinitialize
        onSubmit={() => {
          setLoadingLocation(true)
          if (vendorGuid) {
            deleteVendor(vendorGuid)
              .then((res: any) => {
                ToastMessage({type: 'success', message: res?.data?.message})
                const total_data_page: number = totalPage - pageFrom
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
                setLoadingLocation(false)
                setShowModal(false)
                setReloadVendor(reloadVendor + 1)
                setDataChecked([])
              })
              .catch((e: any) => {
                errorExpiredToken(e)
              })
          }
        }}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Delete Vendor</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className=''>
                Are you sure want to remove
                <span className='fw-bolder'> {vendorName} </span>
                Vendor?
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
  )
}

export {DeleteVendor}
