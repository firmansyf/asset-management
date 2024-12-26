import {deleteBulkLocation} from '@api/Service'
import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken} from '@helpers'
import {Form, Formik} from 'formik'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

type BulkDeleteProps = {
  showModal: any
  setShowModal: any
  setReloadSubLocation: any
  reloadSubLocation: any
  dataChecked: any
  setDataChecked: any
  totalPage: any
  pageFrom: any
  setPage: any
  page: any
  setResetKeyword: any
}

const LocationShcema = Yup.object().shape({
  name: Yup.string().required('This asset status name is required').nullable(),
})

const BulkDeleteLocation: FC<BulkDeleteProps> = ({
  showModal,
  setShowModal,
  setReloadSubLocation,
  reloadSubLocation,
  dataChecked,
  setDataChecked,
  totalPage,
  pageFrom,
  setPage,
  page,
  setResetKeyword,
}) => {
  const [loadingCategory, setLoadingLocation] = useState(false)

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={{
          name: dataChecked?.length || '',
        }}
        validationSchema={LocationShcema}
        enableReinitialize
        onSubmit={() => {
          setLoadingLocation(true)
          if (dataChecked?.length > 0) {
            deleteBulkLocation({guids: dataChecked})
              .then((res: any) => {
                ToastMessage({type: 'success', message: res?.data?.message})
                setLoadingLocation(false)
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
                setShowModal(false)
                setDataChecked([])
                setReloadSubLocation(reloadSubLocation + 1)
              })
              .catch((e: any) => {
                const {message} = e?.response?.data || {}
                errorExpiredToken(e)
                ToastMessage({type: 'error', message})
              })
          }
        }}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Delete Location</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className=''>
                Are you sure want to remove
                <span className='text-dark fw-bolder'> {dataChecked?.length} </span> location(s)?
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                {!loadingCategory && <span className='indicator-label'>Delete</span>}
                {loadingCategory && (
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

export default BulkDeleteLocation
