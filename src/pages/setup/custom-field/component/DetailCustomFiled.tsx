import {PageLoader} from '@components/loader/cloud'
import {configClass} from '@helpers'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

type ModalCustomFieldProps = {
  customFileDetail: any
  showModalDetail: boolean
  setShowModalDetail: any
  title: string
  category: boolean
}

const DetailCFAsset: FC<ModalCustomFieldProps> = ({
  customFileDetail,
  showModalDetail,
  setShowModalDetail,
  title,
  category = false,
}) => {
  const [loadingDetail, setLoadingDetail] = useState<boolean>(true)
  useEffect(() => {
    setLoadingDetail(true)
    if (showModalDetail) {
      setTimeout(() => {
        setLoadingDetail(false)
      }, 400)
    }
  }, [showModalDetail])
  return (
    <Modal
      dialogClassName='modal-md'
      show={showModalDetail}
      onHide={() => setShowModalDetail(false)}
    >
      <Modal.Header>
        <Modal.Title>{title} Detail</Modal.Title>
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
            <div className='col-md-12 mb-4'>
              <label className={configClass?.title}>Custom Field Name</label>
              <p>{customFileDetail?.name || '-'} </p>
            </div>
            <div className='col-md-12 mb-4'>
              <label className={configClass?.title}>Data Type</label>
              <p>{customFileDetail?.element_type_label || '-'} </p>
            </div>
            {['checkbox', 'dropdown', 'radio'].includes(customFileDetail?.element_type) && (
              <div className='col-md-12 mb-4'>
                <label className={configClass?.title}>Data Type Options</label>
                <ul className='m-0'>
                  {customFileDetail?.options?.map((arr: any, index: number) => (
                    <li key={index}>{arr?.value || '-'} </li>
                  ))}
                </ul>
              </div>
            )}
            <div className='col-md-12 mb-4'>
              <label className={configClass?.title}>Required Field</label>
              <p>{customFileDetail?.is_required === 1 ? 'Yes' : 'Optional'} </p>
            </div>
            {category && (
              <div className='col-md-12 mb-4'>
                <label className={configClass?.title}>Category</label>
                <div className='row ms-0 mt-2'>
                  {customFileDetail?.conditions && customFileDetail?.conditions?.length > 0 ? (
                    customFileDetail?.conditions?.map(({model_detail}: any, index: number) => {
                      return (
                        <div
                          className='col-auto rounded bg-secondary word-break mx-1 mb-2'
                          key={index}
                        >
                          {model_detail?.name}
                        </div>
                      )
                    })
                  ) : (
                    <div className='ms-n2 mt-n2'>{'All Category'}</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </Modal.Body>
      )}
      <Modal.Footer>
        <Button className='btn-sm' variant='secondary' onClick={() => setShowModalDetail(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

const DetailCustomField = memo(
  DetailCFAsset,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default DetailCustomField
