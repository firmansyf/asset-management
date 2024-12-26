import {Select} from '@components/select/ajax'
import {
  getAlertTeam as getTeam,
  getDetailAlertTeam as getDetailTeam,
} from '@pages/setup/alert/team/Service'
import {FC, useEffect, useState} from 'react'
const Index: FC<any> = ({defaultValue, action, onChange}) => {
  const [defaultTeam, setDefaultTeam] = useState<any>({})
  useEffect(() => {
    if (defaultValue) {
      getDetailTeam(defaultValue).then(({data: {data: res}}: any) => {
        setDefaultTeam({value: res?.guid, label: res?.name})
      })
    }
  }, [defaultValue])

  return (
    <div className='mt-3'>
      <Select
        sm={true}
        className='col p-0'
        name='user'
        api={getTeam}
        params={false}
        reload={false}
        isClearable={false}
        placeholder='Choose Team'
        defaultValue={defaultTeam}
        onChange={({value}: any) => {
          onChange({type: action?.value, value})
        }}
        parse={({guid, name}: any) => ({value: guid, label: name})}
      />
    </div>
  )
}

export default Index
