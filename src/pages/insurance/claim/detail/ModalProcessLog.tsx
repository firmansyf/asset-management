import {FC, memo} from 'react'
import {Modal} from 'react-bootstrap'

import {ProcessLogComment} from './ProcessLogComment'

let ModalProcessLog: FC<any> = ({showModal, setShowModal, data, caseId}) => {
  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Process Flow {caseId}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='timeline-label'>
          {data &&
            data?.length > 0 &&
            data?.map((item: any, index: number) => {
              const {event_name, event_date, event_causer, comment}: any = item || {}
              const {name}: any = event_causer || {}

              return (
                <div key={index} className='timeline-item'>
                  <div className='timeline-label' style={{width: '167px'}}>
                    <div className='text-gray-600 fs-7'>{event_date || '-'}</div>
                    <div>{name || '-'}</div>
                  </div>
                  <div className='timeline-badge'>
                    <i className='fa fa-genderless text-primary fs-1'></i>
                  </div>
                  <div className='timeline-content fw-mormal ps-3'>
                    <div className='fw-bolder'>{event_name || '-'}</div>
                    <div>
                      <ProcessLogComment comment={comment || ''} />
                    </div>
                  </div>
                </div>
              )
            })}
          <style>
            {`
              .timeline-label:before {
                left: 166px;
              }
            `}
          </style>
        </div>
      </Modal.Body>
    </Modal>
  )
}

ModalProcessLog = memo(
  ModalProcessLog,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ModalProcessLog
