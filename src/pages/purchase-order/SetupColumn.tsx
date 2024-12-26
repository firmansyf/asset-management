import {resetSetupColumns} from '@api/Service'
import {fromColumns, orderColumns, TableDND, toColumns} from '@components/dnd/table'
import {CheckBox} from '@components/form/checkbox'
import {ToastMessage} from '@components/toast-message'
import {getSubdomain} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import filter from 'lodash/filter'
import omit from 'lodash/omit'
import {FC, useEffect, useState} from 'react'
import {Button} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import {Link, useNavigate} from 'react-router-dom'

import {getColumnsPO, saveColumnPO} from './Services'

const SetupColumn: FC<any> = () => {
  const navigate = useNavigate()
  const [columns, setColumns] = useState<any>([])
  const [checkedColumns, setCheckedColumns] = useState<any>([])
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [columnAll, setColumnAll] = useState<any>([])
  const [selectAll, setSelectAll] = useState<any>(true)
  const [selectAllAct, setSelectAllAct] = useState<any>(undefined)
  const [columnLength, setColumnLength] = useState(0)
  const intl = useIntl()

  const onSaveSetup = () => {
    setLoadingBtn(true)
    const fields = fromColumns(columns, checkedColumns)
    saveColumnPO({columns: {fields}})
      .then(({data: {message}}: any) => {
        setLoadingBtn(false)
        navigate('/purchase-order')
        ToastMessage({type: 'success', message})
      })

      .catch((err: any) => {
        const {data}: any = err?.response?.data || {}
        if (data?.fields !== undefined) {
          const error: any = data?.fields || {}
          Object.keys(error || {})?.forEach((key: any) => {
            const value: any = error?.[key] || []
            ToastMessage({type: 'error', message: value?.[0] || ''})
          })
        } else {
          ToastMessage({type: 'error', message: err?.response?.data?.message})
        }
        setLoadingBtn(false)
      })
  }

  useEffect(() => {
    getColumnsPO()
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
              ?.sort((a: any, b: any) => (a?.label > b?.label ? 1 : -1))
              ?.map((item: any) => item)
          )
          setCheckedColumns(toColumns(fields_data, {checked: true, order: true}))
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
      .catch(() => '')
  }, [])

  const handleCheckAll = (checked_val: any) => {
    const new_arr_option = columns?.map((item: any) => {
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
      module: 'purchase-order',
    }
    resetSetupColumns(params)
      .then(({data: {message}}: any) => {
        navigate('/purchase-order')
        ToastMessage({type: 'success', message})
      })
      .catch((err: any) => {
        const {data} = err?.response?.data || {}
        const {fields} = data || {}
        if (fields !== undefined) {
          const error = fields || {}
          Object.keys(error || {})?.forEach((key: any) => {
            const value: any = error?.[key] || []
            ToastMessage({type: 'success', message: value?.[0] || ''})
          })
        } else {
          ToastMessage({type: 'error', message: err?.response?.data?.message})
        }
      })
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>Manage Columns</PageTitle>
      <div className='card card-custom'>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>
              {intl.formatMessage({id: 'SETUP_COLUMN.SELECT_TABLE_COLUMNS'})}
            </span>
            <span className='fs-7'>
              {intl.formatMessage({id: 'SETUP_COLUMN.SELECT_FIELDS_TO_SHOW_TABLE_COLUMNS'})}
            </span>
          </h3>
          <p>
            {intl.formatMessage({id: 'SETUP_COLUMN.NO_COLUMNS_SELECTED'})}:{' '}
            <strong>{checkedColumns?.length}</strong>
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
                onChange={(e: any) => handleCheckAll(e?.target?.checked)}
              />
              <label htmlFor='ckechboxAll' className='ms-2 user-select-none cursor-pointer'>
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
            <span className='card-label fw-bolder fs-3 mb-1'>
              {intl.formatMessage({id: 'SETUP_COLUMN.ORDER_TABLE_COLUMNS'})}
            </span>
            <span className='fs-7'>
              {intl.formatMessage({id: 'SETUP_COLUMN.DRAG_AND_DROP_COLUMNS_ORDER'})}
            </span>
          </h3>
        </div>
        <div className='card-body'>
          <TableDND columns={checkedColumns} result={(e: any) => setCheckedColumns(e)} />
        </div>
      </div>

      <div className='card card-custom'>
        <div className='card-footer text-end'>
          <Link to='/purchase-order' className='btn btn-sm btn-secondary me-2'>
            Cancel
          </Link>
          <Button disabled={loadingBtn} className='btn-sm' variant='primary' onClick={onSaveSetup}>
            {!loadingBtn && <span className='indicator-label'>Save Setup</span>}
            {loadingBtn && (
              <span className='indicator-progress' style={{display: 'block'}}>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </Button>
        </div>
      </div>
    </>
  )
}

export default SetupColumn
