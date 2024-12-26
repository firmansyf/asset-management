import {IMG} from '@helpers'
import {FC} from 'react'
import {useNavigate} from 'react-router-dom'

const ErrorPage: FC = () => {
  const navigate = useNavigate()
  return (
    <div className='d-flex align-items-center justify-content-center h-100'>
      <div className='text-center'>
        <IMG path={'/media/svg/others/nodata.svg'} className='h-250px' style={{opacity: 0.25}} />
        <div className='mb-5'>
          Sorry. The page you are looking for could not be found or under mantenance.
        </div>
        <div className='text-center'>
          <div className=''>
            <button
              type='button'
              className='btn btn-flex btn-sm btn-color-primary bg-light-primary ps-3 mx-2'
              onClick={() => navigate(-2)}
            >
              <i className='las la-angle-left fs-5' />
              Back
            </button>
            <button
              type='button'
              className='btn btn-flex btn-primary btn-sm ps-4 mx-2'
              onClick={() => navigate('/dashboard')}
            >
              <i className='las la-home fs-5' />
              Home
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export {ErrorPage}
