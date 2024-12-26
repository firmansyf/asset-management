import {PageLoader} from '@components/loader/cloud'
import {configClass} from '@helpers'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

const DetailModel: FC<any> = ({showModal, setShowModal, modelDetail}) => {
  const {name, manufacturer} = modelDetail || {}
  const {name: manufacturer_name} = manufacturer || {}
  const [loadingDetail, setLoadingDetail] = useState<boolean>(true)

  useEffect(() => {
    setLoadingDetail(true)
    if (showModal) {
      setTimeout(() => {
        setLoadingDetail(false)
      }, 400)
    }
  }, [showModal])

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Model Detail</Modal.Title>
      </Modal.Header>
      {loadingDetail ? (
        <div className={`${configClass?.row} d-flex flex-column`}>
          <div className='col-12 text-center'>
            <PageLoader height={250} />
          </div>
        </div>
      ) : (
        <Modal.Body>
          <div className={configClass?.grid}>
            <div className={configClass?.label}>Name</div>
            <div>{name || 'N/A'}</div>
          </div>
          <div className={configClass?.grid}>
            <div className={configClass?.label}>Manufacturer</div>
            <div>{manufacturer_name || 'N/A'}</div>
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

export {DetailModel}
