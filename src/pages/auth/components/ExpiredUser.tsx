import {toAbsoluteUrl} from '@helpers'
import {FC} from 'react'
import {useIntl} from 'react-intl'

const ExpiredUser: FC = () => {
  const intl = useIntl()
  return (
    <div className='section' style={{textAlign: 'center'}}>
      <div className='icon' style={{marginBottom: '10px', position: 'relative'}}>
        <img
          alt='Logo'
          src={toAbsoluteUrl('/media/icons/duotone/Code/Warning-2.svg')}
          className='h-100px'
          style={{zIndex: 2}}
        />
      </div>
      <div
        className='d-flex flex-center'
        style={{
          backgroundColor: '#eee',
          paddingTop: '5px',
          marginBottom: '20px',
        }}
      >
        <p style={{color: '#000'}} className='description-text'>
          {intl.formatMessage({id: 'THE_LINK_HAS_EXPIRED'})}
          <br />
          {intl.formatMessage({id: 'YOU_MAY_CONTACT_YOUR_ADMIN_TO_RESEND_THE_INVITATION'})}
        </p>
      </div>
    </div>
  )
}

export {ExpiredUser}
