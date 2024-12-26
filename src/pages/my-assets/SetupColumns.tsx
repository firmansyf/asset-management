/* eslint-disable react-hooks/exhaustive-deps */
import {fromColumns, toColumns} from '@components/dnd/table'
import SetupColumnView from '@components/setup-column/setupColumnView'
import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import filter from 'lodash/filter'
import {FC, memo, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {useNavigate} from 'react-router-dom'

import {getColumnsMyAsset, saveColumnsMyAsset} from './Service'

let MyAssetColumns: FC<any> = () => {
  const intl: any = useIntl()
  const navigate: any = useNavigate()

  const [columns, setColumns] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [redirect, setRedirect] = useState<boolean>(false)
  const [selectAll, setSelectAll] = useState<boolean>(true)
  const [columnLength, setColumnLength] = useState<number>(0)
  const [checkedColumns, setCheckedColumns] = useState<any>([])

  useEffect(() => {
    getColumnsMyAsset().then(
      ({
        data: {
          data: {fields},
        },
      }: any) => {
        let fieldsColumn: any = fields?.fields || {}
        if (!fields?.fields) {
          fieldsColumn = fields || {}
        }

        const fileds_columns: any = toColumns(fieldsColumn, {order: 'label'})
        setColumns(
          fileds_columns
            ?.sort((a: any, b: any) => (a?.label > b?.label ? 1 : -1))
            ?.map((item: any) => item)
        )
        setCheckedColumns(toColumns(fieldsColumn, {checked: true, order: true}))
        setColumnLength(fileds_columns?.length)

        const total_selected: any = filter(
          fileds_columns,
          (column: any) => column?.checked === true
        )

        if (fileds_columns?.length !== total_selected?.length) {
          setSelectAll(false)
        }
      }
    )
  }, [])

  const successMessage = (message: any) => {
    setTimeout(() => ToastMessage({type: 'clear'}), 300)
    setTimeout(() => ToastMessage({type: 'success', message}), 400)
    setTimeout(() => setRedirect(true), 2000)
  }

  const saveColumns = () => {
    setLoading(true)
    const fields: any = fromColumns(columns, checkedColumns)

    saveColumnsMyAsset({columns: {fields}})
      .then(({data: {message}}: any) => successMessage(message))
      .catch(({response}: any) => {
        setLoading(false)
        const {data, message}: any = response?.data || {}
        const {fields}: any = data || {}
        const error: any = fields || {}

        if (fields !== undefined) {
          for (const key in error) {
            const value: any = error?.[key]
            ToastMessage({type: 'error', message: value?.[0] || ''})
          }
        } else {
          ToastMessage({type: 'error', message})
        }
      })
  }

  useEffect(() => {
    redirect && navigate('/my-assets')
  }, [redirect])

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.ASSET_MANAGEMENT.COLUMNS'})}
      </PageTitle>

      <SetupColumnView
        columns={columns}
        loading={loading}
        module={'my-asset'}
        selectAll={selectAll}
        setRedirect={setRedirect}
        setSelectAll={setSelectAll}
        columnLength={columnLength}
        saveSetupColumns={saveColumns}
        checkedColumns={checkedColumns}
        setCheckedColumns={setCheckedColumns}
      />
    </>
  )
}

MyAssetColumns = memo(
  MyAssetColumns,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default MyAssetColumns
