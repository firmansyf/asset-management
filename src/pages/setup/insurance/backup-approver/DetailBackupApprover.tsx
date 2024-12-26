import {configClass} from '@helpers'
import {FC} from 'react'
import {Modal} from 'react-bootstrap'

const DetailBackupApprover: FC<any> = ({detail, showModal, setShowModal}) => {
  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Detail Backup Approver</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='row'>
          <div className='col-md-12 mb-4'>
            <label className={configClass?.title}>Approver Name</label>
            <p>{detail?.approver?.name || '-'} </p>
          </div>

          <div className='col-md-12 mb-4'>
            <label className={configClass?.title}>Assigned Date</label>
            <p>
              {detail?.assigned_start_date && detail?.assigned_end_date
                ? `${detail?.assigned_start_date} to ${detail?.assigned_end_date}`
                : '-'}{' '}
            </p>
          </div>

          <div className='col-md-12'>
            <label className={configClass?.title}>Notes</label>
            <p>{detail?.notes || '-'} </p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export {DetailBackupApprover}
