import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {errorExpiredToken} from '@helpers'
import {omit} from 'lodash'
import {FC, memo, useEffect, useMemo, useState} from 'react'
import {Button, Form, Table} from 'react-bootstrap'

type DatabaseTableProps = {
  updateApi: any
  databaseData: any
  setupText: any
  fieldName: string
  loadingPage: any
  setReloadData?: any
  reloadData?: any
}

let DatabaseTable: FC<DatabaseTableProps> = ({
  updateApi,
  databaseData,
  setupText,
  fieldName,
  setReloadData,
  reloadData,
  loadingPage = true,
}) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [settingAllCk, setSettingAllCk] = useState<boolean>(false)
  const [data, setDatabaseData] = useState<any>([])
  const [reload, setReload] = useState<boolean>(false)

  const group: any = useMemo(
    () => [
      {
        field: 'asset.manufacturer_guid',
        is_parent: true,
      },
      {
        field: 'asset.manufacturer_model_guid',
        parent: 'asset.manufacturer_guid',
        is_parent: true,
      },
      {
        field: 'asset.manufacturer_brand_guid',
        parent: 'asset.manufacturer_model_guid',
      },
      {
        field: 'asset.location_guid',
        is_parent: true,
      },
      {
        field: 'asset.location_sub_guid',
        parent: 'asset.location_guid',
      },
    ],
    []
  )

  const handleCheckChield = (checked_val: any, item: any) => {
    let new_arr_option: any = data?.map((m: any) => {
      const mappedItem: any = m
      if (item?.is_parent && m?.parent === item?.field && !checked_val) {
        mappedItem.is_selected = false
      }
      if (mappedItem?.field === item?.field && !mappedItem?.is_default) {
        return {...mappedItem, is_selected: checked_val, is_required: false}
      } else {
        return mappedItem
      }
    })
    new_arr_option = new_arr_option?.map((m: any) => {
      const parent: any = new_arr_option?.find(({field}: any) => field === m?.parent)
      if (m?.parent === parent?.field && !parent?.is_selected) {
        m.is_selected = false
      }
      return m
    })

    setDatabaseData(new_arr_option)
    setSettingAllCk(
      new_arr_option?.length === new_arr_option?.filter(({is_selected}: any) => is_selected)?.length
    )
  }

  const handleAllChecked = (checked_val: any) => {
    const new_arr_option: any = data?.map((item: any) => {
      if (!item?.is_default) {
        if (!checked_val) {
          return {...item, is_selected: checked_val, is_required: item?.is_required}
        } else {
          return {...item, is_selected: checked_val, is_required: false}
        }
      } else {
        return item
      }
    })
    setDatabaseData(new_arr_option)
    setSettingAllCk(checked_val)
  }

  const handleRadio = (checked_radio: any, index: any) => {
    const new_arr_option: any = data?.map((item: any, i: any) => {
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
    setDatabaseData(new_arr_option)
  }

  const onSave = () => {
    setLoading(true)
    const params: any = {
      fields: data?.map((m: any) => omit(m, ['parent', 'is_parent'])),
    }

    updateApi(params)
      .then((res: any) => {
        ToastMessage({message: res?.data?.message, type: 'success'})
        setLoading(false)
        setReloadData(reloadData + 1)
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
    let count: number = 0
    const mappedData: any = databaseData?.map((m: any) => {
      const mappedResult: any = m
      const thisGroup: any = group?.find(({field}: any) => field === m?.field)
      mappedResult.is_parent = Boolean(thisGroup?.is_parent)
      mappedResult.parent = thisGroup?.parent || null
      return mappedResult
    })
    setDatabaseData(mappedData)
    databaseData
      ?.filter((set: {is_selected: any}) => set?.is_selected === true)
      ?.map((data_role: any) => {
        if (data_role?.is_selected === true) {
          count++
        }
        return true
      })
    if (count === databaseData?.length) {
      setSettingAllCk(true)
    } else {
      setSettingAllCk(false)
    }
  }, [databaseData, group, reload])

  if (loadingPage) {
    return <PageLoader />
  }

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
                  onChange={(e: any) => handleAllChecked(e?.target?.checked)}
                />
              </div>
            </th>
            <th className='fw-bold fs-5'>Field Name</th>
            <th className='fw-bold fs-5 text-nowrap'>Required Field</th>
            <th className='fw-bold fs-5'>Description</th>
            <th className='fw-bold fs-5'>Example</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(data) &&
            data?.map((item: any, index: any) => {
              const parent: any = data?.find(({field}: any) => field === item?.parent)
              return (
                <tr key={index} className='border-bottom mt-15 mb-15'>
                  <td>
                    <div className='form-check form-check-custom form-check-solid mx-5'>
                      {item?.is_default ? (
                        <input
                          className='form-check-input'
                          type='checkbox'
                          name={item?.field + fieldName}
                          value='true'
                          checked
                          disabled
                        />
                      ) : (
                        <input
                          className='form-check-input'
                          type='checkbox'
                          name={item?.field + fieldName}
                          value='true'
                          onChange={(e: any) => handleCheckChield(e?.target?.checked, item)}
                          checked={Boolean(item?.is_selected)}
                          disabled={parent && !parent?.is_selected}
                        />
                      )}
                    </div>
                  </td>
                  <td>
                    {item?.label}
                    {item?.is_required && <span className='text-danger'>&#42;</span>}
                  </td>

                  <td>
                    {item?.is_default && item?.is_selected && item?.is_required && (
                      <Form.Switch label='' checked disabled />
                    )}

                    {!item?.is_default && item?.is_selected && (
                      <Form.Switch
                        label=''
                        checked={Boolean(item?.is_required)}
                        onChange={({target: {checked}}: any) => {
                          handleRadio(String(Boolean(checked)), index)
                        }}
                      />
                    )}
                  </td>
                  <td>{item?.description}</td>
                  <td>{item?.example}</td>
                </tr>
              )
            })}
        </tbody>
      </Table>
      <div className='d-grid gap-2 d-md-flex justify-content-md-end'>
        <Button
          style={{fontSize: '12.5px'}}
          className='btn btn-secondary float-end'
          onClick={() => setReload((prev: any) => !prev)}
        >
          Cancel
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

DatabaseTable = memo(
  DatabaseTable,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default DatabaseTable
