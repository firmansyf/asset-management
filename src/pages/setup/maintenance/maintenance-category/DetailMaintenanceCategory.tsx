import {PageLoader} from '@components/loader/cloud'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

type DetailMintenanceCategoryProps = {
  detailMaintenanceCategory: any
  showDetail: any
  setShowDetail: any
}

let ModalDetailMintenanceCategory: FC<DetailMintenanceCategoryProps> = ({
  detailMaintenanceCategory,
  showDetail,
  setShowDetail,
}) => {
  const [loadingDetail, setLoadingDetail] = useState<boolean>(true)

  useEffect(() => {
    setLoadingDetail(true)
    if (showDetail) {
      setTimeout(() => {
        setLoadingDetail(false)
      }, 400)
    }
  }, [showDetail])
  return (
    <Modal dialogClassName='modal-md' show={showDetail} onHide={() => setShowDetail(false)}>
      <Modal.Header>
        <Modal.Title>Work Orders Category Detail</Modal.Title>
      </Modal.Header>
      {loadingDetail ? (
        <div className='row'>
          <div className='col-12 text-center'>
            <PageLoader height={250} />
          </div>
        </div>
      ) : (
        <Modal.Body>
          <div className='mt-5'>
            <div className='col-md-12 mb-4'>
              <label htmlFor='name' className='mb-2'>
                Work Orders Category Name
              </label>
              <p>
                <strong>{detailMaintenanceCategory?.name || '-'}</strong>
              </p>
            </div>
          </div>
        </Modal.Body>
      )}
      <Modal.Footer>
        <Button className='btn-sm' variant='secondary' onClick={() => setShowDetail(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

ModalDetailMintenanceCategory = memo(
  ModalDetailMintenanceCategory,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ModalDetailMintenanceCategory
