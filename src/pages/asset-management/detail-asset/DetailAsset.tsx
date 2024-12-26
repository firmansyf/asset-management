/* eslint-disable react-hooks/exhaustive-deps */
import Tooltip from '@components/alert/tooltip'
import {PageLoader} from '@components/loader/cloud'
import {configClass, convertDateTimeCustom, hasPermission, useTimeOutMessage} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {useQuery} from '@tanstack/react-query'
import cx from 'classnames'
import {flatMap, keyBy, mapValues, remove} from 'lodash'
import {FC, Fragment, memo, useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {useLocation, useNavigate, useParams} from 'react-router-dom'

import {getCustomForm} from '../add-edit/service'
import {getAssetDetail, getAssetReservation, getReviwUpdateAsset} from '../redux/AssetRedux'
import ModalAssetReview from './modal-asset-review/ModalAssetReview'
import ModalConfirmStatusReview from './modal-asset-review/ModalConfirmStatusReview'
import ModalRejectNewAsset from './modal-asset-review/ModalRejectNewAsset'
import AddReservation from './modal-reservation/AddReservation'
import DetailReservation from './modal-reservation/DetailReservation'
import Actions from './sections/actions'
import AssetHistory from './sections/assetHistory'
import AssetLinked from './sections/assetLinked'
import Cards from './sections/cards'
import CheckInOut from './sections/checkInOut'
import Comment from './sections/comment'
import DetailFileds from './sections/detailFileds'
import Files from './sections/files'
import SendEmail from './SendEmail'

let AssetDetail: FC<any> = () => {
  const params: any = useParams()
  const navigate: any = useNavigate()
  const location: any = useLocation()
  const subTitle: any = document.querySelector('.pageSubTitle')
  const {preference: preferenceStore, currentUser: userStore}: any = useSelector(
    ({preference, currentUser}: any) => ({preference, currentUser}),
    shallowEqual
  )
  const {feature}: any = preferenceStore || {}
  const {guid: userGuid}: any = userStore || {}

  const [values] = useState<any>({})
  const [tab, setTab] = useState<string>('')
  const [isFeature, setFeature] = useState<any>({})
  const [category, setCategory] = useState<any>([])
  const [hideFiled, setHideFiled] = useState<any>([])
  const [reloadLinked, setReloadLinked] = useState<any>([])
  const [initialValues, setInitialValues] = useState<any>({})
  const [preferenceDate, setPreferenceDate] = useState<any>([])
  const [totalCostDetail, setTotalCostDetail] = useState<any>()
  const [dataAssetReview, setDataAssetReview] = useState<any>({})
  const [reloadSendEmail, setReloadSendEmail] = useState<any>([])
  const [dataReservation, setDataReservation] = useState<any>({})
  const [pendingApproval, setPendingApproval] = useState<boolean>(false)
  const [approvalTypeNew, setApprovalTypeNew] = useState<boolean>(false)
  const [reloadCheckInOut, setReloadCheckInOut] = useState<boolean>(false)
  const [reloadAddReservation, setReloadAddReservation] = useState<any>([])
  const [showModalSendEmail, setShowModalSendEmail] = useState<boolean>(false)
  const [reloadAssetApproval, setReloadAssetApproval] = useState<boolean>(false)
  const [showModalAssetReject, setShowModalAssetReject] = useState<boolean>(false)
  const [showModalAssetReview, setShowModalAssetReview] = useState<boolean>(false)
  const [showModalConfirmReview, setShowModalConfirmReview] = useState<boolean>(false)
  const [showModalAddReservation, setShowModalAddReservation] = useState<boolean>(false)
  const [showModalDetailReservation, setShowModalDetailReservation] = useState<boolean>(false)

  const reservationViewPermission: any = hasPermission('asset-reservation.view') || false

  const fieldsQuery: any = useQuery({
    queryKey: ['getCustomForm', {}],
    queryFn: async () => {
      const res: any = await getCustomForm()
      const dataResult: any = res?.data?.data || {}
      const globalFields: any = dataResult?.filter(({forms}: any) => forms)
      const setFirstTab: any = globalFields?.filter(({forms}: any) => forms?.length > 0)
      setTab(
        location?.hash
          ? location?.hash?.split('#')?.[1]
          : setFirstTab?.[0]?.label?.toLowerCase()?.replace(' ', '-')
      )
      const resVal: any = globalFields?.map(
        ({guid, label, name, order, parent_guid, type, forms}: any) => {
          const filtered_forms: any = forms?.filter(
            (field: any) => !['files.photos', 'files.others', 'files.videos']?.includes(field?.name)
          )
          return {
            forms: filtered_forms,
            guid: guid,
            label: label,
            name: name,
            order: order,
            parent_guid: parent_guid,
            type: type,
          }
        }
      )
      return resVal as never[]
    },
  })
  const fields: any = fieldsQuery?.data || {}

  const detailAssetQuery: any = useQuery({
    queryKey: [
      'getAssetDetail',
      {reloadCheckInOut, reloadAssetApproval, fields, guid: params?.guid},
    ],
    queryFn: async () => {
      const {guid}: any = params || {}
      const res: any = await getAssetDetail(guid)
      const dataResult: any = res?.data?.data || {}
      setPendingApproval(dataResult?.approval_status === 'Pending Approval' ? true : false)
      setApprovalTypeNew(dataResult?.approval_type === 'New Asset' ? true : false)
      setTotalCostDetail(dataResult)
      const resVal: any = flatMap(fields, 'forms')?.map(({name}: any) => {
        name = name?.replace('_guid', '')
        if (name?.split('.')?.[0] === 'aaset') {
          name = `asset.${name?.split('.')?.[1]}`
        }
        if (name === 'financial_info.delivery_actual_date_received') {
          name = 'financial_info.actual_date_received'
        }
        const arrName: any = name?.split('.')
        let res: any = undefined
        let val: any = dataResult?.[arrName?.[1]]
        if (arrName?.[0] === 'asset' && arrName?.[1] === 'category') {
          setCategory(val?.guid)
        }
        if (arrName?.[0] === 'global_custom_fields') {
          val = dataResult?.custom_fields
            ?.map(({guid, name}: any) => {
              return {guid, val: dataResult?.global_custom_fields?.[name]}
            })
            ?.find(({guid}: any) => guid === arrName?.[1])?.val
          res = {name, val}
        } else if (Object.hasOwn(dataResult || {}, arrName?.[1])) {
          res = {name, val}
        } else if (Object.hasOwn(dataResult || {}, arrName?.[0])) {
          val = dataResult?.[arrName?.[0]]?.[arrName?.[1]]
          res = {name, val}
        }
        return res
      })
      const resInit: any = mapValues(keyBy(resVal, 'name'), 'val')
      res['financial_info.guid'] = dataResult?.financial_info?.guid
      setInitialValues(resInit)
      return dataResult
    },
  })
  const detailAsset: any = detailAssetQuery?.data || {}
  const loading: any = !detailAssetQuery?.isFetched

  const onTabChange = (tab: string) => {
    navigate({...location, hash: tab}, {replace: true})
    setTab(tab)
  }

  useEffect(() => {
    useTimeOutMessage('clear', 3000)
    setHideFiled(['asset.disposal_date'])
  }, [])

  useEffect(() => {
    if (feature) {
      const resObj: any = keyBy(feature, 'unique_name')
      setFeature(mapValues(resObj, 'value'))
    }
  }, [feature])

  useEffect(() => {
    if (reservationViewPermission) {
      const {guid}: any = params || {}
      const params_data: any = {
        limit: 1,
        orderDir: 'desc',
        orderCol: 'created_at',
        'filter[asset_guid]': guid,
      }

      getAssetReservation(params_data)
        .then(({data: {data: res}}: any) => {
          setDataReservation(res?.length > 0 ? res?.[0] : [])
        })
        .catch(() => setDataReservation({}))
    } else {
      setDataReservation({})
    }
  }, [reloadAddReservation, reservationViewPermission])

  useEffect(() => {
    if (preferenceStore) {
      const {date_format, timezone, time_format}: any = preferenceStore || {}
      const preference_data: any = {
        timezone: timezone || '-',
        date_format: convertDateTimeCustom(date_format, null) || '-',
        time_format: convertDateTimeCustom(null, time_format) || '-',
        date_time_format: convertDateTimeCustom(date_format, time_format) || '-',
      }
      setPreferenceDate(preference_data || {})
    }
  }, [preferenceStore])

  useEffect(() => {
    const {guid}: any = params || {}
    guid &&
      getReviwUpdateAsset('', guid)
        .then(({data: {data: res}}: any) => res && setDataAssetReview(res || {}))
        .catch(() => setDataAssetReview({}))
  }, [reloadAddReservation, reservationViewPermission])

  useEffect(() => {
    subTitle &&
      detailAsset?.name &&
      (subTitle.innerHTML = `Details of asset ${detailAsset?.unique_id || ''}`)
    return () => {
      subTitle && (subTitle.innerHTML = '')
    }
  }, [subTitle, detailAsset])

  return (
    <>
      <PageTitle breadcrumbs={[]}>{detailAsset?.name || 'Detail Asset'}</PageTitle>
      {loading ? (
        <PageLoader />
      ) : (
        <>
          <Actions data={detailAsset} setShowModal={setShowModalSendEmail} />
          <Cards
            userGuid={userGuid}
            detail={detailAsset}
            dataReservation={dataReservation}
            setReloadAssetApproval={setReloadAssetApproval}
            setShowModalReserve={setShowModalAddReservation}
            setShowModalAssetReject={setShowModalAssetReject}
            setShowModalAssetReview={setShowModalAssetReview}
            setShowModalConfirmReview={setShowModalConfirmReview}
            setShowModalDetailReserve={setShowModalDetailReservation}
          />

          <div className='row'>
            <div className='col-md-8'>
              <div className='card card-table'>
                <div className='card-header align-items-center px-4'>
                  <div
                    className={`d-flex bd-highlight w-100 ${
                      pendingApproval && approvalTypeNew ? 'mt-4' : ''
                    }`}
                  >
                    <div className='flex-fill bd-highlight custom-title-asset-card'>
                      <h1 className='card-title text-primary fw-bolder fs-3'>Asset Information</h1>
                    </div>

                    <div className='flex-fill bd-highlight text-end mt-2'>
                      {detailAsset?.has_itemcode === 'Yes' && (
                        <Tooltip
                          placement='top'
                          title={`This asset is using Item Code ${detailAsset?.itemcode?.code}: ${detailAsset?.itemcode?.name}`}
                        >
                          <span style={{fontWeight: '500'}}>
                            Item Code: {`${detailAsset?.itemcode?.code} `}
                            <i className='fa fa-info-circle fa-lg text-body' aria-hidden='true'></i>
                          </span>
                        </Tooltip>
                      )}
                    </div>
                  </div>

                  {pendingApproval && approvalTypeNew && (
                    <div className='row'>
                      <div className='col-md-12 mb-4'>
                        Please review your asset details before clicking the approval button.
                      </div>
                    </div>
                  )}
                </div>

                <div className='card-body align-items-center p-0'>
                  <ul className='nav nav-tabs nav-line-tabs nav-line-tabs-2x fs-6 bg-gray-100'>
                    {fields &&
                      fields?.length > 0 &&
                      fields
                        ?.filter(({forms}: any) => forms?.length > 0)
                        ?.map(({label}: any, index: number) => (
                          <li className='nav-item' key={index || 0}>
                            <div
                              style={{borderBottom: '2px solid #eee'}}
                              className={cx(
                                'm-0 px-5 py-3 cursor-pointer',
                                tab === label?.toLowerCase()?.replace(' ', '-') &&
                                  'bg-primary border-primary text-white fw-bolder'
                              )}
                              onClick={() => onTabChange(label?.toLowerCase()?.replace(' ', '-'))}
                            >
                              {`${label || ''}`}
                            </div>
                          </li>
                        ))}

                    <li className='nav-item' key='asset-history'>
                      <div
                        style={{borderBottom: '2px solid #eee'}}
                        onClick={() => onTabChange('asset-history')}
                        className={cx(
                          'm-0 px-5 py-3 cursor-pointer',
                          tab === 'asset-history' &&
                            'bg-primary border-primary text-white fw-bolder'
                        )}
                      >
                        Asset History
                      </div>
                    </li>
                  </ul>

                  <div className='tab-content'>
                    {fields &&
                      fields?.length > 0 &&
                      fields
                        ?.filter(({forms}: any) => forms?.length > 0)
                        ?.map(({label, forms}: any, index: number) => (
                          <div
                            key={index || 0}
                            className={cx(
                              'tab-pane fade',
                              {show: tab === label?.toLowerCase()?.replace(' ', '-')},
                              {active: tab === label?.toLowerCase()?.replace(' ', '-')}
                            )}
                          >
                            <div className='card card-custom mt-5'>
                              <div className='card-body p-5'>
                                <div className='row'>
                                  {forms &&
                                    forms?.length > 0 &&
                                    forms?.map(
                                      ({
                                        label: formLabel,
                                        name: formName,
                                        guid: formGuid,
                                        type: formType,
                                        option,
                                        conditions,
                                      }: any) => {
                                        if (
                                          formName ===
                                          'financial_info.delivery_actual_date_received'
                                        ) {
                                          formName = 'financial_info.actual_date_received'
                                        }

                                        if (
                                          formName === 'asset.disposal_date' &&
                                          initialValues['asset.status']?.name?.toLowerCase() ===
                                            'disposed'
                                        ) {
                                          remove(
                                            hideFiled,
                                            (value: any) => value === 'asset.disposal_date'
                                          )
                                        }

                                        let check_cf_category: any = undefined
                                        if (conditions !== undefined) {
                                          check_cf_category = conditions?.filter(
                                            (field: any) => category?.includes(field?.model_value)
                                          )
                                        }

                                        if (
                                          conditions !== undefined &&
                                          check_cf_category !== undefined &&
                                          check_cf_category?.length === 0
                                        ) {
                                          const check_hide_filed: any = hideFiled?.filter(
                                            (field: any) => [formName]?.includes(field)
                                          )
                                          if (check_hide_filed?.length === 0) {
                                            hideFiled?.push(formName)
                                          }
                                        }

                                        formName = formName?.replace('_guid', '')
                                        if (formName?.split('.')?.[0] === 'aaset') {
                                          formName = `asset.${formName?.split('.')?.[1]}`
                                        }

                                        let defaultValue: any = initialValues?.[formName]

                                        if (formName === 'financial_info.total_cost') {
                                          if (
                                            values?.unit_cost !== undefined &&
                                            values?.total_quantity !== undefined
                                          ) {
                                            if (values?.unit_cost?.amount !== null) {
                                              const totalUnitCost: any =
                                                values?.unit_cost?.amount * values?.total_quantity
                                              defaultValue = {
                                                code: values?.unit_cost?.code || '',
                                                amount: totalUnitCost || 0,
                                              }
                                            }
                                          } else {
                                            const totalUnitCost: any =
                                              totalCostDetail?.financial_info?.unit_cost?.amount *
                                              totalCostDetail?.financial_info?.total_quantity

                                            defaultValue = {
                                              code:
                                                totalCostDetail?.financial_info?.unit_cost?.code ||
                                                '',
                                              amount: totalUnitCost || 0,
                                            }
                                          }
                                        }

                                        if (formLabel === 'Status Comment') {
                                          formLabel = 'Comment'
                                        }

                                        return (
                                          <Fragment key={formGuid}>
                                            {!hideFiled?.includes(formName) && (
                                              <div key={formGuid} className={configClass.grid}>
                                                <div className={configClass.body}>
                                                  <div className='fw-bolder text-dark mb-1'>
                                                    {formLabel}
                                                  </div>
                                                  <DetailFileds
                                                    option={option}
                                                    type={formType}
                                                    formLabel={formLabel}
                                                    defaultValue={defaultValue}
                                                  />
                                                </div>
                                              </div>
                                            )}
                                          </Fragment>
                                        )
                                      }
                                    )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    <div
                      key='asset-history'
                      className={cx(
                        'tab-pane fade',
                        {show: tab === 'asset-history'},
                        {active: tab === 'asset-history'}
                      )}
                    >
                      <AssetHistory data={detailAsset} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className='col-md-4'>
              {isFeature?.asset_linked === 1 && (
                <AssetLinked
                  detail={detailAsset}
                  reload={reloadLinked}
                  setReload={setReloadLinked}
                />
              )}

              {isFeature?.asset_checkin === 1 && (
                <CheckInOut
                  data={detailAsset}
                  isFeature={isFeature}
                  preferenceDate={preferenceDate}
                  setReload={() => setReloadCheckInOut(!reloadCheckInOut)}
                />
              )}

              <Files data={detailAsset} />
              <Comment data={detailAsset} />
            </div>
          </div>

          <SendEmail
            detailAsset={detailAsset}
            showModal={showModalSendEmail}
            reloadSendEmail={reloadSendEmail}
            setShowModal={setShowModalSendEmail}
            setReloadSendEmail={setReloadSendEmail}
          />

          <AddReservation
            detailAsset={detailAsset}
            dataReservation={dataReservation}
            showModal={showModalAddReservation}
            setShowModal={setShowModalAddReservation}
            reloadAddReservation={reloadAddReservation}
            setReloadAddReservation={setReloadAddReservation}
          />

          <DetailReservation
            detail={dataReservation}
            detailAsset={detailAsset}
            showModal={showModalDetailReservation}
            setShowModal={setShowModalDetailReservation}
          />

          <ModalAssetReview
            detail={dataAssetReview}
            detailAsset={detailAsset}
            showModal={showModalAssetReview}
            setShowModal={setShowModalAssetReview}
            setReloadAssetApproval={setReloadAssetApproval}
          />

          <ModalConfirmStatusReview
            showModal={showModalConfirmReview}
            setShowModal={setShowModalConfirmReview}
          />

          <ModalRejectNewAsset
            showModal={showModalAssetReject}
            setShowModal={setShowModalAssetReject}
            detailAsset={detailAsset}
            setReloadAssetApproval={setReloadAssetApproval}
          />
        </>
      )}
    </>
  )
}

AssetDetail = memo(
  AssetDetail,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default AssetDetail
