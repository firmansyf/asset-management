import moment from 'moment'
import {FC, memo} from 'react'
import {Modal} from 'react-bootstrap'

let DetailPolicy: FC<any> = ({policyDetail, setShowModalPolicy, showModal}) => {
  return (
    <Modal
      dialogClassName='modal-lg'
      size='lg'
      show={showModal}
      onHide={() => setShowModalPolicy(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Insurance Policy Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='row mb-3'>
          <div className='col-md-12 mb-5'>
            <div className='mb-2'>Description</div>
            <div className=''>{policyDetail?.description || '-'}</div>
          </div>
          <div className='col-md-6 mb-5'>
            <div className='mb-2'>Insurance Policy Name</div>
            <div className=''>{policyDetail?.name || '-'}</div>
          </div>
          <div className='col-md-6 mb-5'>
            <div className='mb-2'>Email</div>
            <div>{policyDetail?.email || '-'}</div>
          </div>
          <div className='col-md-6 mb-5'>
            <div className='mb-2'>Insurer</div>
            <div>{policyDetail?.email || '-'}</div>
          </div>
          <div className='col-md-6 mb-5'>
            <div className='mb-2'>Policy No</div>
            <div>{policyDetail?.policy_no || '-'}</div>
          </div>
          <div className='col-md-6 mb-5'>
            <div className='mb-2'>Contact Person</div>
            <div>{policyDetail?.contact_person || '-'}</div>
          </div>
          <div className='col-md-6 mb-5'>
            <div className='mb-2'>Coverage</div>
            <div>{policyDetail?.coverage || '-'}</div>
          </div>
          <div className='col-md-6 mb-5'>
            <div className='mb-2'>Phone Number</div>
            <div className=''>{policyDetail?.phone_number || '-'}</div>
          </div>
          <div className='col-md-6 mb-5'>
            <div className='mb-2'>Limit</div>
            <div className=''>{policyDetail?.limit || '-'}</div>
          </div>
          <div className='col-md-6'>
            <div className='mb-5'>
              <div className='mb-2'>Start Date</div>
              <div className=''>{moment(policyDetail?.start_date).format('YYYY-MM-DD') || '-'}</div>
            </div>
            <div className='mb-5'>
              <div className='mb-2'>End Date</div>
              <div className=''>{moment(policyDetail?.end_date).format('YYYY-MM-DD') || '-'}</div>
            </div>
          </div>
          <div className='col-md-6'>
            <div className='mb-5'>
              <div className='mb-2'>Deductible</div>
              <div className=''>{policyDetail?.deductible || '-'}</div>
            </div>
            <div className='mb-5'>
              <div className='mb-2'>Premium</div>
              <div className=''>{policyDetail?.premium || '-'}</div>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

DetailPolicy = memo(DetailPolicy)
export {DetailPolicy}
