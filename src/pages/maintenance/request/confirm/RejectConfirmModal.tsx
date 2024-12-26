import {InputText} from '@components/InputText'
import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken, errorValidation} from '@helpers'
import {Form, Formik} from 'formik'
import {FC, memo, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

import {updateStatusBulk} from '../core/service'

type RejectStatusProps = {
  showModalRejectStatus: any
  setShowModalRejectStatus: any
  setShowModal: any
  dataChecked: any
  setDataChecked: any
  setReloadTable: any
  reloadTable: any
}

const RejectSchema = Yup.object().shape({
  reason: Yup.string().required('This reason is required').nullable(),
})

const RejectStatusConfirmCode: FC<RejectStatusProps> = ({
  showModalRejectStatus,
  setShowModalRejectStatus,
  setShowModal,
  dataChecked,
  setDataChecked,
  setReloadTable,
  reloadTable,
}) => {
  const [loadingModal, setLoadingModal] = useState(false)

  const handleSubmit = (e: any) => {
    setLoadingModal(true)
    if (dataChecked?.length > 0) {
      const params = {
        status: 'rejected',
        reason: e.reason,
        guids: dataChecked,
      }

      updateStatusBulk(params)
        .then((res: any) => {
          ToastMessage({type: 'success', message: res?.data?.message})
          setDataChecked([])
          setReloadTable(reloadTable + 1)
          setShowModalRejectStatus(false)
          setShowModal(false)
          setLoadingModal(false)
        })
        .catch((e: any) => {
          errorExpiredToken(e)
          setShowModalRejectStatus(false)
          setLoadingModal(false)
          Object.values(errorValidation(e))?.map((message: any) =>
            ToastMessage({type: 'error', message})
          )
        })
    }
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
                  {!loadingModal && <span className='indicator-label'>Submit</span>}
                  {loadingModal && (
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

const RejectStatusConfirm = memo(
  RejectStatusConfirmCode,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default RejectStatusConfirm
