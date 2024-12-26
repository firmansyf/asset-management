import {Title} from '@components/form/Title'
import {PageLoader} from '@components/loader/cloud'
import {configClass} from '@helpers'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

let DetailSupplier: FC<any> = ({showModal, setShowModal, detailSupplier}) => {
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
        <Modal.Title>Supplier Detail</Modal.Title>
      </Modal.Header>
      {loadingDetail ? (
        <div className='row'>
          <div className='col-12 text-center'>
            <PageLoader height={250} />
          </div>
        </div>
      ) : (
        <Modal.Body>
          <div className={configClass?.row}>
            <div className='col-md-12 mt-n5 mb-n2'>
              <Title title='Address Detail' uppercase={false} space={0} />
            </div>
            <div className='col-md-12 mb-4'>
              <label className={configClass?.label}>Supplier Name</label>
              <div className='word-break'>{detailSupplier?.name || '-'} </div>
            </div>
            <div className={configClass?.grid}>
              <span className={configClass?.label}>Address 1</span>
              <p className='word-break'>
                {detailSupplier?.address_1 || detailSupplier?.address_one || '-'}{' '}
              </p>
            </div>
            <div className={configClass?.grid}>
              <span className={configClass?.label}>Address 2</span>
              <p className='word-break'>
                {detailSupplier?.address_2 || detailSupplier?.address_two || '-'}{' '}
              </p>
            </div>
            <div className={configClass?.grid}>
              <span className={configClass?.label}>State</span>
              <p className='word-break'>{detailSupplier?.state || '-'} </p>
            </div>
            <div className={configClass?.grid}>
              <span className={configClass?.label}>City</span>
              <p className='word-break'>{detailSupplier?.city || '-'} </p>
            </div>
            <div className={configClass?.grid}>
              <span className={configClass?.label}>Country</span>
              <p className='word-break'>{detailSupplier?.country || '-'} </p>
            </div>
            <div className={configClass?.grid}>
              <span className={configClass?.label}>Postal Code/ZIP</span>
              <p className='word-break'>{detailSupplier?.postcode || '-'} </p>
            </div>
            <div className='col-md-12 mb-n2'>
              <Title title='Contact Detail' uppercase={false} space={0} />
            </div>
            <div className='col-md-6 mb-4 mb-md-0'>
              <span className={configClass?.label}>Contact Person</span>
              <p className='word-break'>{detailSupplier?.contact_person || '-'} </p>
            </div>

            <div className={configClass?.grid}>
              <span className={configClass?.label}>Contact Number</span>
              <p className='word-break'>
                {detailSupplier?.contact_number ? `+${detailSupplier.contact_number}` : '-'}
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

DetailSupplier = memo(
  DetailSupplier,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {DetailSupplier}
