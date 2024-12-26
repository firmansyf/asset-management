import {toAbsoluteUrl} from '@helpers'
import qs from 'qs'
import {FC} from 'react'
import {createSearchParams, useLocation, useNavigate} from 'react-router-dom'

const PasswordExpiry: FC = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const {token}: any = qs.parse(location?.search, {ignoreQueryPrefix: true}) || {}
  const changePassword = () => {
    navigate({
      pathname: '/auth/change-password',
      search: createSearchParams({token}).toString(),
    })
  }

  return (
    <div className='d-flex flex-column flex-root'>
      <div
        className='d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed'
        style={{backgroundImage: `url('${toAbsoluteUrl('/media/illustrations/progress-hd.png')}')`}}
      >
        <div className='d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center  bgi-no-repeat bgi-size-contain bgi-attachment-fixed'>
          <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'>
            <a href='/dashboard' className='pt-lg-20'>
              <img
                alt='Logo'
                src={toAbsoluteUrl('/media/logos/logo-assetdata.png')}
                className='h-50px'
              />
            </a>
            <div className='text-center mt-20' data-cy='passwordExpiryTriangle'>
              <i className='fas fa-exclamation-triangle fa-6x text-dark'></i>
            </div>
            <div
              style={{
                display: 'flex',
                width: '40%',
                height: '120px',
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: '35px',
                padding: '10px',
                boxShadow: '0 0 2px 2px  rgba(0, 0, 0, .2)',
                borderRadius: '5px',
                textAlign: 'center',
                backgroundColor: '#f1f1f1',
              }}
              data-cy='passwordExpiryText'
            >
              <p style={{fontSize: '16px', color: '#000', fontWeight: 'bolder'}}>
                You password has expired, you must change <br />
                password before log in to your account.
              </p>
            </div>
            <div className='pt-lg-10'>
              <div className='text-center'>
                <button
                  type='button'
                  disabled={!token}
                  onClick={changePassword}
                  className='btn btn-lg btn-primary fw-bolder'
                  data-cy='passwordExpiryChangePassword'
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className='d-flex flex-center flex-column-auto p-10'>
          <div className='d-flex align-items-center fw-bold fs-6'>
            <a href='https://assetdata.io' className='text-muted text-hover-primary px-2'>
              About
            </a>
            <a href='mailto:support@assetdata.io' className='text-muted text-hover-primary px-2'>
              Contact
            </a>
            <a href='https://assetdata.io' className='text-muted text-hover-primary px-2'>
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export {PasswordExpiry}
