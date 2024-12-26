/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import {FC, memo, useCallback, useState} from 'react'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'

import {deleteAsset} from '../asset-management/redux/AssetRedux'
import CardMyAsset from './CardMyAsset'

let MyAssetsWrapper: FC = () => {
  const intl: any = useIntl()
  const user: any = useSelector(({currentUser}: any) => currentUser, shallowEqual)
  const {guid: user_guid}: any = user || {}

  const [page, setPage] = useState<number>(1)
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [assetName, setAssetName] = useState<string>('')
  const [assetGuid, setAssetGuid] = useState<string>('')
  const [dataChecked, setDataChecked] = useState<any>([])
  const [reloadDelete, setReloadDelete] = useState<number>(1)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)
  const [showModal, setShowModalConfirm] = useState<boolean>(false)

  const msg_alert: any = [
    'Are you sure you want to delete this asset ',
    <strong key='asset_name'>{assetName || ''}</strong>,
    '?',
  ]

  const confirmDeleteAsset = useCallback(() => {
    setLoading(true)
    deleteAsset(assetGuid)
      .then(({data: {message}}: any) => {
        setTimeout(() => {
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

          setLoading(false)
          setDataChecked([])
          setShowModalConfirm(false)
          setReloadDelete(reloadDelete + 1)
          ToastMessage({type: 'success', message})
        }, 1000)
      })
      .catch(({response}: any) => {
        const {message} = response?.data || {}
        ToastMessage({type: 'success', message})
      })
  }, [assetGuid, reloadDelete])

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.MY-ASSETS'})}</PageTitle>
      <CardMyAsset
        page={page}
        setPage={setPage}
        pageFrom={pageFrom}
        user_guid={user_guid}
        totalPage={totalPage}
        dataChecked={dataChecked}
        setPageFrom={setPageFrom}
        setTotalPage={setTotalPage}
        resetKeyword={resetKeyword}
        reloadDelete={reloadDelete}
        setAssetGuid={setAssetGuid}
        setAssetName={setAssetName}
        setDataChecked={setDataChecked}
        setResetKeyword={setResetKeyword}
        setReloadDelete={setReloadDelete}
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

MyAssetsWrapper = memo(
  MyAssetsWrapper,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default MyAssetsWrapper
