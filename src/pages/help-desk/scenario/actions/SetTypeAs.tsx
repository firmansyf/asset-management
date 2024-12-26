import {Select} from '@components/select/ajax'
import {getListType} from '@pages/help-desk/ticket/Service'
import {FC, useEffect, useState} from 'react'
const Index: FC<any> = ({action, defaultValue, onChange}) => {
  const [defaultPriority, setDefaultPriority] = useState<any>({})
  useEffect(() => {
    if (defaultValue) {
      getListType({}).then(({data: {data}}: any) => {
        const defaultVal: any = data
          ?.map(({guid: value, name: label}: any) => ({value, label}))
          ?.find(({value}: any) => value === defaultValue)
        setDefaultPriority(defaultVal || {})
      })
      setDefaultPriority({})
    }
  }, [defaultValue])

  return (
    <div className='mt-3'>
      <Select
        sm={true}
        className='col p-0'
        name='user'
        api={getListType}
        params={false}
        reload={false}
        isClearable={false}
        placeholder='Choose Type'
        defaultValue={defaultPriority}
        onChange={({value}: any) => {
          onChange({type: action?.value, value: value})
        }}
        parse={({guid, name}: any) => ({value: guid, label: name})}
      />
    </div>
  )
}

export default Index
