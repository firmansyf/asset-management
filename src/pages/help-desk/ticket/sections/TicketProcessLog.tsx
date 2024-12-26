import {preferenceDateTime} from '@helpers'
import parse from 'html-react-parser'
import moment from 'moment'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

import {processLog} from '../Service'

type TicketLogProps = {
  showModal: any
  setShowModal?: any
  guid?: any
  reloadProcessLog: any
}

const ModalProcessLog: FC<TicketLogProps> = ({
  showModal,
  setShowModal,
  guid,
  reloadProcessLog,
}: any) => {
  const orderCol: any = 'created_at'
  const pref_date_time: any = preferenceDateTime()

  const [orderDir, setOrderDir] = useState<string>('asc')
  const [dataProcessLog, setDataProcessLog] = useState<any>([])
  const [sortTitle, setSortTitle] = useState<string>('Newest First')

  const onSort = () => {
    if (orderDir === 'asc') {
      setOrderDir('desc')
      setSortTitle('Oldest First')
    } else {
      setOrderDir('asc')
      setSortTitle('Newest First')
    }
  }

  useEffect(() => {
    guid &&
      processLog(guid || '', {orderCol, orderDir}).then(({data: {data: res}}: any) => {
        res && setDataProcessLog(res)
      })
  }, [guid, orderDir, reloadProcessLog])

  return (
    <Modal dialogClassName='modal-lg' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Process Log</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='row'>
          <div className='col-md-12'>
            <Button variant='link' className='float-end' onClick={onSort}>
              {sortTitle}&nbsp;&nbsp;
              {orderDir === 'asc' ? (
                <i className='fas fa-sort-amount-down text-primary'></i>
              ) : (
                <i className='fas fa-sort-amount-up-alt text-primary'></i>
              )}
            </Button>
          </div>
        </div>

        <div className='timeline-label'>
          {dataProcessLog &&
            dataProcessLog?.length > 0 &&
            dataProcessLog?.map((item: any, index: any) => {
              const {event_name, created_at, created_by, description}: any = item || {}
              const history: any = description || {}

              return (
                <div key={index || 0} className='timeline-item'>
                  <div className='timeline-label text-gray-600 fs-6' style={{width: '180px'}}>
                    {moment(created_at || '')?.format(pref_date_time)}
                  </div>

                  <div className='timeline-badge'>
                    <i className='fa fa-genderless text-primary fs-1'></i>
                  </div>

                  <div className='timeline-content fw-mormal ps-3'>
                    <div className='fw-bolder'>{event_name || '-'}</div>
                    <div>By : {created_by || '-'}</div>
                    <div>
                      <ul>
                        {history &&
                          Object.entries(history || {})?.map(([key, value]: any, index: number) => {
                            return (
                              <li key={index || 0}>
                                {parse(key || '')} {'->'} {parse(String(value || ''))}
                              </li>
                            )
                          })}
                      </ul>
                    </div>
                  </div>
                </div>
              )
            })}
        </div>

        <style>
          {`
              .timeline-label:before {
                left: 181px;
              }
            `}
        </style>
      </Modal.Body>
    </Modal>
  )
}

export default ModalProcessLog
