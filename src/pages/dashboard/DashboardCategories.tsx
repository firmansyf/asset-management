import {ClearIndicator, customStyles, DropdownIndicator} from '@components/select/config'
import qs from 'qs'
import {FC, useEffect, useState} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {useSearchParams} from 'react-router-dom'
import Select from 'react-select'

const Index: FC<any> = () => {
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {feature} = preferenceStore || {}

  const [dataFilter, setDataFilter] = useState<any>([])
  const [searchParams, setSearchParams] = useSearchParams({value: '', label: 'All Dashboard'})
  const selected: any = qs.parse(searchParams?.toString())

  useEffect(() => {
    if (feature) {
      const array: any = []
      feature.forEach((item: any) => {
        if (item?.unique_name === 'help_desk' && item?.value === 1) {
          array.push(item)
        }
        if (item?.unique_name === 'my_asset' && item?.value === 1) {
          array.push(item)
        }
        if (item?.unique_name === 'maintenance' && item?.value === 1) {
          array.push(item)
        }
        if (item?.unique_name === 'insurance_claim' && item?.value === 1) {
          array.push(item)
        }
      })
      setDataFilter(
        array?.map(({guid, name, unique_name}: any) => ({
          value: guid,
          label: unique_name === 'my_asset' ? 'Asset Management' : name,
        }))
      )
    }
  }, [feature])

  return (
    <Select
      name='filter'
      id='filter-dashboard'
      placeholder='Select Filter'
      defaultValue={{value: '', label: 'All Dashboard'}}
      value={selected}
      options={[{value: '', label: 'All Dashboard'}, ...dataFilter]}
      styles={customStyles(true, {
        control: {backgroundColor: '#eeefff', borderColor: '#eeefff', width: '200px'},
        singleValue: {color: '#050990'},
        option: {whiteSpace: 'nowrap', activeColor: '#050990'},
      })}
      components={{ClearIndicator, DropdownIndicator}}
      getOptionValue={(option: any) => option.value}
      onChange={(e: any) => {
        setSearchParams(e, {replace: true})
      }}
    />
  )
}

export default Index
