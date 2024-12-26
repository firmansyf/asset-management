import {KTSVG} from '@helpers'
import {FC} from 'react'
import {Button, Modal} from 'react-bootstrap'

type Props = {
  showModal: any
  setShowModal: any
  body: any
  onConfirm: any
  confirmLabel: any
  loading: any
}

const confirmSuccess: FC<Props> = ({
  onConfirm,
  body,
  showModal,
  setShowModal,
  confirmLabel,
  loading,
}) => {
  return (
    <Modal
      show={showModal}
      dialogClassName='modal-sm'
      onHide={() => setShowModal(false)}
      style={{marginTop: '200px'}}
    >
      <Modal.Body>
        <div
          style={{
            position: 'absolute',
            top: '-20px',
            background: '#fff',
            borderRadius: '32px',
            paddingTop: '5px',
            left: '38%',
          }}
        >
          <KTSVG
            path={'/media/icons/duotone/Code/Done-circle.svg'}
            className={'svg-icon svg-icon-5x svg-icon-success'}
          />
        </div>
        <div style={{marginTop: '20px'}}>{body}</div>
      </Modal.Body>
      <Modal.Footer style={{justifyContent: 'space-around'}}>
        <Button
          type='submit'
          variant='primary'
          className='btn-sm'
          disabled={loading}
          onClick={onConfirm}
        >
          {!loading && <span className='indicator-label'>{confirmLabel || ''}</span>}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default confirmSuccess
