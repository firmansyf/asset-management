import GoogleMaps from '@components/maps'
import {FC, memo} from 'react'
import {Modal} from 'react-bootstrap'

const ModalLocAudit: FC<any> = ({showModal, setShowModal, isLat, isLang}) => {
  return (
    <Modal
      dialogClassName='modal-md modal-dialog-centered'
      show={showModal}
      onHide={() => {
        setShowModal(false)
      }}
    >
      <Modal.Header>
        <Modal.Title>Location View</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className=''>
          <span className='mx-1'>
            <strong>Lat :</strong>
            {` ${isLat} `},
          </span>

          <span>
            <strong>Lat :</strong>
            {` ${isLang} `}
          </span>
          <GoogleMaps readOnly latitude={isLat} longitude={isLang} height='250px' />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div
          className='btn btn-sm btn-primary'
          onClick={() => {
            setShowModal(false)
          }}
        >
          Close
        </div>
      </Modal.Footer>
    </Modal>
  )
}

const ModalLocationAudit = memo(
  ModalLocAudit,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ModalLocationAudit
