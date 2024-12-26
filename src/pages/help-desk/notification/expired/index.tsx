import {DataTable} from '@components/datatable'
import {Search} from '@components/form/searchValue'
import {KTSVG} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import cx from 'classnames'
import {FC, useEffect, useMemo, useState} from 'react'
import {useIntl} from 'react-intl'
import {useLocation, useNavigate} from 'react-router-dom'

import {getNotification} from '../Service'

const NotificationExpired: FC<any> = () => {
  const intl: any = useIntl()
  const navigate = useNavigate()
  const location = useLocation()
  const [dataWarranty, setDataWarranty] = useState<any>([])
  const [dataInsurance, setDataInsurance] = useState<any>([])
  const [, setDetail] = useState<any>({}) //detail
  const [loading, setLoading] = useState<boolean>(true)
  const [page, setPage] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<any>('')
  const [orderCol, setOrderCol] = useState<any>('')
  const [orderDir, setOrderDir] = useState<any>('asc')
  const [, setExpiredName] = useState('') //expiredName
  const [, setExpiredGuid] = useState('') //expiredGuid
  const [tab, setTab] = useState('warranty')
  const [tabs, setTabs] = useState('unread')

  const columnsInsurance: any = useMemo(
    () => [
      {header: 'View', width: '20px'},
      {header: 'Insurance Police Name', value: 'policy_no', sort: true},
      {header: 'End Date', value: 'end_date', sort: true},
      {header: 'Delete', width: '20px'},
    ],
    []
  )

  const columnsWarranty: any = useMemo(
    () => [
      {header: 'View', width: '20px'},
      {header: 'Asset ID', value: 'asset_id', sort: true},
      {header: 'Expired', value: 'expired', sort: true},
      {header: 'Delete', width: '20px'},
    ],
    []
  )

  const onDelete = (e: any) => {
    const {name, guid} = e || {}
    setExpiredName(name)
    setExpiredGuid(guid)
  }

  const onDetail = (e: any) => {
    setDetail(e)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onChangePage = (e: any) => {
    setPage(e)
  }

  const onLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  useEffect(() => {
    setLoading(true)
    getNotification({
      page,
      orderDir,
      orderCol,
      limit,
      keyword: `*${keyword}*`,
      'filter[module]': 'expired',
      'filter[is_read]': tabs === 'read' ? 1 : 0,
    })
      .then(({data: {data: res, meta}}: any) => {
        const {current_page, per_page, total} = meta || {}
        setPage(current_page)
        setTotalPage(total)
        setLimit(per_page)
        setLoading(false)

        const insurance: any = []
        const warranty: any = []
        res.forEach((item: any) => {
          const {action_data} = item || {}
          const {category} = action_data || {}
          if (category === 'insurance') {
            const {policy_no, end_date} = action_data || {}
            insurance[end_date] = {
              ...insurance,
              original: item,
              view: 'view',
              policy_no,
              end_date,
              delete: 'Delete',
            }
          }

          if (category === 'warranty') {
            const {asset_id, expired} = action_data || {}
            warranty[expired] = {
              ...warranty,
              original: item,
              view: 'view',
              asset_id,
              expired,
              delete: 'Delete',
            }
          }
        })
        setDataWarranty(warranty)
        setDataInsurance(insurance)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [columnsWarranty, columnsInsurance, page, orderDir, orderCol, limit, keyword, tabs])

  useEffect(() => {
    setTab(location.hash ? location.hash.split('#')[1] : 'warranty')
    setTabs(location.hash ? location.hash.split('#')[2] : 'unread')
  }, [location.hash])

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'HELPDESK.NOTIFICATION.EXPIRED'})}
      </PageTitle>
      <ul className='nav nav-tabs nav-line-tabs nav-line-tabs-2x fs-6 mb-5'>
        <li className='nav-item'>
          <div
            className={cx(
              'm-0 px-5 py-3 cursor-pointer',
              tab === 'warranty' && 'bg-primary border-primary text-white fw-bolder'
            )}
            onClick={() => {
              navigate({...location, hash: 'warranty#unread'}, {replace: true})
              setTab('warranty')
              setKeyword('')
            }}
          >
            Warranty
            <div
              className={cx('btn btn-sm', tab === 'warranty' ? 'btn-light' : 'btn-primary')}
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
              tab === 'insurance' && 'bg-primary border-primary text-white fw-bolder'
            )}
            onClick={() => {
              navigate({...location, hash: 'insurance#unread'}, {replace: true})
              setTab('insurance')
              setKeyword('')
            }}
          >
            Insurance Policy
            <div
              className={cx('btn btn-sm', tab === 'insurance' ? 'btn-light' : 'btn-primary')}
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
          className={cx('tab-pane fade', {show: tab === 'warranty'}, {active: tab === 'warranty'})}
        >
          <div className='card card-custom card-table'>
            <ul className='nav nav-tabs nav-line-tabs nav-line-tabs-2x fs-6 bg-gray-100'>
              <li>
                <div
                  style={{
                    color: '#050990',
                    fontSize: '16px',
                    fontWeight: 600,
                    padding: '7px 20px 0px',
                  }}
                >
                  Expired Warranty
                </div>
              </li>
              <li className='nav-item'>
                <div
                  className={cx(
                    'm-0 px-5 py-3 cursor-pointer',
                    tabs === 'unread' && 'bg-primary border-primary text-white fw-bolder'
                  )}
                  onClick={() => {
                    navigate({...location, hash: 'warranty#unread'}, {replace: true})
                    setTabs('unread')
                    setKeyword('')
                  }}
                >
                  Unread
                  <div
                    className={cx('btn btn-sm', tabs === 'unread' ? 'btn-light' : 'btn-primary')}
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
                    tabs === 'read' && 'bg-primary border-primary text-white fw-bolder'
                  )}
                  onClick={() => {
                    navigate({...location, hash: 'warranty#read'}, {replace: true})
                    setTabs('read')
                    setKeyword('')
                  }}
                >
                  Read
                  <div
                    className={cx('btn btn-sm', tabs === 'read' ? 'btn-light' : 'btn-primary')}
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
              <li style={{position: 'absolute', right: 0}}>
                <div
                  className={cx(
                    'm-0 px-5 py-3 cursor-pointer bg-primary border-primary text-white fw-bolder'
                  )}
                  style={{borderTopRightRadius: '5px'}}
                  onClick={() => ''}
                >
                  Mark all as Read
                </div>
              </li>
            </ul>
            <div className='tab-content'>
              <div
                className={cx(
                  'tab-pane fade',
                  {show: tabs === 'unread'},
                  {active: tabs === 'unread'}
                )}
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
                  {Object.keys(dataWarranty || {})?.length > 0 ? (
                    Object.keys(dataWarranty || {})?.map((item: any, index: number) => (
                      <DataTable
                        key={index}
                        loading={loading}
                        limit={limit}
                        total={totalPage}
                        data={dataWarranty[item]}
                        columns={columnsWarranty}
                        onChangePage={onChangePage}
                        onChangeLimit={onLimit}
                        onDelete={onDelete}
                        onDetail={onDetail}
                        onSort={onSort}
                      />
                    ))
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
                </div>
              </div>
              <div
                className={cx('tab-pane fade', {show: tabs === 'read'}, {active: tabs === 'read'})}
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
                  {Object.keys(dataWarranty || {})?.length > 0 ? (
                    Object.keys(dataWarranty || {})?.map((item: any, index: number) => (
                      <DataTable
                        key={index}
                        loading={loading}
                        limit={limit}
                        total={totalPage}
                        data={dataWarranty[item]}
                        columns={columnsWarranty}
                        onChangePage={onChangePage}
                        onChangeLimit={onLimit}
                        onDelete={onDelete}
                        onDetail={onDetail}
                        onSort={onSort}
                      />
                    ))
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
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={cx(
            'tab-pane fade',
            {show: tab === 'insurance'},
            {active: tab === 'insurance'}
          )}
        >
          <div className='card card-custom card-table'>
            <ul className='nav nav-tabs nav-line-tabs nav-line-tabs-2x fs-6 bg-gray-100'>
              <li>
                <div
                  style={{
                    color: '#050990',
                    fontSize: '16px',
                    fontWeight: 600,
                    padding: '7px 20px 0px',
                  }}
                >
                  Expired Insurance Policy
                </div>
              </li>
              <li className='nav-item'>
                <div
                  className={cx(
                    'm-0 px-5 py-3 cursor-pointer',
                    tabs === 'unread' && 'bg-primary border-primary text-white fw-bolder'
                  )}
                  onClick={() => {
                    navigate({...location, hash: 'insurance#unread'}, {replace: true})
                    setTabs('unread')
                    setKeyword('')
                  }}
                >
                  Unread
                  <div
                    className={cx('btn btn-sm', tabs === 'unread' ? 'btn-light' : 'btn-primary')}
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
                    tabs === 'read' && 'bg-primary border-primary text-white fw-bolder'
                  )}
                  onClick={() => {
                    navigate({...location, hash: 'insurance#read'}, {replace: true})
                    setTabs('read')
                    setKeyword('')
                  }}
                >
                  Read
                  <div
                    className={cx('btn btn-sm', tabs === 'read' ? 'btn-light' : 'btn-primary')}
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
              <li style={{position: 'absolute', right: 0}}>
                <div
                  className={cx(
                    'm-0 px-5 py-3 cursor-pointer bg-primary border-primary text-white fw-bolder'
                  )}
                  style={{borderTopRightRadius: '5px'}}
                  onClick={() => ''}
                >
                  Mark all as Read
                </div>
              </li>
            </ul>
            <div className='tab-content'>
              <div
                className={cx(
                  'tab-pane fade',
                  {show: tabs === 'unread'},
                  {active: tabs === 'unread'}
                )}
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
                  {Object.keys(dataInsurance || {})?.length > 0 ? (
                    Object.keys(dataInsurance || {})?.map((item: any, index: number) => (
                      <DataTable
                        key={index}
                        loading={loading}
                        limit={limit}
                        total={totalPage}
                        data={dataInsurance[item]}
                        columns={columnsInsurance}
                        onChangePage={onChangePage}
                        onChangeLimit={onLimit}
                        onDelete={onDelete}
                        onDetail={onDetail}
                        onSort={onSort}
                      />
                    ))
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
                </div>
              </div>
              <div
                className={cx('tab-pane fade', {show: tabs === 'read'}, {active: tabs === 'read'})}
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
                  {Object.keys(dataInsurance || {})?.length > 0 ? (
                    Object.keys(dataInsurance || {})?.map((item: any, index: number) => (
                      <DataTable
                        key={index}
                        loading={loading}
                        limit={limit}
                        total={totalPage}
                        data={dataInsurance[item]}
                        columns={columnsInsurance}
                        onChangePage={onChangePage}
                        onChangeLimit={onLimit}
                        onDelete={onDelete}
                        onDetail={onDetail}
                        onSort={onSort}
                      />
                    ))
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
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default NotificationExpired
