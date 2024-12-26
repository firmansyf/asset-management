import Tooltip from '@components/alert/tooltip'
import {configClass} from '@helpers'
import {FC, useRef, useState} from 'react'

const toObject: any = (arr: any) => {
  return arr
    ?.filter((f: any) => f)
    ?.map((val: any, index: number) => ({
      key: index?.toString() || '',
      value: val || '',
    }))
}

const InputClone: FC<any> = ({
  name,
  placeholder,
  onChange,
  className,
  optionMessage,
  defaultValue,
  setOptionMessage,
}) => {
  const [currentValue, setCurrentValue] = useState<any>('')
  const [options, setOptions] = useState<any>(defaultValue as never[])

  const refCurrent: any = useRef()

  const add = () => {
    setOptions([...options, currentValue])
    setCurrentValue('')
    refCurrent?.current?.focus()
    onChange && onChange(toObject([...options, currentValue]))
    setOptionMessage(false)
  }

  const edit = (value: any, index: number) => {
    const result: any = options.map((opt: any, i: number) => {
      let itemResult: any = opt
      index === i && (itemResult = value)
      return itemResult
    })
    setOptions(result)
    onChange && onChange(toObject(result))
    setOptionMessage(false)
  }

  const del = (index: number) => {
    const opt: any = options
    opt.splice(index, 1)
    setOptions([...opt])
    onChange && onChange(toObject([...opt]))
    setOptionMessage(false)
  }

  return (
    <div className={className} style={{marginTop: -26}}>
      <div className='row'>
        <div className='col-12'>
          <div className='row'>
            <div className='col-10 text-end'>
              <button
                type='button'
                className='btn btn-link'
                onClick={add}
                style={{marginRight: -12, fontSize: 13}}
              >
                Add Option List
              </button>
            </div>
            <div
              className='col-2 h-25px w-25px btn-icon btn-primary rounded-circle p-0 d-flex align-items-center justify-content-center text-end'
              onClick={add}
              style={{marginLeft: 13, marginTop: 8}}
            >
              <i className='fas fa-plus text-white' />
            </div>
          </div>
        </div>
      </div>
      {!!options && (
        <div className='row'>
          {options.map((m: any, index: number) => (
            <div className='col-12 my-2' key={index}>
              <div className='input-group input-group-solid'>
                <input
                  name={`${name}.${index}`}
                  type='text'
                  value={m}
                  placeholder={placeholder}
                  className={configClass?.form}
                  onChange={({target: {value}}: any) => edit(value, index)}
                />
                <Tooltip placement='top' title='Delete'>
                  <div className='input-group-text input-group-prepend p-1'>
                    <div
                      className='h-25px w-25px btn-icon btn-danger rounded-circle p-0 d-flex align-items-center justify-content-center'
                      onClick={() => del(index)}
                    >
                      <i className='fas fa-times text-white' />
                    </div>
                  </div>
                </Tooltip>
              </div>
            </div>
          ))}
        </div>
      )}
      {optionMessage && (
        <div className='fv-plugins-message-container invalid-feedback'>
          Options field is required.
        </div>
      )}
    </div>
  )
}

export {InputClone}
