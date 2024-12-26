/* eslint-disable react-hooks/exhaustive-deps */
import {fromColumns, toColumns} from '@components/dnd/table'
import SetupColumnView from '@components/setup-column/setupColumnView'
import {ToastMessage} from '@components/toast-message'
import {FieldMessageError} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import filter from 'lodash/filter'
import map from 'lodash/map'
import {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {useNavigate} from 'react-router-dom'

import {getSupplierColumn, updateSupplierColumn} from './Service'

const SupplierColumns: FC<any> = () => {
  const intl: any = useIntl()
  const navigate: any = useNavigate()

  const [columns, setColumns] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selectAll, setSelectAll] = useState<boolean>(true)
  const [columnLength, setColumnLength] = useState<number>(0)
  const [checkedColumns, setCheckedColumns] = useState<any>(columns?.filter((f: any) => f?.checked))
  const [redirect, setRedirect] = useState<boolean>(false)

  const renameObject = (object: object) => {
    const fileds_to_columns = map(object, (col: any) => {
      switch (col?.value) {
        case 'address':
          return {
            value: col?.value,
            is_filter: col?.is_filter,
            label: 'Address 1',
            order_number: col?.order_number,
            checked: col?.checked,
          }
        case 'street':
          return {
            value: col?.value,
            is_filter: col?.is_filter,
            label: 'Address 2',
            order_number: col?.order_number,
            checked: col?.checked,
          }
        default:
          return col
      }
    })
    return fileds_to_columns
  }

  useEffect(() => {
    getSupplierColumn()
      .then(
        ({
          data: {
            data: {fields},
          },
        }: any) => {
          const removeField: any = 'extended_address'
          const {[removeField]: _remove, ...fields_data}: any = fields

          const fileds_columns: any = toColumns(fields_data, {order: 'label', dir: 'asc'})
          setColumns(renameObject(fileds_columns))

          const fileds_columns_checked: any = toColumns(fields_data, {checked: true, order: true})
          setCheckedColumns(renameObject(fileds_columns_checked))
          setColumnLength(renameObject(fileds_columns)?.length)

          const total_selected = filter(
            renameObject(fileds_columns),
            (column: any) => column?.checked === true
          )
          if (renameObject(fileds_columns)?.length !== total_selected?.length) {
            setSelectAll(false)
          }
        }
      )
      .catch(() => '')
  }, [])

  const saveColumns = () => {
    setLoading(true)
    const fields = fromColumns(columns, checkedColumns)
    updateSupplierColumn({columns: {fields}})
      .then(({data: {message}}: any) => {
        navigate('/setup/settings/supplier')
        ToastMessage({type: 'success', message})
      })
      .catch((err: any) => {
        setLoading(false)
        FieldMessageError(err, [])
      })
  }

  useEffect(() => {
    redirect && navigate('/setup/settings/supplier')
  }, [redirect])

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.LOCATION.COLUMNS'})}</PageTitle>
      <SetupColumnView
        columns={columns}
        loading={loading}
        columnLength={columnLength}
        setRedirect={setRedirect}
        saveSetupColumns={saveColumns}
        selectAll={selectAll}
        setSelectAll={setSelectAll}
        checkedColumns={checkedColumns}
        setCheckedColumns={setCheckedColumns}
        module={'supplier'}
      />
    </>
  )
}

export default SupplierColumns
