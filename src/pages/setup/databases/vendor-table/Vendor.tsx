import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken} from '@helpers'
import {FC, useEffect, useState} from 'react'
import {Button, Table} from 'react-bootstrap'

import {getDatabaseVendor, updateDatabaseVendor} from '../Serivce'
type VendorTableProps = {
  databaseVendor: any
  setDatabaseVendor: any
  setupText: any
}
const VendorTable: FC<VendorTableProps> = ({databaseVendor, setDatabaseVendor, setupText}) => {
  const [loading, setLoading] = useState(false)
  const [loadingCancel, setLoadingCancel] = useState(false)
  const [settingAllCk, setSettingAllCk] = useState(false)
  const handleCheckChield = (checked_val: any, index: any) => {
    const new_arr_option = databaseVendor?.map((item: any, i: any) => {
      if (index === i) {
        if (!item.is_default) {
          return {...item, is_selected: checked_val, is_required: false}
        } else {
          return item
        }
      } else {
        return item
      }
    })
    setDatabaseVendor(new_arr_option as never)
    setSettingAllCk(false)
  }
  const handleAllChecked = (checked_val: any) => {
    const new_arr_option = databaseVendor?.map((item: any, _i: any) => {
      if (!item.is_default) {
        if (!checked_val) {
          return {...item, is_selected: checked_val, is_required: item.is_required}
        } else {
          return {...item, is_selected: checked_val, is_required: false}
        }
      } else {
        return item
      }
    })
    setDatabaseVendor(new_arr_option as never)
    setSettingAllCk(checked_val)
  }
  const handleRadio = (checked_radio: any, index: any) => {
    const new_arr_option = databaseVendor.map((item: any, i: any) => {
      if (index === i) {
        if (checked_radio === 'true') {
          return {...item, is_required: true}
        } else {
          return {...item, is_required: false}
        }
      } else {
        return item
      }
    })
    setDatabaseVendor(new_arr_option as never)
  }
  const onCancel = () => {
    setLoadingCancel(true)
    getDatabaseVendor({})
      .then(({data: {data: res}}) => {
        if (res) {
          setDatabaseVendor(res)
          setLoadingCancel(false)
        }
      })
      .catch(() => '')
  }
  const onSave = () => {
    setLoading(true)
    const params = {
      fields: databaseVendor,
    }
    updateDatabaseVendor(params)
      .then((res: any) => {
        ToastMessage({message: res?.data?.message, type: 'success'})
        setLoading(false)
      })
      .catch((err: any) => {
        errorExpiredToken(err)
        setLoading(false)
        if (!err?.response?.data?.devMessage) {
          ToastMessage({message: err?.response?.data?.message, type: 'error'})
        }
      })
  }
  useEffect(() => {
    let count = 0
    databaseVendor
      ?.filter((set: {is_selected: any}) => set.is_selected === true)
      .map((data_role: any) => {
        if (data_role.is_selected === true) {
          count++
        }
        return true
      })
    if (count === databaseVendor.length) {
      setSettingAllCk(true)
    } else {
      setSettingAllCk(false)
    }
  }, [databaseVendor])
  return (
    <>
      <div className='p-4 bg-secondary mb-5 mt-5'>{setupText}</div>
      <Table bordered responsive='md'>
        <thead>
          <tr className='border-bottom border-primary'>
            <th>
              <div className='form-check form-check-custom form-check-solid mx-5'>
                <input
                  className='form-check-input'
                  type='checkbox'
                  name='checkall'
                  value='true'
                  checked={settingAllCk}
                  onChange={(e: any) => handleAllChecked(e.target.checked)}
                />
              </div>
            </th>
            <th className='fw-bold fs-5'>Field Name</th>
            <th className='fw-bold fs-5'>Required Field</th>
            <th className='fw-bold fs-5'>Description</th>
            <th className='fw-bold fs-5'>Example</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(databaseVendor) &&
            databaseVendor?.map((item: any, index: any) => (
              <tr key={index} className='border-bottom mt-15 mb-15'>
                <td>
                  <div className='form-check form-check-custom form-check-solid mx-5'>
                    {item.is_default && (
                      <input
                        className='form-check-input'
                        type='checkbox'
                        name={item.field + '_warranty'}
                        value='true'
                        checked
                        disabled
                      />
                    )}
                    {!item.is_default && item.is_selected && (
                      <input
                        className='form-check-input'
                        type='checkbox'
                        name={item.field + '_warranty'}
                        value='true'
                        onChange={(e: any) => handleCheckChield(e.target.checked, index)}
                        defaultChecked
                      />
                    )}
                    {!item.is_default && !item.is_selected && (
                      <input
                        className='form-check-input'
                        type='checkbox'
                        name={item.field + '_warranty'}
                        value='true'
                        onChange={(e: any) => handleCheckChield(e.target.checked, index)}
                      />
                    )}
                  </div>
                </td>
                <td>
                  {item.label}
                  {item.is_required && <span className='text-danger'>&#42;</span>}
                </td>
                <td>
                  {item.is_default && item.is_selected && item.is_required && (
                    <div className='form-check form-check-inline'>
                      <input
                        className='form-check-input'
                        type='radio'
                        name={item.field + '_warranty'}
                        value='true'
                        checked
                        disabled
                      />
                      <label className='form-check-label'>Yes</label>
                    </div>
                  )}
                  {!item.is_default && item.is_selected && (
                    <>
                      <div className='form-check form-check-inline'>
                        {(item.is_required === true && (
                          <input
                            className='form-check-input'
                            type='radio'
                            name={item.field + '_warranty'}
                            onChange={(e: any) => handleRadio(e?.target?.value, index)}
                            value='true'
                            checked
                          />
                        )) || (
                          <input
                            className='form-check-input'
                            type='radio'
                            name={item.field + '_warranty'}
                            onChange={(e: any) => handleRadio(e?.target?.value, index)}
                            value='true'
                          />
                        )}
                        <label className='form-check-label'>Yes</label>
                      </div>
                      <div className='form-check form-check-inline'>
                        {(!item.is_required && (
                          <input
                            className='form-check-input'
                            type='radio'
                            name={item.field + '_warranty'}
                            onChange={(e: any) => handleRadio(e?.target?.value, index)}
                            value='false'
                            checked
                          />
                        )) || (
                          <input
                            className='form-check-input'
                            type='radio'
                            name={item.field + '_warranty'}
                            onChange={(e: any) => handleRadio(e?.target?.value, index)}
                            value='false'
                          />
                        )}
                        <label className='form-check-label'>Optional</label>
                      </div>
                    </>
                  )}
                </td>
                <td>{item.description}</td>
                <td>{item.example}</td>
              </tr>
            ))}
        </tbody>
      </Table>
      <div className='d-grid gap-2 d-md-flex justify-content-md-end'>
        <Button
          disabled={loadingCancel}
          style={{fontSize: '12.5px'}}
          className='btn btn-secondary float-end'
          onClick={onCancel}
        >
          {!loadingCancel && (
            <span className='indicator-label' style={{fontSize: '12.5px'}}>
              {'Cancel'}
            </span>
          )}
          {loadingCancel && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </Button>
        <Button
          disabled={loading}
          className='btn-sm'
          type='submit'
          variant='primary'
          onClick={onSave}
        >
          {!loading && (
            <span className='indicator-label' style={{fontSize: '12.5px'}}>
              {'Save'}
            </span>
          )}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </Button>
      </div>
    </>
  )
}
export {VendorTable}
