import {Title} from '@components/form/Title'
import {PageLoader} from '@components/loader/cloud'
import {configClass} from '@helpers'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {shallowEqual, useSelector} from 'react-redux'

const DetailCompany: FC<any> = ({companyDetail, showModal, setShowModal}) => {
  const token: any = useSelector(({token}: any) => token, shallowEqual)
  const [loadingDetail, setLoadingDetail] = useState<boolean>(true)
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
        <Modal.Title>Company Detail</Modal.Title>
      </Modal.Header>
      {loadingDetail ? (
        <div className='row'>
          <div className='col-12 text-center'>
            <PageLoader height={250} />
          </div>
        </div>
      ) : (
        <Modal.Body>
          <div className={configClass?.row}>
            <div className='col-md-12'>
              <Title title='Company Info' uppercase={false} space={0} />
            </div>

            <div className={configClass?.grid}>
              <div className={configClass?.label}>Company Name</div>
              <p>{companyDetail?.name || '-'} </p>
            </div>

            <div className={configClass?.grid}>
              <div className={configClass?.label}>Company Logo</div>
              {companyDetail?.photo ? (
                <img
                  src={`${companyDetail?.photo?.url}?token=${token}`}
                  alt={companyDetail?.photo?.title || '-'}
                  style={{
                    width: '70%',
                    border: '1px solid #c6c7cc',
                    borderRadius: '10px',
                    padding: '10px',
                  }}
                />
              ) : (
                <div className='text-muted'>-</div>
              )}
            </div>
          </div>

          <div className={configClass?.row}>
            <div className='col-md-12'>
              <div className='col-md-12'>
                <Title title='Address' uppercase={false} space={0} />
              </div>
            </div>
            <div className='col-md-12 mb-2'>
              <div className={configClass?.label}>Address 1</div>
              <p>{companyDetail?.address_one || '-'} </p>
            </div>
          </div>

          <div className={configClass?.row}>
            <div className={configClass?.grid}>
              <div className={configClass?.label}>Address 2</div>
              <p>{companyDetail?.address_two || '-'} </p>
            </div>

            <div className={configClass?.grid}>
              <div className={configClass?.label}>State/Province</div>
              <p>{companyDetail?.state || '-'} </p>
            </div>

            <div className={configClass?.grid}>
              <div className={configClass?.label}>City</div>
              <p>{companyDetail?.city || '-'} </p>
            </div>

            <div className={configClass?.grid}>
              <div className={configClass?.label}>Country</div>
              <p>{companyDetail?.country || '-'} </p>
            </div>
          </div>

          <div className={configClass?.row}>
            <div className={configClass?.grid}>
              <div className={configClass?.label}>ZIP/Postal Code</div>
              <p>{companyDetail?.postcode || '-'} </p>
            </div>

            <div className={configClass?.grid}>
              <div className={configClass?.label}>Financial Year begins on</div>
              <p>{companyDetail?.financial_year_begin || '-'} </p>
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

export {DetailCompany}
