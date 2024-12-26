import {CheckBox} from '@components/form/checkbox'
import {InputTags} from '@components/form/tags'
import {configClass} from '@helpers'
import {FC, memo, useState} from 'react'

let EmailField: FC<any> = ({setFieldValue}) => {
  const [emails, setEmails] = useState([])
  const [isSendEmail, setIsSendEmail] = useState(true)
  return (
    <div className='col-md-12 mb-3'>
      <CheckBox
        name='sendEmail'
        className='mb-2'
        col='12'
        options={[{value: 'email', label: 'Send Email', checked: isSendEmail}]}
        onChange={(e: any) => {
          setIsSendEmail(!!e?.length)
          setFieldValue('emails', e?.length ? emails : [])
        }}
      />
      {isSendEmail && (
        <InputTags
          type='email'
          placeholder='Enter Email'
          className={`ps-2 ${configClass?.form}`}
          tag={emails}
          onChange={(e: any) => {
            setEmails(e)
            setFieldValue('emails', e)
          }}
        />
      )}
    </div>
  )
}

EmailField = memo(
  EmailField,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default EmailField
