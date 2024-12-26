import {configClass} from '@helpers'
import {FC} from 'react'
const Index: FC<any> = ({defaultValue, action, onChange}) => {
  return (
    <div className='mt-3'>
      <textarea
        className={configClass?.form}
        defaultValue={defaultValue}
        onChange={({target: {value}}: any) => {
          onChange({type: action?.value, value})
        }}
      />
    </div>
  )
}

export default Index
