/* eslint-disable react-hooks/exhaustive-deps */
import {getCompanyColumn, updateCompanyColumn} from '@api/Service'
import {fromColumns, toColumns} from '@components/dnd/table'
import SetupColumnView from '@components/setup-column/setupColumnView'
import {ToastMessage} from '@components/toast-message'
import {FieldMessageError} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import filter from 'lodash/filter'
import {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {useNavigate} from 'react-router-dom'

const CompanyColumns: FC<any> = () => {
  const intl = useIntl()
  const navigate = useNavigate()
  const [columns, setColumns] = useState<any>([])
  const [checkedColumns, setCheckedColumns] = useState<any>(columns?.filter((f: any) => f.checked))
  const [loading, setLoading] = useState(false)
  const [selectAll, setSelectAll] = useState<any>(true)
  const [columnLength, setColumnLength] = useState(0)
  const [redirect, setRedirect] = useState<boolean>(false)

  useEffect(() => {
    getCompanyColumn()
      .then(
        ({
          data: {
            data: {fields},
          },
        }: any) => {
          const fileds_columns: any = toColumns(fields, {order: 'label', dir: 'asc'})
          setColumns(fileds_columns)
          setCheckedColumns(toColumns(fields, {checked: true, order: true}))
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
    updateCompanyColumn({columns: {fields}})
      .then(({data: {message}}: any) => {
        navigate('/setup/settings/companies')
        ToastMessage({type: 'success', message})
      })
      .catch((err: any) => {
        setLoading(false)
        FieldMessageError(err, [])
      })
  }

  useEffect(() => {
    redirect && navigate('/setup/settings/companies')
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
        module={'company'}
      />
    </>
  )
}

export default CompanyColumns
