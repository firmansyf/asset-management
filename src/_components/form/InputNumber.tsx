import {configClass} from '@helpers'
import {FC, useEffect, useState} from 'react'

interface Props {
  defaultValue?: any
  nullable?: boolean
  min?: number
  max?: number | undefined
  btn?: boolean
  onChange?: (e?: any) => void
  disabled?: boolean
}

const InputNumber: FC<Props> = ({
  defaultValue,
  nullable = false,
  min = 0,
  max = undefined,
  btn = false,
  onChange = () => '',
  disabled = false,
}) => {
  const [value, setValue] = useState<any>('')
  const isMin: boolean = value <= min
  const isMax: boolean = !!max && value >= (max || 0)

  useEffect(() => {
    let val: number = defaultValue
    if (max && defaultValue > max) {
      val = max
    } else if (min && defaultValue < min) {
      val = min
    }
    setValue(val)
  }, [defaultValue, min, max])

  const decrement: any = () => {
    if (value > min) {
      setValue((prev: any) => {
        const val: number = parseInt(prev || 0) - 1
        onChange(val)
        return val
      })
    }
  }

  const increment: any = () => {
    if (value < (max || 0) || !max) {
      setValue((prev: any) => {
        const val: number = parseInt(prev || 0) + 1
        onChange(val)
        return val
      })
    }
  }

  return (
    <div className='input-group input-group-sm input-group-solid d-flex align-items-center'>
      {btn && (
        <button
          type='button'
          disabled={isMin || disabled}
          className={`btn btn-icon ms-2 w-25px h-25px radius-5 btn-${isMin ? 'light' : 'primary'}`}
          onClick={decrement}
        >
          <i className='fas fa-minus' />
        </button>
      )}
      <input
        type='number'
        className={`${configClass?.form} fs-5 py-0 fw-bolder ${btn ? 'text-center' : ''}`}
        style={{minHeight: '36px'}}
        name='name'
        value={value}
        disabled={disabled}
        onChange={({target: {value}}: any) => {
          if (nullable) {
            value = value || value === '0' ? parseInt(value) : ''
          } else {
            value = parseInt(value || 0)
            if (max && value > max) {
              value = max
            } else if (min && value < min) {
              value = min
            }
          }

          setValue(value)
          onChange(value)
        }}
        onKeyDown={(e: any) => {
          if (['e', 'E', '+', '-', '.', ','].includes(e?.key)) {
            e.preventDefault()
          }
        }}
        onInput={(e: any) => {
          if (e?.target?.value?.length > 1) {
            e.target.value = e?.target?.value?.replace(/^0+/, '')
          }
        }}
      />
      {btn && (
        <button
          type='button'
          disabled={isMax || disabled}
          className={`btn btn-icon me-2 w-25px h-25px radius-5 btn-${isMax ? 'light' : 'primary'}`}
          onClick={increment}
        >
          <i className='fas fa-plus' />
        </button>
      )}
    </div>
  )
}

export {InputNumber}
