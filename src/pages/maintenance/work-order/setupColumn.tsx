/* eslint-disable react-hooks/exhaustive-deps */
import {fromColumns, toColumns} from '@components/dnd/table'
import SetupColumnView from '@components/setup-column/setupColumnView'
import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import filter from 'lodash/filter'
import {FC, memo, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {useNavigate} from 'react-router-dom'

import {getWorkOrderColumn, updateWorkOrderColumn} from '../Service'

let WorkOrderColumns: FC<any> = () => {
  const intl = useIntl()
  const navigate = useNavigate()
  const [columns, setColumns] = useState<any>([])
  const [checkedColumns, setCheckedColumns] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selectAll, setSelectAll] = useState<any>(true)
  const [columnLength, setColumnLength] = useState<number>(0)
  const [redirect, setRedirect] = useState<boolean>(false)

  useEffect(() => {
    getWorkOrderColumn()
      .then(
        ({
          data: {
            data: {fields},
          },
        }: any) => {
          let fieldsColumn = fields?.fields
          if (!fields?.fields) {
            fieldsColumn = fields
          }
          const fileds_columns: any = toColumns(fieldsColumn, {order: 'label'})
          setColumns(fileds_columns)
          setCheckedColumns(toColumns(fieldsColumn, {checked: true, order: true}))
          setColumnLength(fileds_columns?.length)

          const total_selected = filter(fileds_columns, (column: any) => column?.checked === true)
          if (fileds_columns?.length !== total_selected?.length) {
            setSelectAll(false)
          }
        }
      )
      .catch(() => '')
  }, [])
  const saveColumns = () => {
    setLoading(true)
    const fields = fromColumns(columns, checkedColumns)
    updateWorkOrderColumn({columns: {fields}})
      .then(({data: {message}}: any) => {
        navigate('/maintenance/work-order')
        ToastMessage({type: 'success', message})
      })
      .catch((err: any) => {
        setLoading(false)
        const {data} = err?.response?.data || {}
        if (data?.fields !== undefined) {
          const error = data?.fields
          for (const key in error) {
            const value = error?.[key]
            ToastMessage({type: 'error', message: value[0]})
          }
        } else {
          ToastMessage({type: 'error', message: err?.response?.data?.message})
        }
      })
  }

  useEffect(() => {
    redirect && navigate('/maintenance/work-order')
  }, [redirect])

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.MAINTENANCE.WORKORDER.COLUMNS'})}
      </PageTitle>
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
        module={'maintenance'}
      />
    </>
  )
}

WorkOrderColumns = memo(
  WorkOrderColumns,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default WorkOrderColumns
