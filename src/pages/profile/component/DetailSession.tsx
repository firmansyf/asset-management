import GoogleMaps from '@components/maps'
import {FC, memo} from 'react'
import {Button, Modal} from 'react-bootstrap'

const DetailSession: FC<any> = ({showModal, setShowModal, dataDetail}) => {
  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Session Location</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='col-md-12 mb-4'>
          {dataDetail?.location?.latitude !== null && dataDetail?.location?.longitude !== null ? (
            <>
              <p className='mt-3'>
                {dataDetail?.location?.latitude + ', ' + dataDetail?.location?.longitude}
              </p>
              <div className='col-12'>
                <GoogleMaps
                  readOnly
                  latitude={dataDetail?.location?.latitude}
                  longitude={dataDetail?.location?.longitude}
                />
              </div>
            </>
          ) : (
            <p className='mt-3 text-center'>No coordinates added on this session</p>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

const ModalDetailSession = memo(DetailSession)
export {ModalDetailSession}
