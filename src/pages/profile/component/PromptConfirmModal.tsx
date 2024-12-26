import {FC} from 'react'
import {Button, Modal} from 'react-bootstrap'

import {formChangeConstant} from './formChangeConstant'

type Props = {
  showPrompt: any
  setShowPrompt: any
  setFormChange: any
  setLastLocation: any
  setFormChangeCompany: any
  setFormChangeDepartment: any
  setFormChangeTimeZone: any
  setFormChangeAvatar: any
}

const PromptConfirmModal: FC<Props> = ({
  showPrompt,
  setShowPrompt,
  setFormChange,
  setLastLocation,
  setFormChangeCompany,
  setFormChangeDepartment,
  setFormChangeTimeZone,
  setFormChangeAvatar,
}) => {
  return (
    <Modal
      dialogClassName='modal-md'
      show={showPrompt}
      onHide={() => {
        setShowPrompt(false)
        setLastLocation(null)
      }}
    >
      <Modal.Body>
        <div style={{fontWeight: 'normal'}} data-cy='unsaveWarning'>
          This page contains unsaved changes. Do you still wish to leave the page?
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className='btn-sm'
          variant='primary'
          onClick={() => {
            setFormChange(formChangeConstant)
            setFormChangeDepartment(false)
            setFormChangeCompany(false)
            setShowPrompt(false)
            setFormChangeTimeZone(false)
            setFormChangeAvatar(false)
          }}
        >
          <span>Yes</span>
        </Button>
        <Button
          className='btn-sm'
          variant='secondary'
          onClick={() => {
            setShowPrompt(false)
            setLastLocation(null)
          }}
        >
          <span>No</span>
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {PromptConfirmModal}
