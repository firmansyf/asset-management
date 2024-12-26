import {PageLoader} from '@components/loader/cloud'
import {configClass} from '@helpers'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

let DetailBrand: FC<any> = ({brandDetail, showModal, setShowModal}) => {
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
        <Modal.Title>Brand Detail</Modal.Title>
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
              <div className={configClass?.label}>Manufacturer</div>
              <p>{brandDetail?.manufacturer?.name || '-'} </p>
            </div>

            <div className={configClass?.grid}>
              <div className={configClass?.label}>Model</div>
              <p>{brandDetail?.manufacturer_model?.name || '-'} </p>
            </div>

            <div className={configClass?.grid}>
              <div className={configClass?.label}>Brand</div>
              <p>{brandDetail?.name || '-'} </p>
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

DetailBrand = memo(
  DetailBrand,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {DetailBrand}
