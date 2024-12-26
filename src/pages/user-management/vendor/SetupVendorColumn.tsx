import {resetSetupColumns} from '@api/Service'
import {fromColumns, orderColumns, TableDND, toColumns} from '@components/dnd/table'
import {CheckBox} from '@components/form/checkbox'
import {ToastMessage} from '@components/toast-message'
import {getSubdomain} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import filter from 'lodash/filter'
import {FC, useEffect, useState} from 'react'
import {Button} from 'react-bootstrap'
import {useIntl} from 'react-intl'
import {Link, useNavigate} from 'react-router-dom'

import {getSetupColumn, updateSetupColumn} from './redux/VendorCRUD'

const VendorColumns: FC<any> = () => {
  const intl = useIntl()
  const navigate = useNavigate()
  const [columns, setColumns] = useState<any>([])
  const [checkedColumns, setCheckedColumns] = useState<any>([])
  const [loadingVendor, setLoadingVendor] = useState<boolean>(false)
  const [columnAll, setColumnAll] = useState<any>([])
  const [selectAll, setSelectAll] = useState<any>(true)
  const [selectAllAct, setSelectAllAct] = useState<any>(undefined)
  const [columnLength, setColumnLength] = useState<number>(0)

  const onSaveSetup = () => {
    setLoadingVendor(true)
    const fields = fromColumns(columns, checkedColumns)
    updateSetupColumn({columns: {fields}})
      .then(({data: {message}}: any) => {
        setLoadingVendor(false)
        navigate('/user-management/vendor')
        ToastMessage({type: 'success', message})
      })
      .catch((err: any) => {
        setLoadingVendor(false)
        const {data} = err?.response?.data
        if (data.fields !== undefined) {
          const error = data.fields
          for (const key in error) {
            const value = error[key]
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
          let fieldsColumn = fields?.fields
          if (!fields?.fields) {
            fieldsColumn = fields
          }
          const fileds_columns: any = toColumns(fieldsColumn, {order: 'label'})
          setColumns(fileds_columns)
          setCheckedColumns(toColumns(fieldsColumn, {checked: true, order: true}))
          setColumnLength(fileds_columns?.length)

          const total_selected = filter(fileds_columns, (column: any) => column.checked === true)
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
      module: 'vendor',
    }
    resetSetupColumns(params)
      .then(({data: {message}}: any) => {
        navigate('/user-management/vendor')
        ToastMessage({type: 'success', message})
      })
      .catch((err: any) => {
        const {data} = err?.response?.data || {}
        const {fields} = data || {}
        if (fields !== undefined) {
          const error = fields || {}
          for (const key in error) {
            const value = error[key]
            ToastMessage({type: 'error', message: value?.[0]})
          }
        } else {
          ToastMessage({type: 'error', message: err?.response?.data?.message})
        }
      })
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.VENDOR.COLUMNS'})}</PageTitle>
      <div className='card card-custom'>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Select Table Columns</span>
            <span className='fs-7'>Select the fields you want to show in the table columns.</span>
          </h3>
          <p>
            No. of Column(s) Selected: <strong>{checkedColumns.length}</strong>
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
            col='4'
            options={columns}
            checkAll={selectAllAct}
            optionsAll={columnAll}
            setColumns={setColumnAll}
            onChange={(e: any) => {
              setCheckedColumns(orderColumns(e, checkedColumns))
              if (columnLength === e.length) {
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
          <Link to='/user-management/vendor' className='btn btn-sm btn-secondary me-2'>
            Cancel
          </Link>
          <Button
            disabled={loadingVendor}
            className='btn-sm'
            variant='primary'
            onClick={onSaveSetup}
          >
            {!loadingVendor && <span className='indicator-label'>Save Setup</span>}
            {loadingVendor && (
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

export default VendorColumns
