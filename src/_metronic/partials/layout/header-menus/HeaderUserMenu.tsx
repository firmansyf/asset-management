import {logout} from '@api/AuthCRUD'
import {hasPermission, toAbsoluteUrl} from '@helpers'
import {logout as dispatchLogout} from '@redux'
import {FC} from 'react'
import {shallowEqual, useSelector} from 'react-redux'
import {Link, useNavigate} from 'react-router-dom'

const HeaderUserMenu: FC = () => {
  const navigate: any = useNavigate()
  const {currentUser: userStore, token} = useSelector(
    ({currentUser, token}: any) => ({currentUser, token}),
    shallowEqual
  )
  const {photos, first_name, last_name, email, roles}: any = userStore || {}
  const onLogout = (e: any) => {
    e.preventDefault()
    logout()
    dispatchLogout()
  }

  return (
    <div
      className='menu menu-sub menu-sub-dropdown menu-column menu-rounded menu-gray-600 menu-state-bg menu-state-primary fw-bold py-4 fs-6 w-275px'
      id='profile-menu'
      data-kt-menu='true'
      style={{
        border: '5px solid #fff',
        borderRadius: '20px',
        background: '#050990',
      }}
    >
      {hasPermission('profile.view') && (
        <div className='center'>
          <div className='row col-12 mt-n1 ms-0'>
            <div className='col-6 d-flex justify-content-start'>
              <div className='ms-5'>
                <button
                  type='button'
                  className='btn btn-clean btn-sm btn-icon btn-icon-sm'
                  data-dismiss='modal'
                  onClick={() => {
                    const element: any = document.getElementById('profile-menu')
                    element.classList.remove('show')
                  }}
                >
                  <i
                    className='las la-angle-left'
                    style={{
                      float: 'right',
                      fontSize: '14px',
                      marginTop: '-1px',
                      color: '#FFF',
                    }}
                  ></i>
                  <span className='text-light font-size-h4 ms-2 mt-0'>Back</span>
                </button>
              </div>
            </div>
            <div className='col-6 d-flex justify-content-end'>
              <button
                type='button'
                className='btn btn-clean btn-sm btn-icon btn-icon-md'
                data-dismiss='modal'
                onClick={() => {
                  const element: any = document.getElementById('profile-menu')
                  element.classList.remove('show')
                  navigate('/profile')
                }}
              >
                <i
                  className='fas fa-camera'
                  style={{
                    float: 'right',
                    fontSize: '22px',
                    marginTop: '-1px',
                    color: '#FFF',
                  }}
                ></i>
              </button>
            </div>
          </div>

          <div className='d-flex justify-content-center'>
            <img
              src={
                photos?.length > 0
                  ? `${photos?.[0]?.url}?token=${token}`
                  : toAbsoluteUrl('/images/no-image-profile-blue.png')
              }
              alt='Profile'
              style={{
                margin: '5px 15px 10px',
                objectFit: 'unset',
                objectPosition: 'center top',
                height: '105px',
                width: '105px',
                borderRadius: '100%',
                background: '#fff',
                border: '3px solid #fff',
              }}
            />
          </div>

          <div>
            <div
              style={{
                color: '#fff',
                fontWeight: 'lighter',
                fontSize: '16px',
                textAlign: 'center',
              }}
            >
              {`${first_name} ${last_name}`}
            </div>
            <div
              style={{
                color: '#fff',
                fontWeight: 'lighter',
                fontSize: '12px',
                textAlign: 'center',
              }}
            >
              {`${email}`}
            </div>
            <div
              style={{
                color: '#fff',
                fontWeight: 'lighter',
                fontSize: '12px',
                textAlign: 'center',
              }}
            >
              {`${roles?.[0]?.label}`}
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          border: '5px solid #fff',
          borderRadius: '15px',
          background: '#fff',
          marginTop: '10px',
          marginBottom: '-15px',
        }}
      >
        <div className='px-5'>
          <Link to={'/profile'}>
            <div className='text-hover-primary px-5 pt-2 pb-2 d-flex flex-row'>
              <i
                className='las la-edit'
                style={{
                  color: '#000',
                  fontSize: '35px',
                  marginLeft: '-20px',
                  marginRight: '5px',
                }}
              ></i>
              <span className='text-hover-primary pt-3' style={{color: '#000', fontSize: '12px'}}>
                Edit Profile
              </span>
            </div>
          </Link>

          <Link to={'/profile/sessions'}>
            <div className='text-hover-primary px-5 pt-2 pb-2 d-flex flex-row'>
              <div>
                <i
                  className='las la-sign-in-alt'
                  style={{
                    color: '#000',
                    fontSize: '35px',
                    marginLeft: '-20px',
                    marginRight: '5px',
                  }}
                ></i>
              </div>
              <div className='text-hover-primary pt-3' style={{color: '#000', fontSize: '12px'}}>
                Login Sessions
              </div>
            </div>
          </Link>

          <div onClick={onLogout} className='text-hover-primary px-5 pt-2 pb-2 d-flex flex-row'>
            <div>
              <i
                className='las la-sign-out-alt'
                style={{
                  color: '#000',
                  fontSize: '35px',
                  marginLeft: '-20px',
                  marginRight: '5px',
                }}
              ></i>
            </div>
            <div
              className='text-hover-primary pt-3'
              style={{color: '#000', fontSize: '12px', cursor: 'pointer'}}
            >
              Sign Out
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export {HeaderUserMenu}
