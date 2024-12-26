import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken} from '@helpers'
import {Form, Formik} from 'formik'
import {FC, memo, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

import {deleteContact} from '../redux/ContactCRUD'

type DeleteContactProps = {
  showModal: any
  setShowModal: any
  setReloadContact: any
  reloadContact: any
  contactName: any
  contactGuid: any
  setDataChecked: any
  totalPage: any
  pageFrom: any
  setPage: any
  page: any
  setResetKeyword: any
}

const Delete: FC<DeleteContactProps> = ({
  showModal,
  setShowModal,
  setReloadContact,
  reloadContact,
  contactName,
  contactGuid,
  setDataChecked,
  totalPage,
  pageFrom,
  setPage,
  page,
  setResetKeyword,
}) => {
  const [loading, setLoading] = useState<any>(false)

  const onSubmit = () => {
    setLoading(true)
    if (contactGuid) {
      deleteContact(contactGuid)
        .then((row: any) => {
          ToastMessage({type: 'success', message: row?.data?.message})
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
          setLoading(false)
          setShowModal(false)
          setReloadContact(reloadContact + 1)
          setDataChecked([])
        })
        .catch((e: any) => {
          errorExpiredToken(e)
          setLoading(false)
          ToastMessage({type: 'error', message: e?.response?.data?.message})
        })
    }
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={{
          name: contactName || '',
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
                Are you sure you want to remove contact
                <span className='fw-bolder'> {contactName} </span> ?
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

const DeleteContact = memo(
  Delete,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {DeleteContact}
