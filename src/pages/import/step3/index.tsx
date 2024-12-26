import {DataTable} from '@components/datatable'
import isEqual from 'lodash/isEqual'
import uniqWith from 'lodash/uniqWith'
import {FC, useEffect, useState} from 'react'

import {OptionStep3} from './options'

const Step3: FC<any> = ({
  type,
  columns,
  data,
  limit,
  totalPage,
  onPageChange,
  onChangeLimit,
  fistRowHeader,
  fileHeader,
  // setLoading,
  loading,
}) => {
  const [dataColumns, setDataColumns] = useState<any>([])
  const [dataPreview, setDataPreview] = useState<any>([])

  useEffect(() => {
    const keys: any = []
    const col: any = columns?.map(({label, key}: any) => {
      keys.push(key)
      return {
        header: label || '',
        width: '100px',
      }
    })
    setDataColumns(col as never[])

    if (!fistRowHeader) {
      const index: number = 0
      data?.splice(index, 0, fileHeader)
    }

    const res: any = data?.map((e: any) => {
      const item: any = {}
      keys?.forEach((key: any) => {
        item[key] = e?.[key] || ''
      })
      return item
    })
    setDataPreview(uniqWith(res, isEqual) as never[])
  }, [columns, data, fileHeader, fistRowHeader])

  return (
    <>
      <div className='mb-8' style={{minHeight: '300px'}}>
        <DataTable
          loading={loading}
          limit={limit}
          total={totalPage}
          data={data || dataPreview}
          columns={dataColumns}
          onChangePage={onPageChange}
          onChangeLimit={onChangeLimit}
        />
      </div>
      {type !== 'insurance' && <OptionStep3 type={type} />}
    </>
  )
}

export {Step3}
