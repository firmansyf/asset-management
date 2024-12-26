import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {configClass} from '@helpers'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

const DetailVendor: FC<any> = ({vendorDetail, showModal, setShowModal}) => {
  const [loadingDetail, setLoadingDetail] = useState<boolean>(true)
  let statusColor: string = ''
  if (vendorDetail?.status?.toLowerCase() === 'active') {
    statusColor = '-success'
  } else if (vendorDetail?.status?.toLowerCase() === 'non-active') {
    statusColor = '-danger'
  }

  useEffect(() => {
    if (showModal) {
      setTimeout(() => ToastMessage({type: 'clear'}), 800)
    }
  }, [showModal])

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
        <Modal.Title>Vendor Detail</Modal.Title>
      </Modal.Header>
      {loadingDetail ? (
        <div className='row'>
          <div className='col-12 text-center'>
            <PageLoader height={250} />
          </div>
        </div>
      ) : (
        <Modal.Body>
          <div className='row mb-2'>
            <div className='col-md-12'>
              <label className={configClass?.title}>Vendor Name</label>
              <p className='mb-4'>{vendorDetail?.name || '-'}</p>
            </div>
            <div className='col-md-12'>
              <label className={configClass?.title}>Description</label>
              <p className='mb-4'>{vendorDetail?.description || '-'}</p>
            </div>
            <div className='col-md-12'>
              <label className={configClass?.title}>Address</label>
              <p className='mb-4'>{vendorDetail?.address || '-'}</p>
            </div>
            <div className='col-md-6'>
              <label className={configClass?.title}>Phone Number</label>
              <p className='mb-4'>
                {vendorDetail?.phone_number ? `+${vendorDetail?.phone_number}` : '-'}
              </p>
            </div>
            <div className='col-md-6'>
              <label className={configClass?.title}>Fax Number</label>
              <p className='mb-4'>{vendorDetail?.fax_number || '-'}</p>
            </div>
            <div className='col-md-6'>
              <label className={configClass?.title}>Website</label>
              <p className='mb-4'>{vendorDetail?.website || '-'}</p>
            </div>
            <div className='col-md-6'>
              <label className={configClass?.title}>Type</label>
              <p className='mb-4'>{vendorDetail?.type || '-'}</p>
            </div>
            <div className='col-md-6'>
              <label className={configClass?.title}>Contact Name</label>
              <p className='mb-4'>{vendorDetail?.contact_name || '-'}</p>
            </div>
            <div className='col-md-6'>
              <label className={configClass?.title}>Contact Number</label>
              <p className='mb-4'>{vendorDetail?.contact_number || '-'}</p>
            </div>
            <div className='col-md-12'>
              <label className={configClass?.title}>Status</label>
              <p>
                <span className={`badge badge-light${statusColor}`}>
                  {vendorDetail?.status || '-'}
                </span>
              </p>
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

export {DetailVendor}
