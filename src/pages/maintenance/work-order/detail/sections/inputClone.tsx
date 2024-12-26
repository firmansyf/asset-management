import {InputClone as InputCloneOptions} from '@components/form/InputClone'
import {configClass} from '@helpers'
import {getMaintenanceChecklistType} from '@pages/setup/maintenance/checklist/Service'
import {FC, useEffect, useState} from 'react'

const toObject: any = (arr: any) => {
  return arr
    ?.filter((f: any) => f)
    ?.map((val: any, index: number) => ({
      name: val?.name,
      field_type: val?.field_type,
      order: index + 1,
      option: val?.option,
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
  const [tasks, setTasks] = useState<any>([])
  const [maintenanceType, setMaintenanceType] = useState<any>([])

  const edit = (value: any, index: number) => {
    const result: any = tasks?.map((opt: any, i: number) => {
      const resData = {
        name: index === i ? value : opt?.name,
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
    const result: any = tasks?.map((opt: any, i: number) => {
      const resData = {
        name: opt?.name || '',
        field_type: index === i ? value : opt?.field_type,
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
    const result: any = tasks?.map((opt: any, i: number) => {
      const resData = {
        name: opt?.name || '',
        field_type: opt?.field_type || '',
        order: i + 1,
        option:
          index === i
            ? value?.length > 0
              ? value?.map(({value}: any) => value)
              : null
            : opt?.option,
      }
      return resData
    })
    setTasks(result)
    onChange && onChange(result)
    setOptionMessage(false)
  }

  const del = (index: number) => {
    const opt: any = tasks
    opt?.splice(index, 1)
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
            Object.keys(res || {})?.map((item: any) => ({
              value: item,
              label: res?.[item],
            })) as never[]
          )
        }
      })
      .catch(() => '')
  }, [])

  return (
    <div className={className}>
      {!!tasks &&
        tasks?.map((m: any, index: number) => (
          <div
            key={index}
            className='row mt-2'
            style={{
              border: '1px solid #e7e7e7',
              padding: '10px 0px',
            }}
          >
            <div className='col-6'>
              <div className='input-group input-group-solid'>
                <input
                  name={`${name}.${index}`}
                  type='text'
                  value={m?.name}
                  placeholder='Enter Task Name'
                  className={configClass?.form}
                  onChange={({target: {value}}: any) => edit(value, index)}
                />
              </div>
            </div>
            <div className='col-5'>
              <div className='input-group input-group-solid'>
                <select
                  name={`type.${name}.${index}`}
                  className={configClass?.select}
                  onChange={({target: {value}}: any) => editType(value, index)}
                  defaultValue={m?.field_type}
                >
                  <option value='' disabled selected>
                    Choose type
                  </option>
                  {maintenanceType?.map(({label, value}: any, key: any) => (
                    <option value={value} key={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              {m?.field_type && m?.field_type === 'select_dropdown' && (
                <div className='mt-5 pt-5'>
                  <InputCloneOptions
                    name='options'
                    defaultValue={m?.option as never[]}
                    placeholder='Enter Option'
                    className='col-lg-8 offset-lg-4'
                    onChange={(e: any) => {
                      editOptions(e, index)
                    }}
                    optionMessage={optionMessage}
                    setOptionMessage={setOptionMessage}
                  />
                </div>
              )}
            </div>
            <div className='col-1' style={{marginTop: '5px'}}>
              <div
                className='h-25px w-25px btn-icon btn-danger rounded-circle p-0 d-flex align-items-center justify-content-center'
                onClick={() => del(index)}
              >
                <i className='fas fa-times text-white' />
              </div>
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
