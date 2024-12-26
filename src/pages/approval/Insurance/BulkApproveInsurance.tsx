import {approveBulkInsurance} from '@api/Service'
import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken} from '@helpers'
import {Form, Formik} from 'formik'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

type BulkApproveProps = {
  showModal: any
  setShowModal: any
  setReloadBulkApprove: any
  reloadBulkApprove: any
  dataChecked: any
  setDataChecked: any
}

const ApproveShcema: any = Yup.object().shape({
  name: Yup.string().required('This asset status name is required').nullable(),
})

const BulkApproveInsurance: FC<BulkApproveProps> = ({
  showModal,
  setShowModal,
  setReloadBulkApprove,
  reloadBulkApprove,
  dataChecked,
  setDataChecked,
}) => {
  const [loadingApprove, setLoadingApprove] = useState<boolean>(false)

  const initValues: any = {
    name: dataChecked?.length || '',
  }

  const handleSubmit = () => {
    setLoadingApprove(true)
    if (dataChecked?.length > 0) {
      const params: any = {
        guids: dataChecked as never[],
        is_claimable: 1,
      }

      approveBulkInsurance(params)
        .then(({data: {message}}: any) => {
          setDataChecked([])
          setShowModal(false)
          setLoadingApprove(false)
          ToastMessage({type: 'success', message})
          setReloadBulkApprove(reloadBulkApprove + 1)
        })
        .catch((e: any) => {
          errorExpiredToken(e)
          setLoadingApprove(false)
          const {message} = e?.response?.data || {}
          ToastMessage({type: 'error', message})
        })
    }
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={initValues}
        validationSchema={ApproveShcema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Approve Insurance Claim</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='text-black-400 mb-3 text-center'>
                Are you sure you want to approve selected insurance claim(s) ?
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                {!loadingApprove && <span className='indicator-label'>Yes, Approve</span>}
                {loadingApprove && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default BulkApproveInsurance
