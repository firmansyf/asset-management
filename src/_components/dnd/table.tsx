import {keyBy, pick} from 'lodash'
import difference from 'lodash/difference'
import differenceBy from 'lodash/differenceBy'
import intersectionBy from 'lodash/intersectionBy'
import mapValues from 'lodash/mapValues'
import orderBy from 'lodash/orderBy'
import {FC, useEffect, useState} from 'react'

import {reorder} from './dnd'
import {Sortable} from './sortable'

export const toColumns = (obj: any, params?: any) => {
  let convertToColumns = Object.entries(obj || {})?.map((m: any, index: number) => ({
    value: m?.[0],
    label: m?.[1]?.label?.toLowerCase() === 'assigned asset' ? 'Assigned User' : m?.[1]?.label,
    is_filter: m?.[1]?.is_filter,
    is_sortable: m?.[1]?.is_sortable !== undefined ? m?.[1]?.is_sortable : 1,
    order_number: params?.order ? m?.[1]?.order_number || index + 1 : index + 1,
    checked: !m?.[1]?.is_hidden,
  }))
  convertToColumns = convertToColumns?.filter(({value}: any) => value !== 'guid')
  if (params?.order && params?.order !== true) {
    convertToColumns = orderBy(
      convertToColumns,
      [(data: any) => data[params.order].toLowerCase()],
      params?.dir || 'asc'
    )
  } else if (params?.order && params?.order === true) {
    convertToColumns = orderBy(convertToColumns, 'order_number', 'asc')
  }
  if (params?.checked) {
    convertToColumns = convertToColumns?.filter((f: any) => f.checked)
  }
  return convertToColumns
}

export const orderColumns = (e: any, checkedColumns: any) => {
  let dataColumnsChecked = differenceBy(e, checkedColumns, 'value')
  if (dataColumnsChecked?.length) {
    dataColumnsChecked = [...checkedColumns, ...dataColumnsChecked].map((d: any, index: number) => {
      d.order_number = index + 1
      return d
    })
  } else {
    dataColumnsChecked = intersectionBy(checkedColumns, e, 'value').map((d: any, index: number) => {
      d.order_number = index + 1
      return d
    })
  }
  return dataColumnsChecked
}

export const fromColumns = (columns: any, checkedColumns: any) => {
  const mergeColumns = columns?.map((m: any) => {
    const checked = checkedColumns?.find((f: any) => f?.value === m?.value)
    m.checked = !!checked
    m.order_number = checked ? checked?.order_number : 0
    return m
  })

  const payload = mapValues(keyBy(mergeColumns, 'value'), (m: any) => ({
    label: m?.label?.replace(/\+/g, ''),
    order_number: m?.order_number || 0,
    is_hidden: m?.checked ? 0 : 1,
  }))

  return payload
}

export const matchColumns = (data: any, columns: any) => {
  const result = data.map((m: any) => {
    const hasNotKeys = difference(
      columns?.map((col: any) => col?.value || col?.header),
      Object.keys(m || {})
    )?.filter((f: any) => f)
    hasNotKeys?.length && hasNotKeys?.map((col: any) => (m[col] = '-'))
    const picked = pick(m, columns?.map((col: any) => col?.value || col.header)?.concat(['guid']))
    picked.original = m
    return picked
  })
  return result
}

export const TableDND: FC<any> = ({columns: cols = [], result = () => '', inModal = false}) => {
  const [columns, setColumns] = useState([])
  useEffect(() => {
    setColumns(cols)
  }, [cols])
  const onSortend = (_arr: any, source: any, destination: any) => {
    const sortResult = {
      source: {
        index: source,
      },
      destination: {
        index: destination,
      },
    }
    onDragEnd(sortResult)
  }
  const onDragEnd = (e: any) => {
    const {source, destination} = e
    if (!destination) {
      return
    }
    let items: any = reorder(columns, source.index, destination.index)
    items = items.map((m: any, index: any) => {
      m.order_number = index + 1
      return m
    })
    setColumns(items)
    result(items)
  }
  return (
    <div className='table-responsive pb-3'>
      {columns?.length > 0 ? (
        <Sortable onSort={onSortend} className='row m-0 flex-nowrap' axis='x'>
          {columns.map(({label}: any, index: any) => (
            <div
              className='col-auto cursor-pointer border border-dashed border-primary p-0 m-1'
              style={{zIndex: inModal ? 999999 : 9}}
              key={index}
            >
              <div className='bg-light fw-bolder p-2 border-bottom border-bottom-dashed border-primary'>
                {label}
              </div>
              <div className='bg-white fw-normal p-2'> Sample </div>
            </div>
          ))}
        </Sortable>
      ) : (
        <div className='d-flex align-items-center justify-content-center border border-dashed border-primary h-50px'>
          <small className='text-primary fw-normal d-block pt-0'>
            Select columns to rearrange the columns order
          </small>
        </div>
      )}
    </div>
  )
}
