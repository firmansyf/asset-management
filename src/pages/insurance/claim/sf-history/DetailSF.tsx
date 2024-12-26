import {DataTable} from '@components/datatable'
import {ToastMessage} from '@components/toast-message'
import {configClass} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import moment from 'moment'
import {FC, memo, useEffect, useMemo, useState} from 'react'
import {Modal} from 'react-bootstrap'

import {getReportSFDetail} from '../Service'

let DetailSF: FC<any> = ({showModal, setShowModal, detail, dateTimeCustom}) => {
  const {guid, date, total_case} = detail || {}

  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [filterStatus, setFilterStatus] = useState<any>()

  const columns: any = useMemo(
    () => [
      {header: 'Case ID', value: 'case_id', sort: true},
      {header: 'Status', value: 'status_sf', sort: true},
      {header: 'No. of Attachment', value: 'no_of_attachment', sort: true},
      {header: 'Error Detail', value: 'error_detail', sort: true},
    ],
    []
  )
  useEffect(() => {
    setPage(1)
    setFilterStatus('')
  }, [showModal])

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  const onPageChange = (e: any) => {
    setPage(e)
  }

  const onFilterStatus = (e: any) => {
    setFilterStatus(e)
  }

  const onRender = (val: any) => ({
    case_id: () => {
      const item: any = val.split('/')
      switch (item[1]?.toLowerCase()) {
        case 'success':
          return (
            <a
              href={item[0] !== null ? `/insurance-claims/${item[0]}/detail` : 'javascript:void(0)'}
              className='cursor-pointer text-primary me-3'
              style={{textDecoration: 'underline', fontWeight: 500}}
            >
              {item[2]}
            </a>
          )
        default:
          return <span>{item[2]}</span>
      }
    },
  })

  const reportSFQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getReportSFDetail', {page, limit, filterStatus, guid}],
    queryFn: async () => {
      if (guid) {
        const res: any = await getReportSFDetail(guid, {page, limit, status: filterStatus})
        const {current_page, per_page, total}: any = res?.data?.meta || {}
        setLimit(per_page)
        setTotalPage(total)
        setPage(current_page)

        const dataResult: any = res?.data?.data?.map((item: any) => {
          const {
            guid,
            case_id,
            status,
            insurance_claim_guid,
            number_attachment,
            error_detail,
          }: any = item || {}

          return {
            guid: guid,
            case_id: insurance_claim_guid + '/' + status + '/' + case_id,
            status_sf: status || '',
            no_of_attachment: number_attachment || '0',
            error_detail,
            original: item,
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

  const dataSF: any = reportSFQuery?.data || []

  return (
    <Modal dialogClassName='modal-lg' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>SF Import History</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='row'>
          <div className='col-6 d-flex'>
            <div style={{width: '130px'}}>
              <div>Date and Time</div>
              <div>Total cases(s)</div>
            </div>
            <div>
              <div>: {moment(date).format(dateTimeCustom) || '-'}</div>
              <div>: {total_case || '-'}</div>
            </div>
          </div>
          <div className='col-6 text-end'>
            <select
              style={{width: '200px', display: 'inline'}}
              className={configClass?.form}
              onChange={({target: {value}}: any) => {
                setPage(1)
                onFilterStatus(value || '')
              }}
            >
              <option value=''>All Data</option>
              <option value='success'>Success Import</option>
              <option value='failed'>Failed Import</option>
            </select>
          </div>
        </div>
        <div className='mt-5'>
          <DataTable
            loading={!reportSFQuery?.isFetched}
            page={page}
            limit={limit}
            total={totalPage}
            data={dataSF}
            columns={columns}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
            render={onRender}
          />
        </div>
      </Modal.Body>
    </Modal>
  )
}

DetailSF = memo(DetailSF, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export {DetailSF}
