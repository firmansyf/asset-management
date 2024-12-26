import {DataTable} from '@components/datatable'
import {preferenceDateTime} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'

import {ModalDetailSession} from './component/DetailSession'
import {getUserSession} from './component/Service'

const ProfileSessionsPage: FC<any> = () => {
  const intl = useIntl()
  const pref_date_time = preferenceDateTime()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(10)
  const [totalPage, setTotalPage] = useState(0)
  // const [orderCol, setOrderCol] = useState('browser')
  // const [orderDir, setOrderDir] = useState('asc')
  const [dataSessions, setDataSessions] = useState<any>({})
  const [loading, setLoading] = useState<any>(true)
  const [showModalDetail, setShowModalDetail] = useState(false)
  const [sessionDetail, setSessionDetail] = useState<any>({})

  useEffect(() => {
    setLoading(true)
    getUserSession({page, limit})
      .then(({data: {data: res_man, meta}}) => {
        const {total} = meta || {}
        setTotalPage(total)
        if (res_man) {
          const data = res_man?.map((sessions: any) => {
            const {guid, browser, last_action, location} = sessions || {}
            const {ip_address, name} = location || {}
            return {
              original: sessions,
              view: 'view',
              guid: guid,
              last_action: last_action,
              ip_address: ip_address,
              name: name,
              browser: browser,
            }
          })
          setDataSessions(data)
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [page, limit])

  const columns = [
    {header: 'View', width: '20px'},
    {header: 'Date & Time', value: 'last_action', sort: false},
    {header: 'IP Address', value: 'ip_address', sort: false},
    {header: 'Location', value: 'name', sort: false},
    {header: 'Browser', value: 'browser', sort: false},
  ]

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  const onPageChange = (e: any) => {
    setPage(e)
  }

  // const onSort = (value: any) => {
  //   setOrderCol(value)
  //   setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  // }

  const onDetail = (e: any) => {
    setSessionDetail(e)
    setShowModalDetail(true)
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'LOGIN_SESSIONS'})}</PageTitle>
      <div className='card mb-5 mb-xl-10'>
        <div className='card-body'>
          <DataTable
            limit={limit}
            total={totalPage}
            data={dataSessions}
            columns={columns}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
            onDetail={onDetail}
            // onSort={onSort}
            loading={loading}
            render={(val: any) => {
              return {
                last_action: val !== '-' ? moment(val).format(pref_date_time) : '-',
              }
            }}
          />
        </div>
      </div>
      <ModalDetailSession
        showModal={showModalDetail}
        setShowModal={setShowModalDetail}
        dataDetail={sessionDetail}
      />
    </>
  )
}

const ProfileUserSession = memo(ProfileSessionsPage)
export default ProfileUserSession
