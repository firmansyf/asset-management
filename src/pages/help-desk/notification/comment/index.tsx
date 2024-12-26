import {PaginationDatatable} from '@components/datatable/pagination'
import {Search} from '@components/form/searchValue'
import {KTSVG} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import cx from 'classnames'
import {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {useLocation, useNavigate} from 'react-router-dom'

import {getNotification, getUser} from '../Service'

const NotificationComment: FC<any> = () => {
  const intl: any = useIntl()
  const navigate: any = useNavigate()
  const location: any = useLocation()

  const [data, setData] = useState<any>([])
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [tab, setTab] = useState<string>('unread')
  const [keyword, setKeyword] = useState<string>('')
  const [totalPage, setTotalPage] = useState<number>(0)
  const [, setLoading] = useState<boolean>(true) //loading

  const onChangePage = (e: any) => {
    setPage(e)
  }

  const onLimit = (e: any) => {
    setLimit(e)
  }

  useEffect(() => {
    setLoading(true)
    getNotification({
      page,
      limit,
      keyword: `*${keyword || ''}*`,
      'filter[module]': 'comment',
      'filter[is_read]': tab === 'read' ? 1 : tab === 'sent' ? 2 : 0,
    })
      .then(({data: {data: res, meta}}: any) => {
        const {current_page, per_page, total}: any = meta || {}
        setLoading(false)
        setLimit(per_page)
        setTotalPage(total)
        setPage(current_page)

        const resData: any = []
        res &&
          res?.length > 0 &&
          res?.forEach((item: any) => {
            const promise: any = new Promise((resolve, reject) => {
              const {trigger_time, trigger_by, action_data}: any = item || {}

              getUser(trigger_by)
                .then(({data: {data: arr}}: any) => {
                  if (arr) {
                    const {photos, first_name, last_name}: any = arr || {}

                    resolve({
                      original: item,
                      image: photos?.length > 0 ? photos?.[0]?.url : null,
                      name: (first_name || '') + ' ' + (last_name || ''),
                      date: trigger_time || '',
                      text: action_data?.text || '',
                    })
                  }
                })
                .catch((err: any) => reject(err))
            })
            resData.push(promise)
          })

        Promise.all(resData).then((values: any) => {
          setData(values)
        })
      })
      .catch(() => setLoading(false))
  }, [page, limit, keyword, tab])

  useEffect(() => {
    setTab(location.hash ? location.hash.split('#')[1] : 'unread')
  }, [location.hash])

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'HELPDESK.NOTIFICATION.COMMENT'})}
      </PageTitle>
      <div className='card card-custom card-table'>
        <ul className='nav nav-tabs nav-line-tabs nav-line-tabs-2x fs-6 bg-gray-100'>
          <li className='nav-item'>
            <div
              className={cx(
                'm-0 px-5 py-3 cursor-pointer',
                tab === 'unread' && 'bg-primary border-primary text-white fw-bolder'
              )}
              onClick={() => {
                navigate({...location, hash: 'unread'}, {replace: true})
                setTab('unread')
                setKeyword('')
              }}
            >
              Unread
              <div
                className={cx('btn btn-sm', tab === 'unread' ? 'btn-light' : 'btn-primary')}
                style={{
                  padding: '5px 10px',
                  float: 'right',
                  fontSize: '10px',
                  marginTop: '-3px',
                  marginLeft: '10px',
                }}
              >
                0
              </div>
            </div>
          </li>
          <li className='nav-item'>
            <div
              className={cx(
                'm-0 px-5 py-3 cursor-pointer',
                tab === 'read' && 'bg-primary border-primary text-white fw-bolder'
              )}
              onClick={() => {
                navigate({...location, hash: 'read'}, {replace: true})
                setTab('read')
                setKeyword('')
              }}
            >
              Read
              <div
                className={cx('btn btn-sm', tab === 'read' ? 'btn-light' : 'btn-primary')}
                style={{
                  padding: '5px 10px',
                  float: 'right',
                  fontSize: '10px',
                  marginTop: '-3px',
                  marginLeft: '10px',
                }}
              >
                0
              </div>
            </div>
          </li>
          <li className='nav-item'>
            <div
              className={cx(
                'm-0 px-5 py-3 cursor-pointer',
                tab === 'sent' && 'bg-primary border-primary text-white fw-bolder'
              )}
              onClick={() => {
                navigate({...location, hash: 'sent'}, {replace: true})
                setTab('sent')
                setKeyword('')
              }}
            >
              Sent
              <div
                className={cx('btn btn-sm', tab === 'sent' ? 'btn-light' : 'btn-primary')}
                style={{
                  padding: '5px 10px',
                  float: 'right',
                  fontSize: '10px',
                  marginTop: '-3px',
                  marginLeft: '10px',
                }}
              >
                0
              </div>
            </div>
          </li>
        </ul>
        <div className='tab-content'>
          <div
            className={cx('tab-pane fade', {show: tab === 'unread'}, {active: tab === 'unread'})}
          >
            <div className='card-table-header'>
              <div className='d-flex flex-wrap flex-stack'>
                <div className='d-flex align-items-center position-relative me-4 my-1'>
                  <KTSVG
                    path='/media/icons/duotone/General/Search.svg'
                    className='svg-icon-3 position-absolute ms-3'
                  />
                  <Search
                    bg='solid'
                    delay={1500}
                    onChange={(e: any) => setKeyword(e)}
                    value={keyword}
                  />
                </div>
              </div>
            </div>
            <div className='card-body'>
              {data && data?.length > 0 ? (
                data?.map((item: any, index: any) => {
                  return (
                    <div className='card card-custom bg-gray-100 my-5' key={index || 0}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-1'>
                            <img
                              alt=''
                              src={item?.image || ''}
                              style={{
                                width: '100%',
                                border: '1px solid #050990',
                                borderRadius: '3px',
                                padding: '10px',
                                marginTop: '10px',
                              }}
                            />
                          </div>
                          <div className='col-11 mt-3'>
                            <h5>{item?.name || '-'}</h5>
                            <p>{item?.date || '-'}</p>
                            <p>{item?.text || '-'}</p>

                            <button className='btn btn-sm btn-primary me-3'>
                              <i className='las la-reply'></i> Reply
                            </button>
                            <button className='btn btn-sm btn-danger'>
                              <i className='las la-trash'></i> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className='text-center w-100'>
                  <div className='mb-2 '>
                    <KTSVG
                      path={'/media/svg/others/nodata.svg'}
                      style={{opacity: 0.35}}
                      className='svg-icon-primary'
                      svgClassName='w-auto h-150px'
                    />
                  </div>
                  <p className='text-gray-400 fw-bold opacity-50 m-0'>{'No data shown'}</p>
                </div>
              )}

              {data?.length > 0 && (
                <PaginationDatatable
                  limit={limit}
                  total={totalPage}
                  onChangeLimit={onLimit}
                  onChangePage={onChangePage}
                />
              )}
            </div>
          </div>
          <div className={cx('tab-pane fade', {show: tab === 'read'}, {active: tab === 'read'})}>
            <div className='card-table-header'>
              <div className='d-flex flex-wrap flex-stack'>
                <div className='d-flex align-items-center position-relative me-4 my-1'>
                  <KTSVG
                    path='/media/icons/duotone/General/Search.svg'
                    className='svg-icon-3 position-absolute ms-3'
                  />
                  <Search
                    bg='solid'
                    delay={1500}
                    onChange={(e: any) => setKeyword(e)}
                    value={keyword}
                  />
                </div>
              </div>
            </div>
            <div className='card-body'>
              {data && data?.length > 0 ? (
                data?.map((item: any, index: any) => {
                  return (
                    <div className='card card-custom bg-gray-100 my-5' key={index || 0}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-1'>
                            <img
                              alt=''
                              src={item?.image || ''}
                              style={{
                                width: '100%',
                                border: '1px solid #050990',
                                borderRadius: '3px',
                                padding: '10px',
                                marginTop: '10px',
                              }}
                            />
                          </div>
                          <div className='col-11 mt-3'>
                            <h5>{item?.name || '-'}</h5>
                            <p>{item?.date || '-'}</p>
                            <p>{item?.text || '-'}</p>

                            <button className='btn btn-sm btn-primary me-3'>
                              <i className='las la-reply'></i> Reply
                            </button>
                            <button className='btn btn-sm btn-danger'>
                              <i className='las la-trash'></i> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className='text-center w-100'>
                  <div className='mb-2 '>
                    <KTSVG
                      path={'/media/svg/others/nodata.svg'}
                      style={{opacity: 0.35}}
                      className='svg-icon-primary'
                      svgClassName='w-auto h-150px'
                    />
                  </div>
                  <p className='text-gray-400 fw-bold opacity-50 m-0'>{'No data shown'}</p>
                </div>
              )}

              {data?.length > 0 && (
                <PaginationDatatable
                  limit={limit}
                  total={totalPage}
                  onChangeLimit={onLimit}
                  onChangePage={onChangePage}
                />
              )}
            </div>
          </div>
          <div className={cx('tab-pane fade', {show: tab === 'sent'}, {active: tab === 'sent'})}>
            <div className='card-table-header'>
              <div className='d-flex flex-wrap flex-stack'>
                <div className='d-flex align-items-center position-relative me-4 my-1'>
                  <KTSVG
                    path='/media/icons/duotone/General/Search.svg'
                    className='svg-icon-3 position-absolute ms-3'
                  />
                  <Search
                    bg='solid'
                    delay={1500}
                    onChange={(e: any) => setKeyword(e)}
                    value={keyword}
                  />
                </div>
              </div>
            </div>
            <div className='card-body'>
              {data?.length > 0 ? (
                data?.map((item: any, index: any) => {
                  return (
                    <div className='card card-custom bg-gray-100 my-5' key={index || 0}>
                      <div className='card-body'>
                        <div className='row'>
                          <div className='col-1'>
                            <img
                              alt=''
                              src={item?.image || ''}
                              style={{
                                width: '100%',
                                border: '1px solid #050990',
                                borderRadius: '3px',
                                padding: '10px',
                                marginTop: '10px',
                              }}
                            />
                          </div>
                          <div className='col-11 mt-3'>
                            <h5>{item?.name || '-'}</h5>
                            <p>{item?.date || '-'}</p>
                            <p>{item?.text || '-'}</p>

                            <button className='btn btn-sm btn-primary me-3'>
                              <i className='las la-reply'></i> Reply
                            </button>
                            <button className='btn btn-sm btn-danger'>
                              <i className='las la-trash'></i> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className='text-center w-100'>
                  <div className='mb-2 '>
                    <KTSVG
                      path={'/media/svg/others/nodata.svg'}
                      style={{opacity: 0.35}}
                      className='svg-icon-primary'
                      svgClassName='w-auto h-150px'
                    />
                  </div>
                  <p className='text-gray-400 fw-bold opacity-50 m-0'>{'No data shown'}</p>
                </div>
              )}

              {data?.length > 0 && (
                <PaginationDatatable
                  limit={limit}
                  total={totalPage}
                  onChangeLimit={onLimit}
                  onChangePage={onChangePage}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotificationComment
