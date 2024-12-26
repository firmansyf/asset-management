import {KTSVG} from '@helpers'
import {FC, memo} from 'react'
import {Modal} from 'react-bootstrap'

let MandatoryEdit: FC<any> = ({
  showModal,
  setShowModal,
  mandatory,
  loading,
  temporaryDataConfirm,
  handleSubmit,
}) => {
  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Update Insurance Claim</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='mb-5'>
          <div className='mb-2'>Following fields are blank. Are you confirm to continue ?</div>
          {mandatory &&
            mandatory?.map((e: any, index: any) => {
              const item = e.replace(/'_'/g, ' ')
              return (
                <div className='my-1 text-capitalize' key={index}>
                  <span className='btn-icon svg-icon-2 '>
                    <KTSVG path='/media/icons/duotone/Interface/Close-Square.svg' />
                  </span>
                  <span>{item}</span>
                </div>
              )
            })}
        </div>
      </Modal.Body>

      <Modal.Footer>
        <div className='float-end'>
          <button
            disabled={loading}
            onClick={() => setShowModal(false)}
            className='btn btn-sm btn-secondary mx-2'
          >
            Cancel
          </button>
          <button
            disabled={loading}
            className='btn btn-sm btn-primary'
            onClick={() => {
              handleSubmit({
                ...temporaryDataConfirm,
                confirm_blank: true,
              })
            }}
          >
            {!loading && <span className='indicator-label'>Yes, Confirm</span>}
            {loading && (
              <span className='indicator-progress' style={{display: 'block'}}>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

MandatoryEdit = memo(
  MandatoryEdit,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default MandatoryEdit
