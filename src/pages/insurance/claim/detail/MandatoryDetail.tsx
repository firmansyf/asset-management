import {KTSVG} from '@helpers'
import {FC, memo} from 'react'
import {Modal} from 'react-bootstrap'

let MandatoryDetail: FC<any> = ({showModal, setShowModal, mandatory, codeMandatory}) => {
  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Submit For Approval</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='mb-5'>
          <div className='mb-2'>
            <h6 className='text-center'>You cannot perform this action.</h6>
            Please&nbsp;
            {codeMandatory === 'err_insurance_claim_blank_mandatory_document' &&
              'upload the mandatory document(s)'}
            {codeMandatory === 'err_insurance_claim_blank_mandatory_fields_and_document' &&
              'upload the mandatory document(s) and '}
            {codeMandatory !== 'err_insurance_claim_blank_mandatory_document' &&
              'fill in the following field(s) to continue.'}
          </div>
          {mandatory &&
            mandatory?.map((e: any, index: any) => {
              const item = e?.replace(/'_'/g, ' ')
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
          <button onClick={() => setShowModal(false)} className='btn btn-sm btn-secondary mx-2'>
            Close
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  )
}

MandatoryDetail = memo(
  MandatoryDetail,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default MandatoryDetail
