import {KTSVG, toAbsoluteUrl} from '@helpers'
import {FC, memo} from 'react'
import {Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import {useNavigate} from 'react-router-dom'

let ModalConfirm: FC<any> = ({showModal, setShowModal}) => {
  const intl = useIntl()
  const navigate: any = useNavigate()

  return (
    <Modal
      dialogClassName='modal-md modal-dialog-centered'
      show={showModal}
      onHide={() => {
        setShowModal(false)
        navigate('/billing/billing-overview')
      }}
    >
      <Modal.Body>
        <div className='row'>
          <div className='col-md-12 text-center'>
            <img
              alt='Success'
              height={250}
              src={toAbsoluteUrl('/media/svg/others/success.svg')}
              style={{opacity: 0.5}}
            />
            <div className='d-flex align-items-center justify-content-center mb-3'>
              <div className='symbol symbol-35px me-2'>
                <div className='symbol-label bg-light-success'>
                  <KTSVG
                    path='/media/icons/duotone/Code/Done-circle.svg'
                    className='svg-icon-success svg-icon-2x'
                  />
                </div>
              </div>
              <h1 className='m-0'>{intl.formatMessage({id: 'THANKYOU_FOR_YOUR_PAYMENT'})}</h1>
            </div>
            <p>{intl.formatMessage({id: 'PLEASE_CHECK_YOUR_EMAIL_FOR_PAYMENT_INVOICE'})}</p>
            <div
              className='btn btn-light radius-50 px-10'
              onClick={() => {
                setShowModal(false)
                navigate('/billing/billing-overview')
              }}
            >
              Close
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

ModalConfirm = memo(
  ModalConfirm,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {ModalConfirm}
