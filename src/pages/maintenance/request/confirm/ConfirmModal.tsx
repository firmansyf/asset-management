import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken, errorValidation} from '@helpers'
import {FC, memo, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

import {updateStatusBulk} from '../core/service'

type ApproveRejectConfirmProps = {
  showModal: any
  setShowModal: any
  dataChecked: any
  setDataChecked: any
  reloadTable: any
  setReloadTable: any
}

import RejectStatusConfirm from './RejectConfirmModal'

const UpdateStatusConfirmCode: FC<ApproveRejectConfirmProps> = ({
  showModal,
  setShowModal,
  dataChecked,
  setDataChecked,
  reloadTable,
  setReloadTable,
}) => {
  const [loadingModal, setLoadingModal] = useState(false)
  const [showModalRejectStatus, setShowModalRejectStatus] = useState(false)

  const onUpdateStatus = (acction: any) => {
    setLoadingModal(true)

    if (dataChecked?.length > 0) {
      let params = {}
      if (acction === 'approve') {
        params = {status: 'approved', guids: dataChecked}
      }
      updateStatusBulk(params)
        .then((res: any) => {
          ToastMessage({type: 'success', message: res?.data?.message})
          setDataChecked([])
          setLoadingModal(false)
          setShowModal(false)
          setReloadTable(reloadTable + 1)
        })
        .catch((e: any) => {
          errorExpiredToken(e)
          setLoadingModal(false)
          Object.values(errorValidation(e))?.map((message: any) =>
            ToastMessage({type: 'error', message})
          )
        })
    }
  }

  const onClose = () => {
    setDataChecked([])
    setShowModal(false)
    setReloadTable(reloadTable + 1)
  }

  const onReject = () => {
    setShowModalRejectStatus(true)
  }

  return (
    <>
      <Modal dialogClassName='modal-md' show={showModal} onHide={onClose}>
        <Modal.Header>
          <Modal.Title>Approve/Reject Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className=''>
            Do you want to <strong>Approve/Reject</strong> the Request?
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            className='btn-sm'
            onClick={() => onUpdateStatus('approve')}
            form-id=''
            variant='primary'
          >
            {!loadingModal && <span className='indicator-label'>Approve</span>}
            {loadingModal && (
              <span className='indicator-progress' style={{display: 'block'}}>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </Button>
          <Button className='btn-sm' onClick={onReject} variant='secondary'>
            Reject
          </Button>
        </Modal.Footer>
      </Modal>
      <RejectStatusConfirm
        showModalRejectStatus={showModalRejectStatus}
        setShowModalRejectStatus={setShowModalRejectStatus}
        setShowModal={setShowModal}
        dataChecked={dataChecked}
        setDataChecked={setDataChecked}
        setReloadTable={setReloadTable}
        reloadTable={reloadTable}
      />
    </>
  )
}

const UpdateStatusConfirm = memo(
  UpdateStatusConfirmCode,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default UpdateStatusConfirm
