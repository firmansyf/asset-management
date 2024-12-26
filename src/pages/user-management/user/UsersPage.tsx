import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'

import CardUser from './CardUser'
import {DeleteBulkUsers} from './DeleteBulkUsers'

const UsersPage: FC = () => {
  const intl: any = useIntl()

  document.title = 'User - AssetData.io'
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {timezone, date_format, time_format}: any = preferenceStore || {}

  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [filterAll, setFilterAll] = useState<any>({})
  const [totalPage, setTotalPage] = useState<number>(0)
  const [reloadUser, setReloadUser] = useState<number>(1)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [dataChecked, setDataChecked] = useState<any>([])
  const [reloadDelete, setReloadDelete] = useState<number>(1)
  const [orderCol, setOrderCol] = useState<string>('first_name')
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)
  const [isUnverifiedUser, setUnverifiedUser] = useState<boolean>(false)
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)

  const onChecked = (e: any) => {
    const ar_guid: any = []
    setUnverifiedUser(false)
    e?.forEach((ck: any) => {
      const {checked}: any = ck || {}
      if (checked) {
        const {original}: any = ck || {}
        const {guid}: any = original || {}
        ar_guid?.push(guid)
        if (original?.user_status === 'unverified' || original?.user_status === 'owner') {
          setUnverifiedUser(true)
        }
      }
    })
    setDataChecked(ar_guid as never[])
  }

  useEffect(() => {
    setTimeout(() => ToastMessage({type: 'clear'}), 800)
  }, [])

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.USER_MANAGEMENT.USERS'})}
      </PageTitle>

      <CardUser
        page={page}
        limit={limit}
        setPage={setPage}
        keyword={keyword}
        orderCol={orderCol}
        orderDir={orderDir}
        pageFrom={pageFrom}
        setLimit={setLimit}
        timezone={timezone}
        filterAll={filterAll}
        onChecked={onChecked}
        totalPage={totalPage}
        setKeyword={setKeyword}
        reloadUser={reloadUser}
        dateFormat={date_format}
        timeFormat={time_format}
        dataChecked={dataChecked}
        setOrderCol={setOrderCol}
        setOrderDir={setOrderDir}
        setPageFrom={setPageFrom}
        setTotalPage={setTotalPage}
        reloadDelete={reloadDelete}
        setFilterAll={setFilterAll}
        resetKeyword={resetKeyword}
        setReloadUser={setReloadUser}
        setDataChecked={setDataChecked}
        setResetKeyword={setResetKeyword}
        setReloadDelete={setReloadDelete}
        setShowModalConfirmBulk={setShowModalConfirmBulk}
      />

      <DeleteBulkUsers
        page={page}
        setPage={setPage}
        pageFrom={pageFrom}
        totalPage={totalPage}
        reloadUser={reloadDelete}
        dataChecked={dataChecked}
        showModal={showModalBulk}
        setDataChecked={setDataChecked}
        setReloadUser={setReloadDelete}
        setResetKeyword={setResetKeyword}
        isUnverifiedUser={isUnverifiedUser}
        setShowModal={setShowModalConfirmBulk}
      />
    </>
  )
}

export default UsersPage
