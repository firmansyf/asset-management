import {PageLoader} from '@components/loader/cloud'
import {configClass} from '@helpers'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

type DetailCategoryProps = {
  data: any
  showDetail: any
  setShowDetail: any
}

const ModalDetailCategory: FC<DetailCategoryProps> = ({data, showDetail, setShowDetail}) => {
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
        <Modal.Title>Asset Category Detail</Modal.Title>
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
            <div className='col-12'>
              <div className={configClass?.label}>Asset Category Name</div>
              <p>{data?.name || '-'}</p>
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

export {ModalDetailCategory}
