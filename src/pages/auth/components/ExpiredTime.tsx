import {toAbsoluteUrl} from '@helpers'
import {FC} from 'react'
import {useNavigate} from 'react-router-dom'

const ExpiredTime: FC = () => {
  const navigate: any = useNavigate()
  const redirectToDashboard = () => {
    navigate('/')
  }

  return (
    <div
      className='d-flex flex-column flex-column-fluid bgi-position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed'
      style={{
        backgroundImage: 'url(/media/patterns/bg-blue-ui.png)',
        backgroundColor: '#00048f',
        height: '100vh',
        backgroundRepeat: 'repeat',
      }}
    >
      <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'>
        {/* begin::Logo */}
        <a href='#' className='mb-8'>
          <img
            alt='Logo'
            src={toAbsoluteUrl('/media/logos/logo-assetdata.png')}
            className='h-60px'
            style={{
              filter: 'brightness(0) invert(1)',
            }}
          />
        </a>
        {/* end::Logo */}
        <div
          className='d-flex flex-column justify-content-center align-items-center rounded shadow-sm bg-white'
          style={{width: '45rem', height: '35vh'}}
        >
          <div className='icon' style={{marginBottom: '10px', position: 'relative'}}>
            <img
              alt='Logo'
              src={toAbsoluteUrl('/media/icons/duotone/Code/warning.png')}
              className='h-100px'
              style={{zIndex: 2}}
            />
          </div>
          <div
            className=''
            style={{
              // backgroundColor: '#eee',
              paddingTop: '5px',
              marginBottom: '20px',
              width: '37rem',
              textAlign: 'center',
            }}
          >
            <p style={{color: '#000'}}>
              Your request to delete your account has already expired. Please login and make a new
              request
            </p>
            <div className='text-center mt-8'>
              <a onClick={redirectToDashboard} className='btn btn-sm btn-primary fw-bolder'>
                Login
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export {ExpiredTime}
