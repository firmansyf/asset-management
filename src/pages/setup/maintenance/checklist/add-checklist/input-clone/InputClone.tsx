import {InputClone as InputCloneOptions} from '@components/form/InputClone'
import {configClass} from '@helpers'
import {getMaintenanceChecklistType} from '@pages/setup/maintenance/checklist/Service'
import {FC, useEffect, useRef, useState} from 'react'

const toObject: any = (arr: any) => {
  return arr
    ?.filter((f: any) => f)
    ?.map((val: any, index: number) => ({
      name: val?.name || '',
      field_type: val?.field_type || '',
      order: index + 1,
      option: val?.option || '',
    }))
}

const InputClone: FC<any> = ({
  name,
  onChange,
  className,
  optionMessage,
  defaultValue,
  setOptionMessage,
}) => {
  const refCurrent: any = useRef()

  const [tasks, setTasks] = useState<any>([])
  const [maintenanceType, setMaintenanceType] = useState<any>([])

  const add = () => {
    const taskLast = tasks
      ?.sort((a: any, b: any) => (a?.order < b?.order ? 1 : -1))
      ?.map((res: any) => res)

    const currentValue: any = {
      name: '',
      field_type: '',
      order: taskLast?.[0] !== undefined ? taskLast?.[0]?.order + 1 : 1,
      option: null,
    }
    setTasks([...tasks, currentValue])
    refCurrent?.current?.focus()
    onChange && onChange(toObject([...tasks, currentValue]))
    setOptionMessage(false)
  }

  const edit = (value: any, index: number) => {
    const result: any = tasks
      ?.sort((a: any, b: any) => (a?.order > b?.order ? 1 : -1))
      ?.map((opt: any, i: number) => {
        const resData = {
          name: index === opt?.order ? value : opt?.name,
          field_type: opt?.field_type || '',
          order: i + 1,
          option: opt?.option || null,
        }
        return resData
      })
    setTasks(result)
    onChange && onChange(result)
    setOptionMessage(false)
  }

  const editType = (value: any, index: number) => {
    const result: any = tasks
      ?.sort((a: any, b: any) => (a?.order > b?.order ? 1 : -1))
      ?.map((opt: any, i: number) => {
        const resData = {
          name: opt?.name || '',
          field_type: index === opt?.order ? value : opt?.field_type,
          order: i + 1,
          option: opt?.option || null,
        }
        return resData
      })
    setTasks(result)
    onChange && onChange(result)
    setOptionMessage(false)
  }

  const editOptions = (value: any, index: number) => {
    const result: any = tasks
      ?.sort((a: any, b: any) => (a?.order > b?.order ? 1 : -1))
      ?.map((opt: any, i: number) => {
        const resData = {
          name: opt?.name || '',
          field_type: opt?.field_type || '',
          order: i + 1,
          option:
            index === opt?.order
              ? value?.length > 0
                ? value?.map(({value}: any) => value)
                : opt?.option
              : opt?.option,
        }
        return resData
      })
    setTasks(result)
    onChange && onChange(result)
    setOptionMessage(false)
  }

  const del = (index: number) => {
    const opt: any = tasks?.filter(({order}: any) => order !== index)?.map((item: any) => item)
    setTasks([...opt])
    onChange && onChange(toObject([...opt]))
    setOptionMessage(false)
  }

  useEffect(() => {
    !!defaultValue && setTasks(defaultValue)
  }, [defaultValue])

  useEffect(() => {
    getMaintenanceChecklistType()
      .then(({data: {data: res}}: any) => {
        if (res) {
          setMaintenanceType(
            Object.keys(res || {})?.map((item: any) => ({value: item, label: res[item]})) as never[]
          )
        }
      })
      .catch(() => '')
  }, [])

  return (
    <div className={className}>
      <div className='row mx-1'>
        <div className='col-12 text-end mb-2'>
          <button
            type='button'
            className='btn btn-primary'
            onClick={add}
            style={{marginRight: -12, fontSize: 13}}
          >
            Add Task
          </button>
        </div>
      </div>
      {!!tasks &&
        tasks
          ?.sort((a: any, b: any) => (a?.order > b?.order ? 1 : -1))
          ?.map((m: any) => (
            <div
              className='row mt-2 mx-1'
              key={m?.order}
              style={{
                border: '1px solid #e7e7e7',
                padding: '20px 10px',
                borderRadius: '10px',
              }}
            >
              <div className='col-12 mb-3'>
                <div className='row'>
                  <div className='col-10 fw-bolder fs-15'>{m?.order}&nbsp;&nbsp;Task</div>
                  <div
                    className='col-2 text-end'
                    onClick={() => del(m?.order)}
                    style={{cursor: 'pointer'}}
                  >
                    <i className='fa fa-trash-alt text-danger'></i>
                  </div>
                </div>
              </div>
              <div className='col-12 mb-3 ps-5'>
                <div className='row align-items-end'>
                  <label
                    htmlFor={`${name}.${m?.order}`}
                    className={`mb-2 col-ms-12 col-md-4 col-md-4 ps-5`}
                  >
                    Task Name
                  </label>
                  <div className='col-ms-12 col-md-8 col-md-8'>
                    <input
                      name={`${name}.${m?.order}`}
                      type='text'
                      value={m?.name}
                      placeholder='Enter Task Name'
                      className={configClass?.form}
                      onChange={({target: {value}}: any) => edit(value, m?.order)}
                    />
                  </div>
                </div>
              </div>
              <div className='col-12 mb-3 ps-5'>
                <div className='row align-items-end'>
                  <label
                    htmlFor={`type.${name}.${m?.order}`}
                    className={`mb-2 col-ms-12 col-md-4 col-md-4 ps-5`}
                  >
                    Data Type
                  </label>
                  <div className='col-ms-12 col-md-8 col-md-8'>
                    <select
                      name={`type.${name}.${m?.order}`}
                      className={configClass?.select}
                      onChange={({target: {value}}: any) => editType(value, m?.order)}
                      ref={(el: any) => {
                        if (el) {
                          el.style.setProperty('font-size', '12px', 'important')
                          el.style.setProperty('color', '#a1a5b7', 'important')
                        }
                      }}
                    >
                      <option value='' disabled selected={m?.field_type === '' ? true : false}>
                        Choose type
                      </option>
                      {maintenanceType?.map(({label, value}: any, key: any) => (
                        <option
                          value={value}
                          key={key}
                          selected={
                            m?.field_type === '' ? false : m?.field_type === value ? true : false
                          }
                        >
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {m?.field_type && m?.field_type === 'select_dropdown' && (
                  <div className='mt-5 pt-5'>
                    <InputCloneOptions
                      name='options'
                      placeholder='Enter Option'
                      className='col-lg-8 offset-lg-4'
                      defaultValue={m?.option || []}
                      onChange={(e: any) => {
                        editOptions(e, m?.order)
                      }}
                      optionMessage={optionMessage}
                      setOptionMessage={setOptionMessage}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
      {optionMessage && (
        <div className='fv-plugins-message-container invalid-feedback'>
          Options field is required.
        </div>
      )}
    </div>
  )
}

export {InputClone}
