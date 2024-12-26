import {FC, forwardRef, memo, useMemo, useState} from 'react'
import ReactSelect from 'react-select'

import {
  ClearIndicator,
  customStyles,
  DropdownIndicator,
  MultiValueRemove,
  SelectTypes,
} from './config'

const SelectField: any = (
  {
    name,
    placeholder,
    onChange,
    data,
    defaultValue,
    multiple,
    params,
    sm = false,
    isClearable = true,
    id,
    className,
    components: comp,
    getOptionValue,
    getOptionLabel,
    isDisabled = false,
    styleOption = {},
  }: SelectTypes,
  ref: any
) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [query, setQuery] = useState<any>('')
  const [options, setOptions] = useState<any>([])
  const [value, setValue] = useState<any>()
  const onInputChange = (e: any, ev: any) => {
    if (ev.action === 'input-change') {
      setPage(1)
      setIsLoading(true)
      params && params({page: 1, q: e})
      setQuery(() => e)
    }
    setIsLoading(false)
  }
  const scrollToBottom = () => {
    if (data !== options) {
      setIsLoading(true)
      setPage((p: any) => {
        ++p
        return p
      })
      params && params({page, q: query})
    } else {
      params && params({page: 1, q: query})
    }
    setIsLoading(false)
  }
  useMemo(() => {
    setOptions(data)
    setValue(defaultValue)
    return () => {
      setPage(1)
      setQuery('')
      setIsLoading(false)
      // loadingSet(false)
    }
  }, [data, defaultValue])
  return (
    <div className={className}>
      <ReactSelect
        ref={ref as any}
        inputId={id}
        styles={customStyles(sm, styleOption)}
        components={{...comp, DropdownIndicator, ClearIndicator, MultiValueRemove}}
        name={name}
        placeholder={placeholder}
        noOptionsMessage={(e: any) => (e.inputValue = 'No Data...')}
        isLoading={isLoading}
        isMulti={false}
        closeMenuOnSelect={multiple ? false : true}
        controlShouldRenderValue
        isClearable={isClearable}
        value={value ? options?.find((f: any) => f?.value === value) : ''}
        inputValue={query}
        options={options}
        onInputChange={onInputChange}
        onChange={(e: any) => {
          setQuery('')
          setValue(e || {value: null})
          onChange && onChange(e || {value: null})
        }}
        onMenuScrollToBottom={scrollToBottom}
        getOptionValue={getOptionValue}
        getOptionLabel={getOptionLabel}
        isDisabled={isDisabled}
      />
    </div>
  )
}

const Select: FC<SelectTypes> = memo(
  forwardRef(SelectField),
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)

export {Select}
