import {PageLoader} from '@components/loader/cloud'
import {configClass, preferenceDateTime} from '@helpers'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

let DetailItemCode: FC<any> = ({itemCodeDetail, showModal, setShowModal}) => {
  const pref_date_time = preferenceDateTime()
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
        <Modal.Title>Item Code Detail</Modal.Title>
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
            <div className='col-md-6 mb-4'>
              <div className={configClass?.title}>Item Code ID</div>
              <p>{itemCodeDetail?.code || '-'} </p>
            </div>
            <div className='col-md-6 mb-4'>
              <div className={configClass?.title}>Name</div>
              <p>{itemCodeDetail?.name || '-'} </p>
            </div>
            <div className='col-md-6 mb-4'>
              <div className={configClass?.title}>Description</div>
              <p>{itemCodeDetail?.description || '-'} </p>
            </div>
            <div className='col-md-6 mb-4'>
              <div className={configClass?.title}>Asset Count</div>
              <p>{itemCodeDetail?.asset_count || '-'} </p>
            </div>
            <div className='col-md-6 mb-4'>
              <div className={configClass?.title}>Category</div>
              <p>{itemCodeDetail?.category?.name || '-'} </p>
            </div>
            <div className='col-md-6 mb-4'>
              <div className={configClass?.title}>Type</div>
              <p>{itemCodeDetail?.type?.name || '-'} </p>
            </div>
            <div className='col-md-6 mb-4'>
              <div className={configClass?.title}>Manufacturer</div>
              <p>{itemCodeDetail?.manufacturer?.name || '-'} </p>
            </div>
            <div className='col-md-6 mb-4'>
              <div className={configClass?.title}>Model</div>
              <p>{itemCodeDetail?.manufacturer_model?.name || '-'} </p>
            </div>
            <div className='col-md-6 mb-4'>
              <div className={configClass?.title}>Brand</div>
              <p>{itemCodeDetail?.manufacturer_brand?.name || '-'} </p>
            </div>
            <div className='col-md-6 mb-4'>
              <div className={configClass?.title}>Created By</div>
              <p>{itemCodeDetail?.created_by || '-'} </p>
            </div>
            <div className='col-md-6 mb-4'>
              <div className={configClass?.title}>Created On</div>
              <p>{moment(itemCodeDetail?.created_at).format(pref_date_time) || '-'}</p>
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

DetailItemCode = memo(
  DetailItemCode,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {DetailItemCode}
