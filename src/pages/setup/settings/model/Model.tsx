/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import {FC, memo, useCallback, useState} from 'react'
import {useIntl} from 'react-intl'

import CardModel from './CardModel'
import {deleteBulkModel, deleteModel} from './Service'

let Model: FC = () => {
  const intl: any = useIntl()
  const [page, setPage] = useState<number>(1)
  const [totalPerPage, setTotalPerPage] = useState<number>(0)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)

  const [modelGuid, setGuid] = useState<string>('')
  const [modelName, setModelname] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [dataChecked, setDataChecked] = useState<any>([])
  const [reloadDelete, setReloadDelete] = useState<number>(1)
  const [showModal, setShowModalConfirm] = useState<boolean>(false)

  const confirmDeleteModel = useCallback(() => {
    setLoading(true)
    deleteModel(modelGuid)
      .then(({data: {message}}: any) => {
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
      })
      .catch(({response}: any) => {
        setLoading(false)
        const {message} = response?.data || {}
        ToastMessage({message, type: 'success'})
      })
  }, [modelGuid, reloadDelete, page, totalPage, totalPerPage])

  const onDelete = (e: any) => {
    const {name, guid}: any = e || {}
    setGuid(guid || '')
    setModelname(name || '')
    setShowModalConfirm(true)
  }

  // BulkDeleteMark
  const onBulkDelete = (e: any) => {
    deleteBulkModel({guids: e})
      .then(({data: {message}}: any) => {
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
        setReloadDelete(reloadDelete + 1)
        ToastMessage({message, type: 'success'})
      })
      .catch(({response}: any) => {
        const {message} = response?.data || {}
        ToastMessage({message, type: 'success'})
      })
  }

  const msg_alert: any = [
    'Are you sure you want to delete this model ',
    <strong key='full_name'>{modelName || ''}</strong>,
    '?',
  ]

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.SETUP.SETTINGS.MODELS'})}
      </PageTitle>

      <CardModel
        onDelete={onDelete}
        dataChecked={dataChecked}
        onBulkDelete={onBulkDelete}
        reloadDelete={reloadDelete}
        setDataChecked={setDataChecked}
        page={page}
        setPage={setPage}
        setTotalPerPage={setTotalPerPage}
        totalPage={totalPage}
        setTotalPage={setTotalPage}
        setResetKeyword={setResetKeyword}
        resetKeyword={resetKeyword}
        totalPerPage={totalPerPage}
      />

      <Alert
        type={'delete'}
        body={msg_alert}
        loading={loading}
        showModal={showModal}
        title={'Delete Model'}
        confirmLabel={'Delete'}
        setShowModal={setShowModalConfirm}
        onConfirm={() => confirmDeleteModel()}
        onCancel={() => setShowModalConfirm(false)}
      />
    </>
  )
}

Model = memo(Model, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default Model
