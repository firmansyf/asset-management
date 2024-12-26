import {configClass} from '@helpers'
import {FC, memo} from 'react'
import {Button, Modal, Tab, Tabs} from 'react-bootstrap'

type DetailCustomerProps = {
  detailCustomer: any
  showDetail: any
  setShowDetail: any
}

let ModalDetailCustomer: FC<DetailCustomerProps> = ({
  detailCustomer,
  showDetail,
  setShowDetail,
}) => {
  return (
    <Modal dialogClassName='modal-md' show={showDetail} onHide={() => setShowDetail(false)}>
      <Modal.Header>
        <Modal.Title>Customer Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs defaultActiveKey='first'>
          <Tab eventKey='first' title='Customer Information'>
            <div className='mt-10'>
              <div className='col-md-12 mb-8'>
                <label htmlFor='name' className='mb-2 required'>
                  Customer Name
                </label>
                <p>
                  <strong>{detailCustomer?.name || '-'}</strong>
                </p>
              </div>
              <div className='col-md-12 mb-8'>
                <label htmlFor='address' className='mb-2'>
                  Customer Address
                </label>
                <p>
                  <strong>{detailCustomer?.address || '-'}</strong>
                </p>
              </div>
              <div className='col-md-12 mb-8'>
                <label htmlFor='country_code' className='mb-2'>
                  Phone Number
                </label>
                <p>
                  <strong>{detailCustomer?.phone_number || '-'}</strong>
                </p>
              </div>
              <div className='col-md-12 mb-8'>
                <label htmlFor='website' className='mb-2'>
                  Customer Website
                </label>
                <p>
                  <strong>{detailCustomer?.website || '-'}</strong>
                </p>
              </div>
              <div className='col-md-12 mb-8'>
                <label htmlFor='email' className='mb-2'>
                  Customer Email
                </label>
                <p>
                  <strong>{detailCustomer?.email || '-'}</strong>
                </p>
              </div>
              <div className='col-md-12 mb-8'>
                <label htmlFor='email' className='mb-2'>
                  Customer Type <span style={{fontSize: 10}}>e.g. (plumbing, electrical)</span>
                </label>
                <p>
                  <strong>{detailCustomer?.type || '-'}</strong>
                </p>
              </div>
              <div className='col-md-12 mb-8'>
                <label htmlFor='description' className='mb-2'>
                  Customer Description
                </label>
                <p>
                  <strong>{detailCustomer?.description || '-'}</strong>
                </p>
              </div>
            </div>
          </Tab>
          <Tab eventKey='second' title='Billing Information'>
            <div className='mt-10'>
              <div className='col-md-12 mb-8'>
                <label htmlFor='billing_name' className='mb-2'>
                  Name
                </label>
                <p>
                  <strong>{detailCustomer?.billing_name || '-'}</strong>
                </p>
              </div>
              <div className='col-md-12 mb-8'>
                <label htmlFor='billing_address_line_1' className='mb-2'>
                  Address Line 1
                </label>
                <p>
                  <strong>{detailCustomer?.billing_address_line_1 || '-'}</strong>
                </p>
              </div>
              <div className='col-md-12 mb-8'>
                <label htmlFor='billing_address_line_2' className='mb-2'>
                  Address Line 2
                </label>
                <p>
                  <strong>{detailCustomer?.billing_address_line_2 || '-'}</strong>
                </p>
              </div>
              <div className='col-md-12 mb-8'>
                <label htmlFor='billing_address_line_3' className='mb-2'>
                  Address Line 3
                </label>
                <p>
                  <strong>{detailCustomer?.billing_address_line_3 || '-'}</strong>
                </p>
              </div>
              <div className='col-md-12 mb-5'>
                <label className={`${configClass?.label} col-lg-5`}>Currency</label>
                <p>
                  <strong>{detailCustomer?.currency || '-'}</strong>
                </p>
              </div>
            </div>
          </Tab>
        </Tabs>
      </Modal.Body>
      <Modal.Footer>
        <Button className='btn-sm' variant='secondary' onClick={() => setShowDetail(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

ModalDetailCustomer = memo(
  ModalDetailCustomer,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ModalDetailCustomer
