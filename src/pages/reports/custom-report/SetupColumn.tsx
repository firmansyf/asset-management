import {orderColumns, TableDND} from '@components/dnd/table'
import {CheckBox} from '@components/form/checkbox'
import {ToastMessage} from '@components/toast-message'
import {filter, orderBy} from 'lodash'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

import {initSetupColumns as initColumns} from './constant'

let CustomReportColumns: FC<any> = ({columns, showModal, setShowModal, onSaveColumns}) => {
  const [column, setColumns] = useState(initColumns)
  const [checkedColumns, setCheckedColumns] = useState<any>(
    initColumns.filter((f: any) => f?.checked)
  )
  const [columnAll, setColumnAll] = useState<any>([])
  const [selectAll, setSelectAll] = useState<any>(true)
  const [selectAllAct, setSelectAllAct] = useState<any>(undefined)
  const [columnLength, setColumnLength] = useState(0)

  useEffect(() => {
    const fileds_columns: any = initColumns?.map((m: any) => {
      m.checked = columns?.includes(m?.value)
      return m
    })
    setColumns(orderBy(fileds_columns, 'label', 'asc'))
    if (showModal) {
      const cols: any = []
      columns.forEach((map: any) => {
        if (initColumns.find((f: any) => f?.value === map) !== undefined) {
          cols.push(initColumns.find((f: any) => f?.value === map))
        }
      })
      setCheckedColumns(cols)
      // setCheckedColumns(columns?.map((m: any) => initColumns.find((f: any) => f?.value === m)))
      setColumnLength(fileds_columns?.length)

      const total_selected: any = filter(fileds_columns, (column: any) => column?.checked === true)
      if (fileds_columns?.length !== total_selected?.length) {
        setSelectAll(false)
      }
    }
  }, [columns, showModal])
  const saveColumns = () => {
    if (checkedColumns?.length > 0) {
      onSaveColumns(checkedColumns.map(({value}: any) => value))
      setShowModal(false)
      ToastMessage({type: 'clear'})
    } else {
      ToastMessage({type: 'error', message: 'Please select at least one field'})
    }
  }
  const onClose = () => {
    setShowModal(false)
    ToastMessage({type: 'clear'})
  }
  const handleCheckAll = (checked_val: any) => {
    const new_arr_option = column?.map((item: any) => {
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

  return (
    <Modal
      dialogClassName='modal-xl'
      show={showModal}
      onHide={() => {
        onClose()
      }}
    >
      <Modal.Header>
        <Modal.Title>
          <p className='card-label fw-bolder fs-3 mb-1'>Select Table Columns</p>
          <p className='fs-7 mb-0'>Select the fields you want to show in the table columns.</p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className='px-0 py-2'>
        <div className='card card-custom'>
          <div className='card-body'>
            <div className='d-flex align-items-center form-check form-check-sm form-check-custom form-check-solid border-bottom mb-2 pb-2'>
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
            <CheckBox
              name='column'
              col='3'
              options={column}
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
          <div className='card-header border-0'>
            <h3 className='card-title align-items-start flex-column'>
              <span className='card-label fw-bolder fs-3 mb-1'>Order Table Columns</span>
              <span className='fs-7'>
                Drag and drop the columns to rearrange the columns order.
              </span>
            </h3>
          </div>
          <div className='card-body py-0'>
            <TableDND inModal columns={checkedColumns} result={(e: any) => setCheckedColumns(e)} />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className='btn-sm'
          variant='secondary'
          onClick={() => {
            onClose()
          }}
        >
          Cancel
        </Button>
        <Button
          className='btn-sm'
          type='submit'
          form-id=''
          variant='primary'
          onClick={() => saveColumns()}
        >
          <span className='indicator-label'>Save</span>
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

CustomReportColumns = memo(
  CustomReportColumns,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default CustomReportColumns
