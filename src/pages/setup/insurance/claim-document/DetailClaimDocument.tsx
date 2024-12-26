import {configClass} from '@helpers'
import {FC} from 'react'
import {Modal} from 'react-bootstrap'

const DetailClaimDocument: FC<any> = ({detail, showModal, setShowModal}) => {
  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Insurance Document Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='row'>
          <div className='col-md-12 mb-4'>
            <label className={configClass?.title}>Type of Peril</label>
            <p>{detail?.peril?.name || '-'} </p>
          </div>

          <div className='col-md-12 mb-4'>
            <label className={configClass?.title}>Document Name</label>
            <p>{detail?.name || '-'} </p>
          </div>

          <div className='col-md-12'>
            <label className={configClass?.title}>Mandatory Document</label>
            <p>{detail?.is_mandatory_document ? 'Yes' : 'No'} </p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export {DetailClaimDocument}
