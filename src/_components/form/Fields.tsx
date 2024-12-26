/* eslint-disable react-hooks/exhaustive-deps */
import {configClass} from '@helpers'
import {useDeepEffect} from '@hooks'
import {FC, memo, SetStateAction, useRef, useState} from 'react'

import {Select as SelectAjax} from '../select/ajax'
import {Select} from '../select/select'
import {DateEl} from './DateInput'
import {DateTime} from './DateTimeInput'
import {FieldCheck} from './FieldCheck'
import {FieldCurrency} from './FieldCurrency'
import {FileUploader} from './FileUploader'

interface SelectValTypes {
  value: string | undefined
  label: string | undefined
}
export interface SelectOptionType {
  [key: string]: any
}

interface FieldTypes {
  type: string
  label: string
  required?: boolean
  defaultValue?: SelectValTypes | undefined | SetStateAction<any>
  onChange?: (e: object | string | number | boolean | undefined, label?: any) => void
  addBtn?: boolean
  onClickAddBtn?: () => void
  api?: (e: SelectOptionType) => void
  selectParams?: SelectOptionType
  selectTrigger?: boolean
  selectParser?: ((e: SelectOptionType | undefined) => SelectValTypes) | undefined
  option?: Array<SelectOptionType> | undefined
  readOnly?: boolean
  setHidden?: any
  limit?: any
  clearOption?: boolean
  fileAccept?: string
}

