import './style.scss'

import {ClearIndicator, customStyles, DropdownIndicator} from '@components/select/config'
import {debounce, differenceWith, filter, isEqual, size, uniqBy} from 'lodash'
import {FC, forwardRef, memo, useEffect, useState} from 'react'
import ReactSelect from 'react-select'

interface Props {
  name?: string
  placeholder?: string
  onChange?: any
  data?: any
  defaultValue?:
    | Array<{
        value: any
        label: any
      }>
    | any
  multiple?: any
  params: any
  limit?: any
  resultParams?: any
  api: any
  parse: any
  reload?: any
  id?: any
  className?: any
  sm?: any
  removeOption?: any
  resetOption?: any
  setResetOption?: any
  clearOption?: any
  isClearable?: boolean
  isDisabled?: any
  isMulti?: any
}

const SelectAjax: any = (
  {
    name,
    placeholder,
    onChange,
    data,
    defaultValue,
    multiple,
    params = {},
    limit = 10,
    resultParams,
    api,
    parse,
    reload,
    id = '',
    className = '',
    removeOption = [],
    resetOption,
    setResetOption,
    clearOption,
    isClearable = true,
    isDisabled = false,
    isMulti = false,
  }: Props,
  ref: any
) => {
  const [isLoading, setIsLoading] = useState<any>(false)
  const [page, setPage] = useState<any>(1)
  const [query, setQuery] = useState<any>('')
  const [queryParams, setQueryParams] = useState<any>(params)
  const [paramsChange, setParamsChange] = useState<any>(false)
  const [options, setOptions] = useState<any>([])
  const [value, setValue] = useState<any>([])

  useEffect(() => {
    if (defaultValue && defaultValue?.length > 0) {
      setValue(defaultValue)
    } else {
      setValue([])
    }
  }, [defaultValue, reload])

  useEffect(() => {
    setTimeout(() => {
      setQueryParams((prev: any) => {
        if (JSON.stringify(prev) !== JSON.stringify(params)) {
          setValue({})
          setPage(1)
          setQuery('')
          setOptions([])
        }
        setParamsChange(JSON.stringify(prev) !== JSON.stringify(params))
        return params
      })
    }, 1000)
  }, [params])

  useEffect(() => {
    setIsLoading(true)
    api({page, limit, keyword: `*${query}*`, ...queryParams})
      .then(({data: {data: res}}: any) => {
        if (parse) {
          const data: any = res?.data || res
          if (!!data?.length && !paramsChange) {
            const mapParse: any = data.map((e: any) => parse(e))
            setOptions((prev: any) => {
              if (
                !!prev?.length &&
                JSON.stringify(Object.values(prev || {})) !==
                  JSON.stringify(Object.values(mapParse || {}))
              ) {
                let result: any = uniqBy((prev || []).concat(mapParse), 'value')
                if (result.filter(({value}: any) => value === defaultValue?.value)?.length) {
                  result = [
                    ...result.filter(({value}: any) => value !== defaultValue?.value),
                    defaultValue,
                  ]
                } else if (defaultValue?.value) {
                  result = [...result, defaultValue]
                }
                result = filter(result, size)
                return result
              } else {
                let result: any = mapParse
                result = filter(result, size)
                return result
              }
            })
          } else if (paramsChange) {
            let result: any = data.map((e: any) => parse(e))
            result = filter(result, size)
            setOptions(result)
            if (result.filter(({value}: any) => value === defaultValue?.value)?.length) {
              setValue(defaultValue?.value)
              onChange && onChange(defaultValue)
            } else {
              setValue(undefined)
              onChange && onChange({value: undefined})
            }
          }
        } else {
          setOptions([])
        }
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [api, queryParams, paramsChange, limit, page, parse, query, defaultValue, reload, onChange])

  useEffect(() => {
    if (resetOption === true) {
      setQuery('')
      setValue(defaultValue?.value) // used in reset form, (setup>preference)
      setTimeout(() => {
        setResetOption(false)
      }, 2000)
    }

    if (clearOption === true) {
      setQuery('')
      setOptions([])
    }
  }, [resetOption, setResetOption, defaultValue?.value, clearOption])

  const applyDebounce = debounce(
    (e: any) => {
      setQuery(e)
      setIsLoading(false)
    },
    1500,
    {leading: false, trailing: true}
  )

  const onInputChange = (e: any, ev: any) => {
    if (ev?.action === 'input-change') {
      setPage(1)
      setIsLoading(true)
      resultParams && resultParams({page: 1, q: e})
      if (e) {
        applyDebounce(e)
      } else {
        setQuery('')
        setIsLoading(false)
      }
    } else {
      setIsLoading(false)
    }
  }

  const scrollToBottom = () => {
    setParamsChange(false)
    if (data !== options) {
      setIsLoading(true)
      setPage((p: any) => {
        ++p
        return p
      })
      resultParams && resultParams({page, q: query})
    } else {
      resultParams && resultParams({page: 1, q: query})
    }
    setIsLoading(false)
  }
  return (
    <div className={className}>
      <ReactSelect
        ref={ref}
        inputId={id}
        styles={customStyles(true, {})}
        components={{DropdownIndicator, ClearIndicator}}
        name={name}
        placeholder={placeholder}
        noOptionsMessage={(e: any) => (e.inputValue = 'No Data...')}
        isLoading={isLoading}
        isMulti={isMulti}
        closeMenuOnSelect={multiple ? false : true}
        controlShouldRenderValue
        isClearable={isClearable}
        value={value?.length > 0 ? value : ''}
        // inputValue={query}
        options={
          removeOption.length === 0 ? options : differenceWith(options, removeOption, isEqual)
        }
        onInputChange={onInputChange}
        onChange={(e: any) => {
          setQuery('')
          setValue(e || {value: ''})
          onChange && onChange(e || {value: ''})
        }}
        onMenuScrollToBottom={scrollToBottom}
        isDisabled={isDisabled}
      />
    </div>
  )
}

const Select: FC<Props> = memo(
  forwardRef(SelectAjax),
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {Select}
