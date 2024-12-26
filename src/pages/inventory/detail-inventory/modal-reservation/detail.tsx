import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap'

import {detailReservation} from './Service'

let DetailReservation: FC<any> = ({showModal, setShowModal, detail, reloadReservation}) => {
  const [data, setData] = useState<any>({})

  useEffect(() => {
    const {guid} = detail || {}
    guid &&
      detailReservation(guid).then(({data: {data: res}}: any) => {
        res && setData(res)
      })
  }, [detail, reloadReservation])

  return (
    <Modal dialogClassName='modal-lg' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header>
        <Modal.Title className='text-primary'>
          {data?.from_date ? moment(data?.from_date)?.format('DD MMMM, Y') : 'Reservation'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='row'>
          <div className='col-12'>{data?.caption || '-'}</div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className='btn btn-sm btn-light' onClick={() => setShowModal(false)}>
          Cancel
        </div>
      </Modal.Footer>
    </Modal>
  )
}

DetailReservation = memo(
  DetailReservation,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)

export {DetailReservation}
