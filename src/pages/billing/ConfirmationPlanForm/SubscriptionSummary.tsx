import qs from 'qs'
import {FC, memo, useEffect, useState} from 'react'
import {Button} from 'react-bootstrap'
import {useLocation, useNavigate} from 'react-router-dom'

let SubscriptionSummary: FC<any> = ({loading, plan}) => {
  const location = useLocation()
  const {search} = location || {}
  const navigate = useNavigate()
  const params: any = qs.parse(search.substring(1))
  const [top, setTop] = useState<number>(0)

  useEffect(() => {
    const headerHeight: any = document.getElementById('kt_header')?.offsetHeight || 0
    const htoolbarHeight: any = document.getElementById('kt_toolbar')?.offsetHeight || 0
    const kt_content: any = document.getElementById('kt_content')
    let contentPadding: any = 0
    if (kt_content) {
      contentPadding = parseInt(
        window?.getComputedStyle(kt_content)?.getPropertyValue('padding-top')
      )
    }
    setTop(headerHeight + htoolbarHeight + contentPadding)
  }, [])

  return (
    <div className='sticky-top' style={{top, zIndex: 99}}>
      <div className='card shadow-sm mb-5'>
        <div className='card-header p-5' style={{minHeight: 0}}>
          <div className='fw-bolder text-primary'>
            <i className='fa fa-info-circle fa-lg text-primary me-2' />
            Subcription Summary
          </div>
        </div>
        <div className='card-body px-5 py-3'>
          <div className='row'>
            <div className='col-12'>
              <table className='table'>
                <tbody>
                  <tr>
                    <td className='fw-bold fs-7 text-gray-700'>
                      <i className='las la-file-invoice-dollar text-dark fs-3 me-2' />
                      Package Name
                    </td>
                    <td className='fw-boldest text-end'>
                      {params?.package || plan?.name || 'Standard'}
                    </td>
                  </tr>
                  <tr>
                    <td className='fw-bold fs-7 text-gray-700'>
                      <i className='las la-donate text-dark fs-3 me-2' />
                      Payment Cycle
                    </td>
                    <td className='fw-boldest text-end'>
                      {params?.PaymentCycle || plan?.billing_cycle || 'Monthly'}
                    </td>
                  </tr>
                  <tr>
                    <td className='fw-bold fs-7 text-gray-700'>
                      <i className='las la-balance-scale text-dark fs-2 me-2' />
                      Total Assets
                    </td>
                    <td className='fw-boldest text-end'>
                      {params?.totalAsset || plan?.limit_asset || 500}
                    </td>
                  </tr>
                  <tr>
                    <td className='fw-bold fs-7 text-gray-700'>
                      <i className='las la-money-bill-wave text-dark fs-2 me-2' />
                      Price
                    </td>
                    <td className='fw-boldest text-end'>
                      {params?.currency || plan?.currency || 'USD'}{' '}
                      {params?.price || plan?.price || '24.99'}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className='card-footer p-5'>
          <div className='text-gray-700 px-5 text-center'>
            You are agree to our{' '}
            <a href='https://assetdata.io/term-of-use/' target='_blank' rel='noreferrer'>
              T&C
            </a>{' '}
            and{' '}
            <a href='https://assetdata.io/privacy-policy/' target='_blank' rel='noreferrer'>
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
      {/*<div className='text-gray-700 mb-5 px-5 text-center'>
        By proceeding with payment. You are agree to our <u className='text-primary fw-bold cursor-pointer'>T&C</u> and <u className='text-primary fw-bold cursor-pointer'>Privacy Policy</u>
      </div>*/}
      <div className='card shadow-sm bg-primary'>
        <div className='card-body p-5'>
          <div className='row'>
            <div className='col-md-auto col-lg-6'>
              <div
                onClick={() => navigate(-1)}
                className='btn btn-block w-100 btn-sm btn-transparent text-white fw-bolder'
              >
                {' '}
                Cancel{' '}
              </div>
            </div>
            <div className='col-md col-lg-6'>
              <Button
                disabled={loading}
                className='btn btn-block w-100 btn-sm btn-primary pe-2 text-nowrap radius-50'
                type='submit'
                data-cy='saveBilling'
                style={{background: 'rgba(255,255,255,.35)'}}
                variant='primary'
              >
                {!loading && (
                  <>
                    <span className='indicator-label'>Save</span>
                    <i className='ms-2 las la-arrow-right' />
                  </>
                )}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

SubscriptionSummary = memo(
  SubscriptionSummary,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {SubscriptionSummary}