let Index: FC<FieldTypes> = ({
  type,
  label,
  required,
  defaultValue,
  onChange = () => undefined,
  addBtn = false,
  onClickAddBtn,
  api,
  selectParams,
  selectTrigger,
  selectParser,
  option,
  readOnly,
  setHidden,
  limit,
  clearOption,
  fileAccept,
}) => {
  const latRef: any = useRef<any>()
  const longRef: any = useRef<any>()
  const hyperlinkUrlRef: any = useRef<any>()
  const hyperlinkTextRef: any = useRef<any>()

  const [val, setVal] = useState<any>('')

  useDeepEffect(() => {
    let value: any = defaultValue
    if (defaultValue?.guid) {
      let timeOut: number = 0
      switch (label?.toLocaleLowerCase()) {
        case 'model':
          timeOut = 250
          break
        case 'brand':
          timeOut = 500
          break
        default:
          timeOut = 250
      }
      if (defaultValue?.type) {
        value = {
          value: defaultValue?.guid || '',
          label: defaultValue?.name || '',
          type: defaultValue?.type || '',
        }
        onChange({value: defaultValue?.guid || '', type: defaultValue?.type || ''})
      } else {
        value = {value: defaultValue?.guid || '', label: defaultValue?.name || ''}
        onChange(defaultValue?.guid)
      }
      setTimeout(() => setVal(value), timeOut)
    } else {
      setVal(value)
    }
  }, [defaultValue])

  useDeepEffect(() => {
    if (setHidden) {
      onChange(defaultValue)
    }
  }, [setHidden, onChange, defaultValue])

  const numericChangeInput = (event: any) => {
    const result: any = event?.target?.value?.replace(/\D/g, '')
    setVal(result || '')
    onChange(parseInt(result))
  }

  const urlValidation = (event: any) => {
    const link: string = event?.toLowerCase()
    const regex: any = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')
    const validation: string = regex.test(link)
    const pattern: any = link?.match(/http/g)
    if (validation) {
      if (pattern?.length > 0) {
        return link
      } else {
        const replace_link: any = `http://${link}`
        return replace_link
      }
    } else {
      return ''
    }
  }

  switch (type) {
    case 'text':
    case 'macaddress':
    case 'url':
    case 'email':
    case 'ipaddress':
      return limit > 0 ? (
        <input
          type='text'
          maxLength={limit}
          defaultValue={val}
          readOnly={readOnly}
          placeholder={`Enter ${label || ''}`}
          className={`${configClass?.form} ${readOnly ? 'bg-read-only' : ''}`}
          onInput={({target: {value}}: any) => onChange(value)}
        />
      ) : (
        <input
          placeholder={`Enter ${label || ''}`}
          type='text'
          readOnly={readOnly}
          defaultValue={val}
          className={`${configClass?.form} ${readOnly ? 'bg-read-only' : ''}`}
          onInput={({target: {value}}: any) => onChange(value)}
        />
      )
    case 'numeric':
      return limit > 0 ? (
        <input
          type='text'
          maxLength={limit}
          value={val || ''}
          placeholder={`Enter ${label || ''}`}
          className={configClass?.form}
          onChange={numericChangeInput}
        />
      ) : (
        <input
          type='text'
          value={val || ''}
          placeholder={`Enter ${label || ''}`}
          className={configClass?.form}
          onChange={numericChangeInput}
        />
      )
    case 'dropdown':
      return (
        <div className='input-group input-group-solid d-flex align-items-center'>
          {!!api && (
            <SelectAjax
              sm={true}
              className='col p-0'
              api={api}
              params={selectParams}
              reload={selectTrigger}
              placeholder={`Choose ${label || ''}`}
              defaultValue={val}
              isClearable={!required}
              isDisabled={readOnly}
              clearOption={clearOption}
              onChange={({value, type, label}: SelectOptionType) => {
                if (type) {
                  onChange({value, type})
                } else {
                  onChange(value, label)
                }
              }}
              parse={selectParser}
            />
          )}
          {addBtn && api && (
            <button
              className='border border-dashed border-primary h-25px w-25px btn btn-icon btn-light-primary rounded-circle ms-2 me-3'
              onClick={onClickAddBtn}
              type='button'
            >
              <i className='fas fa-plus' />
            </button>
          )}
          {/* CUSTOM FIELDS DROPDOWN */}
          {!api && option && option?.length > 0 && (
            <Select
              sm={true}
              className='col p-0'
              data={option?.map(({key, value}: SelectOptionType) => ({value: key, label: value}))}
              placeholder='Choose'
              isClearable={!required}
              defaultValue={val}
              onChange={({value}: SelectOptionType) => onChange(value)}
            />
          )}
        </div>
      )
    case 'date':
      return (
        <DateEl sm controlled nullable required={required} defaultValue={val} onChange={onChange} />
      )
    case 'currency':
      return (
        <FieldCurrency
          label={label}
          required={required}
          defaultValue={defaultValue}
          onChange={onChange}
          readOnly={readOnly}
        />
      )
    case 'file':
      return <FileUploader defaultValue={val} onChange={onChange} accept={fileAccept} />
    case 'checkbox':
    case 'radio':
      return <FieldCheck type={type} option={option} defaultValue={val} onChange={onChange} />
    case 'gps':
      return (
        <div className='input-group input-group-solid d-flex align-items-center'>
          <input
            ref={latRef}
            placeholder='Lat'
            type='text'
            defaultValue={val?.lat || ''}
            className={`${configClass?.form} border-end border-right-3`}
            onChange={({target: {value}}: any) => {
              onChange({lat: value, lng: longRef?.current?.value})
            }}
          />
          <input
            ref={longRef}
            placeholder='Long'
            type='text'
            defaultValue={val?.lng || ''}
            className={`${configClass?.form} border-start border-left-3`}
            onChange={({target: {value}}: any) => {
              onChange({lat: latRef?.current?.value, lng: value})
            }}
          />
        </div>
      )
    case 'datetime':
    case 'date_format:Y-m-d H:i:s':
      return (
        <DateTime
          sm
          controlled
          nullable
          required={required}
          defaultValue={val}
          onChange={onChange}
        />
      )
    case 'hidden':
      return (
        <input
          placeholder={`Enter ${label || ''}`}
          type='hidden'
          defaultValue={val}
          className={configClass?.form}
          onInput={({target: {value}}: any) => onChange(value)}
        />
      )
    case 'link':
      return (
        <div className='input-group input-group-solid d-flex align-items-center'>
          <input
            ref={hyperlinkUrlRef}
            placeholder='Enter URL'
            type='text'
            defaultValue={val?.url || ''}
            className={`${configClass?.form} border-end border-right-3`}
            onChange={({target: {value}}: any) => {
              onChange({
                url: urlValidation(value),
                text: hyperlinkTextRef?.current?.value,
              })
            }}
          />
          <input
            ref={hyperlinkTextRef}
            placeholder='Enter URL Title'
            type='text'
            defaultValue={val?.text || ''}
            className={`${configClass?.form} border-start border-left-3`}
            onChange={({target: {value}}: any) => {
              onChange({url: urlValidation(hyperlinkUrlRef?.current?.value), text: value})
            }}
          />
        </div>
      )
    default:
      return (
        <input
          placeholder={`Enter ${label || ''}`}
          type='text'
          defaultValue={val}
          className={configClass?.form}
          onInput={({target: {value}}: any) => onChange(value)}
        />
      )
  }
}

Index = memo(
  Index,
  (prev: FieldTypes, next: FieldTypes) => JSON.stringify(prev) === JSON.stringify(next)
)
export default Index
