import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken} from '@helpers'
import {Form, Formik} from 'formik'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

import {DeleteAssetStatusReassign} from './DeleteAssetStatusReassign'
import {checkDeleteAssetStatus, deleteBulkAssetStatus} from './Service'

const AssetStatusSchema = Yup.object().shape({
  name: Yup.string().required('This asset status name is required').nullable(),
})

type BulkDeleteAssetStatusProps = {
  showModal: any
  setShowModal: any
  setReloadAssetStatus: any
  reloadAssetStatus: any
  dataChecked: any
  setDataChecked: any
  assignAssetStatus: any
  totalPage: any
  totalPerPage: any
  page: any
  setPage: any
  setResetKeyword: any
}

const BulkDeleteAssetStatus: FC<BulkDeleteAssetStatusProps> = ({
  showModal,
  setShowModal,
  setReloadAssetStatus,
  reloadAssetStatus,
  dataChecked,
  setDataChecked,
  assignAssetStatus,
  totalPage,
  totalPerPage,
  page,
  setPage,
  setResetKeyword,
}) => {
  const [loading, setLoading] = useState(false)
  const [reassginData, setReassginData] = useState<any>([])
  const [modalReassign, setModalReassign] = useState<any>(false)

  const onSubmit = () => {
    setLoading(true)
    if (dataChecked?.length > 0) {
      checkDeleteAssetStatus({guids: dataChecked})
        .then((res: any) => {
          const {error, message} = res?.data || {}
          if (error) {
            setLoading(false)
            setModalReassign(false)
            ToastMessage({type: 'success', message: message})
          } else {
            deleteBulkAssetStatus({guids: dataChecked})
              .then((res: any) => {
                ToastMessage({type: 'success', message: res?.data?.message})
                setDataChecked([])
                setLoading(false)
                setShowModal(false)
                const total_data_page: number = totalPage - totalPerPage
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
                setModalReassign(false)
                setReloadAssetStatus(reloadAssetStatus + 1)
              })
              .catch((e: any) => {
                errorExpiredToken(e)
                setLoading(false)
                setModalReassign(false)
                ToastMessage({type: 'error', message: e?.response?.data?.message})
              })
          }
        })
        .catch((err: any) => {
          if (err?.response?.data?.error) {
            setLoading(false)
            setModalReassign(true)
            setReassginData(err?.response?.data)
          } else {
            setLoading(false)
            setModalReassign(false)
            errorExpiredToken(err)
            ToastMessage({type: 'error', message: 'asd : ' + err?.response?.data?.message})
          }
        })
    }
  }

  return (
    <>
      <DeleteAssetStatusReassign
        showModalDeleteReassign={modalReassign}
        setShowModal={setShowModal}
        setShowModalDeleteReassign={setModalReassign}
        setReloadAssetStatus={setReloadAssetStatus}
        reloadAssetStatus={reloadAssetStatus}
        assetStatusGuid={dataChecked}
        cantDeleteInfo={reassginData}
        assignAssetStatus={assignAssetStatus}
        setDataChecked={setDataChecked}
      />

      <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
        <Formik
          initialValues={{
            name: dataChecked?.length || '',
          }}
          validationSchema={AssetStatusSchema}
          enableReinitialize
          onSubmit={() => onSubmit()}
        >
          {() => (
            <Form className='justify-content-center' noValidate>
              <Modal.Header>
                <Modal.Title>Delete Asset Status</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className=''>
                  Are you sure want to delete
                  <span className='fw-bolder'> {dataChecked?.length} </span>
                  Asset Status ?
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
    </>
  )
}

export {BulkDeleteAssetStatus}
