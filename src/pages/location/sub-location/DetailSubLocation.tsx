import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {configClass} from '@helpers'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

const DetailSubLocation: FC<any> = ({subLocationDetail, showModal, setShowModal}) => {
  const [loadingDetail, setLoadingDetail] = useState<boolean>(true)

  useEffect(() => {
    setLoadingDetail(true)
    showModal && ToastMessage({type: 'clear'})
    showModal && setTimeout(() => setLoadingDetail(false), 0)
  }, [showModal])

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header>
        <Modal.Title>Sub Location Detail</Modal.Title>
      </Modal.Header>
      {loadingDetail ? (
        <div className='row'>
          <div className='col-12 text-center'>
            <PageLoader height={250} />
          </div>
        </div>
      ) : (
        <Modal.Body>
          <div className='row'>
            <div className='col-md-12 mb-4'>
              <label className={configClass?.title}>Name</label>
              <p>{subLocationDetail?.name || '-'} </p>
            </div>

            <div className='col-md-12 mb-4'>
              <label className={configClass?.title}>Location</label>
              <p>{subLocationDetail?.location?.name || '-'} </p>
            </div>

            <div className='col-md-12'>
              <label className={configClass?.title}>Description</label>
              <p>{subLocationDetail?.description || '-'} </p>
            </div>
          </div>
        </Modal.Body>
      )}

      <Modal.Footer>
        <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {DetailSubLocation}
