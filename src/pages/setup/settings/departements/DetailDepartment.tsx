import {PageLoader} from '@components/loader/cloud'
import {configClass} from '@helpers'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

const DetailDepartment: FC<any> = ({data, showModal, setShowModal}) => {
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
        <Modal.Title>Department Detail</Modal.Title>
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
              <div className={configClass?.label}>Department Name</div>
              <p>{data?.name || '-'} </p>
            </div>
            <div className={configClass?.grid}>
              <div className={configClass?.label}>Company Name</div>
              <p>{data?.company?.name || '-'} </p>
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

export default DetailDepartment
