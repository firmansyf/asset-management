import {resetSetupColumns} from '@api/Service'
import {fromColumns, orderColumns, TableDND, toColumns} from '@components/dnd/table'
import {CheckBox} from '@components/form/checkbox'
import {ToastMessage} from '@components/toast-message'
import {getSubdomain} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import filter from 'lodash/filter'
import {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {Link, useNavigate} from 'react-router-dom'

import {getSetupColumn, updateSetupColumn} from './redux/WarrantyCRUD'

const WarrantyColumns: FC<any> = () => {
  const intl = useIntl()
  const navigate = useNavigate()
  const [columns, setColumns] = useState<any>([])
  const [checkedColumns, setCheckedColumns] = useState<any>([])
  const [loadingWarranty, setLoadingWarranty] = useState<boolean>(false)
  const [columnAll, setColumnAll] = useState<any>([])
  const [selectAll, setSelectAll] = useState<any>(true)
  const [selectAllAct, setSelectAllAct] = useState<any>(undefined)
  const [columnLength, setColumnLength] = useState<number>(0)

  const successMessage = (message: any) => {
    setTimeout(() => ToastMessage({type: 'clear'}), 300)
    setTimeout(() => ToastMessage({message, type: 'success'}), 400)
  }

  const onSaveSetup = () => {
    setLoadingWarranty(true)
    const fields: any = fromColumns(columns, checkedColumns)
    updateSetupColumn({columns: {fields}})
      .then(({data: {message}}: any) => {
        setLoadingWarranty(false)
        successMessage(message)
        navigate('/warranty')
      })
      .catch((err: any) => {
        setLoadingWarranty(false)
        const {data}: any = err?.response?.data
        if (data.fields !== undefined) {
          const error: any = data.fields
          for (const key in error) {
            const value: any = error[key]
            ToastMessage({type: 'error', message: value?.[0]})
          }
        } else {
          ToastMessage({type: 'error', message: err?.response?.data?.message})
        }
      })
  }

  useEffect(() => {
    getSetupColumn({})
      .then(
        ({
          data: {
            data: {fields},
          },
        }: any) => {
          const fileds_columns: any = toColumns(fields, {})
          setColumns(
            fileds_columns
              .sort((a: any, b: any) => (a?.label > b?.label ? 1 : -1))
              .map((item: any) => item)
          )
          setCheckedColumns(toColumns(fields, {checked: true, order: true}))
          setColumnLength(fileds_columns?.length)

          const total_selected: any = filter(
            fileds_columns,
            (column: any) => column.checked === true
          )
          if (fileds_columns?.length !== total_selected?.length) {
            setSelectAll(false)
          }
        }
      )
      .catch(() => '')
  }, [])

  const handleCheckAll = (checked_val: any) => {
    const new_arr_option: any = columns?.map((item: any) => {
      if (checked_val) {
        return {...item, checked: true}
      } else {
        return {...item, checked: false}
      }
    })
    if (checked_val) {
      setCheckedColumns(new_arr_option)
    } else {
      setCheckedColumns([])
    }
    setSelectAllAct(true)
    setColumnAll(new_arr_option)
    setSelectAll(!selectAll)
  }

  const resetColumns = () => {
    const params: any = {
      fqdn: getSubdomain(),
      module: 'warranty',
    }
    resetSetupColumns(params)
      .then(({data: {message}}: any) => {
        successMessage(message)
        navigate('/warranty')
      })
      .catch((err: any) => {
        const {data}: any = err?.response?.data || {}
        const {fields}: any = data || {}
        if (fields !== undefined) {
          const error: any = fields || {}
          for (const key in error) {
            const value: any = error[key]
            ToastMessage({type: 'error', message: value?.[0]})
          }
        } else {
          ToastMessage({type: 'error', message: err?.response?.data?.message})
        }
      })
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.WARRANTY.COLUMNS'})}</PageTitle>
      <div className='card card-custom'>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Select Table Columns</span>
            <span className='fs-7'>Select the fields you want to show in the table columns.</span>
          </h3>
          <p>
            No. of Column(s) Selected: <strong>{checkedColumns?.length}</strong>
          </p>
        </div>
        <div className='card-body'>
          <div className='row form-check form-check-sm form-check-custom form-check-solid border-bottom mb-2 pb-2'>
            <div className='col-md-6 ms-n3'>
              <input
                className='form-check-input border border-gray-300'
                type='checkbox'
                name='checkall'
                value='false'
                id='ckechboxAll'
                checked={selectAll}
                onChange={(e: any) => handleCheckAll(e.target.checked)}
              />
              <label htmlFor='ckechboxAll' className='ms-2 user-select-none'>
                <strong> Select/Unselect All </strong>
              </label>
            </div>
            <div className='col-md-6 text-end px-0'>
              <Link to='#' className='btn btn-sm btn-light-primary' onClick={resetColumns}>
                Reset to Default
              </Link>
            </div>
          </div>
          <CheckBox
            name='column'
            col='3'
            options={columns}
            checkAll={selectAllAct}
            optionsAll={columnAll}
            setColumns={setColumnAll}
            onChange={(e: any) => {
              setCheckedColumns(orderColumns(e, checkedColumns))
              if (columnLength === e?.length) {
                setSelectAll(true)
              } else {
                setSelectAll(false)
              }
            }}
          />
        </div>
      </div>
      <div className='card card-custom'>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Order Table Columns</span>
            <span className='fs-7'>Drag and drop the columns to rearrange the columns order.</span>
          </h3>
        </div>
        <div className='card-body'>
          <TableDND columns={checkedColumns} result={(e: any) => setCheckedColumns(e)} />
        </div>
      </div>
      <div className='card card-custom'>
        <div className='card-footer text-end'>
          <Link to='/warranty' className='btn btn-sm btn-secondary me-2'>
            Cancel
          </Link>
          <Link to='#' className='btn btn-sm btn-primary' onClick={onSaveSetup}>
            {!loadingWarranty && <span className='indicator-label'> Save Setup </span>}
            {loadingWarranty && (
              <span className='indicator-progress' style={{display: 'block'}}>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </Link>
        </div>
      </div>
    </>
  )
}

export default WarrantyColumns
