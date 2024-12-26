import Tooltip from '@components/alert/tooltip'
import {configClass} from '@helpers'
import {FC, memo, useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap'

let Share: FC<any> = ({showModal, setShowModal, data}) => {
  const [detail, setDetail] = useState<any>('')
  const [copyMessage, setCopyMessage] = useState<any>('Copy To Clipboard')

  useEffect(() => {
    setDetail(`${window.location.origin}/shared/` + data)
  }, [data])

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Share Work Order</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='row'>
          <div className='col-12'>
            <input
              type='text'
              id='share'
              name='share'
              className={configClass?.form}
              placeholder='Link Share'
              value={detail || ''}
            />
          </div>
          <div className='col-12 text-end mt-5'>
            <Tooltip placement='auto' title={copyMessage}>
              <button
                className='btn btn-primary btn-sm'
                onMouseEnter={() => {
                  setCopyMessage('Copy To Clipboard')
                }}
                onClick={() => {
                  navigator.clipboard.writeText(detail)
                  setCopyMessage('Copied')
                }}
              >
                Copy
              </button>
            </Tooltip>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

Share = memo(Share, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default Share
