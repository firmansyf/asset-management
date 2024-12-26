import {Alert} from '@components/alert'
import {ToastMessage} from '@components/toast-message'
import {useTimeOutMessage} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {FC, useCallback, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'

import {CardAlertSetting} from './CardAlertSetting'
import {deleteAlertSetting} from './Service'

const AlertSetting: FC = () => {
  const intl: any = useIntl()

  const [meta, setMeta] = useState<any>({})
  const [page, setPage] = useState<number>(1)
  const [detail, setDetail] = useState<any>({})
  const [limit, setLimit] = useState<number>(10)
  const [reload, setReload] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [totalPage, setTotalPage] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [dataChecked, setDataChecked] = useState<any>([])
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')
  const [totalPerPage, setTotalPerPage] = useState<number>(0)
  const [showModal, setShowModalConfirm] = useState<boolean>(false)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)

  const confirmDeleteAlertSetting = useCallback(() => {
    setLoading(true)
    const {guid}: any = detail || {}

    deleteAlertSetting(guid || '')
      .then(({data: {message}}: any) => {
        setTimeout(() => {
          setLoading(false)
          const total_data_page: number = totalPage - totalPerPage
          const thisPage: any = page

          if (total_data_page - 1 <= 0) {
            if (thisPage > 1) {
              setPage(thisPage - 1)
            } else {
              setPage(thisPage)
              setResetKeyword(true)
            }
          } else {
            setPage(thisPage)
          }
          setDataChecked([])
          setReload(reload + 1)
          setShowModalConfirm(false)
          ToastMessage({message, type: 'success'})
        }, 1000)
      })
      .catch(({response}: any) => {
        setLoading(false)
        const {message}: any = response?.data || {}
        ToastMessage({type: 'error', message})
      })
  }, [detail, reload, setReload, page, totalPage, totalPerPage])

  const onDelete = (e: any) => {
    setDetail(e || {})
    setShowModalConfirm(true)
  }

  const msg_alert: any = [
    'Are you sure you want to delete this alert setting ',
    <strong key='full_name'>{detail?.name || '-'}</strong>,
    '?',
  ]

  useEffect(() => {
    useTimeOutMessage('clear', 2000)
  }, [])

  useEffect(() => {
    if (totalPerPage === 0 && Object.keys(meta || {})?.length > 0) {
      setPage(meta?.current_page > 1 ? meta?.current_page - 1 : 1)
    }
  }, [totalPerPage, meta])

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.SETUP.ALERT.SETTINGS'})}
      </PageTitle>

      <CardAlertSetting
        page={page}
        limit={limit}
        reload={reload}
        setPage={setPage}
        keyword={keyword}
        setMeta={setMeta}
        orderDir={orderDir}
        orderCol={orderCol}
        setLimit={setLimit}
        onDelete={onDelete}
        totalPage={totalPage}
        setReload={setReload}
        setKeyword={setKeyword}
        setOrderCol={setOrderCol}
        setOrderDir={setOrderDir}
        dataChecked={dataChecked}
        resetKeyword={resetKeyword}
        totalPerPage={totalPerPage}
        setTotalPage={setTotalPage}
        setDataChecked={setDataChecked}
        setResetKeyword={setResetKeyword}
        setTotalPerPage={setTotalPerPage}
        // loading={loading}
        // columns={columns}
        // res_man={dataRes}
        // setColumns={setColumns}
      />

      <Alert
        type={'delete'}
        body={msg_alert}
        loading={loading}
        showModal={showModal}
        confirmLabel={'Delete'}
        title={'Delete Alert Setting'}
        setShowModal={setShowModalConfirm}
        onCancel={() => setShowModalConfirm(false)}
        onConfirm={() => confirmDeleteAlertSetting()}
      />
    </>
  )
}

export default AlertSetting
