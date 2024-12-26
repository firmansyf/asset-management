import {DataTable} from '@components/datatable'
import {matchColumns} from '@components/dnd/table'
import {getStockDetail} from '@pages/inventory/redux/InventoryCRUD'
import {FC, useEffect, useMemo, useState} from 'react'

const StockDetail: FC<any> = ({reload, detail}) => {
  const [data, setData] = useState<any>([])
  const [page, setPage] = useState<any>(1)
  const [limit, setLimit] = useState<any>(10)
  const [totalPage, setTotalPage] = useState<any>(0)
  const [orderCol, setOrderCol] = useState<any>('unique_id')
  const [orderDir, setOrderDir] = useState<any>('asc')
  const [isLoading, setIsLoading] = useState<any>(true)

  const columns = useMemo(
    () => [
      {header: 'Barcode', value: 'barcode', sort: true},
      {header: 'Serial Number', value: 'serial_number', sort: true},
      {header: 'Unique ID', value: 'unique_id', sort: true},
      {header: 'Location', value: 'location_name', sort: true},
    ],
    []
  )

  useEffect(() => {
    if (detail?.guid) {
      setIsLoading(true)
      getStockDetail({page, limit, orderCol, orderDir}, detail?.guid)
        .then(({data: {data: res, meta}}: any) => {
          const {current_page, per_page, total} = meta || {}
          setTotalPage(total)
          setPage(current_page)
          setLimit(per_page)
          if (res) {
            setData(matchColumns(res, columns))
            setIsLoading(false)
          }
        })
        .catch(() => {
          setIsLoading(false)
        })
    }
  }, [page, limit, orderCol, orderDir, columns, detail?.guid, reload])

  return (
    <div className='row mx-0 mt-5'>
      <div className='col-12'>
        <DataTable
          limit={limit}
          total={totalPage}
          data={data}
          columns={columns}
          onChangePage={(e: any) => setPage(e)}
          onChangeLimit={(e: any) => {
            setPage(1)
            setLimit(e)
          }}
          onSort={(value: any) => {
            setOrderCol(value)
            setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
          }}
          loading={isLoading}
          customEmptyTable='No Stock Detail Added'
        />
      </div>
    </div>
  )
}

export {StockDetail}
