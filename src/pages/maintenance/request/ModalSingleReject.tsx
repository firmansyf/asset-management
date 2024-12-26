import {InputText} from '@components/InputText'
import {ToastMessage} from '@components/toast-message'
import {Form, Formik} from 'formik'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'
import * as Yup from 'yup'

import {updateStatusSingle} from './core/service'

type Props = {
  showModalRejectStatus: any
  setShowModalRejectStatus: any
  setReloadData: any
  reloadData: any
  guid: any
}

const RejectSchema = Yup.object().shape({
  reason: Yup.string().required('This reason is required').nullable(),
})

const ModalSingleReject: FC<Props> = ({
  showModalRejectStatus,
  setShowModalRejectStatus,
  setReloadData,
  reloadData,
  guid,
}) => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSubmit = (value: any) => {
    setLoading(true)
    const params = {
      status: 'rejected',
      reason: value.reason,
    }
    updateStatusSingle(params, guid)
      .then((res: any) => {
        setLoading(false)
        setShowModalRejectStatus(false)
        ToastMessage({type: 'success', message: res?.data?.message})
        setTimeout(() => {
          navigate('/maintenance/request')
        }, 1500)
        setReloadData(reloadData + 1)
      })
      .catch((err: any) => {
        ToastMessage({type: 'error', message: err.response?.data?.message})
        setLoading(false)
      })
  }
  return (
    <Modal
      dialogClassName='modal-md'
      show={showModalRejectStatus}
      onHide={() => setShowModalRejectStatus(false)}
    >
      <Formik
        initialValues={{
          reason: '',
        }}
        validationSchema={RejectSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Why do you want to Reject this request?</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className=''>
                <InputText name='reason' type='text' placeholder='Reason to Reject' />
              </div>
              <div className='center mt-10' style={{textAlign: 'center'}}>
                <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                  {!loading && <span className='indicator-label'>Submit</span>}
                  {loading && (
                    <span className='indicator-progress' style={{display: 'block'}}>
                      Please wait...
                      <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                    </span>
                  )}
                </Button>
              </div>
            </Modal.Body>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export {ModalSingleReject}
