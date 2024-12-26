/* eslint-disable react-hooks/exhaustive-deps */
import './custom.scss'

import {ToastMessage} from '@components/toast-message'
import {toAbsoluteUrl} from '@helpers'
import {HeaderUserMenu} from '@metronic/partials'
import {getCustomize, notificationCount, postCustomize} from '@pages/help-desk/customize/Service'
import clsx from 'clsx'
import {find, sumBy} from 'lodash'
import {FC, useEffect, useState} from 'react'
import {Dropdown} from 'react-bootstrap'
import Form from 'react-bootstrap/Form'
import {shallowEqual, useSelector} from 'react-redux'
import {Link, useLocation, useNavigate, useParams} from 'react-router-dom'
// import Select from 'react-select'

const toolbarButtonMarginClass = 'ms-1 ms-lg-3',
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px'

const Topbar: FC = () => {
  const {currentUser: user, token} = useSelector(
    ({currentUser, token}: any) => ({currentUser, token}),
    shallowEqual
  )
  const {photos}: any = user
  const params: any = useParams()
  const location: any = useLocation()
  const navigate: any = useNavigate()
  const pathname: any = location?.pathname || ''

  const [data, setData] = useState<any>({})
  const [notiveValue, setNotiveValue] = useState<any>({})
  const [totalNotive, setTotalNotive] = useState<number>(0)
  const [isSettings, setIsSettings] = useState<boolean>(false)
  const [dataUpdate, setDataUpdate] = useState<any>({})
  const [loadingSetting, setLoadingSetting] = useState<boolean>(false)
  const [activeAlert, setActiveAlert] = useState<boolean>(false)
  const [activeNotivication, setActiveNotivication] = useState<any>([])
  const [reloadNotivication, setReloadNotivication] = useState<number>(0)

  // const [selectFilter, setSelectFilter] = useState<any>({value: '', label: 'Add Assets'})

  useEffect(() => {
    getCustomize({})
      .then(({data: {data: res}}: any) => {
        if (res) {
          setData(res)
          setDataUpdate(res)
          setActiveAlert(find(res, {is_active: 1}) ? true : false)
        }
      })
      .catch(() => {
        setData([])
        setDataUpdate([])
      })
  }, [loadingSetting])

  // useEffect(() => {
  //   if (selectFilter?.value === 'add') {
  //     if (window.location.pathname === '/asset-management/edit') {
  //       navigate('/asset-management/add')
  //       window.location.reload()
  //     } else {
  //       navigate('/asset-management/add')
  //     }
  //   } else if (selectFilter?.value === 'import') {
  //     navigate('/tools/import?type=asset')
  //   } else if (selectFilter?.value === 'request') {
  //     navigate('/asset-management/request-add-asset')
  //   }
  // }, [selectFilter])

  useEffect(() => {
    notificationCount()
      .then(({data: {data: res}}: any) => {
        if (res) {
          const updateResults: any = Object.keys(dataUpdate || {})?.map((key: any) => {
            return {
              module: key,
              count: res?.[key],
              is_active: dataUpdate?.[key]?.is_active,
            }
          })
          setNotiveValue(res)
          setActiveNotivication(updateResults)
        }
      })
      .catch(() => '')
  }, [params, dataUpdate])

  useEffect(() => {
    const totalCount: any = sumBy(activeNotivication, (notive: any) =>
      notive?.is_active === 1 ? notive?.count : 0
    )
    setTotalNotive(totalCount)
  }, [params, reloadNotivication])

  const onClickSetting = () => {
    setIsSettings(!isSettings)
  }

  const onNotifChange = (item: any, value: any) => {
    if (Object.keys(dataUpdate || {})?.length > 0) {
      const updateSettings: any = {}
      Object.keys(dataUpdate || {})?.forEach((row: any) => {
        updateSettings[row] = {
          label: dataUpdate?.[row]?.label || '',
          is_active: row === item ? (value ? 1 : 0) : dataUpdate?.[row]?.is_active,
        }
      })
      setDataUpdate(updateSettings)
      postCustomize({modules: updateSettings})
        .then(() => {
          setLoadingSetting(false)
          setTimeout(() => setReloadNotivication(reloadNotivication + 1), 1000)
        })
        .catch(({response}: any) => {
          setLoadingSetting(false)
          const {message} = response?.data || {}
          ToastMessage({type: 'error', message})
        })
    }
  }

  // const optionsDataFilter: any = [
  //   {value: 'add', label: 'Add Asset'},
  //   {value: 'import', label: 'Import Assets'},
  //   {value: 'request', label: 'Request Add Asset'},
  // ]

  return (
    <div className='d-flex align-items-stretch flex-shrink-0'>
      {/* Search */}
      {/* <div className={clsx('d-flex align-items-stretch', toolbarButtonMarginClass)}>
        <Search />
      </div> */}
      {/* Activities */}
      <div className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}>
        {/* begin::Drawer toggle */}
        {/* <div
          className={clsx('btn btn-icon btn-active-light-primary', toolbarButtonHeightClass)}
          id='kt_activities_toggle'
        >
          <KTSVG
            path='/media/icons/duotone/Media/Equalizer.svg'
            className={toolbarButtonIconSizeClass}
          />
        </div> */}
        {/* end::Drawer toggle */}
      </div>
      {/* Quick links */}
      {/* <div className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}> */}
      {/* begin::Menu wrapper */}
      {/* <div
          className={clsx('btn btn-icon btn-active-light-primary', toolbarButtonHeightClass)}
          data-kt-menu-trigger='click'
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
          data-kt-menu-flip='bottom'
        >
          <KTSVG
            path='/media/icons/duotone/Layout/Layout-4-blocks.svg'
            className={toolbarButtonIconSizeClass}
          />
        </div> */}
      {/* <QuickLinks /> */}
      {/* end::Menu wrapper */}
      {/* </div> */}

      {/* CHAT */}
      {/* <div className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}> */}
      {/* begin::Menu wrapper */}
      {/* <div
          className={clsx(
            'btn btn-icon btn-active-light-primary position-relative',
            toolbarButtonHeightClass
          )}
          id='kt_drawer_chat_toggle'
        >
          <KTSVG
            path='/media/icons/duotone/Communication/Group-chat.svg'
            className={toolbarButtonIconSizeClass}
          />

          <span className='bullet bullet-dot bg-success h-6px w-6px position-absolute translate-middle top-0 start-50 animation-blink'></span>
        </div> */}
      {/* end::Menu wrapper */}
      {/* </div> */}

      {/* NOTIFICATIONS */}
      {!(pathname === '/setup/wizard') && (
        <>
          <div className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}>
            {/* <Select
              name='filter'
              value={selectFilter}
              id='filter-dashboard'
              placeholder='Select Filter'
              options={optionsDataFilter}
              getOptionValue={({value}: any) => value}
              onChange={(e: any) => setSelectFilter(e)}
              components={{ClearIndicator, DropdownIndicator}}
              styles={customStyles(true, {
                control: {
                  backgroundColor: '#eeefff',
                  borderColor: '#eeefff',
                  width: '130px',
                },
                singleValue: {color: '#050990'},
                option: {whiteSpace: 'nowrap', activeColor: '#050990'},
              })}
              components={{ClearIndicator, DropdownIndicator}}
              getOptionValue={(option: any) => option?.value}
              onChange={(e: any) => {
                setSelectFilter(e)
              }}
            /> */}
            <Link
              className='btn btn-sm btn-primary me-3'
              to='/asset-management/add'
              data-cy='addAsset'
            >
              + Add Asset
            </Link>
          </div>

          <div className={clsx('d-flex align-items-center')}>
            <Dropdown>
              <Dropdown.Toggle variant='light-light' size='sm'>
                <span onClick={() => setIsSettings(false)}>
                  <i className='fas fa-bell' style={{fontSize: '28px', color: '#050990'}} />
                  {totalNotive > 0 && (
                    <span
                      style={{
                        padding: '1px 6px 1px 6px',
                        borderRadius: '100px',
                        fontSize: '10px',
                        marginLeft: '-20px',
                        marginTop: '-10px',
                        position: 'absolute',
                        color: '#FFF',
                        backgroundColor: 'rgb(251, 33, 64) ',
                      }}
                    >
                      {totalNotive > 99 ? '99+' : totalNotive}
                    </span>
                  )}
                </span>
              </Dropdown.Toggle>
              <Dropdown.Menu className='pb-0'>
                <div className='card' style={{width: '220px'}}>
                  <div
                    className='card-header align-items-center bg-primary px-4 py-3'
                    style={{minHeight: '40px', marginTop: '-6px'}}
                  >
                    {isSettings && (
                      <div className='w-100 d-flex align-items-center justify-content-between'>
                        <div onClick={onClickSetting} className='d-flex flex-center cursor-pointer'>
                          <button
                            type='button'
                            className='btn btn-clean btn-sm btn-icon w-auto me-1 ms-n1'
                          >
                            <i className='las la-angle-left text-white fs-3' />
                          </button>
                          <div className='text-light fw-bold text-uppercase'>Settings</div>
                        </div>
                        {loadingSetting && (
                          <span
                            className='indicator-progress'
                            style={{display: 'block', color: '#FFF', paddingRight: '10px'}}
                          >
                            <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                          </span>
                        )}
                      </div>
                    )}

                    {!isSettings && (
                      <div className='w-100 d-flex align-items-center justify-content-between'>
                        <div className='text-light fw-bold text-uppercase'>Notification</div>
                        <div className='right'>
                          <button
                            type='button'
                            data-dismiss='modal'
                            onClick={onClickSetting}
                            className='btn btn-clean btn-sm btn-icon w-auto'
                          >
                            <i className='las la-cog text-white fs-1' />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {isSettings && (
                    <div className=''>
                      {data &&
                        Object.keys(data || {})?.length > 0 &&
                        Object.keys(data || {})?.map((item: any, index: any) => {
                          return (
                            <div
                              key={index || 0}
                              className='d-flex align-items-center justify-content-between border-bottom px-4 py-2 fw-bold fs-7'
                            >
                              {data?.[item]?.label || ''}
                              <div className='form-check form-check-custom form-switch'>
                                <Form.Check
                                  type='switch'
                                  id='custom-switch'
                                  defaultChecked={data?.[item]?.is_active}
                                  onChange={({target: {checked}}: any) => {
                                    onNotifChange(item, checked)
                                    setLoadingSetting(!loadingSetting)
                                  }}
                                />
                              </div>
                            </div>
                          )
                        })}
                    </div>
                  )}

                  {!isSettings && (
                    <>
                      {activeAlert ? (
                        <div className='min-h-100px'>
                          {data &&
                            Object.keys(data || {})?.length > 0 &&
                            Object.keys(data || {})?.map((item: any, index: any) => {
                              if (data?.[item]?.is_active === 1) {
                                return (
                                  <Dropdown.Item
                                    href='#'
                                    key={index || 0}
                                    onClick={() => navigate(`/notification/${item}`)}
                                    className={`border-bottom border-gray-200 py-3 fs-7 ${
                                      notiveValue?.[item]
                                        ? 'fw-bolder bg-gray-100'
                                        : 'fw-normal bg-white'
                                    }`}
                                  >
                                    {data?.[item]?.label || ''}
                                    {Boolean(notiveValue?.[item]) && (
                                      <div
                                        className='d-flex flex-center bg-danger text-white radius-5 p-2 min-w-20px h-20px'
                                        style={{
                                          float: 'right',
                                        }}
                                      >
                                        {Number(notiveValue?.[item] || 0) > 99
                                          ? '99+'
                                          : notiveValue?.[item] || 0}
                                      </div>
                                    )}
                                  </Dropdown.Item>
                                )
                              } else {
                                return ''
                              }
                            })}
                        </div>
                      ) : (
                        <div
                          className='card-body'
                          style={{
                            paddingTop: '154px',
                            minHeight: '280px',
                            backgroundImage: `url("/media/svg/others/no-data.png")`,
                            backgroundPositionX: 'center',
                            backgroundPositionY: '85px',
                            backgroundSize: '75px',
                            backgroundRepeat: 'no-repeat',
                            opacity: '0.2',
                            textAlign: 'center',
                          }}
                        >
                          No Notifications
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </>
      )}

      {/* begin::User */}
      {/* begin::Toggle */}
      <div
        className={clsx('d-flex align-items-center', toolbarButtonMarginClass)}
        id='kt_header_user_menu_toggle'
      >
        <div
          className={clsx('cursor-pointer symbol', toolbarUserAvatarHeightClass)}
          data-kt-menu-trigger='click'
          data-kt-menu-attach='parent'
          data-kt-menu-placement='bottom-end'
          data-kt-menu-flip='bottom'
        >
          {photos?.length > 0 && (
            <img
              src={`${photos?.[0]?.url || ''}?token=${token || ''}`}
              alt={photos?.[0]?.title || ''}
              style={{
                borderRadius: '100%',
                border: '2px solid #050990',
              }}
            />
          )}

          {!(photos?.length > 0) && (
            <img
              src={toAbsoluteUrl('/images/no-image-profile-wite.png')}
              alt='profile-topbar'
              style={{
                borderRadius: '100%',
                background: '#050990',
                border: '2px solid #050990',
              }}
            />
          )}
        </div>
        <HeaderUserMenu />
      </div>
      {/* end::Toggle */}
      {/* end::User */}

      {/* begin::Aside Toggler */}
      {/* {config.header.left === 'menu' && (
        <div className='d-flex align-items-center d-lg-none ms-2 me-n3' title='Show header menu'>
          <div
            className='btn btn-icon btn-active-light-primary w-30px h-30px w-md-40px h-md-40px'
            id='kt_header_menu_mobile_toggle'
          >
            <KTSVG path='/media/icons/duotone/Text/Toggle-Right.svg' className='svg-icon-1' />
          </div>
        </div>
      )} */}
    </div>
  )
}

export {Topbar}
