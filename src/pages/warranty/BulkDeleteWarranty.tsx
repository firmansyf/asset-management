import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken} from '@helpers'
import {Form, Formik} from 'formik'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

import {deleteBulkWarranty} from './redux/WarrantyCRUD'

type BulkDeleteWarrantyProps = {
  showModal: any
  setShowModal: any
  setReloadWarranty: any
  reloadWarranty: any
  dataChecked: any
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

const BulkDeleteWarranty: FC<BulkDeleteWarrantyProps> = ({
  showModal,
  setShowModal,
  setReloadWarranty,
  reloadWarranty,
  dataChecked,
  setDataChecked,
  totalPage,
  pageFrom,
  setPage,
  page,
  setResetKeyword,
}) => {
  const [loadingModal, setLoadingModal] = useState(false)

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={{
          name: dataChecked?.length || '',
        }}
        validationSchema={WarrantySchema}
        enableReinitialize
        onSubmit={() => {
          setLoadingModal(true)
          if (dataChecked?.length > 0) {
            deleteBulkWarranty({guids: dataChecked})
              .then((res: any) => {
                ToastMessage({type: 'success', message: res?.data?.message})
                setLoadingModal(false)
                setShowModal(false)
                const total_data_page: number = totalPage - pageFrom
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
                setReloadWarranty(reloadWarranty + 1)
                setDataChecked([])
              })
              .catch((e: any) => {
                errorExpiredToken(e)
                ToastMessage({type: 'error', message: e})
              })
          }
        }}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Bulk Delete Warranty</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className=''>
                Are you sure want to remove
                <span style={{color: 'black'}}> {dataChecked?.length} </span>
                Warranty ?
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                {!loadingModal && <span className='indicator-label'>Delete</span>}
                {loadingModal && (
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

export {BulkDeleteWarranty}
