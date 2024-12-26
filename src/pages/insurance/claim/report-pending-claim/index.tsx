import {Alert} from '@components/alert'
import {DataTable} from '@components/datatable'
import {ToastMessage} from '@components/toast-message'
import {configClass} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {useQuery} from '@tanstack/react-query'
import {FC, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {useIntl} from 'react-intl'
import {useNavigate} from 'react-router-dom'

import {exportReportPendingClaim, getOptionYear, getReportPendingClaim} from '../Service'

const InsuranceReportPendingClaim: FC = () => {
  const intl: any = useIntl()
  const navigate: any = useNavigate()

  const [year, setYear] = useState<any>()
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [messageAlert, setMessage] = useState<any>()
  const [totalPage, setTotalPage] = useState<number>(0)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('pic_name')
  const [showModalExport, setShowModalExport] = useState<boolean>(false)

  const columns: any = [
    {header: 'Name', value: 'pic_name', sort: true, width: '280px'},
    {header: 'Role', value: 'pic_role', sort: true},
    {header: 'January', value: 'january', sort: false},
    {header: 'February', value: 'february', sort: false},
    {header: 'March', value: 'march', sort: false},
    {header: 'April', value: 'april', sort: false},
    {header: 'May', value: 'may', sort: false},
    {header: 'June', value: 'june', sort: false},
    {header: 'July', value: 'july', sort: false},
    {header: 'August', value: 'august', sort: false},
    {header: 'September', value: 'september', sort: false},
    {header: 'October', value: 'october', sort: false},
    {header: 'November', value: 'november', sort: false},
    {header: 'December', value: 'december', sort: false},
  ]

  const onExport = (year: any) => {
    exportReportPendingClaim(year || optionYear?.[0]?.value)
      .then(({data: res}) => {
        const {data, message} = res || {}
        const {url} = data || {}
        window.open(url, '_blank')
        ToastMessage({message, type: 'success'})
      })
      .catch(({response}: any) => {
        const {message} = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }

  const onChangeLimit = (e: any) => {
    setLimit(e)
  }

  const onPageChange = (e: any) => {
    setPage(e)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const dataYearQuery: any = useQuery({
    // initialData: {data: []},
    refetchOnMount: false,
    staleTime: Infinity,
    queryKey: ['getOptionYear'],
    queryFn: async () => {
      const res: any = await getOptionYear()
      const dataResult: any = res?.data
        ?.sort((a: any, b: any) => (a < b ? 1 : -1))
        ?.filter((f: any) => f)
        ?.map((m: any) => ({value: m, label: m}))

      return dataResult
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const optionYear: any = dataYearQuery?.data || []

  const reportPendingClaimQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getReportPendingClaim', {page, limit, year, optionYear, orderDir, orderCol}],
    queryFn: async () => {
      const selectedYear: any = year || optionYear?.[0]?.value
      if (selectedYear) {
        const res: any = await getReportPendingClaim({
          page,
          limit,
          year: selectedYear,
          orderDir,
          orderCol,
        })
        const {current_page, per_page, total}: any = res?.data?.meta || {}
        setPage(current_page)
        setTotalPage(total)
        setLimit(per_page)

        const dataResult: any = res?.data?.data?.map((item: any) => {
          const {pic_name, pic_role, pending} = item || {}
          const {
            January,
            February,
            March,
            April,
            May,
            June,
            July,
            August,
            September,
            October,
            November,
            December,
          } = pending || {}

          return {
            original: item,
            pic_name: pic_name || '',
            pic_role: pic_role || '',
            january: January || '0',
            february: February || '0',
            march: March || '0',
            april: April || '0',
            may: May || '0',
            june: June || '0',
            july: July || '0',
            august: August || '0',
            september: September || '0',
            october: October || '0',
            november: November || '0',
            december: December || '0',
          }
        })

        return dataResult
      } else {
        return []
      }
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const reportPendingClaim: any = reportPendingClaimQuery?.data || []

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.INSURANCE.REPORT_PENDING_CLAIM'})}
      </PageTitle>

      <div className='card card-custom card-table'>
        <div className='card-table-header'>
          <div className='row m-0'>
            <div className='col-6'>
              <span className='me-2'>Year :</span>
              <select
                style={{width: '120px', display: 'inline'}}
                className={configClass?.select}
                onChange={({target: {value}}: any) => setYear(value || '')}
              >
                {optionYear && optionYear?.length > 0 ? (
                  optionYear?.map(({value, label}: any) => (
                    <option key={value || 0} value={value || ''}>
                      {label || '-'}
                    </option>
                  ))
                ) : (
                  <option value='' disabled>
                    Empty(s) Year
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

              <Alert
                loading={false}
                type={'download'}
                body={messageAlert}
                confirmLabel={'Download'}
                showModal={showModalExport}
                title={'Download File Export'}
                setShowModal={setShowModalExport}
                onCancel={() => setShowModalExport(false)}
                onConfirm={() => {
                  setShowModalExport(false)
                  onExport(year || optionYear?.[0]?.value)
                }}
              />
            </div>
          </div>
        </div>

        <div className='card-body'>
          <DataTable
            hoverRow
            page={page}
            limit={limit}
            onSort={onSort}
            total={totalPage}
            columns={columns}
            data={reportPendingClaim}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
            loading={!reportPendingClaimQuery?.isFetched || !optionYear?.length}
            render={(val: any) => ({
              pic_name: () => {
                return (
                  <span
                    onClick={() =>
                      navigate(
                        `/insurance-claims/all?filter[pic_name]=${val}&filter[incident_year]=${
                          year || optionYear?.[0]?.value
                        }`
                      )
                    }
                    className='cursor-pointer text-primary me-3'
                    style={{fontWeight: '500'}}
                  >
                    {val}
                  </span>
                )
              },
            })}
          />
        </div>
      </div>
    </>
  )
}

export default InsuranceReportPendingClaim
