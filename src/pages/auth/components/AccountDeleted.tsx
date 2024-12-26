import {toAbsoluteUrl} from '@helpers'
import {useEffect} from 'react'
import {useIntl} from 'react-intl'
import {useNavigate} from 'react-router-dom'

export default function AccountDeleted() {
  const intl = useIntl()
  const navigate = useNavigate()

  useEffect(() => {
    setTimeout(() => navigate('/'), 2000)
  }, [navigate])

  return (
    <div className='d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center  bgi-no-repeat bgi-size-contain bgi-attachment-fixed'>
      <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'>
        {/* Logo */}
        <img alt='Logo' src={toAbsoluteUrl('/media/logos/logo-assetdata.png')} className='h-45px' />
        {/* End Logo */}
        <div
          style={{
            display: 'flex',
            width: '50%',
            height: '120px',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: '15px',
            padding: '10px',
            boxShadow: '0 0 2px 2px  rgba(0, 0, 0, .2)',
            borderRadius: '5px',
            textAlign: 'center',
          }}
        >
          <p className='h1'>
            {intl.formatMessage({id: 'YOUR_ACCOUNT_HAS_BEEN_SUCCESSFULLY_DELETED'})}
          </p>
        </div>
      </div>
    </div>
  )
}
