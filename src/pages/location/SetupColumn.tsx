import {getLocationColumn, resetSetupColumns, updateLocationColumn} from '@api/Service'
import {fromColumns, orderColumns, TableDND, toColumns} from '@components/dnd/table'
import {CheckBox} from '@components/form/checkbox'
import {ToastMessage} from '@components/toast-message'
import {FieldMessageError, getSubdomain} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import filter from 'lodash/filter'
import {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {Link, useNavigate} from 'react-router-dom'

const LocationsColumns: FC<any> = () => {
  const intl: any = useIntl()
  const navigate: any = useNavigate()

  const [columns, setColumns] = useState<any>([])
  const [columnAll, setColumnAll] = useState<any>([])
  const [selectAll, setSelectAll] = useState<any>(true)
  const [loading, setLoading] = useState<boolean>(false)
  const [columnLength, setColumnLength] = useState<number>(0)
  const [selectAllAct, setSelectAllAct] = useState<any>(undefined)
  const [checkedColumns, setCheckedColumns] = useState<any>(
    columns?.filter(({checked}: any) => checked)
  )

  useEffect(() => {
    getLocationColumn().then(
      ({
        data: {
          data: {fields},
        },
      }: any) => {
        const fileds_columns: any = toColumns(fields, {order: 'label', dir: 'asc'})
        setColumns(
          fileds_columns
            ?.sort((a: any, b: any) => (a?.label > b?.label ? 1 : -1))
            ?.map((item: any) => item)
        )
        setCheckedColumns(toColumns(fields, {checked: true, order: true}))
        setColumnLength(fileds_columns?.length)

        const total_selected: any = filter(fileds_columns, ({checked}: any) => checked === true)
        if (fileds_columns?.length !== total_selected?.length) {
          setSelectAll(false)
        }
      }
    )
  }, [])

  const saveColumns = () => {
    setLoading(true)
    const field: any = fromColumns(columns, checkedColumns)
    const fields: any = {
      ...field,
      guid: {
        label: 'guid',
        order_number: 0,
        is_hidden: 1,
      },
    }

    updateLocationColumn({columns: {fields}})
      .then(({data: {message}}: any) => {
        navigate('/location/location')
        ToastMessage({type: 'success', message})
      })
      .catch((e: any) => {
        setLoading(false)
        FieldMessageError(e, [])
      })
  }

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
    setSelectAll(!selectAll)
    setColumnAll(new_arr_option)
  }

  const resetColumns = () => {
    const params: any = {
      fqdn: getSubdomain(),
      module: 'location',
    }

    resetSetupColumns(params)
      .then(({data: {message}}: any) => {
        navigate('/location/location')
        ToastMessage({type: 'success', message})
      })
      .catch((e: any) => FieldMessageError(e, []))
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.LOCATION.COLUMNS'})}</PageTitle>
      <div className='card card-custom'>
        <div className='card-header border-0 pt-5'>
          <h3 className='card-title align-items-start flex-column'>
            <span className='card-label fw-bolder fs-3 mb-1'>Select Table Columns</span>
            <span className='fs-7'>Select the fields you want to show in the table columns.</span>
          </h3>

          <p>
            No. of Column(s) Selected: <strong>{checkedColumns?.length || 0}</strong>
          </p>
        </div>

        <div className='card-body'>
          <div className='row form-check form-check-sm form-check-custom form-check-solid border-bottom mb-2 pb-2'>
            <div className='col-md-6 ms-n3'>
              <input
                value='false'
                type='checkbox'
                name='checkall'
                id='ckechboxAll'
                checked={selectAll}
                className='form-check-input border border-gray-300'
                onChange={({target: {checked}}: any) => handleCheckAll(checked)}
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
            col='3'
            name='column'
            options={columns}
            optionsAll={columnAll}
            checkAll={selectAllAct}
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
          <Link to='/location/location' className='btn btn-sm btn-secondary me-2'>
            Cancel
          </Link>

          <Link to='#' className='btn btn-sm btn-primary' onClick={saveColumns}>
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

export default LocationsColumns
