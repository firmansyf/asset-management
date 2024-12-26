import {configClass} from '@helpers'
import {FC} from 'react'
import {Modal} from 'react-bootstrap'

const DetailPeril: FC<any> = ({detail, showModal, setShowModal}) => {
  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Detail Type Of Peril</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='row'>
          <div className='col-md-12 mb-4'>
            <label className={configClass?.title}>Type of Peril</label>
            <p>{detail?.name || '-'} </p>
          </div>

          <div className='col-md-12 mb-4'>
            <label className={configClass?.title}>Deductible Amount</label>
            <p>{detail?.deductible_amount || '-'} </p>
          </div>

          <div className='col-md-12'>
            <label className={configClass?.title}>Description</label>
            <p>{detail?.description || '-'} </p>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export {DetailPeril}
