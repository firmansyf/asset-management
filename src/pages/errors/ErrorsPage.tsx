import {toAbsoluteUrl} from '@helpers'
import {FC} from 'react'
import {Outlet, useNavigate} from 'react-router-dom'

const ErrorsPage: FC<any> = () => {
  const navigate = useNavigate()
  const redirectToDashboard = () => {
    navigate('/')
  }

  return (
    <div className='d-flex flex-column flex-root'>
      <div
        className='d-flex flex-column flex-column-fluid bgi-position-y-bottom position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed'
        style={{backgroundImage: `url('${toAbsoluteUrl('/media/illustrations/progress-hd.png')}')`}}
      >
        <div className='d-flex flex-column flex-column-fluid text-center p-10 py-lg-20'>
          <a href='/dashboard' className='mb-10 pt-lg-20'>
            <img
              alt='Logo'
              src={toAbsoluteUrl('/media/logos/logo-assetdata.png')}
              className='h-50px mb-5'
            />
          </a>
          <div className='pt-lg-10'>
            <Outlet />

            <div className='text-center'>
              <a onClick={redirectToDashboard} className='btn btn-lg btn-primary fw-bolder'>
                Go to homepage
              </a>
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

export {ErrorsPage}
