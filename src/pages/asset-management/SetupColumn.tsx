/* eslint-disable react-hooks/exhaustive-deps */
import {fromColumns, toColumns} from '@components/dnd/table'
import SetupColumnView from '@components/setup-column/setupColumnView'
import {useTimeOutMessage} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {getAssetColumn, updateAssetColumn} from '@pages/asset-management/redux/AssetRedux'
import filter from 'lodash/filter'
import {FC, memo, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {useNavigate} from 'react-router-dom'

let AssetColumns: FC<any> = () => {
  const intl: any = useIntl()
  const navigate: any = useNavigate()

  const [columns, setColumns] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [redirect, setRedirect] = useState<boolean>(false)
  const [selectAll, setSelectAll] = useState<boolean>(true)
  const [columnLength, setColumnLength] = useState<number>(0)
  const [checkedColumns, setCheckedColumns] = useState<any>([])

  useEffect(() => {
    useTimeOutMessage('clear', 2000)
  }, [])

  useEffect(() => {
    getAssetColumn()
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
          const custom_el: any = fileds_columns?.map(
            ({checked, is_filter, label, order_number, value}: any) => {
              return {
                checked,
                is_filter,
                order_number,
                value,
                label,
                custom_label: <span className={`text-dark fw-bold'}`}>{label}</span>,
              }
            }
          )

          setColumns(
            custom_el
              ?.sort((a: any, b: any) => (a?.label > b?.label ? 1 : -1))
              ?.map((item: any) => item)
          )
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

  const successMessage = (message: any) => {
    useTimeOutMessage('clear', 200)
    useTimeOutMessage('success', 250, message)
    setTimeout(() => setRedirect(true), 2000)
  }

  const saveColumns = () => {
    setLoading(true)
    const fields = fromColumns(columns, checkedColumns)
    updateAssetColumn({columns: {fields}})
      .then(({data: {message}}: any) => {
        successMessage(message)
      })
      .catch((err: any) => {
        setLoading(false)
        const {data, message}: any = err?.response?.data || {}
        const error: any = data?.fields

        if (data?.fields !== undefined) {
          for (const key in error) {
            const value: any = error?.[key] || ''
            useTimeOutMessage('error', 0, value?.[0] || '')
          }
        } else {
          useTimeOutMessage('error', 0, message)
        }
      })
  }

  useEffect(() => {
    redirect && navigate('/asset-management/all')
  }, [redirect])

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.ASSET_MANAGEMENT.COLUMNS'})}
      </PageTitle>

      <SetupColumnView
        columns={columns}
        loading={loading}
        selectAll={selectAll}
        setRedirect={setRedirect}
        module={'asset-management'}
        setSelectAll={setSelectAll}
        columnLength={columnLength}
        saveSetupColumns={saveColumns}
        checkedColumns={checkedColumns}
        setCheckedColumns={setCheckedColumns}
      />
    </>
  )
}

AssetColumns = memo(AssetColumns)
export default AssetColumns
