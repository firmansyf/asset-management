/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import {ToastMessage} from '@components/toast-message'
import {useTimeOutMessage} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {FC, useCallback, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'

import {CardAlertTeam} from './CardAlertTeam'
import {deleteAlertTeam} from './Service'

const AlertTeam: FC = () => {
  const intl: any = useIntl()

  const [page, setPage] = useState<number>(1)
  const [teamName, setTeamName] = useState<any>('')
  const [teamGuid, setTeamGuid] = useState<any>('')
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [dataChecked, setDataChecked] = useState<any>([])
  const [deleteReload, setReloadDelete] = useState<any>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)
  const [showModal, setShowModalConfirm] = useState<boolean>(false)

  useEffect(() => {
    useTimeOutMessage('clear', 800)
  }, [])

  const confirmDelete = useCallback(() => {
    setLoading(true)
    deleteAlertTeam(teamGuid)
      .then(({data: {message}}: any) => {
        setTimeout(() => {
          const total_data_page: number = totalPage - pageFrom
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

          setLoading(false)
          setDataChecked([])
          setShowModalConfirm(false)
          setReloadDelete(deleteReload + 1)
          ToastMessage({message, type: 'success'})
        }, 1000)
      })
      .catch(({response}: any) => {
        setLoading(false)
        const {message}: any = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }, [teamGuid, deleteReload])

  const msg_alert: any = [
    'Are you sure you want to delete this team ',
    <strong key='team_name'>{teamName || ''}</strong>,
    '?',
  ]

  const onDelete = (e: any) => {
    const {name, guid}: any = e || {}

    setTeamName(name || '')
    setTeamGuid(guid || '')
    setShowModalConfirm(true)
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.SETUP.TEAM'})}</PageTitle>
      <CardAlertTeam
        page={page}
        setPage={setPage}
        pageFrom={pageFrom}
        onDelete={onDelete}
        totalPage={totalPage}
        setPageFrom={setPageFrom}
        dataChecked={dataChecked}
        setTotalPage={setTotalPage}
        resetKeyword={resetKeyword}
        deleteReload={deleteReload}
        setDataChecked={setDataChecked}
        setResetKeyword={setResetKeyword}
      />

      <Alert
        type={'delete'}
        body={msg_alert}
        loading={loading}
        showModal={showModal}
        confirmLabel={'Delete'}
        title={'Delete Alert Team'}
        onConfirm={() => confirmDelete()}
        setShowModal={setShowModalConfirm}
        onCancel={() => setShowModalConfirm(false)}
      />
    </>
  )
}

export default AlertTeam
