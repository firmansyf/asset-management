import {KTSVG} from '@helpers'
import parse from 'html-react-parser'
import moment from 'moment'
import {FC, useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap'

const ModalProcessLog: FC<any> = ({showModal, setShowModal, data}) => {
  const [sortTimeLine, setSortTimeLine] = useState<any>(false)
  const [timeline, setTimeline] = useState<any>(false)

  useEffect(() => {
    setTimeline(data)
  }, [data])

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Process Flow</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{textAlign: 'right'}}>
          {data && (
            <button
              className='btn btn-sm btn-link-primary'
              data-cy='btnSortProcessLog'
              onClick={() => {
                setSortTimeLine(!sortTimeLine)
                setTimeline(data.reverse())
              }}
            >
              {sortTimeLine && (
                <>
                  Oldest First
                  <KTSVG
                    className='svg-icon-2x'
                    path='/media/icons/duotone/Navigation/Angle-double-up.svg'
                  />
                </>
              )}
              {!sortTimeLine && (
                <>
                  Newest First
                  <KTSVG
                    className='svg-icon-2x'
                    path='/media/icons/duotone/Navigation/Angle-double-down.svg'
                  />
                </>
              )}
            </button>
          )}
        </div>
        <div className='timeline-label'>
          {timeline &&
            timeline.map((item: any, index: any) => {
              const {event_name, created_at, description, created_by} = item
              return (
                <div key={index} className='timeline-item'>
                  <div className='timeline-label text-gray-600 fs-6' style={{width: '165px'}}>
                    {moment(created_at).format('YYYY-MM-DD HH:mm')}
                  </div>
                  <div className='timeline-badge'>
                    <i className='fa fa-genderless text-primary fs-1'></i>
                  </div>
                  <div className='timeline-content fw-mormal ps-3'>
                    <div className='fw-bolder'>{event_name}</div>
                    <div>By: {created_by}</div>
                    <div>
                      <ul>
                        {description &&
                          Object.entries(description || {})?.map(([key, value], index: any) => {
                            return (
                              <li key={index}>
                                <div className='text-wrap' style={{width: 250}}>
                                  {parse(key || '-')} {'->'} {parse(String(value || ''))}
                                </div>
                              </li>
                            )
                          })}
                      </ul>
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

export {ModalProcessLog}
