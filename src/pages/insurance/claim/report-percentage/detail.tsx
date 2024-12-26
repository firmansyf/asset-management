import {DataTable} from '@components/datatable'
import {ToastMessage} from '@components/toast-message'
import {preferenceDateTime} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import moment from 'moment'
import {FC, memo, useState} from 'react'
import {Modal} from 'react-bootstrap'
import {Link} from 'react-router-dom'

import {getDetailReportPercentage} from '../Service'

let Detail: FC<any> = ({showModal, setShowModal, detail}) => {
  const pref_date_time: any = preferenceDateTime()

  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [totalPage, setTotalPage] = useState<number>(0)

  const columns = [
    {header: 'View', width: '20px'},
    {header: 'Case ID', value: 'case_id', sort: true},
    {header: 'Case Title', value: 'case_title', sort: true},
    {header: 'Sitename', value: 'sitename', sort: true},
    {header: 'Approved At', value: 'approved_at', sort: true},
  ]

  const detailReportPercentageQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: ['getDetailReportPercentage', {detail, page, limit, pref_date_time}],
    queryFn: async () => {
      if (Object.keys(detail || {})?.length > 0) {
        const params: any = {
          region: detail?.data?.name || '',
          month: detail?.month || '',
          year: detail?.year || '',
        }
        const res: any = await getDetailReportPercentage(params)
        const {current_page, per_page, total}: any = res?.data?.meta || {}
        setTotalPage(total)
        setPage(current_page)
        setLimit(per_page)

        const dataResult: any = res?.data?.data?.map((item: any) => {
          const {guid, case_id, case_title, sitename, approved_at, location}: any = item || {}
          return {
            original: item,
            guid,
            view: 'view',
            case_id,
            case_title,
            sitename: sitename || location?.guid || '-',
            approved_at: moment(approved_at || '')?.format(pref_date_time),
          }
        })

        return dataResult as never[]
      } else {
        return []
      }
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const data: any = detailReportPercentageQuery?.data || []

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  const onPageChange = (e: any) => {
    setPage(e)
  }

  const onDetail = (e: any) => {
    const {guid}: any = e || {}
    return `/insurance-claims/${guid || ''}/detail`
  }

  return (
    <Modal dialogClassName='modal-lg' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>{`${
          detail?.data?.name !== undefined
            ? detail?.data?.name
            : detail?.label !== undefined
            ? detail?.label
            : ''
        } - ${detail?.month || ''} ${detail?.year || ''}`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='mt-5'>
          <DataTable
            loading={!detailReportPercentageQuery?.isFetched}
            limit={limit}
            total={totalPage}
            data={data}
            columns={columns}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
            onDetail={onDetail}
            hrefDetail={true}
            render={(val: any, {original}: any) => ({
              case_id: () => {
                const item: any = val?.split('/')
                return (
                  <Link
                    to={
                      item?.[0] !== null ? `/insurance-claims/${original?.guid || ''}/detail` : ''
                    }
                    className='cursor-pointer text-primary text-link text-decoration-underline fw-bolder'
                    style={{textDecoration: 'underline', fontWeight: 500}}
                  >
                    {original?.case_id || ''}
                  </Link>
                )
              },
            })}
          />
        </div>
      </Modal.Body>
    </Modal>
  )
}

Detail = memo(Detail, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default Detail
