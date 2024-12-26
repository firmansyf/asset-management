import {ToastMessage} from '@components/toast-message'
import {Form, Formik} from 'formik'
import {FC, memo, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

import {deleteBulkContact} from '../redux/ContactCRUD'

type BulkDeleteContactProps = {
  showModal: any
  setShowModal: any
  setReloadContact: any
  reloadContact: any
  dataChecked: any
  setDataChecked: any
  totalPage: any
  pageFrom: any
  setPage: any
  page: any
  setResetKeyword: any
}

const BulkDelete: FC<BulkDeleteContactProps> = ({
  showModal,
  setShowModal,
  setReloadContact,
  reloadContact,
  dataChecked,
  setDataChecked,
  totalPage,
  pageFrom,
  setPage,
  page,
  setResetKeyword,
}) => {
  const [loading, setLoading] = useState(false)

  const onSubmit = () => {
    setLoading(true)
    if (dataChecked?.length > 0) {
      deleteBulkContact({guids: dataChecked})
        .then((res: any) => {
          ToastMessage({type: 'success', message: res?.data?.message})
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
          setDataChecked([])
          setLoading(false)
          setShowModal(false)
          setReloadContact(reloadContact + 1)
        })
        .catch((e: any) => {
          setLoading(false)
          ToastMessage({type: 'error', message: e?.response?.data?.message})
        })
    }
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={{
          name: dataChecked?.length || '',
        }}
        enableReinitialize
        onSubmit={() => onSubmit()}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Delete Contact</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className=''>
                Are you sure you want to delete
                <span className='fw-bolder'> {dataChecked.length} </span>
                Contact ?
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                {!loading && <span className='indicator-label'>Delete</span>}
                {loading && (
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

const BulkDeleteContact = memo(
  BulkDelete,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {BulkDeleteContact}
