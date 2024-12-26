/* eslint-disable react-hooks/exhaustive-deps */
import {resetSetupColumns} from '@api/Service'
import {orderColumns, TableDND} from '@components/dnd/table'
import {CheckBox} from '@components/form/checkbox'
import {ToastMessage} from '@components/toast-message'
import {getSubdomain} from '@helpers'
import {FC, useState} from 'react'
import {Link} from 'react-router-dom'

type propSetupColumn = {
  columns: any
  loading: boolean
  columnLength: number
  setRedirect?: any
  saveSetupColumns?: any
  selectAll: boolean
  setSelectAll?: any
  checkedColumns: any
  setCheckedColumns?: any
  module: string
}

const SetupColumnView: FC<propSetupColumn> = ({
  columns,
  loading,
  columnLength,
  setRedirect,
  saveSetupColumns,
  selectAll,
  setSelectAll,
  checkedColumns,
  setCheckedColumns,
  module,
}) => {
  const [columnAll, setColumnAll] = useState<any>([])
  const [selectAllAct, setSelectAllAct] = useState<any>(undefined)

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
      module: module,
    }
    resetSetupColumns(params)
      .then(({data: {message}}: any) => {
        setTimeout(() => ToastMessage({type: 'clear'}), 300)
        setTimeout(() => ToastMessage({type: 'success', message}), 400)
        setTimeout(() => setRedirect(true), 2000)
      })
      .catch(() => '')
  }

  return (
    <>
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
                onChange={(e: any) => handleCheckAll(e?.target?.checked)}
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
          <Link to='/asset-management/all' className='btn btn-sm btn-secondary me-2'>
            Cancel
          </Link>
          <Link to='#' className='btn btn-sm btn-primary' onClick={saveSetupColumns}>
            {!loading && <span className='indicator-label'> Save Setup </span>}
            {loading && (
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

export default SetupColumnView
