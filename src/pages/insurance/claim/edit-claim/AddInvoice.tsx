import {configClass, KTSVG} from '@helpers'
import {FC, memo} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'

let AddInvoice: FC<any> = ({showModal, setShowModal}) => {
  const intl = useIntl()
  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Add invoice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <button
            type='button'
            onClick={(e: any) => {
              e.preventDefault()
            }}
            className='btn btn-outline btn-bg-light btn-color-gray-600 btn-active-light-primary border-dashed border-primary px-3 py-4 text-center w-100 min-w-150px'
          >
            <KTSVG className='svg-icon-2x ms-n1' path='/media/icons/duotone/Files/File.svg' />
            <span className='text-gray-800 pt-6'>
              {intl.formatMessage({id: 'DRAG_FILE_HERE_OR_CLICK_TO_UPLOAD_A_FILE'})}
            </span>
          </button>
        </div>
        <div className='mt-2'>
          <label className={`${configClass.label} mt-2`}>Comment / Description</label>
          <div></div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button className='btn-sm' variant='primary' onClick={() => setShowModal(false)}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

AddInvoice = memo(
  AddInvoice,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {AddInvoice}
