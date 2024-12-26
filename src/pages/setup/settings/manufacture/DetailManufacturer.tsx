import {PageLoader} from '@components/loader/cloud'
import {configClass} from '@helpers'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

let DetailManufacturer: FC<any> = ({showModal, setShowModal, dataDetail}) => {
  const {name, description} = dataDetail || {}
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
        <Modal.Title>Manufacturer Detail</Modal.Title>
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
            <div className={configClass?.label}>Manufacturer Name</div>
            <div>{name || 'N/A'}</div>
          </div>
          <div className={configClass?.grid}>
            <div className={configClass?.label}>Description</div>
            <div>{description || '-'}</div>
          </div>
        </Modal.Body>
      )}
      <Modal.Footer>
        <Button
          className='btn-sm'
          variant='secondary'
          onClick={() => {
            setShowModal(false)
          }}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

DetailManufacturer = memo(
  DetailManufacturer,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {DetailManufacturer}
