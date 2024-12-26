import {configClass} from '@helpers'
import {FC, useEffect, useState} from 'react'

const Index: FC<any> = ({defaultValue, action, onChange}) => {
  const [subject, setSubject] = useState<string>(defaultValue?.subject)
  const [body, setBody] = useState<string>(defaultValue?.body)
  useEffect(() => {
    onChange({type: action?.value, value: {subject: subject, body: body}})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const changeValue = () => {
    onChange({type: action?.value, value: {subject: subject, body: body}})
  }
  return (
    <div className='mt-3'>
      <label htmlFor='name' className={`${configClass?.label} ms-1`}>
        Subject :
      </label>
      <input
        name='subject'
        className={configClass?.form}
        defaultValue={defaultValue?.subject}
        placeholder='Enter Subject Here'
        onChange={({target: {value}}: any) => {
          setSubject(value || '')
          changeValue()
        }}
      />
      <label htmlFor='name' className={`${configClass?.label} mt-5 ms-1`}>
        Body :
      </label>
      <textarea
        name='body'
        className={configClass?.form}
        defaultValue={defaultValue?.body}
        onChange={({target: {value}}: any) => {
          setBody(value || '')
          changeValue()
        }}
      />
    </div>
  )
}

export default Index
