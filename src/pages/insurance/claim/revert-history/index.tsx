import {Alert} from '@components/alert'
import Tooltip from '@components/alert/tooltip'
import {DataTable} from '@components/datatable'
import {ToastMessage} from '@components/toast-message'
import {configClass, preferenceDateTime, validationViewDate} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {useQuery} from '@tanstack/react-query'
import {FC, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {useIntl} from 'react-intl'
import {Link} from 'react-router-dom'

import {exportExcelRevertHistory, getRevertHistory} from '../Service'

const InsuranceRevertHistory: FC = () => {
  const intl: any = useIntl()
  const pref_date_time: any = preferenceDateTime()

  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [showModalExport, setShowModalExport] = useState<boolean>(false)
  const [messageAlert, setMessage] = useState<any>(false)
  const [region, setRegion] = useState<string>('')
  const [orderCol, setOrderCol] = useState<string>('case_id')
  const [orderDir, setOrderDir] = useState<string>('asc')

  const dataRegionQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getRegion', {page, limit}],
    queryFn: async () => {
      const res: any = await getRevertHistory({page, limit})

      let dataResult: any = res?.data?.data?.map(({region}: any) => region)
      dataResult = new Set(dataResult)

      return [...dataResult]
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })

  const dataRegion: any = dataRegionQuery?.data || []

  const revertHistoryQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getRevertHistory', {page, orderDir, orderCol, limit, region}],
    queryFn: async () => {
      const filter: any = region !== '' ? {'filter[region]': region} : {}
      const res: any = await getRevertHistory({page, orderDir, orderCol, limit, ...filter})
      const {current_page, per_page, total}: any = res?.data?.meta || {}
      setTotalPage(total)
      setPage(current_page)
      setLimit(per_page)

      const dataResult: any = res?.data?.data?.map((item: any) => {
        const {
          guid,
          case_id,
          case_title,
          sitename,
          site_id,
          reverted_at,
          reviewer,
          reverted_to,
          revert_to_role,
          revert_reason,
          current_status,
          region,
        }: any = item || {}

        return {
          original: item,
          guid: guid,
          view: 'view',
          case_id: case_id || '-',
          case_title: case_title || '-',
          sitename: sitename || '-',
          site_id: site_id || '-',
          region: region || '-',
          reverted_at: reverted_at || '-',
          reviewer: reviewer || '-',
          reverted_to: `${revert_to_role} : ${reverted_to?.replace(/<[^>]*>/g, '')}` || '-',
          revert_reason: revert_reason ? revert_reason?.replace(/<[^>]*>/g, '') : '-',
          current_status: current_status || '-',
        }
      })

      return dataResult
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })

  const dataRevertHistory: any = revertHistoryQuery?.data || []

  const onChangeLimit = (e: any) => {
    setLimit(e)
  }

  const onPageChange = (e: any) => {
    setPage(e)
  }

  const onDetail = () => {
    //
  }

  const columns: any = [
    {header: 'View', width: '20px'},
    {header: 'Case ID', value: 'case_id', sort: true},
    {header: 'Case Title', value: 'case_title', sort: true},
    {header: 'Sitename', value: 'sitename', sort: true},
    {header: 'Site ID', value: 'site_id', sort: true},
    {header: 'Region', value: 'region', sort: true},
    {header: 'Reverted at', value: 'reverted_at', sort: true},
    {header: 'Reviewer', value: 'reviewer', sort: true},
    {header: 'Reverted to', value: 'reverted_to', sort: true},
    {header: 'Revert Reason', value: 'revert_reason', sort: true},
    {header: 'Current Status', value: 'current_status', sort: true},
  ]

  const onExport = () => {
    exportExcelRevertHistory()
      .then(({data: res}: any) => {
        const {data}: any = res || {}
        const {url}: any = data || {}
        window.open(url, '_blank')
        ToastMessage({message: res.message || 'Success : ', type: 'success'})
      })
      .catch((err: any) => {
        ToastMessage({message: err?.response?.data?.message || 'Error : ', type: 'error'})
      })
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.INSURANCE.REVERT'})}</PageTitle>
      <div className='card card-custom card-table'>
        <div className='card-table-header'>
          <div className='row m-0'>
            <div className='col-6'>
              <span className='me-2'>Region :</span>
              <select
                style={{width: '150px', display: 'inline'}}
                className={configClass?.select}
                onChange={({target}: any) => {
                  const {value}: any = target || {}
                  setRegion(value)
                }}
              >
                <option key={''} value={''} selected disabled>
                  Choose Region
                </option>
                {dataRegion?.length > 0 ? (
                  dataRegion?.map((item: any, index: number) => {
                    return (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    )
                  })
                ) : (
                  <option value='' disabled>
                    Empty(s) Region
                  </option>
                )}
              </select>
            </div>
            <div className='col-6 text-end'>
              <Dropdown>
                <Dropdown.Toggle variant='light-primary' size='sm'>
                  Actions
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item
                    href='#'
                    onClick={() => {
                      setShowModalExport(true)
                      setMessage([`Are you sure want to download xlsx file ?`])
                    }}
                  >
                    Export to Excel
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>
          </div>
        </div>
        <div className='card-body'>
          <DataTable
            loading={!revertHistoryQuery?.isFetched}
            limit={limit}
            total={totalPage}
            data={dataRevertHistory}
            columns={columns}
            onDetail={onDetail}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
            onSort={(value: any) => {
              setOrderCol(value)
              setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
            }}
            render={(val: any, original: any) => ({
              reverted_at: val && val !== '-' ? validationViewDate(val, pref_date_time) : '-',
              revert_reason: val ? (
                val?.length > 50 ? (
                  <Tooltip placement='auto' title={val}>
                    <span>{val?.substr(0, 50) + (val?.length > 50 ? '...' : '')}</span>
                  </Tooltip>
                ) : (
                  <span>{val}</span>
                )
              ) : (
                '-'
              ),
              case_id: val ? (
                original && original?.original && original?.original?.insurance_claim_guid ? (
                  <Link
                    to={
                      original?.original?.insurance_claim_guid
                        ? `/insurance-claims/${
                            original?.original?.insurance_claim_guid || ''
                          }/detail`
                        : ''
                    }
                    className='cursor-pointer text-primary text-link text-decoration-underline'
                  >
                    {val || ''}
                  </Link>
                ) : (
                  val
                )
              ) : (
                '-'
              ),
            })}
          />
        </div>
      </div>

      <Alert
        setShowModal={setShowModalExport}
        showModal={showModalExport}
        loading={false}
        body={messageAlert}
        type={'download'}
        title={'Download File Export'}
        confirmLabel={'Download'}
        onConfirm={() => {
          onExport()
          setShowModalExport(false)
        }}
        onCancel={() => {
          setShowModalExport(false)
        }}
      />
    </>
  )
}

export default InsuranceRevertHistory
