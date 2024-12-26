import {PageLoader} from '@components/loader/cloud'
import {configClass} from '@helpers'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

type Props = {
  showModal: any
  setShowModal: any
  dataDetail: any
}

const DetailAlert: FC<Props> = ({showModal, setShowModal, dataDetail}) => {
  const {name, start_time, end_time, frequency, frequency_value, types, team, is_active}: any =
    dataDetail || {}

  const [loadingDetail, setLoadingDetail] = useState<boolean>(true)

  useEffect(() => {
    setLoadingDetail(true)
    showModal && setTimeout(() => setLoadingDetail(false), 400)
  }, [showModal])

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Alert Setting Detail</Modal.Title>
      </Modal.Header>
      {loadingDetail ? (
        <div className='row'>
          <div className='col-12 text-center'>
            <PageLoader height={250} />
          </div>
        </div>
      ) : (
        <>
          <Modal.Body>
            <div className='row mb-4'>
              <div className='col-6'>
                <div className={configClass?.title}>Alert Name</div>
                <div>{name || 'N/A'}</div>
              </div>

              <div className='col-6'>
                <div className={configClass?.title}>Module</div>
                <div>{dataDetail?.module?.name || '-'}</div>
              </div>
            </div>

            <div className='row mb-4'>
              <div className='col-6'>
                <div className={configClass?.title}>Field</div>
                <div>{dataDetail?.module_field?.name || '-'}</div>
              </div>

              <div className='col-6'>
                <div className={configClass?.title}>Type of Alert</div>
                <div>
                  {types &&
                    types?.length > 0 &&
                    types?.map(({name}: any, index: number) => {
                      return (
                        <span key={index} className='px-2 m-1 rounded bg-secondary'>
                          {name}
                        </span>
                      )
                    })}
                </div>
              </div>
            </div>

            <div className='row mb-4'>
              <div className='col-6'>
                <div className={configClass?.title}>Alert Time</div>
                <div>
                  {start_time || ''} to {end_time || ''}
                </div>
              </div>

              <div className='col-6'>
                <div className='mb-2 fw-bolder'>Frequency</div>
                <div className='d-flex my-1'>
                  <span>{frequency || ''}</span> <span className='mx-1'>-</span>
                  <span className='mx-1'>
                    {frequency === 'monthly' && frequency_value?.join(' / ')}
                    {frequency === 'daily' && frequency_value?.join(' , ')}
                    {frequency === 'weekly' && frequency_value}
                    {frequency === 'yearly' && frequency_value}
                  </span>
                </div>
              </div>
            </div>

            <div className='row'>
              <div className='col-md-6 mb-3'>
                <div className='fw-bolder'>Team</div>
                <div>{team?.name || '-'}</div>
              </div>

              <div className='col-md-6'>
                <div className='fw-bolder'>Active</div>
                {is_active === 1 && <span className='badge bg-success'>Yes</span>}
                {is_active === 0 && <span className='badge bg-secondary text-primary'>No</span>}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  )
}

export {DetailAlert}
