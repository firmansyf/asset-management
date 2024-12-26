import {resendActivation} from '@api/UserCRUD'
import {ToastMessage} from '@components/toast-message'
import {generateUrlServer, toAbsoluteUrl} from '@helpers'
import {FC} from 'react'
import {useIntl} from 'react-intl'

const ExpiredRegister: FC = () => {
  const intl: any = useIntl()
  const handleClick = (e: any) => {
    e.preventDefault()

    const fullUri: any = window.location.host
    const subdomain: any = fullUri?.split('.')?.[0]
    const params: any = {
      return_ok_url: generateUrlServer('set-password'),
      return_fail_url: generateUrlServer('fail-url'),
    }

    resendActivation(subdomain, params)
      .then(() => '')
      .catch((err: any) => {
        ToastMessage({type: 'error', message: err?.response?.data?.message})
      })
  }

  return (
    <div
      className='d-flex flex-column flex-column-fluid bgi-position-x-center bgi-no-repeat bgi-size-contain bgi-attachment-fixed'
      style={{
        // backgroundImage: 'url(/media/patterns/bg-blue-ui.png)',
        // backgroundColor: '#00048f',
        height: '100vh',
        backgroundRepeat: 'repeat',
      }}
    >
      <div className='d-flex flex-center flex-column flex-column-fluid p-10 pb-lg-20'>
        {/* begin::Logo */}
        {/* <a href='#' className='mb-8'>
          <img
            alt='Logo'
            src={toAbsoluteUrl('/media/logos/logo-assetdata.png')}
            className='h-60px'
            style={{
              filter: 'brightness(0) invert(1)',
            }}
          />
        </a> */}
        {/* end::Logo */}
        <div
          className='d-flex flex-column justify-content-center align-items-center rounded bg-white'
          style={{width: '45rem', height: '35vh'}}
        >
          <div className='icon' style={{marginBottom: '10px', position: 'relative'}}>
            <img
              alt='Logo'
              src={toAbsoluteUrl('/images/warning-icon.svg')}
              className='h-100px'
              style={{zIndex: 2}}
            />
          </div>
          <div
            className=''
            style={{
              paddingTop: '5px',
              marginBottom: '20px',
              width: '37rem',
              textAlign: 'center',
            }}
          >
            <h1 className='text-uppercase' style={{fontSize: '34px'}}>
              {intl.formatMessage({id: 'THIS_LINK_HAS_EXPIRED'})}
            </h1>
            <p style={{color: '#000'}}>
              {intl.formatMessage({id: 'PLEASE_CLICK'})}
              <a
                href='about:blank'
                className='link-primary fs-6 fw-bolder'
                style={{marginLeft: '5px'}}
                onClick={handleClick}
              >
                {intl.formatMessage({id: 'HERE'})}
              </a>
              {intl.formatMessage({id: 'AND_WE_LL_SEND_ANOTHER_VERIFICATION_LINK'})}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export {ExpiredRegister}
