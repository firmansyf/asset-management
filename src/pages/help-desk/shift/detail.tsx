import {PageLoader} from '@components/loader/cloud'
import {configClass, sortByDayName} from '@helpers'
import {FC, memo, useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap'

import {getDetailShifts} from './Service'

const Detail: FC<any> = ({showModal, setShowModal, dataDetail}) => {
  const {name} = dataDetail || {}
  const [data, setData] = useState<any>([])
  const [days, setDay] = useState<any>([])
  const [loadingDetail, setLoadingDetail] = useState<boolean>(true)

  useEffect(() => {
    setLoadingDetail(true)
    if (showModal) {
      setTimeout(() => {
        setLoadingDetail(false)
      }, 400)
    }
  }, [showModal])

  useEffect(() => {
    if (dataDetail?.guid !== undefined) {
      getDetailShifts(dataDetail?.guid)
        .then(({data: {data: res}}: any) => {
          setData(res as never[])
        })
        .catch(() => {
          setData([])
        })
    } else {
      setData([])
    }
  }, [dataDetail, showModal])

  useEffect(() => {
    if (data?.working_hours) {
      setDay(sortByDayName(data?.working_hours?.days))
    }
  }, [data?.working_hours])

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Shift Detail</Modal.Title>
      </Modal.Header>
      {loadingDetail ? (
        <div className='row'>
          <div className='col-12 text-center'>
            <PageLoader height={250} />
          </div>
        </div>
      ) : (
        <Modal.Body>
          <div className='col-md-12 mb-4'>
            <div className={configClass?.title}>Shift Name</div>
            <div>{name || '-'}</div>
          </div>

          <div className='col-md-12 mb-4'>
            <div className={configClass?.title}>Timezone</div>
            <div>{data?.working_hours?.timezone || '-'}</div>
          </div>

          <div className='col-md-12 mb-4'>
            <div className={configClass?.title}>Working Hours</div>
            {data?.working_hours?.days?.length > 0 ? (
              <div className='row ms-1'>
                {days?.map(({day, start_time, end_time}: any, index: any) => (
                  <div className='col-md-4 mt-2' key={index}>
                    <div className='d-flex align-items-center fw-bolder mb-1'>
                      <div className='text-primary me-2'>{index + 1}.</div>
                      <div className='text-capitalize'>{day}</div>
                    </div>
                    <p className='m-0 badge badge-light-primary'>
                      {start_time} to {end_time}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              '-'
            )}
          </div>

          <div className='col-md-12'>
            <div className={configClass?.title}>Agents</div>
            {data?.users?.length > 0 ? (
              <ul className='m-0'>
                {data?.users?.map(({first_name, last_name}: any, index: any) => (
                  <li className='mt-2' key={index}>
                    {first_name + ' ' + last_name || '-'}
                  </li>
                ))}
              </ul>
            ) : (
              '-'
            )}
          </div>
        </Modal.Body>
      )}
    </Modal>
  )
}

const DetailShift = memo(
  Detail,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {DetailShift}
