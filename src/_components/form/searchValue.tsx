import {configClass, KTSVG} from '@helpers'
import {debounce} from 'lodash'
import {FC, useEffect, useState} from 'react'

export const Search: FC<any> = ({bg = 'white', value = '', delay = 2000, onChange = () => ''}) => {
  const [loading, setLoading] = useState(false)
  const [val, setVal] = useState('')

  const debounceSave = debounce((e: any) => {
    onChange(e)
    setLoading(false)
  }, delay)

  const onSearch = (e: any) => {
    setLoading(true)
    if (e?.toString()?.length > 1 || e?.toString().length === 0) {
      debounceSave(e)
    }
  }

  useEffect(() => {
    setVal(value)
  }, [value])

  return (
    <>
      <KTSVG
        path='/media/icons/duotone/General/Search.svg'
        className='svg-icon-3 position-absolute ms-3'
      />
      <input
        type='text'
        id='kt_filter_search'
        className={`${configClass?.search} form-control-${bg} ps-9`}
        placeholder='Search'
        value={val}
        onChange={({target}: any) => {
          onSearch(target?.value || '')
          setVal(target?.value || '')
        }}
      />
      {loading && (
        <div className='position-absolute end-0 pe-3'>
          <span className='spinner-border spinner-border-sm text-muted align-middle'></span>
        </div>
      )}
    </>
  )
}
