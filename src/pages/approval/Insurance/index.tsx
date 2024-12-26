/* eslint-disable react-hooks/exhaustive-deps */
import {DataTable} from '@components/datatable'
import {Search} from '@components/form/searchAlert'
import {Select} from '@components/select/select'
import {ToastMessage} from '@components/toast-message'
import {checkFeature, hasPermission, KTSVG, preferenceDate} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {Forbidden} from '@metronic/partials'
import {useQuery} from '@tanstack/react-query'
import moment from 'moment'
import {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {useNavigate} from 'react-router-dom'

import {getApproveInsuranceClaim} from '../Service'
import BulkApproveInsurance from './BulkApproveInsurance'

const CardApprovalInsurance: FC<any> = () => {
  const navigate: any = useNavigate()
  const pref_date: any = preferenceDate()
  const urlSearchParams: any = new URLSearchParams(window?.location?.search)
  const params: any = Object.fromEntries(urlSearchParams?.entries())

  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [totalPage, setTotalPage] = useState<number>(0)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('guid')
  const [filterReport, setFilterReport] = useState<any>()
  const [dataChecked, setDataChecked] = useState<any>([])
  const [reloadBulkApprove, setReloadBulkApprove] = useState<any>(0)
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)

  const viewPermission: any = hasPermission('approval.list.insurance_claim') || false

  let is_digital_url: any = undefined
  is_digital_url = Object.entries(params)?.map((key: any) => {
    if (key?.[1] === '0' || key?.[1] === '1') {
      return {is_digital: Number(key?.[1])}
    } else {
      navigate('/approval/insurance-claim')
      return ''
    }
  })

  const columns: any = [
    {header: 'checkbox', width: '20px'},
    {header: 'view', width: '20px'},
    {header: 'Case Number', sort: true, value: 'case_id'},
    {header: 'Case Title', sort: true, value: 'case_title'},
    {header: 'Location', sort: true, value: 'location_guid'},
    {header: 'Vendor', sort: true, value: 'vendor_guid'},
    {header: 'Type of Perils', sort: true, value: 'insurance_claim_peril_name'},
    {header: 'Is Digital', sort: true, value: 'is_digital'},
    {header: 'Created Date', sort: true, value: 'claim_time'},
  ]

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
    setDataChecked([])
  }

  const onPageChange = (e: any) => {
    setPage(e)
    setDataChecked([])
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `*${e}*` : '')
  }

  const onDetail = (item: any) => {
    const {guid, approval_guid} = item || {}
    return `/insurance-claims/${guid || ''}/detail?approval_id=${approval_guid || ''}`
  }

  const onChecked = (e: any) => {
    const ar_guid: any = []
    e?.forEach((ticked: any) => {
      const {checked} = ticked || {}
      if (checked) {
        const {original} = ticked || {}
        const {approval_guid} = original || {}
        ar_guid.push(approval_guid)
      }
    })
    setDataChecked(ar_guid as never[])
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  const approvalInsuranceQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getApproveInsuranceClaim',
      {
        page,
        limit,
        keyword,
        orderDir,
        orderCol,
        reloadBulkApprove,
        pref_date,
        filterReport,
        is_digital_url,
      },
    ],
    queryFn: async () => {
      const filter: any = is_digital_url?.[0] || {}
      const res: any = await getApproveInsuranceClaim({
        page,
        limit,
        keyword,
        orderDir,
        orderCol,
        filter: filter,
      })
      const {current_page, per_page, total}: any = res?.data?.meta || {}
      setTotalPage(total)
      setLimit(per_page)
      setPage(current_page)
      const dataResult: any = res?.data?.data?.map((data: any) => {
        const {guid, insurance_claim: res}: any = data || {}
        return {
          checkbox: res,
          view: 'view',
          case_id: res?.case_id || '-',
          case_title: res?.case_title || '-',
          location_guid: res?.location?.name || '-',
          vendor_guid: res?.vendor?.name || '-',
          insurance_claim_peril_name: res?.insurance_claim_peril?.name || '-',
          digital: res?.is_digital === 1 ? 'Digital' : 'Non Digital',
          claim_time: res?.claim_time ? moment(res?.claim_time || '')?.format(pref_date) : '-',
          original: {...res, approval_guid: guid || ''},
        }
      })
      return dataResult as never[]
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const dataApprovalInsurance: any = approvalInsuranceQuery?.data || []

  return (
    <>
      <div className='card card-custom card-table'>
        <div className='card-table-header'>
          <div className='d-flex flex-wrap flex-stack'>
            <div className='d-flex align-items-center position-relative me-4 my-1'>
              <KTSVG
                path='/media/icons/duotone/General/Search.svg'
                className='svg-icon-3 position-absolute ms-3'
              />
              <Search bg='solid' onChange={onSearch} />

              <Select
                name='filter'
                className='w-200px ms-2'
                placeholder='Filter Digital'
                defaultValue={
                  is_digital_url?.[0] !== undefined
                    ? is_digital_url?.[0]?.is_digital?.toString()
                    : ''
                }
                onChange={({value}: any) => {
                  setFilterReport(value || '')
                  navigate('/approval/insurance-claim?filter[is_digital]=' + value || '')
                }}
                data={[
                  {value: '1', label: 'Digital'},
                  {value: '0', label: 'Non Digital'},
                ]}
              />
            </div>

            <div className='ms-5'>
              <button
                type='button'
                className='btn btn-sm btn-primary me-2'
                disabled={dataChecked?.length < 1 ? true : false}
                onClick={() => dataChecked?.length > 0 && setShowModalConfirmBulk(true)}
              >
                <span className='indicator-label'>Approve</span>
              </button>
            </div>
          </div>
        </div>

        <div className='card-body'>
          <DataTable
            limit={limit}
            onSort={onSort}
            hrefDetail={true}
            total={totalPage}
            columns={columns}
            onDetail={onDetail}
            onChecked={onChecked}
            view={viewPermission}
            onChangePage={onPageChange}
            data={dataApprovalInsurance}
            onChangeLimit={onChangeLimit}
            loading={!approvalInsuranceQuery?.isFetched}
          />
        </div>
      </div>

      <BulkApproveInsurance
        showModal={showModalBulk}
        dataChecked={dataChecked}
        setDataChecked={setDataChecked}
        reloadBulkApprove={reloadBulkApprove}
        setShowModal={setShowModalConfirmBulk}
        setReloadBulkApprove={setReloadBulkApprove}
      />
    </>
  )
}

const ApprovalInsurance: FC = () => {
  const intl: any = useIntl()
  const pagePermission: any = checkFeature('approval')

  const [loadingPage, setLoadingPage] = useState<boolean>(true)

  useEffect(() => {
    setTimeout(() => setLoadingPage(false), 10)
  }, [])

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.APPROVAL.INSURANCE_CLAIM'})}
      </PageTitle>
      {loadingPage ? '' : <>{!pagePermission ? <Forbidden /> : <CardApprovalInsurance />}</>}
    </>
  )
}

export default ApprovalInsurance
