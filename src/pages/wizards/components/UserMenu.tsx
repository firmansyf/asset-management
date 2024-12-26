import {logout} from '@api/AuthCRUD'
import {hasPermission, toAbsoluteUrl} from '@helpers'
import {logout as logoutAction} from '@redux'
import {FC} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {shallowEqual, useSelector} from 'react-redux'

const UserMenu: FC = () => {
  const {currentUser: userStore, token}: any = useSelector(
    ({currentUser, token}: any) => ({currentUser, token}),
    shallowEqual
  )
  const {photos, first_name, last_name, email}: any = userStore || {}

  const onLogout = (e: any) => {
    e.preventDefault()

    logout()
    logoutAction()
  }

  const PermissionView: any = hasPermission('profile.view') || false

  return (
    <div className='position-absolute end-0 top-0' style={{zIndex: 12}}>
      <Dropdown className='px-5'>
        <Dropdown.Toggle
          size='sm'
          id='dropdown-basic'
          variant='transparent'
          className='px-0 pt-5 pb-0'
        >
          <div className='h-50px w-50px radius-5 p-1'>
            <div
              className='w-100 h-100 radius-5'
              style={{
                background: `#fff url(${
                  photos?.length > 0
                    ? `${photos?.[0]?.url || ''}?token=${token || ''}`
                    : toAbsoluteUrl('/images/no-image-profile-blue.png')
                }) center / cover no-repeat`,
              }}
            />
          </div>
        </Dropdown.Toggle>
        <Dropdown.Menu className='p-0 radius-10 overflow-hidden'>
          {PermissionView && (
            <>
              <img
                src={
                  photos?.length > 0
                    ? `${photos?.[0]?.url || ''}?token=${token || ''}`
                    : toAbsoluteUrl('/images/no-image-profile-blue.png')
                }
                className=''
                alt='Profile'
                data-cy='profile-img'
                style={{
                  margin: '15px 15px 10px',
                  padding: '2px',
                  objectFit: 'contain',
                  objectPosition: 'top',
                  height: '150px !important',
                  border: '1px solid #e3e6ef',
                  borderRadius: 'px',
                  width: '250px',
                }}
              />

              <span
                data-cy='profile-name'
                style={{
                  color: '#000',
                  fontWeight: 600,
                  marginLeft: '15px',
                  fontSize: '13px',
                }}
              >
                {`${first_name || ''} ${last_name || ''}`}
              </span>
              <br />

              <span
                data-cy='profile-email'
                style={{
                  color: '#000',
                  marginLeft: '15px',
                  fontSize: '12px',
                }}
              >
                {`${email || ''}`}
              </span>
              <div className='separator my-2'></div>
            </>
          )}

          <div className='menu-item px-5 mb-5'>
            <span onClick={onLogout} className='menu-link px-5 p-0'>
              <i
                className='las la-sign-out-alt'
                style={{
                  color: '#000',
                  fontSize: '26px',
                  marginLeft: '-20px',
                  marginRight: '5px',
                }}
              ></i>
              <span
                style={{
                  color: '#000',
                  fontWeight: '500',
                  marginRight: '5px',
                }}
              >
                Sign Out
              </span>
            </span>
          </div>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  )
}
export default UserMenu
