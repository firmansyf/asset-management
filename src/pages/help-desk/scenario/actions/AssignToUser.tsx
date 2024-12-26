import {getUserDetail, getUserV1} from '@api/UserCRUD'
import {Select} from '@components/select/ajax'
import {FC, useEffect, useState} from 'react'
const Index: FC<any> = ({defaultValue, action, onChange}) => {
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
        className='col p-0'
        name='user'
        api={getUserV1}
        params={false}
        reload={false}
        isClearable={false}
        placeholder='Choose User'
        defaultValue={defaultUser}
        onChange={({value}: any) => {
          onChange({type: action?.value, value})
        }}
        parse={({guid, first_name, last_name}: any) => ({
          value: guid,
          label: `${first_name} ${last_name}`,
        })}
      />
    </div>
  )
}

export default Index
