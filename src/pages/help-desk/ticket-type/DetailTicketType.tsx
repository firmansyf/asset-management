import {PageLoader} from '@components/loader/cloud'
import {configClass} from '@helpers'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

type Props = {
  data: any
  showDetail: any
  setShowDetail: any
}

let ModalDetailTicketType: FC<Props> = ({data, showDetail, setShowDetail}) => {
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
        <Modal.Title>Type of ticket Detail</Modal.Title>
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
            <div className='col-12 mb-4'>
              <div className={configClass?.title}>Ticket Type</div>
              <p>{data?.name || '-'}</p>
            </div>
            <div className='col-12 mb-4'>
              <div className={configClass?.title}>Description</div>
              <p>{data?.description || '-'}</p>
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

ModalDetailTicketType = memo(
  ModalDetailTicketType,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {ModalDetailTicketType}
