import {Title} from '@components/form/Title'
import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {configClass, numberWithCommas, preferenceDate, preferenceDateTime} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {Link} from 'react-router-dom'

import {getDetailWarranty} from './redux/WarrantyCRUD'

const Detail: FC<any> = ({warrantyDetail, showModal, setShowModal, defaultCustomField, guid}) => {
  let statusColor: any = ''
  const pref_date: any = preferenceDate()
  const pref_date_time: any = preferenceDateTime()
  const [loadingDetail, setLoadingDetail] = useState<boolean>(true)

  if (warrantyDetail?.status?.toString()?.toLowerCase() === 'active') {
    statusColor = '-success'
  } else if (warrantyDetail?.status?.toString()?.toLowerCase() === 'expired') {
    statusColor = '-danger'
  } else if (warrantyDetail?.status?.toString()?.toLowerCase() === 'expiring') {
    statusColor = '-info'
  } else {
    //
  }

  const warrantyQueryCF: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getDetailWarrantyCF',
      {
        guid,
      },
    ],
    queryFn: async () => {
      if (guid) {
        const res: any = await getDetailWarranty(guid)
        return res?.data?.data?.custom_fields as never[]
      } else {
        return []
      }
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const customField: any = warrantyQueryCF?.data || []

  useEffect(() => {
    setLoadingDetail(true)
    showModal && setTimeout(() => setLoadingDetail(false), 400)
  }, [showModal])

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header>
        <Modal.Title>Warranty Detail</Modal.Title>
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
            <div className='col-md-6 mb-4'>
              <label className={configClass?.title}>Attached Asset</label>
              <p>
                {warrantyDetail?.asset_guid ? (
                  <Link
                    target={'_blank'}
                    to={`/asset-management/detail/${warrantyDetail?.asset_guid}`}
                  >{`${warrantyDetail?.asset_id} - ${warrantyDetail?.asset_name}`}</Link>
                ) : (
                  '-'
                )}
              </p>
            </div>

            <div className='col-md-6 mb-4'>
              <label className={configClass?.title}>Warranty Description</label>
              <p>{warrantyDetail?.description || '-'}</p>
            </div>

            <div className='col-md-6 mb-4'>
              <label className={configClass?.title}>Warranty Expiration Date</label>
              <p>
                {moment(warrantyDetail?.expired).isValid()
                  ? moment(warrantyDetail?.expired).format(pref_date)
                  : '-'}
              </p>
            </div>

            <div className='col-md-6 mb-4'>
              <label className={configClass?.title}>Warranty Period</label>
              <p>{warrantyDetail?.length ? `${warrantyDetail?.length} month(s)` : '-'}</p>
            </div>

            <div className='col-md-12 mb-4'>
              <label className={configClass?.title}>Status</label>
              <p>
                <span className={`badge badge-light${statusColor}`}>
                  {warrantyDetail?.status || '-'}
                </span>
              </p>
            </div>

            {defaultCustomField?.length > 0 && (
              <div className='col-md-12'>
                <Title title='Custom Fields' uppercase={false} space={0} />
                <div className='row'>
                  {customField &&
                    customField?.map((custom: any, index: number) => (
                      <div className='col-md-6 mb-4' key={index}>
                        <div className={configClass?.title}>{custom?.name}</div>
                        <div className=''>
                          {custom?.value ? (
                            <>
                              {![
                                'dropdown',
                                'radio',
                                'checkbox',
                                'currency',
                                'date',
                                'datetime',
                                'gps',
                                'numeric',
                                'link',
                              ].includes(custom?.element_type) && custom?.value}
                              {custom?.element_type === 'date' &&
                                (custom?.value ? moment(custom?.value).format(pref_date) : '-')}
                              {custom?.element_type === 'datetime' &&
                                (custom?.value
                                  ? moment(custom?.value).format(pref_date_time)
                                  : '-')}
                              {custom?.element_type === 'currency' &&
                                (custom?.value?.code || '') +
                                  ' ' +
                                  numberWithCommas(custom?.value?.amount)}
                              {custom?.element_type === 'numeric' &&
                                numberWithCommas(custom?.value, false)}
                              {custom?.element_type === 'link' && (
                                <div className='pt-2'>
                                  <div className='text-dark'>
                                    {custom?.value?.text !== undefined ? (
                                      <Link to={custom?.value?.url} target='_blank'>
                                        {custom?.value?.text}
                                      </Link>
                                    ) : (
                                      <>-</>
                                    )}
                                  </div>
                                </div>
                              )}
                              {custom?.element_type === 'checkbox' &&
                                custom?.options
                                  ?.filter((filter: any) => custom?.value?.includes(filter?.key))
                                  ?.map((m: any) => m?.value)
                                  ?.join(', ')}
                              {['dropdown', 'radio'].includes(custom?.element_type) &&
                                custom?.options?.find((find: any) => find?.key === custom?.value)
                                  ?.value}
                              {custom?.element_type === 'gps' &&
                                `Long : ${custom?.value?.lat}, Lat : ${custom?.value?.lng}`}
                            </>
                          ) : (
                            '-'
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
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

const DetailWarranty = memo(
  Detail,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {DetailWarranty}
