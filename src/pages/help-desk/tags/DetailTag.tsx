import {PageLoader} from '@components/loader/cloud'
import {configClass} from '@helpers'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {Link} from 'react-router-dom'

type Props = {
  data: any
  showDetail: any
  setShowDetail: any
}

const ModalDetailTag: FC<Props> = ({data, showDetail, setShowDetail}) => {
  const [loadingDetail, setLoadingDetail] = useState<boolean>(true)
  useEffect(() => {
    setLoadingDetail(true)
    if (showDetail) {
      setTimeout(() => {
        setLoadingDetail(false)
      }, 400)
    }
  }, [showDetail])
  return (
    <Modal dialogClassName='modal-md' show={showDetail} onHide={() => setShowDetail(false)}>
      <Modal.Header>
        <Modal.Title>Tag Detail</Modal.Title>
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
            <div className='col-12 mb-4'>
              <div className={configClass?.title}>Tag Name</div>
              <p>{data?.name || '-'}</p>
            </div>
            <div className='col-12 mb-4'>
              <div className={configClass?.title}>Tickets</div>
              {data?.tickect?.length > 0 ? (
                <ol className='ps-4 m-0'>
                  {data?.tickect?.map(({guid, name}: any, index: number) => (
                    <li key={index}>
                      <span className='badge bg-secondary my-1'>
                        <Link
                          className='text-decoration-underline'
                          to={`/help-desk/ticket/detail/${guid}`}
                        >
                          {name || ' - '}
                        </Link>
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                '-'
              )}
            </div>
            <div className='col-12'>
              <div className={configClass?.title}>Contacts</div>
              {data?.contact?.length > 0 ? (
                <ol className='ps-4 m-0'>
                  {data?.contact?.map(({name}: any, index: number) => (
                    <li key={index}>
                      <span className='badge bg-secondary my-1'>
                        <Link
                          className='text-decoration-underline'
                          to={`/user-management/contact/`}
                        >
                          {name || ' - '}
                        </Link>
                      </span>
                    </li>
                  ))}
                </ol>
              ) : (
                '-'
              )}
            </div>
          </div>
        </Modal.Body>
      )}
      <Modal.Footer>
        <Button className='btn-sm' variant='secondary' onClick={() => setShowDetail(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {ModalDetailTag}
