/* eslint-disable react-hooks/exhaustive-deps */
import {fromColumns, toColumns} from '@components/dnd/table'
import SetupColumnView from '@components/setup-column/setupColumnView'
import {ToastMessage} from '@components/toast-message'
import {useTimeOutMessage} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import filter from 'lodash/filter'
import {FC, memo, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {useNavigate} from 'react-router-dom'

import {getSetupColumnMeter, saveSetupColumnMeter} from '../Service'

let SetupColumnMeter: FC<any> = () => {
  const intl = useIntl()
  const navigate = useNavigate()
  const [columns, setColumns] = useState([])
  const [checkedColumns, setCheckedColumns] = useState<any>(columns?.filter((f: any) => f?.checked))
  const [loading, setLoading] = useState(false)
  const [selectAll, setSelectAll] = useState<any>(true)
  const [columnLength, setColumnLength] = useState(0)
  const [redirect, setRedirect] = useState<boolean>(false)

  useEffect(() => {
    getSetupColumnMeter({}).then(
      ({
        data: {
          data: {fields},
        },
      }: any) => {
        const removeField = 'created_at'
        const {[removeField]: _remove, ...fields_data} = fields

        const fileds_columns: any = toColumns(fields_data, {})
        setColumns(
          fileds_columns
            .sort((a: any, b: any) => (a?.label > b?.label ? 1 : -1))
            .map((item: any) => item)
        )
        setCheckedColumns(toColumns(fields_data, {checked: true, order: true}))
        setColumnLength(fileds_columns?.length)

        const total_selected = filter(fileds_columns, (column: any) => column?.checked === true)
        if (fileds_columns?.length !== total_selected?.length) {
          setSelectAll(false)
        }
      }
    )
  }, [])

  const saveColumns = () => {
    setLoading(true)
    const fields = fromColumns(columns, checkedColumns)
    saveSetupColumnMeter({columns: {fields}})
      .then(({data: {message}}: any) => {
        useTimeOutMessage('clear', 200)
        useTimeOutMessage('success', 250, message)
        setTimeout(() => setRedirect(true), 2000)
      })
      .catch((err: any) => {
        setLoading(false)
        const {data} = err?.response?.data
        if (data?.fields !== undefined) {
          const error = data?.fields
          for (const key in error) {
            const value = error?.[key]
            ToastMessage({type: 'error', message: value?.[0]})
          }
        } else {
          ToastMessage({type: 'error', message: err?.response?.data?.message})
        }
      })
  }

  useEffect(() => {
    redirect && navigate('/maintenance/meter')
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
        module={'maintenance-meter'}
      />
    </>
  )
}

SetupColumnMeter = memo(
  SetupColumnMeter,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default SetupColumnMeter
