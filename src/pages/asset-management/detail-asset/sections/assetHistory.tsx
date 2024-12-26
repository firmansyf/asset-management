import {DataTable} from '@components/datatable'
import {configClass, preferenceDate} from '@helpers'
import {
  getAssetDetailHistory,
  getAssetHistoryOption,
} from '@pages/asset-management/redux/AssetRedux'
import {mapValues} from 'lodash'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap'

const ModalDetail: FC<any> = ({showModal, setShowModal, title, detail}: any) => {
  const [data, setData] = useState<any>([])

  useEffect(() => {
    let result: any = [{name: null, initial_value: null, new_value: null}]
    if (!Array.isArray(detail?.changed_fields) && typeof detail?.changed_fields === 'object') {
      if (detail?.changed_fields?.info_values?.initial_value?.global_custom_fields) {
        const {
          changed_fields: {info_values},
        }: any = detail || {}
        const {initial_value, new_value}: any = info_values || {}
        result = mapValues(initial_value?.global_custom_fields, (initial_value: any, key: any) => {
          return {
            name: key?.toString()?.split('_')?.join(' '),
            initial_value,
            new_value: new_value?.global_custom_fields?.[key] || '',
          }
        })
      } else if (!detail?.changed_fields?.info_attrs) {
        result = mapValues(detail?.changed_fields, ({initial_value, new_value}: any, key: any) => {
          return {
            name: key?.toString()?.split('_')?.join(' '),
            initial_value,
            new_value,
          }
        })
      }
      result = Object.values(result || {})
    }

    result = result?.map(({name, initial_value, new_value}: any) => {
      if (typeof initial_value === 'object' && initial_value !== null) {
        initial_value = Object.values(initial_value || {})?.join('')
      }
      if (typeof new_value === 'object' && new_value !== null) {
        new_value = Object.values(new_value || {})?.join('')
      }

      return {name, initial_value, new_value}
    })
    setData(result)
  }, [detail])

  return (
    <Modal dialogClassName='modal-lg' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header>
        <Modal.Title>{title || ''}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='row'>
          <div className='col-md-12'>
            <div className='table-responsive' style={{maxHeight: '60vh'}}>
              <table className='table table-sm table-striped gx-3'>
                <thead>
                  <tr>
                    <th className='fw-bolder'>Field Name</th>
                    <th className='fw-bolder'>Changed From</th>
                    <th className='fw-bolder'>Changed To</th>
                  </tr>
                </thead>
                <tbody>
                  {data &&
                    data?.length > 0 &&
                    data?.map((m: any, index: any) => (
                      <tr key={index || 0}>
                        <td className='text-capitalize'>{m?.name || '-'}</td>
                        <td className='fw-bold'>{m?.new_value || '-'}</td>
                        <td className='fw-bold'>{m?.initial_value || '-'}</td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className='btn btn-sm btn-light' onClick={() => setShowModal(false)}>
          Cancel
        </div>
      </Modal.Footer>
    </Modal>
  )
}

let AssetHistory: FC<any> = ({data}) => {
  const orderCol: any = 'date'
  const orderDir: any = 'desc'
  const pref_date: any = preferenceDate()

  const [page, setPage] = useState<number>(1)
  const [detail, setDetail] = useState<any>({})
  const [limit, setLimit] = useState<number>(10)
  const [dataDetail, setData] = useState<any>([])
  const [totalPage, setTotalPage] = useState<number>(0)
  const [eventName, setEventName] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false)
  const [options, setOptions] = useState<any>([])

  let columns: any = [
    {header: 'Date', value: 'date', sort: false},
    {header: 'Event', value: 'event', sort: false},
  ]

  if (eventName === 'Asset Edit') {
    columns = [...columns, {header: 'View'}]
  }

  const onDetail = (e: any) => {
    setDetail(e)
    setShowModalDetail(true)
  }

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  const onRender = (val: any) => {
    return {
      date: (
        <div className='fs-8 fw-bold'>
          <i className='las la-clock me-1' />
          {val?.toString()?.split(' ')?.[0] || ''}
          <span className='text-gray-500 ms-2'> {val?.toString()?.split(' ')?.[1] || ''}</span>
        </div>
      ),
      event: <div className='fs-8 fw-bolder text-primary'>{val || ''}</div>,
    }
  }

  useEffect(() => {
    const {guid} = data || {}
    if (guid) {
      setLoading(true)
      getAssetDetailHistory(guid, {
        page,
        orderDir,
        orderCol,
        limit,
        filter: {event: eventName || ''},
      })
        .then(({data: {data: res, meta}}: any) => {
          const {current_page, per_page, total}: any = meta || {}
          setLimit(per_page)
          setTotalPage(total)
          setPage(current_page)

          const mapped: any =
            res && res?.length > 0
              ? res?.map((m: any) => {
                  const filled: any = {}

                  filled.original = m
                  filled.date = moment(m?.date || '')?.format(pref_date) || '-'
                  filled.event = m?.event || ''

                  if (['Asset Edit']?.includes(eventName)) {
                    filled.view = 'view'
                  }

                  return filled
                })
              : []
          setData(mapped as never[])
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [data, page, limit, eventName, pref_date])

  useEffect(() => {
    getAssetHistoryOption({orderCol: 'Asset%20Linking', orderDir: 'asc'})
      .then(({data: {data: response}}: any) => {
        const option_data = response?.map((res: any) => {
          return {
            value: res,
            label: res,
          }
        })
        setOptions(option_data)
      })
      .catch(() => '')
  }, [])

  return (
    <div className='card card-custom mt-5'>
      <div className='card-body p-5'>
        <select
          className={`${configClass?.select} border border-secondary w-auto`}
          name='event'
          data-cy='select-event-history'
          onInput={({target: {value}}: any) => {
            setLoading(false)
            setEventName(value || '')
          }}
        >
          <option value=''>All Event</option>
          {Array.isArray(options) &&
            options?.length > 0 &&
            options?.map(({value, label}: any, index: any) => (
              <option key={index || 0} value={value || ''}>
                {label || '-'}
              </option>
            ))}
        </select>

        <div className='separator mt-5' />

        <DataTable
          limit={limit}
          loading={loading}
          total={totalPage}
          data={dataDetail}
          columns={columns}
          render={onRender}
          onDetail={onDetail}
          onChangeLimit={onChangeLimit}
          onChangePage={(e: any) => setPage(e)}
        />
      </div>
      <ModalDetail
        detail={detail}
        showModal={showModalDetail}
        title={eventName || 'Detail'}
        setShowModal={setShowModalDetail}
      />
    </div>
  )
}

AssetHistory = memo(
  AssetHistory,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default AssetHistory
