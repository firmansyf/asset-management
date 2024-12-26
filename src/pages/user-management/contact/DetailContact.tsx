import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {configClass} from '@helpers'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

const Detail: FC<any> = ({showModal, setShowModal, contactDetail}) => {
  const [loadingDetail, setLoadingDetail] = useState<boolean>(true)
  useEffect(() => {
    if (showModal) {
      setTimeout(() => ToastMessage({type: 'clear'}), 800)
    }
  }, [showModal])

  useEffect(() => {
    setLoadingDetail(true)
    if (showModal) {
      setTimeout(() => {
        setLoadingDetail(false)
      }, 400)
    }
  }, [showModal])
  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header>
        <Modal.Title>Contact Detail</Modal.Title>
      </Modal.Header>
      {loadingDetail ? (
        <div className='row'>
          <div className='col-12 text-center'>
            <PageLoader height={250} />
          </div>
        </div>
      ) : (
        <Modal.Body>
          <div className='row mb-5'>
            <div className={configClass?.grid}>
              <div className={configClass?.body}>
                <div className={configClass?.title} data-cy='generalName'>
                  Contact Name
                </div>
                <div className='word-break lh-12'>{contactDetail?.name || '-'}</div>
              </div>
            </div>
            <div className={configClass?.grid}>
              <div className={configClass?.body}>
                <div className={configClass?.title} data-cy='generalTitle'>
                  Title
                </div>
                <div className='word-break lh-12'>{contactDetail?.title || '-'}</div>
              </div>
            </div>
            <div className={configClass?.grid}>
              <div className={configClass?.body}>
                <div className={configClass?.title} data-cy='generalCompany'>
                  Company
                </div>
                <div className='word-break lh-12'>{contactDetail?.company_name || '-'}</div>
              </div>
            </div>
            <div className={configClass?.grid}>
              <div className={configClass?.body}>
                <div className={configClass?.title} data-cy='generalEmail'>
                  Email
                </div>
                <div className='word-break lh-12'>{contactDetail?.email || '-'}</div>
              </div>
            </div>
            <div className={configClass?.grid}>
              <div className={configClass?.body}>
                <div className={configClass?.title} data-cy='generalPhone'>
                  Phone Number
                </div>
                <div className='word-break lh-12'>
                  {contactDetail?.phonenumber ? `+${contactDetail?.phonenumber}` : '-'}
                </div>
              </div>
            </div>
            <div className={configClass?.grid}>
              <div className={configClass?.body}>
                <div className={configClass?.title} data-cy='generalFacebook'>
                  Facebook
                </div>
                <div className='word-break lh-12'>{contactDetail?.facebook || '-'}</div>
              </div>
            </div>
            <div className={configClass?.grid}>
              <div className={configClass?.body}>
                <div className={configClass?.title} data-cy='generalTag'>
                  Tags
                </div>
                <div className='row'>
                  {contactDetail?.tags?.length > 0 ? (
                    contactDetail?.tags.map(({name}: any, index: number) => (
                      <div
                        className='col-auto badge mx-2 bg-secondary text-dark mb-1 pt-2'
                        key={index}
                      >
                        {name || '-'}
                      </div>
                    ))
                  ) : (
                    <div className='col-auto'>-</div>
                  )}
                </div>
              </div>
            </div>
            <div className={configClass?.grid}>
              <div className={configClass?.body}>
                <div className={configClass?.title} data-cy='generalTwitter'>
                  Twitter
                </div>
                <div className='word-break lh-12'>{contactDetail?.twitter || '-'}</div>
              </div>
            </div>
          </div>
        </Modal.Body>
      )}
      <Modal.Footer>
        <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

const DetailContact = memo(
  Detail,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {DetailContact}
