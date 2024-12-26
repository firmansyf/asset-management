/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import {FC, useCallback, useState} from 'react'
import {useIntl} from 'react-intl'

import CardType from './CardType'
import {deleteBulkType, deleteType} from './Service'

const Type: FC = () => {
  const intl: any = useIntl()
  const [page, setPage] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [totalPerPage, setTotalPerPage] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)

  const [userGuid, setUserGuid] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [dataChecked, setDataChecked] = useState<any>([])
  const [optCategory, setOptionCategory] = useState<any>([])
  const [reloadDelete, setReloadDelete] = useState<number>(1)
  const [userFullname, setUserFullname] = useState<string>('')
  const [showModal, setShowModalConfirm] = useState<boolean>(false)
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)

  const confirmDeleteType: any = useCallback(() => {
    setLoading(true)
    deleteType(userGuid)
      .then(({status, data: {message}}: any) => {
        if (status === 200) {
          ToastMessage({message, type: 'success'})
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
            setShowModalConfirm(false)
            setReloadDelete(reloadDelete + 1)
          }, 1000)
        }
      })
      .catch(({response}: any) => {
        setLoading(false)
        const {message} = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }, [reloadDelete, userGuid, page, totalPage, totalPerPage])

  const confirmBulkDeleteEmployee: any = useCallback(() => {
    setLoading(true)
    deleteBulkType({guids: dataChecked as never[]})
      .then(({status, data: {message}}: any) => {
        if (status === 200) {
          ToastMessage({message, type: 'success'})
          setTimeout(() => {
            setLoading(false)
            const total_data_page: number = totalPage - totalPerPage
            const thisPage: any = page
            if (total_data_page - dataChecked?.length <= 0) {
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
            setShowModalConfirmBulk(false)
            setReloadDelete(reloadDelete + 1)
          }, 1000)
        }
      })
      .catch(({response}: any) => {
        setLoading(false)
        const {message} = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }, [dataChecked, reloadDelete, page, totalPage, totalPerPage])

  const msg_alert: any = [
    'Are you sure you want to delete this Type ',
    <strong key='full_name'>{userFullname || ''}</strong>,
    '?',
  ]

  const msg_alert_bulk_delete: any = [
    'Are you sure you want to delete',
    <strong key='full_name'> {dataChecked?.length || 0} </strong>,
    'Types data?',
  ]

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.SETUP.SETTINGS.TYPES'})}
      </PageTitle>

      <CardType
        dataChecked={dataChecked}
        setUserGuid={setUserGuid}
        optCategory={optCategory}
        reloadDelete={reloadDelete}
        setDataChecked={setDataChecked}
        setUserFullname={setUserFullname}
        setOptionCategory={setOptionCategory}
        setShowModalConfirm={setShowModalConfirm}
        setShowModalConfirmBulk={setShowModalConfirmBulk}
        page={page}
        setPage={setPage}
        setTotalPage={setTotalPage}
        totalPage={totalPage}
        setTotalPerPage={setTotalPerPage}
        setResetKeyword={setResetKeyword}
        resetKeyword={resetKeyword}
      />

      <Alert
        type={'delete'}
        body={msg_alert}
        loading={loading}
        showModal={showModal}
        title={'Delete Type'}
        confirmLabel={'Delete'}
        setShowModal={setShowModalConfirm}
        onConfirm={() => confirmDeleteType()}
        onCancel={() => setShowModalConfirm(false)}
      />

      <Alert
        type={'delete'}
        loading={loading}
        confirmLabel={'Delete'}
        showModal={showModalBulk}
        title={'Delete Bulk Type'}
        body={msg_alert_bulk_delete}
        setShowModal={setShowModalConfirmBulk}
        onConfirm={() => confirmBulkDeleteEmployee()}
        onCancel={() => setShowModalConfirmBulk(false)}
      />
    </>
  )
}

export default Type
