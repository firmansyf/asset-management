import {configClass} from '@helpers'
import sumBy from 'lodash/sumBy'
import {FC, useEffect, useState} from 'react'

const Step2: FC<any> = ({
  fields,
  excelColOptions,
  fieldMapping,
  setFieldMapping,
  setNextButton,
  fistRowHeader,
  setFistRowHeader,
}) => {
  const [excelOptionColumn, setExcelOptionColumn] = useState([])

  const onChangeOptionField = (value: any, index: any) => {
    const new_arr_option = excelOptionColumn?.map((item: any, i: any) => {
      if (index === i) {
        if (value === 'noColumn') {
          return {...item, key: item.key, label: item.label, selected: false}
        }
        if (value === item.key) {
          return {...item, key: item.key, label: item.label, selected: true}
        } else {
          return item
        }
      }
      if (value === item.key) {
        return {...item, key: item.key, label: item.label, selected: true}
      } else {
        return item
      }
    })
    setExcelOptionColumn(new_arr_option as never)

    const new_arr_filed = fieldMapping?.map((field_item: any, i: any) => {
      if (index === i) {
        if (value === 'noColumn') {
          return {
            ...field_item,
            key: field_item.key,
            label: '',
            required: field_item.required,
            type: field_item.type,
          }
        } else {
          return {
            ...field_item,
            key: field_item.key,
            label: value,
            required: field_item.required,
            type: field_item.type,
          }
        }
      } else {
        return field_item
      }
    })
    setFieldMapping(new_arr_filed)

    const mapping_count = sumBy(excelOptionColumn, ({selected}) => Number(selected === true))

    if (Math.abs(mapping_count - 1) > 0) {
      setNextButton(true)
    } else {
      setNextButton(false)
    }
  }

  const handleCheckFirstRow = (value: any) => {
    if (value === false) {
      setFistRowHeader(false)
    } else {
      setFistRowHeader(true)
    }
  }

  useEffect(() => {
    const arr_option = excelColOptions?.map(({label: lb, key: k}: any) => {
      const val_opt = {key: k, label: lb, selected: true}
      return val_opt
    })
    setExcelOptionColumn(arr_option)

    if (excelColOptions.length === 0 || excelColOptions?.length !== fields?.length) {
      setNextButton(false)
    }
  }, [excelColOptions, setNextButton, fields])

  return (
    <>
      <div className='form-check form-check-custom form-check-solid mb-5'>
        <input
          className='form-check-input'
          type='checkbox'
          name='rirst_row'
          onChange={(e: any) => handleCheckFirstRow(e.target.checked)}
          checked={fistRowHeader}
        />
        <span className='m-3'>First row fields heading</span>
      </div>
      <table className='table table-row-dashed table-row-gray-300 gy-3'>
        <thead>
          <td key='exting' className='fw-bolder fs-6 text-gray-800'>
            Existing Field
          </td>
          <td key='available' className='fw-bolder fs-6 text-gray-800'>
            Available Field
          </td>
        </thead>
        <tbody>
          {fields?.map(({label, required}: any, index: any) => {
            const name = label.replace('*', '')
            return (
              <tr className='' key={index}>
                <td className='align-middle'>
                  <label className={`${configClass?.label} ${required ? 'required' : ''}`}>
                    {name}
                  </label>
                  {/* {name} {required && <span className='text-danger'>*</span>} */}
                </td>
                <td>
                  <select
                    className={configClass?.select}
                    // value={label}
                    name={label}
                    onChange={(e: any) => onChangeOptionField(e?.target?.value, index)}
                  >
                    <option value='noColumn'>No Column</option>
                    {excelOptionColumn?.map(
                      ({label: lb, key: k, selected: select}: any, i: any) => {
                        if (label === k) {
                          return (
                            <option key={i} value={k} selected disabled={select}>
                              {lb}
                            </option>
                          )
                        }
                        return (
                          <option key={i} value={k} disabled={select}>
                            {lb}
                          </option>
                        )
                      }
                    )}
                  </select>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {/* <div>Custom Fields</div> */}
    </>
  )
}

export {Step2}
