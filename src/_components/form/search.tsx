import {configClass, KTSVG} from '@helpers'
import {debounce} from 'lodash'
import {FC, useState} from 'react'

interface Props {
  onChange?: (e: string | undefined) => void
  delay?: number
  min?: number
  bg?: any
}

export const Search: FC<Props> = ({delay, onChange, min = 0}) => {
  const [loading, setLoading] = useState<boolean>(false)

  const debounceSave = debounce((e: any) => {
    onChange && onChange(e)
    setLoading(false)
  }, delay || 3000)

  const onSearch = (e: any) => {
    if (e?.toString()?.length >= min) {
      setLoading(true)
      debounceSave(e)
    }
  }
  return (
    <>
      <KTSVG
        path='/media/icons/duotone/General/Search.svg'
        className='svg-icon-3 position-absolute ms-3'
      />

      <input
        type='text'
        id='kt_filter_search'
        className={configClass?.form}
        placeholder='Search'
        onChange={({target: {value}}: any) => {
          onSearch(value || '')
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
