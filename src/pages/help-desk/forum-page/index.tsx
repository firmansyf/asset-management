/* eslint-disable react-hooks/exhaustive-deps */
import Tooltip from '@components/alert/tooltip'
import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import cx from 'classnames'
import {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'
import {Outlet, useLocation, useNavigate} from 'react-router-dom'

import {AddEditForum} from './AddEditForum'
import {AllForums} from './all-forums/AllForums'
import {getForumDisscussion} from './service'
import {YourForum} from './your-forum/YourForum'

const IndexForum: FC = () => {
  const intl: any = useIntl()
  const location: any = useLocation()
  const navigate: any = useNavigate()

  const [tab, setTab] = useState<any>('all-forum')
  const [showModaladd, setShowModalAdd] = useState<boolean>(false)
  const [detail, setDetail] = useState<any>()
  const [data, setData] = useState<any>([])
  const [reload, setReload] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)

  const isYourForum: boolean = tab === 'your-forum'
  const currentUser: any = useSelector(({currentUser}: any) => currentUser, shallowEqual)
  const {guid} = currentUser || {}

  useEffect(() => {
    setLoading(true)
    const filters: any = {}
    isYourForum && (filters[`filter[user_guid]`] = guid || '')
    getForumDisscussion({...filters})
      .then(({data: {data: res}}) => {
        setData(res)
        setDetail(res)
        setTimeout(() => {
          setLoading(false)
        }, 1000)
      })
      .catch(() => '')
      .finally(() => {
        setLoading(false)
      })
  }, [isYourForum, reload])

  const onClickYourForum = () => {
    navigate({...location, hash: isYourForum ? 'all-forum' : 'your-forum'}, {replace: true})
    const thisTab: any = tab
    setTab(thisTab)
  }

  useEffect(() => {
    setTab(location.hash ? location.hash.split('#')[1] : 'all-forum')
  }, [location.hash])

  const elProps: any = {
    className: 'overflow-auto',
    style: {minHeight: '10vh', maxHeight: '60vh', marginBottom: '3.75rem'},
  }

  useEffect(() => {
    setTimeout(() => ToastMessage({type: 'clear'}), 3500)
  }, [])

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'FORUM.PAGE'})}</PageTitle>
      <div className='row'>
        <div className='col-md-12 position-relative'>
          <div className='card border border-gray-300'>
            <div className='card-body align-items-center p-0'>
              <div className='row m-0'>
                <div className='col-lg-4 p-0'>
                  <div className='d-flex align-items-center justify-content-end py-3 border-bottom border-bottom-2'>
                    <div
                      className={cx(
                        'btn btn-sm radius-5 p-2 me-2',
                        isYourForum ? 'bg-primary text-white' : 'bg-light-primary text-primary'
                      )}
                      onClick={onClickYourForum}
                    >
                      <span className='btn btn-icon w-20px h-20px btn-primary rounded-circle'>
                        <i className='las la-user-alt text-white' />
                      </span>
                      <span className='px-2'>Your Forum</span>
                    </div>
                    <Tooltip placement='top' title='Add Forum'>
                      <div
                        className='btn btn-icon w-30px h-30px btn-primary radius-5'
                        onClick={() => setShowModalAdd(true)}
                      >
                        <i className='fas fa-plus fs-5' />
                      </div>
                    </Tooltip>
                  </div>
                  {loading ? (
                    <div className='border-end' style={{height: 'calc(100% - 55px)'}}>
                      <PageLoader />
                    </div>
                  ) : (
                    <div className='border-end' style={{height: 'calc(100% - 55px)'}}>
                      {isYourForum ? (
                        <YourForum data={data} {...elProps} />
                      ) : (
                        <AllForums data={data} {...elProps} />
                      )}
                    </div>
                  )}
                </div>
                <div className='col-lg-8 p-0 position-relative'>
                  <Outlet
                    context={{
                      style: elProps?.style,
                      setReloadParent: () => setReload(!reload),
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <AddEditForum
        reload={reload}
        setReload={setReload}
        detailForum={detail}
        showModal={showModaladd}
        setShowModal={setShowModalAdd}
      />
    </>
  )
}

export default IndexForum
