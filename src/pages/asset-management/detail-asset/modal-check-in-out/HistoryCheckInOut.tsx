import {DataTable} from '@components/datatable'
import {matchColumns} from '@components/dnd/table'
import {preferenceDate, preferenceTime} from '@helpers'
import {getHistoryCheckInOut} from '@pages/asset-management/redux/CheckInOutRedux'
import moment from 'moment'
import {FC, memo, useEffect, useMemo, useState} from 'react'
import {Modal} from 'react-bootstrap'

let HistoryCheckInOut: FC<any> = ({data, showModal, setShowModal}) => {
  const pref_date = preferenceDate()
  const pref_time = preferenceTime()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPage, setTotalPage] = useState(0)
  const [dataHistory, setDataHistory] = useState<any>([])
  const [orderCol, setOrderCol] = useState('datetime')
  const [orderDir, setOrderDir] = useState('asc')
  const columns: any = useMemo(
    () => [
      {header: 'Date and Time', value: 'datetime', sort: true},
      {header: 'Action', value: 'action'},
      {header: 'Action by', value: 'action_by'},
      {header: 'Details', value: 'detail'},
    ],
    []
  )
  useEffect(() => {
    if (showModal && data.guid) {
      getHistoryCheckInOut(data.guid, {page, limit, orderCol, orderDir}).then(
        ({data: {data, meta}}: any) => {
          setTotalPage(meta.total)
          setPage(meta.current_page)
          setLimit(meta.per_page)
          const resData: any = data.map((m: any) => {
            m.due_date && (m.due_date = moment(m.due_date).format(pref_date))
            m.return_date && (m.return_date = moment(m.return_date).format(pref_date))
            return m
          })
          setDataHistory(matchColumns(resData, columns))
        }
      )
    }
  }, [data.guid, page, limit, showModal, columns, orderCol, orderDir, pref_date])
  return (
    <Modal dialogClassName='modal-lg' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header>
        <Modal.Title>Check Out/ In History</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DataTable
          loading={false}
          limit={limit}
          total={totalPage}
          data={dataHistory}
          columns={columns}
          onChangePage={setPage}
          onChangeLimit={setLimit}
          onSort={(value: any) => {
            setOrderCol(value)
            setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
          }}
          render={(val: any, {original}: any) => {
            return {
              action: (
                <span
                  className={`badge badge-light-${
                    val.toLowerCase() === 'check-out' ? 'danger' : 'success'
                  }`}
                >
                  {val}
                </span>
              ),
              action_by: <strong className='text-capitalize'>{val}</strong>,
              datetime: val ? (
                <div className='fw-bold d-flex align-items-center'>
                  <p className='my-0 me-1 badge badge-light-primary rounded-pill'>
                    <i className='las la-calendar text-primary' /> {moment(val).format(pref_date)}{' '}
                  </p>
                  <p className='my-0 ms-1 badge badge-light rounded-pill'>
                    <i className='las la-clock text-dark' /> {moment(val).format(pref_time)}{' '}
                  </p>
                </div>
              ) : (
                '-'
              ),
              detail: (
                <div className=''>
                  <p className='m-0'>
                    <strong>Type : </strong>
                    {original?.type}
                  </p>
                  {original?.from ? (
                    <p className='m-0'>
                      <strong>From : </strong>
                      {original?.from || '-'}
                    </p>
                  ) : (
                    <p className='m-0'>
                      <strong>To : </strong>
                      {original?.to || '-'}
                    </p>
                  )}
                  <p className='m-0'>
                    {original?.due_date ? (
                      <>
                        <strong data-cy='dueDateCheckinOutHistory'>Due Date : </strong>
                        {original?.due_date || '-'}
                      </>
                    ) : (
                      <>
                        <strong data-cy='dueDateCheckinOutHistory'>Return Date : </strong>
                        {original?.return_date || '-'}
                      </>
                    )}
                  </p>
                </div>
              ),
            }
          }}
        />
      </Modal.Body>
      <Modal.Footer>
        <div className='btn btn-sm btn-light' onClick={() => setShowModal(false)}>
          {' '}
          Close{' '}
        </div>
      </Modal.Footer>
    </Modal>
  )
}

HistoryCheckInOut = memo(
  HistoryCheckInOut,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default HistoryCheckInOut
