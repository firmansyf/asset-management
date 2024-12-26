/* eslint-disable react-hooks/exhaustive-deps */
import {Accordion} from '@components/Accordion'
import {PageLoader} from '@components/loader/cloud'
import {IMG} from '@helpers'
import {FC} from 'react'

const TicketRequest: FC<any> = ({detailTicket, loading}) => {
  return (
    <>
      {loading ? (
        <PageLoader height={250} />
      ) : (
        <div className='card-body align-items-center p-0 mb-4'>
          <Accordion id='files' default={'info'}>
            <div className='' data-value='info' data-label={`Requester`}>
              <div className='row' data-cy='detail-container'>
                <div className='col-2'>
                  <IMG path={'/images/blank.png'} className='h-35px rounded-circle' />
                </div>
                <div className='col-10'>
                  <div>{detailTicket?.submitter_name || '-'}</div>
                  <div>{detailTicket?.submitter_email || '-'}</div>
                </div>
              </div>
            </div>
          </Accordion>
        </div>
      )}
    </>
  )
}

export default TicketRequest
