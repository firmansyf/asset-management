import {IMG} from '@helpers'
import {FC} from 'react'

const ErrorBoundaryPage: FC<any> = ({error, reset}) => {
  const goBack: any = () => {
    window.history.back()
    setTimeout(() => reset(), 300)
  }

  const reload: any = () => {
    window.location.reload()
  }

  const goToHome: any = () => {
    window.location.href = '/'
  }

  return (
    <div className='d-flex align-items-center justify-content-center h-100'>
      <div className='text-center'>
        <IMG path={'/media/svg/others/nodata.svg'} className='h-250px' style={{opacity: 0.25}} />
        {error?.message && (
          <div
            className='rounded bg-light-danger text-danger p-3 fw-bold mx-auto mb-5'
            style={{maxWidth: '75vw'}}
          >
            <p className='m-0 text-truncate-3'>{error?.message}</p>
          </div>
        )}
        <div className='fs-3s fw-lighter mb-7'>
          <span className='fw-bolder'>Sorry!!, </span> The page you are looking for could not be
          found or under mantenance.
        </div>
        <div className='text-center'>
          <div className='btn btn-sm btn-light btn-flex text-dark me-3' onClick={goBack}>
            <i className='las la-angle-left' /> Back
          </div>
          <div className='btn btn-sm btn-light btn-flex text-dark me-3' onClick={reload}>
            <i className='las la-sync' /> Reload
          </div>
          <div className='btn btn-sm btn-primary btn-flex' onClick={goToHome}>
            <i className='las la-home' />
            Home
          </div>
        </div>
      </div>
    </div>
  )
}

export {ErrorBoundaryPage}
