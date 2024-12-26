import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {configClass} from '@helpers'
import {FC, useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap'

const DetailAlertTeam: FC<any> = ({showModal, setShowModal, dataDetail}) => {
  const {name, members, description, working_hour}: any = dataDetail || {}
  const {name: working_name}: any = working_hour || {}
  const [loadingDetail, setLoadingDetail] = useState<boolean>(true)

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
      <Modal.Header closeButton>
        <Modal.Title>Team Detail</Modal.Title>
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
            <div className={configClass?.title}>Team Name</div>
            <div className=''>{name || '-'}</div>
          </div>
          <div className='col-md-12 mb-4'>
            <div className={configClass?.title}>Descriptioin</div>
            <div className=''>{description || '-'}</div>
          </div>
          <div className='col-md-12 mb-4'>
            <div className={configClass?.title}>Members</div>
            <div className='row'>
              {members?.length > 0 ? (
                members?.map(({email}: any, index: any) => (
                  <div className='col-auto' key={index}>
                    <div className='rounded p-1 px-2 bg-light'>{email || '-'}</div>
                  </div>
                ))
              ) : (
                <div className='ms-1 px-2'> - </div>
              )}
            </div>
          </div>
          <div className='col-md-12 mb-4'>
            <div className={configClass?.title}>Working Hour</div>
            <div className=''>{working_name || '-'}</div>
          </div>
        </Modal.Body>
      )}
    </Modal>
  )
}

export {DetailAlertTeam}
