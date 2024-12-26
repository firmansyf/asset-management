import {CalendarWidget} from '@components/calendar/CalendarTheme2'
import {detectMobileScreen, preferenceDate} from '@helpers'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

let DetailReservation: FC<any> = ({showModal, setShowModal, detail, detailAsset}) => {
  const pref_date: any = preferenceDate()
  const [reservation, setReservation] = useState<any>([])
  const [isMobile, setIsMobile] = useState<boolean>(false)

  const handleResizeScreen = () => {
    setIsMobile(detectMobileScreen())
  }

  useEffect(() => {
    window.addEventListener('resize', handleResizeScreen)
  })

  useEffect(() => {
    setReservation([
      {
        title: detail?.description !== null ? detail?.description : detailAsset?.unique_id,
        start: detail?.date_from,
        end:
          detail?.date_to === detail?.date_from
            ? detail?.date_to
            : moment(detail?.date_to)
                .add(1, 'days')
                .format('YYYY-MM-DD'),
        backgroundColor: '#D9214E',
        borderColor: '#D9214E',
      },
    ])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail])

  return (
    <Modal dialogClassName='modal-lg' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton={isMobile}>
        <Modal.Title>Reserved Asset Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='row'>
          <div className='col-lg-4'>
            <div className='row'>
              <div className='col-md-12 my-3'>
                <div className='fw-bolder text-dark mb-1 required'>Asset Name</div>
                <div className='text-dark'>{detailAsset?.unique_id || '-'}</div>
              </div>
              <div className='col-md-12 my-3'>
                <div className='fw-bolder text-dark mb-1 required'>Start Date</div>
                <div className='text-dark'>
                  {detail?.date_from !== '' ? moment(detail?.date_from).format(pref_date) : '-'}
                </div>
              </div>
              <div className='col-md-12 my-3'>
                <div className='fw-bolder text-dark mb-1 required'>End Date</div>
                <div className='text-dark'>
                  {detail?.date_to !== '' ? moment(detail?.date_to).format(pref_date) : '-'}
                </div>
              </div>
              <div className='col-md-12 my-3'>
                <div className='fw-bolder text-dark mb-1'>Reserved for</div>
                <div className='text-dark'>
                  {detail?.assignee?.first_name !== '' || detail?.assignee?.first_name !== ''
                    ? `${detail?.assignee?.first_name || ''} ${detail?.assignee?.last_name || ''}`
                    : '-'}
                </div>
              </div>
              <div className='col-md-12 my-3'>
                <div className='fw-bolder text-dark mb-1'>Description</div>
                <div className='text-dark'>{detail?.description || '-'}</div>
              </div>
            </div>
          </div>

          <div className='col-lg-8'>
            <CalendarWidget now={moment(detail?.date_from)} events={reservation} />
          </div>
        </div>
      </Modal.Body>
      {isMobile && (
        <Modal.Footer>
          <Button className='btn-sm' variant='primary' onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      )}
    </Modal>
  )
}

DetailReservation = memo(
  DetailReservation,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default DetailReservation
