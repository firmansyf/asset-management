/* eslint-disable react-hooks/exhaustive-deps */
import {Accordion} from '@components/Accordion'
import Linkify from '@components/linkify'
import {PageLoader} from '@components/loader/cloud'
import {preferenceDate, preferenceDateTime, reverseDateTime} from '@helpers'
import parse from 'html-react-parser'
import moment from 'moment'
import {FC} from 'react'

const TicketGeneral: FC<any> = ({detailTicket, loading}) => {
  const pref_date: any = preferenceDate()
  const pref_date_time: any = preferenceDateTime()

  const linkProps: any = {
    onClick: (e: any) => {
      e?.preventDefault()
      const {target}: any = e || {}
      const {href}: any = target || {}
      window.open(href || '', '_blank')
    },
  }

  const statusPriority = (val: any) => {
    switch (val?.toLowerCase()) {
      case 'highest':
        return <span className='badge badge-light-danger'>{val || ''}</span>
      case 'hight':
        return <span className='badge badge-light-warning'>{val || ''}</span>
      case 'medium':
        return <span className='badge badge-light-info'>{val || ''}</span>
      case 'low':
        return <span className='badge badge-light-success'>{val || ''}</span>
      default:
        return <span className=''>{val || '-'}</span>
    }
  }

  return (
    <>
      {loading ? (
        <PageLoader height={250} />
      ) : (
        <div className='card border border-gray-300 mb-4'>
          <div className='card-header align-items-center px-4'>
            <h3 className='card-title fw-bold fs-3 m-0'>Details</h3>
          </div>
          <div className='card-body align-items-center p-0'>
            <Accordion id='files' default={'info'}>
              <div className='' data-value='info' data-label={`Ticket Info`}>
                <div className='row' data-cy='detail-container'>
                  <div className='col-12 mt-2 row'>
                    <div className='col-5 fw-bolder'>Ticket ID</div>
                    <div className='col-1'>:</div>
                    <div className='col-6'>{detailTicket?.ticket_id || '-'}</div>
                  </div>

                  <div className='col-12 mt-2 row'>
                    <div className='col-5 fw-bolder'>Created</div>
                    <div className='col-1'>:</div>
                    <div className='col-6'>
                      {detailTicket?.created_at
                        ? moment(detailTicket?.created_at || '')?.isValid()
                          ? moment(detailTicket?.created_at || '')?.format(pref_date_time)
                          : moment(reverseDateTime(detailTicket?.created_at || ''))?.format(
                              pref_date_time
                            )
                        : '-'}
                    </div>
                  </div>

                  <div className='col-12 mt-2 row'>
                    <div className='col-5 fw-bolder'>Last Message</div>
                    <div className='col-1'>:</div>
                    <div className='col-6'>
                      {detailTicket?.last_respond_at
                        ? moment(detailTicket?.last_respond_at || '')?.isValid()
                          ? moment(detailTicket?.last_respond_at || '')?.format(pref_date_time)
                          : moment(reverseDateTime(detailTicket?.last_respond_at || ''))?.format(
                              pref_date_time
                            )
                        : '-'}
                    </div>
                  </div>

                  <div className='col-12 mt-2 row'>
                    <div className='col-5 fw-bolder'>Status</div>
                    <div className='col-1'>:</div>
                    <div className='col-6'>{detailTicket?.status_name || '-'}</div>
                  </div>

                  <div className='col-12 mt-2 row'>
                    <div className='col-5 fw-bolder'>Prority</div>
                    <div className='col-1'>:</div>
                    <div className='col-6'>{statusPriority(detailTicket?.priority_name || '')}</div>
                  </div>

                  <div className='col-12 mt-2 row'>
                    <div className='col-5 fw-bolder'>Ticket type</div>
                    <div className='col-1'>:</div>
                    <div className='col-6'>{detailTicket?.type_name || '-'}</div>
                  </div>

                  <div className='col-12 mt-2 row'>
                    <div className='col-5 fw-bolder'>Due</div>
                    <div className='col-1'>:</div>
                    <div className='col-6'>
                      {' '}
                      {detailTicket?.due_time
                        ? moment(detailTicket?.due_time || '')?.isValid()
                          ? moment(detailTicket?.due_time || '')?.format(pref_date)
                          : moment(reverseDateTime(detailTicket?.due_time || ''))?.format(pref_date)
                        : '-'}
                    </div>
                  </div>

                  <div className='col-12 mt-2 row'>
                    <div className='col-5 fw-bolder'>Reporter</div>
                    <div className='col-1'>:</div>
                    <div className='col-6'>
                      {detailTicket?.reporter_name ? (
                        <>
                          <span className='fw-bolder me-2'>
                            {detailTicket?.reporter_name || ''}
                          </span>
                          reported via
                          <span className='fw-bolder ms-2'>
                            {detailTicket?.report_channel_name || ''}
                          </span>
                        </>
                      ) : (
                        '-'
                      )}
                    </div>
                  </div>
                  <div className='col-12 mt-2 row'>
                    <div className='col-5 fw-bolder'>Description</div>
                    <div className='col-1'>:</div>
                    <div className='col-6'>&nbsp;</div>
                    <div className='col-12 pt-2 text-justify'>
                      <Linkify options={{attributes: linkProps}}>
                        {parse(`${detailTicket?.description}`) !== undefined
                          ? parse(`${detailTicket?.description}`)
                          : '-'}
                      </Linkify>
                    </div>
                  </div>
                </div>
              </div>
            </Accordion>
          </div>
        </div>
      )}
    </>
  )
}

export default TicketGeneral
