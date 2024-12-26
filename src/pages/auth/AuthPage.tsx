import {toAbsoluteUrl} from '@helpers'
import {Outlet} from 'react-router-dom'

export function AuthPage() {
  // useEffect(() => { document.body.classList.add('bg-white') return () => { document.body.classList.remove('bg-white') } }, [])

  return (
    <div
      className='d-flex flex-column flex-column-fluid bgi-position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed'
      style={{
        backgroundImage: 'url(/media/patterns/bg-blue-ui.png)',
        backgroundColor: '#00048f',
        backgroundRepeat: 'repeat',
      }}
    >
      {/* begin::Content */}
      {/* flex-center flex-column-fluid p-10 pb-lg-20 */}
      <div className='d-flex flex-column m-auto'>
        {/* begin::Logo */}
        <a href='##' className='text-center mb-5'>
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
        {/* begin::Wrapper */}
        <Outlet />
        {/* end::Wrapper */}
      </div>
      {/* end::Content */}
    </div>
  )
}
