import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken} from '@helpers'
import {Form, Formik} from 'formik'
import {FC, memo, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

import {deleteMeter} from '../Service'

type DeleteMeterProps = {
  showModal: any
  setShowModal: any
  setReloadMeter: any
  reloadMeter: any
  meterName: any
  meterGuid: any
  totalPage: any
  pageFrom: any
  setPage: any
  page: any
  setResetKeyword: any
}

const MeterSchema = Yup.object().shape({
  name: Yup.string().required('This asset status name is required').nullable(),
})

let DeleteMeter: FC<DeleteMeterProps> = ({
  showModal,
  setShowModal,
  setReloadMeter,
  reloadMeter,
  meterName,
  meterGuid,
  totalPage,
  pageFrom,
  setPage,
  page,
  setResetKeyword,
}) => {
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = () => {
    setLoading(true)
    if (meterGuid) {
      deleteMeter(meterGuid)
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
          setLoading(false)
          setShowModal(false)
          setReloadMeter(reloadMeter + 1)
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
          name: meterName || '',
        }}
        validationSchema={MeterSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Delete Meter</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                Are you sure want to remove
                <span className='fw-bolder'> {meterName} </span>
                Meter ?
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

DeleteMeter = memo(
  DeleteMeter,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default DeleteMeter
