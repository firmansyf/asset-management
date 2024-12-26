import {PageLoader} from '@components/loader/cloud'
import {configClass, KTSVG} from '@helpers'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

interface Props {
  data: any
  show: boolean
  onHide: any
  setShowModal: any
}

const DetailType: FC<Props> = ({data, show, onHide, setShowModal}) => {
  const [loadingDetail, setLoadingDetail] = useState<boolean>(true)
  useEffect(() => {
    setLoadingDetail(true)
    if (show) {
      setTimeout(() => {
        setLoadingDetail(false)
      }, 400)
    }
  }, [show])
  return (
    <Modal dialogClassName='modal-md' show={show} onHide={onHide}>
      <Modal.Header>
        <div className='modal-title h4'>Type Detail</div>
        <div
          onClick={onHide}
          className='btn btn-icon btn-sm btn-active-light-primary ms-2'
          data-bs-dismiss='modal'
          aria-label='Close'
        >
          <KTSVG path='/media/icons/duotune/arrows/arr061.svg' className='svg-icon svg-icon-2x' />
        </div>
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
              <div className={configClass?.label}>Type Name</div>
              <p>{data?.name || '-'}</p>
            </div>
            <div className={configClass?.grid}>
              <div className={configClass?.label}>Asset Category</div>
              <p>{data?.category?.name || '-'}</p>
            </div>
          </div>
        </Modal.Body>
      )}
      <Modal.Footer>
        <Button className='btn-sm' variant='secondary' onClick={setShowModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {DetailType}
