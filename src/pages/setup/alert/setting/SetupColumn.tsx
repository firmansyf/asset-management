/* eslint-disable react-hooks/exhaustive-deps */
import {fromColumns, toColumns} from '@components/dnd/table'
import SetupColumnView from '@components/setup-column/setupColumnView'
import {ToastMessage} from '@components/toast-message'
import {FieldMessageError} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {filter, orderBy} from 'lodash'
import {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {useNavigate} from 'react-router-dom'

import {getAlertSettingColumn, updateAlertSettingColumn} from './Service'

const AlertSettingColumns: FC<any> = () => {
  const intl: any = useIntl()
  const navigate: any = useNavigate()

  const [columns, setColumns] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [selectAll, setSelectAll] = useState<boolean>(true)
  const [columnLength, setColumnLength] = useState<number>(0)
  const [checkedColumns, setCheckedColumns] = useState<any>(
    columns?.filter(({checked}: any) => checked)
  )
  const [redirect, setRedirect] = useState<boolean>(false)

  useEffect(() => {
    getAlertSettingColumn()
      .then(
        ({
          data: {
            data: {fields},
          },
        }: any) => {
          const fileds_columns: any = toColumns(fields, {})
          setColumns(orderBy(fileds_columns, 'label', 'asc'))
          setCheckedColumns(toColumns(fields, {checked: true, order: true}))
          setColumnLength(fileds_columns?.length)

          const total_selected: any = filter(fileds_columns, ({checked}: any) => checked === true)
          if (fileds_columns?.length !== total_selected?.length) {
            setSelectAll(false)
          }
        }
      )
      .catch(() => '')
  }, [])

  const saveColumns = () => {
    setLoading(true)
    const fields: any = fromColumns(columns, checkedColumns)
    updateAlertSettingColumn({columns: {fields}})
      .then(({data: {message}}: any) => {
        setTimeout(() => ToastMessage({type: 'clear'}), 300)
        setTimeout(() => ToastMessage({type: 'success', message}), 400)
        setTimeout(() => setRedirect(true), 2000)
      })
      .catch((e: any) => {
        setLoading(false)
        FieldMessageError(e, [])
      })
  }

  useEffect(() => {
    redirect && navigate('/setup/alert/setting')
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
        module={'alert-setting'}
      />
    </>
  )
}

export default AlertSettingColumns
