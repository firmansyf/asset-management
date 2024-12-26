import {PageLoader} from '@components/loader/cloud'
import {configClass, preferenceDate, sortByDayName} from '@helpers'
import moment from 'moment'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

const Detail: FC<any> = ({showModal, setShowModal, detail}) => {
  const [days, setDay] = useState<any>([])
  const pref_date = preferenceDate()
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
    if (detail?.days) {
      setDay(sortByDayName(detail?.days))
    }
  }, [detail])
  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header>
        <Modal.Title>Working Hour Detail</Modal.Title>
      </Modal.Header>
      {loadingDetail ? (
        <div className='row'>
          <div className='col-12 text-center'>
            <PageLoader height={250} />
          </div>
        </div>
      ) : (
        <Modal.Body>
          <div className='row'>
            <div className='col-md-12 mb-7'>
              <p className={configClass?.title}>Working Name</p>
              <p>{detail?.name || '-'}</p>
            </div>
            <div className='col-md-12 mb-7'>
              <p className={configClass?.title}>Timezone</p>
              <p>{detail?.timezone || '-'}</p>
            </div>
            <div className='col-md-12 mb-7'>
              <p className={configClass?.title}>Working Hours</p>
              <div className='row'>
                {days?.map(({day, start_time, end_time}: any, index: number) => (
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
            </div>
            <div className='col-md-12 mb-7'>
              <p className={configClass?.title}>Description</p>
              <p>{detail?.description || '-'}</p>
            </div>
            <div className='col-md-12'>
              <p className={configClass?.title}>Holidays</p>
              <ol className='px-3 m-0'>
                {detail?.holidays?.length > 0
                  ? detail?.holidays?.map(
                      ({description, start_date, end_date}: any, index: number) => (
                        <li className='my-3 px-1 fw-bolder text-primary' key={index}>
                          <p className='mb-1 fs-8'>
                            {start_date === end_date ? (
                              moment(start_date).format(pref_date)
                            ) : (
                              <span>
                                {moment(start_date).format(pref_date)}{' '}
                                <span className='text-gray-500 mx-2'>to</span>{' '}
                                {moment(end_date).format(pref_date)}
                              </span>
                            )}
                          </p>
                          {description && (
                            <div className='text-capitalize text-dark fs-7 fw-bold'>
                              {description}
                            </div>
                          )}
                        </li>
                      )
                    )
                  : '-'}
              </ol>
            </div>
          </div>
        </Modal.Body>
      )}
      <Modal.Footer>
        <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {Detail}
