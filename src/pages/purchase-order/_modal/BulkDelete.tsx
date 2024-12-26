import {ToastMessage} from '@components/toast-message'
import {errorValidation} from '@helpers'
import {Form, Formik} from 'formik'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

import {deleteBulkPO} from '../Services'

type Props = {
  showModal: any
  setShowModal: any
  setReload: any
  reload: any
  dataChecked: any
  setDataChecked: any
}

const validationSchema: any = Yup.object().shape({
  name: Yup.string().required('This asset status name is required').nullable(),
})

const BulkDelete: FC<Props> = ({
  showModal,
  setShowModal,
  setReload,
  reload,
  dataChecked,
  setDataChecked,
}) => {
  const [loadingModal, setLoadingModal] = useState<boolean>(false)

  const onSubmit: any = () => {
    setLoadingModal(true)
    if (dataChecked?.length > 0) {
      deleteBulkPO(dataChecked)
        .then(({data: {message}}: any) => {
          setReload(!reload)
          setDataChecked([])
          setShowModal(false)
          ToastMessage({type: 'success', message})
        })
        .catch((err: any) => {
          Object.values(errorValidation(err) || {})?.map((message: any) =>
            ToastMessage({type: 'error', message})
          )
        })
        .finally(() => setLoadingModal(false))
    }
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={{
          name: dataChecked?.length || '',
        }}
        validationSchema={validationSchema}
        enableReinitialize
        onSubmit={onSubmit}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Confirm Bulk Delete</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className=''>
                Are you sure want to remove
                <span className=''> {dataChecked?.length || 0} </span>
                Purchase Order(s) ?
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

export default BulkDelete
