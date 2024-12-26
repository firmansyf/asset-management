import {DataTable} from '@components/datatable'
import {Search} from '@components/form/searchAlert'
import {KTSVG, preferenceDateTime} from '@helpers'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap'
import {useIntl} from 'react-intl'

import {getInsuranceSAPLog} from '../Service'

const parseJSON = (json: any) => {
  try {
    return JSON.parse(json)
  } catch (error) {
    return false
  }
}

let ModalSAPLog: FC<any> = ({id, showModal, setShowModal}) => {
  const intl: any = useIntl()
  const pref_date_time: any = preferenceDateTime()

  const [page, setPage] = useState<number>(1)
  const [dataSAP, setData] = useState<any>([])
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [totalPage, setTotalPage] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')

  const columns: any = [
    {header: 'Date', value: 'date', sort: true},
    {header: 'RO Number', value: 'ro_number', sort: true},
    {header: 'Result', value: 'result', sort: true},
  ]

  const onChangeLimit = (e: any) => {
    setLimit(e || 10)
  }

  const onPageChange = (e: any) => {
    setPage(e || 1)
  }

  const onSearch = (e: any) => {
    setKeyword(e ? `*${e}*` : '')
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onRender = (val: any) => ({
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
        dataVal = JSON.parse(val)
      } else {
        if (val && val !== '-' && val?.length > 0) {
          dataVal = val
        } else {
          dataVal = []
        }
      }

      return (
        <p className='text-left'>
          {dataVal && dataVal?.length > 0
            ? dataVal?.map(({key, value}: any, index: number) => (
                <p key={index} className='text-left'>
                  {key} : {value}
                </p>
              ))
            : '-'}
        </p>
      )
    },
  })

  useEffect(() => {
    if (showModal && id) {
      setLoading(true)
      getInsuranceSAPLog(id, {page, limit, keyword, orderCol, orderDir})
        .then(({data: {data: res, meta}}: any) => {
          const {total, current_page, per_page}: any = meta || {}
          setLimit(per_page)
          setPage(current_page)
          setTotalPage(total || res?.length)

          if (res) {
            const data = res?.map((item: any) => {
              const {date, ro_number, result}: any = item || {}
              return {
                original: item,
                date: moment(date || '')?.format(pref_date_time),
                ro_number: ro_number || '-',
                result: result || '-',
              }
            })
            setData(data as never[])
            setLoading(false)
          }
        })
        .catch(() => setLoading(false))
    }
  }, [page, limit, id, keyword, orderCol, orderDir, showModal, pref_date_time])

  return (
    <Modal dialogClassName='modal-lg' show={showModal} onHide={() => setShowModal(false)}>
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
            </div>
          </div>
        </div>

        <div className='card-body'>
          <DataTable
            limit={limit}
            data={dataSAP}
            onSort={onSort}
            render={onRender}
            loading={loading}
            total={totalPage}
            columns={columns}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
          />
        </div>
      </Modal.Body>
    </Modal>
  )
}

ModalSAPLog = memo(
  ModalSAPLog,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ModalSAPLog
