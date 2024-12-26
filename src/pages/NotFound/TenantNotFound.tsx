import {toAbsoluteUrl} from '@helpers'
import {Link} from 'react-router-dom'

const TenantNotFound = () => {
  return (
    <div
      className='d-flex flex-column flex-column-fluid bgi-position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed'
      style={{
        backgroundImage: 'url(/media/patterns/bg-blue-ui.png)',
        backgroundColor: '#00048f',
        backgroundRepeat: 'repeat',
      }}
    >
      <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'>
        <a href='#logo' className='mb-12'>
          <img
            alt='Logo'
            src={toAbsoluteUrl('/media/logos/assetdataV1.png')}
            className='h-45px'
            style={{
              filter: 'brightness(0) invert(1)',
            }}
          />
        </a>
        <div className='w-lg-500px bg-white rounded shadow-sm p-10 p-lg-8 mx-auto'>
          <div className='alert alert-secondary' role='alert'>
            <p className='text-center'>
              The Account You are trying to access does not exist.
              <br />
              Please click below to register
            </p>
          </div>
          <div className='w-100 d-flex'>
            <Link className='btn btn-primary w-100' to='/register'>
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TenantNotFound
