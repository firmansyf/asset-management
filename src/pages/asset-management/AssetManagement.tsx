/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import {ToastMessage} from '@components/toast-message'
import {errorValidation} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {FC, memo, useCallback, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {useLocation} from 'react-router-dom'

import CardAssetManagement from './CardAssetManagement'
import {deleteAsset, deleteBulkAsset} from './redux/AssetRedux'

let AssetManagement: FC = () => {
  const intl: any = useIntl()
  const location: any = useLocation()

  const [page, setPage] = useState<number>(1)
  const [assetName, setAssetName] = useState<any>()
  const [assetGuid, setAssetGuid] = useState<any>()
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [dataChecked, setDataChecked] = useState<any>([])
  const [reloadDelete, setReloadDelete] = useState<number>(1)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)
  const [showModal, setShowModalConfirm] = useState<boolean>(false)

  useEffect(() => {
    if (location?.state) {
      ToastMessage({type: 'success', message: location?.state?.message || ''})
    }
  }, [location])

  const msg_alert: any = [
    'Are you sure you want to delete this asset ',
    <strong key='asset_name'>{assetName || ''}</strong>,
    '?',
  ]

  const confirmDeleteAsset = useCallback(() => {
    setLoading(true)
    deleteAsset(assetGuid)
      .then(({data}: any) => {
        setTimeout(() => {
          ToastMessage({type: 'success', message: data?.message})
          const total_data_page: number = totalPage - pageFrom
          const current_page: number = page
          if (total_data_page - 1 === 0) {
            if (current_page > 1) {
              setPage(current_page - 1)
            } else {
              setPage(current_page)
              setResetKeyword(true)
            }
          } else {
            setPage(current_page)
          }
          setShowModalConfirm(false)
          setReloadDelete(reloadDelete + 1)
          setDataChecked([])
        }, 1000)
      })
      .catch((err: any) => {
        Object.values(errorValidation(err) || {})?.map((message: any) =>
          ToastMessage({type: 'error', message})
        )
      })
      .finally(() => {
        setLoading(false)
      })
  }, [assetGuid, reloadDelete])

  const onBulkDelete = (e: any) => {
    deleteBulkAsset({guids: e})
      .then(({data: {message}}: any) => {
        const total_data_page: number = totalPage - pageFrom
        const current_page: number = page
        if (total_data_page - dataChecked?.length === 0) {
          if (current_page > 1) {
            setPage(current_page - 1)
          } else {
            setPage(current_page)
            setResetKeyword(true)
          }
        } else {
          setPage(current_page)
        }
        setReloadDelete(reloadDelete + 1)
        ToastMessage({type: 'success', message})
      })
      .catch((err: any) => {
        Object.values(errorValidation(err) || {})?.map((message: any) =>
          ToastMessage({type: 'error', message})
        )
      })
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.ASSET_MANAGEMENT'})}</PageTitle>
      <CardAssetManagement
        page={page}
        setPage={setPage}
        totalPage={totalPage}
        setPageFrom={setPageFrom}
        dataChecked={dataChecked}
        setTotalPage={setTotalPage}
        resetKeyword={resetKeyword}
        onBulkDelete={onBulkDelete}
        reloadDelete={reloadDelete}
        setAssetGuid={setAssetGuid}
        setAssetName={setAssetName}
        setDataChecked={setDataChecked}
        setResetKeyword={setResetKeyword}
        setShowModalConfirm={setShowModalConfirm}
      />

      <Alert
        type={'delete'}
        body={msg_alert}
        loading={loading}
        showModal={showModal}
        title={'Delete Asset'}
        confirmLabel={'Delete'}
        setShowModal={setShowModalConfirm}
        onConfirm={() => confirmDeleteAsset()}
        onCancel={() => setShowModalConfirm(false)}
      />
    </>
  )
}

AssetManagement = memo(
  AssetManagement,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default AssetManagement
