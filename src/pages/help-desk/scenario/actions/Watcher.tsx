import {getUserDetail, getUserV1} from '@api/UserCRUD'
import {Select} from '@components/select/ajax'
import {FC, memo, useEffect, useState} from 'react'

let Index: FC<any> = ({defaultValue, action, onChange}) => {
  const [defaultUser, setDefaultUser] = useState<any>({})

  useEffect(() => {
    if (defaultValue) {
      getUserDetail(defaultValue).then(({data: {data: res}}: any) => {
        setDefaultUser({value: res?.guid, label: `${res?.first_name} ${res?.last_name}`})
      })
    }
  }, [defaultValue])

  return (
    <div className='mt-3'>
      <Select
        sm={true}
        api={getUserV1}
        name='user'
        params={false}
        reload={false}
        className='col p-0'
        isClearable={false}
        placeholder='Choose User'
        defaultValue={defaultUser}
        onChange={({value}: any) => onChange({type: action?.value, value})}
        parse={({guid, first_name, last_name}: any) => ({
          value: guid,
          label: `${first_name} ${last_name}`,
        })}
      />
    </div>
  )
}

Index = memo(Index, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default Index
