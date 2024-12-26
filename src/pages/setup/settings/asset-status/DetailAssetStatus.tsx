import {PageLoader} from '@components/loader/cloud'
import {configClass} from '@helpers'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

const DetailAssetStatus: FC<any> = ({showModal, setShowModal, assetStatusDetail}) => {
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
      <Modal.Header>
        <Modal.Title>Asset Status Detail</Modal.Title>
      </Modal.Header>
      {loadingDetail ? (
        <div className='row'>
          <div className='col-12 text-center'>
            <PageLoader height={250} />
          </div>
        </div>
      ) : (
        <Modal.Body>
          <div className={`${configClass?.row} d-flex flex-column`}>
            <div className={configClass?.grid}>
              <div className={configClass?.label}>Asset Status Name</div>
              <p>{assetStatusDetail?.name || '-'} </p>
            </div>

            <div className={configClass?.grid}>
              <div className={configClass?.label}>Description</div>
              <p>{assetStatusDetail?.description || '-'} </p>
            </div>
          </div>
        </Modal.Body>
      )}
      <Modal.Footer>
        <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {DetailAssetStatus}
