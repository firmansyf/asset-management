import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken} from '@helpers'
import {Form, Formik} from 'formik'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

import {deleteSubLocation} from './redux/SubLocationCRUD'

type DeleteSubLocationProps = {
  showModal: any
  setShowModal: any
  setReloadSubLocation: any
  reloadSubLocation: any
  subLocationName: any
  subLocationGuid: any
  setDataChecked: any
  totalPage: any
  pageFrom: any
  setPage: any
  page: any
  setResetKeyword: any
}

const SubLocationSchema = Yup.object().shape({
  name: Yup.string().required('This location name is required').nullable(),
})

const DeleteSubLocation: FC<DeleteSubLocationProps> = ({
  showModal,
  setShowModal,
  setReloadSubLocation,
  reloadSubLocation,
  subLocationName,
  subLocationGuid,
  setDataChecked,
  totalPage,
  pageFrom,
  setPage,
  page,
  setResetKeyword,
}) => {
  const [loadingCategory, setLoadingLocation] = useState(false)

  const onDeleteSubLocation = () => {
    setLoadingLocation(true)
    if (subLocationGuid) {
      deleteSubLocation(subLocationGuid)
        .then((res: any) => {
          ToastMessage({type: 'success', message: res?.data?.message})
          setLoadingLocation(false)
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
          setReloadSubLocation(reloadSubLocation + 1)
          setDataChecked([])
        })
        .catch((e: any) => {
          errorExpiredToken(e)
        })
    }
  }
  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={{
          name: subLocationName || '',
        }}
        validationSchema={SubLocationSchema}
        enableReinitialize
        onSubmit={onDeleteSubLocation}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Delete Sub Location</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='text-black-800 mb-3'>
                Are you sure want to remove Sub Location
                <strong> {subLocationName} </strong> ?
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

export {DeleteSubLocation}
