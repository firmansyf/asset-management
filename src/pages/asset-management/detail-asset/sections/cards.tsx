import {hasPermission, preferenceDateTime} from '@helpers'
import {approveAssetReview} from '@pages/asset-management/redux/AssetRedux'
import {keyBy, mapValues} from 'lodash'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import Swal from 'sweetalert2'

import ModalAudit from '../modal-audit-history/ModalAuditHistory'

let Cards: FC<any> = ({
  detail,
  dataReservation,
  setShowModalDetailReserve,
  setShowModalReserve,
  setShowModalAssetReview,
  setShowModalConfirmReview,
  userGuid,
  setReloadAssetApproval,
  setShowModalAssetReject,
}) => {
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {feature}: any = preferenceStore || {}
  const pref_date_time: any = preferenceDateTime()
  const {guid}: any = detail || {}
  const [data, setData] = useState<any>({})
  const [showModalAudit, setShowModalAudit] = useState<boolean>(false)
  const [warrantyStatus, setWarrantyStatus] = useState<string>('')
  const [features, setFeatures] = useState<any>({})
  const [confirmStatus, setConfirmStatus] = useState<string>('')

  const PermissionAdd: any = hasPermission('asset-reservation.add') || false
  const PermissionEdit: any = hasPermission('asset-reservation.edit') || false
  const PermissionView: any = hasPermission('asset-reservation.view') || false

  useEffect(() => {
    detail && setData(detail)

    if (detail?.warranty !== null) {
      switch (detail?.warranty?.status?.toLowerCase()) {
        case 'active':
          return setWarrantyStatus('badge badge-success')
        case 'expired':
          return setWarrantyStatus('badge badge-danger')
        case 'expiring':
          return setWarrantyStatus('badge badge-light-info')
        default:
          return setWarrantyStatus('badge badge-info')
      }
    }
  }, [detail])

  useEffect(() => {
    if (feature) {
      const resObj: any = keyBy(feature, 'unique_name')
      setFeatures(mapValues(resObj, 'value'))
    }
  }, [feature])

  useEffect(() => {
    if (detail?.confirm_status !== null) {
      switch (detail?.confirm_status) {
        case 'Confirmed':
          return setConfirmStatus('badge badge-success')
        case 'Declined':
          return setConfirmStatus('badge badge-danger')
        default:
          return setConfirmStatus('badge badge-light-blue')
      }
    }
  }, [detail])

  const onApprove = () => {
    const params: any = {
      comment: '',
    }
    approveAssetReview(guid, params).then(({data}: any) => {
      if (data) {
        Swal.fire({
          imageUrl: '/images/approved.png',
          imageWidth: 65,
          imageHeight: 65,
          imageAlt: 'Custom image',
          title: 'Asset Approved',
          text: 'Asset Assignee status changed to Approved',
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonColor: '#050990',
          confirmButtonText: 'Ok',
        }).then(() => {
          if (data) {
            setReloadAssetApproval(true)
          }
        })
      }
    })
  }

  return (
    <div className='row'>
      <div className='grid-md-7 col-6 col-sm-4 col-md-3 col-lg-2 mb-5 pe-2'>
        <div className='card bg-gray-100 border border-dashed border-primary h-100'>
          <div className='card-body px-3 py-3'>
            <p className='card-title fw-bold fs-7 mb-2 d-block'>ASSET ID</p>
            <span className='text-dark fw-bolder'>{data?.unique_id || '-'}</span>
          </div>
        </div>
      </div>
      <div className='grid-md-7 col-6 col-sm-4 col-md-3 col-lg-2 mb-5 pe-2'>
        <div className='card bg-gray-100 border border-dashed border-primary h-100'>
          <div className='card-body px-3 py-3'>
            <p className='card-title fw-bold fs-7 mb-2 d-block'>QR CODE</p>
            <span className='text-dark fw-bolder'>{data?.qr_code || '-'}</span>
          </div>
        </div>
      </div>
      <div className='grid-md-7 col-6 col-sm-4 col-md-3 col-lg-2 mb-5 pe-2'>
        <div className='card bg-gray-100 border border-dashed border-primary h-100'>
          <div className='card-body px-3 py-3'>
            <p className='card-title fw-bold fs-7 mb-2 d-block'>AUDIT STATUS</p>
            <span className='text-dark fw-bolder'>
              {data?.last_audit?.data?.status?.name || data?.last_audit?.data || '-'}
            </span>
            <p
              className='small m-0 mt-3 float-end btn-link cursor-pointer text-primary'
              onClick={() => setShowModalAudit(true)}
            >
              Audit History
            </p>
          </div>
        </div>
      </div>
      {features?.maintenance === 1 && (
        <div className='grid-md-7 col-6 col-sm-4 col-md-3 col-lg-2 mb-5 pe-2'>
          <div className='card bg-gray-100 border border-dashed border-primary h-100'>
            <div className='card-body px-3 py-3'>
              <p className='card-title fw-bold fs-7 mb-2 d-block'>MAINTENANCE</p>
              <span className='text-muted fw-bold'>No schedule</span>
            </div>
          </div>
        </div>
      )}
      <div className='grid-md-7 col-6 col-sm-4 col-md-3 col-lg-2 mb-5 pe-2'>
        <div className='card bg-gray-100 border border-dashed border-primary h-100'>
          <div className='card-body px-3 py-3'>
            <p className='card-title fw-bold fs-7 mb-2 d-block'>Reservation Schedule</p>
            {Object.keys(dataReservation || {})?.length > 0 ? (
              <>
                {PermissionView && PermissionEdit && (
                  <>
                    <div
                      className='fw-bold'
                      data-cy='btnViewReserve'
                      style={{cursor: 'pointer'}}
                      onClick={() => setShowModalDetailReserve(true)}
                    >
                      <i className={`text-black fa fa-eye`} />
                      &nbsp; Reserved
                    </div>
                    <p
                      data-cy='btnEditReserve'
                      className='small m-0 fs-13 mt-2 btn-link cursor-pointer text-primary btn-reserved'
                      onClick={() => setShowModalReserve(true)}
                    >
                      Edit
                    </p>
                  </>
                )}
              </>
            ) : (
              <>
                <div className='text-muted fw-bold'>No schedule</div>
                {PermissionAdd && (
                  <p
                    data-cy='btnAddReserve'
                    className='small m-0 fs-13 mt-2 btn-link cursor-pointer text-primary btn-reserved'
                    onClick={() => setShowModalReserve(true)}
                  >
                    Reserve
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {detail?.approval_status !== undefined && detail?.approval_status === 'Pending Approval' && (
        <div className='grid-md-7 col-6 col-sm-4 col-md-3 col-lg-2 mb-5 pe-3'>
          <div
            className='card bg-gray-100 border border-dashed border-primary h-100'
            style={{position: 'relative'}}
          >
            <div className='card-body px-2 py-3 w-100'>
              <p className='card-title fw-bold fs-7 mb-2 d-block w-100'>Approval Status</p>
              <div className='d-flex justify-content-center w-100'>
                <span className='badge badge-light-blue text-wrap'>
                  {detail?.approval_status || ''}
                </span>
              </div>
              {detail?.approval_type === 'Asset Updated' && (
                <div className='d-flex justify-content-center small fs-13 mt-2'>
                  By {detail?.team_name || '-'}
                </div>
              )}
              {detail?.is_approver === 0 && detail?.approval_type === 'New Asset' && (
                <div className='d-flex justify-content-center small fs-13 mt-2'>
                  By {detail?.team_name || '-'}
                </div>
              )}
              {detail?.is_approver !== undefined && detail?.is_approver === 1 && (
                <>
                  {detail?.approval_type === 'New Asset' ? (
                    <div
                      className='d-flex justify-content-evenly align-items-center flex-wrap w-100 h-auto small fs-13 mt-2'
                      style={{position: 'relative', right: 0, left: 0, bottom: 0}}
                    >
                      <a className='cursor-pointer mx-1' onClick={() => onApprove()}>
                        <span className='badge badge-primary text-wrap mb-2 mt-2'>Approve</span>
                      </a>
                      <a className='cursor-pointer' onClick={() => setShowModalAssetReject(true)}>
                        <span className='badge badge-secondary'>Reject</span>
                      </a>
                    </div>
                  ) : (
                    <div
                      className='d-flex justify-content-center small fs-13 mt-2 btn-link cursor-pointer text-primary'
                      onClick={() => setShowModalAssetReview(true)}
                    >
                      Review
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {detail?.confirm_status !== null && (
        <div className='grid-md-7 col-6 col-sm-4 col-md-3 col-lg-2 mb-5 pe-2'>
          <div className='card bg-gray-100 border border-dashed border-primary h-100'>
            <div className='card-body px-3 py-3'>
              <p className='card-title fw-bold fs-7 mb-2 d-block'>Assignee Confirmation</p>
              <div className='d-flex justify-content-center'>
                <span className={confirmStatus}>{detail?.confirm_status || '-'}</span>
              </div>
              {detail?.confirm_status === 'Pending Confirmation' &&
                detail?.assign_to?.guid === userGuid && (
                  <div
                    className='d-flex justify-content-center small fs-13 mt-2 btn-link cursor-pointer text-primary'
                    onClick={() => setShowModalConfirmReview(true)}
                  >
                    Review
                  </div>
                )}
              <div className='d-flex justify-content-center small fs-13 mt-2'>
                By {detail?.assign_to?.name || '-'}
              </div>
            </div>
          </div>
        </div>
      )}

      {detail?.warranty !== null && (
        <div className='grid-md-7 col-6 col-sm-4 col-md-3 col-lg-2 mb-5 pe-2'>
          <div className='card bg-gray-100 border border-dashed border-primary h-100'>
            <div className='card-body px-3 py-3'>
              <p className='card-title fw-bold fs-7 mb-2 d-block'>WARRANTY</p>
              <div className='d-flex justify-content-center'>
                <span className={warrantyStatus}>{detail?.warranty?.status || '-'}</span>
              </div>
              <div
                className='d-flex justify-content-center font-weight-bold'
                style={{fontSize: '10px'}}
              >
                Expiry Date: {moment(detail?.warranty?.expired).format(pref_date_time) || '-'}
              </div>
            </div>
          </div>
        </div>
      )}

      <ModalAudit showModal={showModalAudit} detail={detail} setShowModal={setShowModalAudit} />
    </div>
  )
}

Cards = memo(Cards, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default Cards
