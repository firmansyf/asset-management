import {DataTable} from '@components/datatable'
import {FilterRadio} from '@components/filter/FilterAll'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {KTSVG, preferenceDateTime} from '@helpers'
import {getReportSAPDetail, getStatusSAP} from '@pages/insurance/claim/Service'
import {useQuery} from '@tanstack/react-query'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import {Link} from 'react-router-dom'

const parseJSON = (json: any) => {
  try {
    return JSON.parse(json)
  } catch (error) {
    return false
  }
}

let DetailSAP: FC<any> = ({detail, showModal, setShowModal}) => {
  const intl: any = useIntl()
  const {guid}: any = detail || {}
  const pref_date_time: any = preferenceDateTime()

  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [filterAll, setFilterAll] = useState<any>({})
  const [totalPage, setTotalPage] = useState<number>(0)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('ro_number')

  const columns: any = [
    {header: 'Date', value: 'date', sort: false},
    {header: 'RO Number', value: 'ro_number', sort: true},
    {header: 'Case ID', value: 'case_id', sort: true},
    {header: 'GR', value: 'gr', sort: false},
    {header: 'Invoice', value: 'invoice', sort: false},
    {header: 'Result', value: 'result', sort: false},
  ]

  const onChangeLimit = (e: any) => {
    setLimit(e || 10)
  }

  const onPageChange = (e: any) => {
    setPage(e || 1)
  }

  const onSearch = (e: any) => {
    setKeyword(e ? `*${e?.trim()}*` : '')
    setPage(1)
  }

  const onSort = (value: any) => {
    setOrderCol(value || '')
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onClose = () => {
    setKeyword('')
    setShowModal(false)
    setFilterAll(undefined)
  }

  const onRender = (val: any, {original}: any) => ({
    case_id: () => {
      if (original?.case_id !== '-' && original?.case_id !== '') {
        return (
          <Link
            to={original?.case_guid ? `/insurance-claims/${original?.case_guid || ''}/detail` : ''}
            className='cursor-pointer text-primary text-link me-3'
            style={{textDecoration: 'underline', fontWeight: 500}}
          >
            {original?.case_id || ''}
          </Link>
        )
      } else {
        return <p>{original?.case_id || '-'}</p>
      }
    },
    gr: () => {
      return (
        <div style={{textAlign: 'center'}}>
          {val === 1 ? (
            <i className='fas fa-check' style={{fontSize: '27px', color: '#4bb818'}}></i>
          ) : (
            <i className='fas fa-times' style={{fontSize: '27px', color: '#e02121'}}></i>
          )}
        </div>
      )
    },
    invoice: () => {
      return (
        <div style={{textAlign: 'center'}}>
          {val === 1 ? (
            <i className='fas fa-check' style={{fontSize: '27px', color: '#4bb818'}}></i>
          ) : (
            <i className='fas fa-times' style={{fontSize: '27px', color: '#e02121'}}></i>
          )}
        </div>
      )
    },
    result: () => {
      let dataVal: any = []

      if (
        val &&
        val !== '-' &&
        parseJSON(val) &&
        parseJSON(val) !== 'N/A' &&
        parseJSON(val) !== '' &&
        parseJSON(val) !== '-'
      ) {
        dataVal = JSON.parse(val || '"-"')
      } else {
        if (val && val !== '-' && val?.length > 0) {
          dataVal = val
        } else {
          dataVal = []
        }
      }

      return (
        <p className='text-left'>
          {Array.isArray(dataVal) && dataVal?.length > 0 ? (
            dataVal?.map(({key, value}: any, index: number) => (
              <p key={index || 0} className='text-left'>
                {key || ''} : {value || ''}
              </p>
            ))
          ) : (
            <p className='text-left'>
              {dataVal?.key || ''} : {dataVal?.value || ''}
            </p>
          )}
        </p>
      )
    },
  })

  const reportSAPQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getReportSAPDetail',
      {
        page,
        limit,
        guid,
        keyword,
        orderCol,
        orderDir,
        showModal,
        pref_date_time,
        ...(filterAll?.parent || []),
      },
    ],
    queryFn: async () => {
      if (showModal && guid) {
        const filterParams: any = {}
        const res: any = filterAll?.parent?.map(({value}: any) => value)?.join(';')
        if (res !== '') {
          filterParams[`filter[ro_number_status]`] = res || ''
        }

        const params: any = {
          page,
          limit,
          keyword,
          orderCol,
          orderDir,
          ...filterParams,
        }
        const api: any = await getReportSAPDetail(guid, params)
        const {total, current_page, per_page}: any = api?.data?.meta || {}
        setLimit(per_page)
        setPage(current_page)
        setTotalPage(total || api?.length || 0)

        const dataResult: any = api?.data?.data?.map((item: any) => {
          const {
            guid,
            ro_number,
            case_guid,
            case_id,
            ro_gr_status,
            ro_incoice_status,
            result,
            date,
          }: any = item || {}

          return {
            guid,
            original: item,
            date: moment(date || '')?.format(pref_date_time),
            ro_number: ro_number || '-',
            case_id: case_id !== '' ? case_guid + '/' + case_id : '-',
            gr: ro_gr_status ? 1 : 0,
            invoice: ro_incoice_status ? 1 : 0,
            result: result || '-',
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

  const dataSAP: any = reportSAPQuery?.data || []

  const statusSAPQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getstatusSAPDetail', {showModal}],
    queryFn: async () => {
      if (showModal) {
        const api: any = await getStatusSAP()

        const dataResult: any = api?.data?.data?.map((item: any) => {
          return {
            header: item?.label || '',
            sort: true,
            value: item?.value || '',
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

  const filterColumns: any = statusSAPQuery?.data || []

  useEffect(() => {
    setPage(1)
    setLimit(10)
    setKeyword('')
    setTotalPage(0)
    setFilterAll({})
    setOrderDir('asc')
    setOrderCol('ro_number')
  }, [showModal])

  return (
    <Modal dialogClassName='modal-lg' show={showModal} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>{intl.formatMessage({id: 'MENU.INSURANCE.SAP'})}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='card-table-header'>
          <div className='d-flex flex-wrap flex-stack'>
            <div className='d-flex align-items-center position-relative me-4 my-1'>
              <KTSVG
                path='/media/icons/duotone/General/Search.svg'
                className='svg-icon-3 position-absolute ms-3'
              />
              <Search bg='solid' onChange={onSearch} />
              <FilterRadio
                filterAll={filterAll}
                onChange={(e: any) => {
                  setPage(1)
                  setFilterAll(e)
                }}
                columns={filterColumns}
                name={'ro_number_status'}
                setFilterAll={setFilterAll}
              />
            </div>
          </div>
        </div>

        <div className='card-body'>
          <DataTable
            page={page}
            limit={limit}
            data={dataSAP}
            onSort={onSort}
            columns={columns}
            render={onRender}
            total={totalPage}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
            loading={!reportSAPQuery?.isFetched}
          />
        </div>
      </Modal.Body>
    </Modal>
  )
}

DetailSAP = memo(DetailSAP, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default DetailSAP
