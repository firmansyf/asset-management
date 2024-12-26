/* eslint-disable react-hooks/exhaustive-deps */
import {fromColumns, toColumns} from '@components/dnd/table'
import SetupColumnView from '@components/setup-column/setupColumnView'
import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import filter from 'lodash/filter'
import omit from 'lodash/omit'
import {FC, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

import {getSetupColumnRequest, saveSetupColumnRequest} from './core/service'

const RequestSetupColumns: FC<any> = () => {
  const navigate = useNavigate()
  const [columns, setColumns] = useState<any>([])
  const [checkedColumns, setCheckedColumns] = useState<any>([])
  const [loadingReq, setLoadingRequest] = useState<boolean>(false)
  const [selectAll, setSelectAll] = useState<boolean>(true)
  const [columnLength, setColumnLength] = useState<number>(0)
  const [redirect, setRedirect] = useState<boolean>(false)

  const onSaveSetup = () => {
    setLoadingRequest(true)
    const field = fromColumns(columns, checkedColumns)
    const fields = {
      ...field,
      additional_worker: {
        label: 'Additional Worker',
        order_number: 0,
        is_hidden: 1,
        is_filter: 0,
      },
      inventory_name: {
        label: 'Inventory',
        order_number: 0,
        is_hidden: 1,
        is_filter: 0,
      },
    }

    saveSetupColumnRequest({columns: {fields}})
      .then(({data: {message}}: any) => {
        setLoadingRequest(false)
        navigate('/maintenance/request')
        ToastMessage({type: 'success', message})
      })

      .catch((err: any) => {
        setLoadingRequest(false)
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
    getSetupColumnRequest({})
      .then(
        ({
          data: {
            data: {fields},
          },
        }: any) => {
          const fields_data = omit(fields, ['additional_worker', 'inventory_name'])
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
      .catch(() => '')
  }, [])

  useEffect(() => {
    redirect && navigate('/maintenance/request')
  }, [redirect])

  return (
    <>
      <PageTitle breadcrumbs={[]}>Manage Columns</PageTitle>
      <SetupColumnView
        columns={columns}
        loading={loadingReq}
        columnLength={columnLength}
        setRedirect={setRedirect}
        saveSetupColumns={onSaveSetup}
        selectAll={selectAll}
        setSelectAll={setSelectAll}
        checkedColumns={checkedColumns}
        setCheckedColumns={setCheckedColumns}
        module={'maintenance-request'}
      />
    </>
  )
}

export default RequestSetupColumns
