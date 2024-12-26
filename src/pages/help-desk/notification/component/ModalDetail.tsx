import {PageLoader} from '@components/loader/cloud'
import {configClass} from '@helpers'
import {FC, memo, useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import {Link} from 'react-router-dom'

const Detail: FC<any> = ({dataDetail, showModal, setShowModal}) => {
  const intl: any = useIntl()
  const {action_data, trigger_time}: any = dataDetail || {}
  const {main_message, description, url}: any = action_data || {}
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
        <Modal.Title>{intl.formatMessage({id: 'NOTIFICATION_DETAIL'})}</Modal.Title>
      </Modal.Header>
      {loadingDetail ? (
        <div className='row'>
          <div className='col-12 text-center'>
            <PageLoader height={250} />
          </div>
        </div>
      ) : (
        <Modal.Body>
          <div className='col-md-12 mb-4'>
            <div className={configClass?.title}>Message</div>
            <div>{main_message || '-'}</div>
          </div>
          <div className='col-md-12 mb-4'>
            <div className={configClass?.title}>Description</div>
            <div>{description || '-'}</div>
          </div>
          <div className='col-md-12 mb-4'>
            <div className={configClass?.title}>Notification Date</div>
            <div>{trigger_time || '-'}</div>
          </div>
          <div className='col-12 mb-4 text-center'>
            <Link
              to={url?.replace('.be.', '.')}
              target='_blank'
              className='btn btn-sm btn-primary'
              onClick={() => setShowModal(false)}
            >
              Go to the Page
            </Link>
          </div>
        </Modal.Body>
      )}
    </Modal>
  )
}

const DetailNotification = memo(
  Detail,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {DetailNotification}
