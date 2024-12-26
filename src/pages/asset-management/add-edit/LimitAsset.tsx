import {FC, memo, useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'

let LimitAsset: FC<any> = ({showModal, setShowModal, loading, dataSubscriber}) => {
  const navigate = useNavigate()
  const [urlBilling, setUrlBilling] = useState<any>('')

  useEffect(() => {
    if (dataSubscriber?.status === 'active') {
      setUrlBilling('/billing/change-plan')
    } else {
      setUrlBilling('/billing')
    }
  }, [dataSubscriber])

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Asset Limit Reached</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='mb-5'>
          <div className='mb-2'>
            Sorry, you have added the maximum number of assets allowed for your tenant.
          </div>
          <div className='mb-2'>
            You may delete existing asset(s) to continue or if you are the account owner, you can
            upgrade your plan.
          </div>
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className='float-end'>
          <button
            disabled={loading}
            onClick={() => {
              navigate(urlBilling)
            }}
            className='btn btn-sm btn-primary mx-2'
          >
            View Plans
          </button>
          <button
            disabled={loading}
            onClick={() => {
              navigate('/asset-management/all')
            }}
            className='btn btn-sm btn-secondary mx-2'
          >
            View Asset List
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

LimitAsset = memo(
  LimitAsset,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default LimitAsset
