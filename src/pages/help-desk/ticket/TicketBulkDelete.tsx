import {ToastMessage} from '@components/toast-message'
import {Form, Formik} from 'formik'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

import {deleteBulkTicket} from './Service'

type BulkDeleteProps = {
  showModal: any
  setShowModal: any
  setReloadTicket: any
  reloadTicket: any
  dataChecked: any
  setDataChecked: any
  totalPage: any
  pageFrom: any
  setPage: any
  page: any
  setResetKeyword: any
}

const TicketBulkDelete: FC<BulkDeleteProps> = ({
  showModal,
  setShowModal,
  setReloadTicket,
  reloadTicket,
  dataChecked,
  setDataChecked,
  totalPage,
  pageFrom,
  setPage,
  page,
  setResetKeyword,
}) => {
  const [loadingTicket, setLoadingTicket] = useState(false)

  const onSubmit = () => {
    setLoadingTicket(true)
    if (dataChecked?.length > 0) {
      deleteBulkTicket({guids: dataChecked})
        .then((res: any) => {
          ToastMessage({type: 'success', message: res?.data?.message})
          setLoadingTicket(false)
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
          setReloadTicket(reloadTicket + 1)
          setDataChecked([])
        })
        .catch((e: any) => {
          const {message} = e?.response?.data || {}
          ToastMessage({type: 'error', message})
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
        onSubmit={onSubmit}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Delete Ticket</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='text-black-800 mb-3'>
                Are you sure want to remove <strong>{dataChecked?.length}</strong> Ticket(s)?
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                {!loadingTicket && <span className='indicator-label'>Delete</span>}
                {loadingTicket && (
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

export default TicketBulkDelete
