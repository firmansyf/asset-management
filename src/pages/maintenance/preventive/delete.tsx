import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken} from '@helpers'
import {Form, Formik} from 'formik'
import {FC, memo, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

import {deletePreventive} from '../Service'

type DeletePreventiveProps = {
  showModal: any
  setShowModal: any
  setReloadPreventive: any
  reloadPreventive: any
  preventiveName: any
  preventiveGuid: any
  totalPage: any
  pageFrom: any
  setPage: any
  page: any
  setResetKeyword: any
}

const PreventiveSchema = Yup.object().shape({
  name: Yup.string().required('This asset status name is required').nullable(),
})

let DeletePreventive: FC<DeletePreventiveProps> = ({
  showModal,
  setShowModal,
  setReloadPreventive,
  reloadPreventive,
  preventiveName,
  preventiveGuid,
  totalPage,
  pageFrom,
  setPage,
  page,
  setResetKeyword,
}) => {
  const [loading, setLoading] = useState(false)

  const handleSubmit = () => {
    setLoading(true)
    if (preventiveGuid) {
      deletePreventive(preventiveGuid)
        .then((res: any) => {
          ToastMessage({type: 'success', message: res?.data?.message})
          setLoading(false)
          setShowModal(false)
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
          setReloadPreventive(reloadPreventive + 1)
        })
        .catch((e: any) => {
          const {message} = e?.response?.data || {}
          setLoading(false)
          errorExpiredToken(e)
          ToastMessage({type: 'error', message})
        })
    }
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={{
          name: preventiveName || '',
        }}
        validationSchema={PreventiveSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Delete Preventive</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className=''>
                Are you sure want to remove
                <span className='fw-bolder'> {preventiveName} </span>
                Preventive ?
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

DeletePreventive = memo(
  DeletePreventive,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default DeletePreventive
