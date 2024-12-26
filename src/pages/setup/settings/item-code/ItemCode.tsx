/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import {ToastMessage} from '@components/toast-message'
import {useTimeOutMessage} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {FC, useCallback, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'

import {CardItemCode} from './CardItemCode'
import {deleteBulkItemCode, deleteItemCode} from './Service'

const ItemCode: FC = () => {
  const intl = useIntl()
  const [page, setPage] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [showModal, setShowModalConfirm] = useState<boolean>(false)
  const [brandItemCode, setItemCodeDetail] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [reloadData, setReloadData] = useState<number>(0)
  const [dataChecked, setDataChecked] = useState<any>([])
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)

  useEffect(() => {
    useTimeOutMessage('clear', 800)
  }, [])

  const confirmDeleteItemCode = useCallback(() => {
    setLoading(true)
    deleteItemCode(brandItemCode?.guid)
      .then((res: any) => {
        setTimeout(() => {
          ToastMessage({message: res?.data?.message, type: 'success'})
          setLoading(false)
          setShowModalConfirm(false)
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
          setReloadData(reloadData + 1)
          setDataChecked([])
        }, 1000)
      })
      .catch((error: any) => {
        ToastMessage({message: error?.response?.data?.message, type: 'success'})
        setLoading(false)
      })
  }, [brandItemCode, reloadData])

  const onDelete = (e: any) => {
    setItemCodeDetail(e)
    setShowModalConfirm(true)
  }

  // BulkDeleteMark
  const onBulkDelete = (e: any) => {
    deleteBulkItemCode({guids: e})
      .then(({data}) => {
        ToastMessage({message: data?.message, type: 'success'})
        const total_data_page: number = totalPage - pageFrom
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
        setReloadData(reloadData + 1)
        setDataChecked([])
      })
      .catch((error: any) => {
        ToastMessage({message: error?.response?.data?.message, type: 'success'})
      })
  }

  const msg_alert: any = [
    'Are you sure you want to delete this item code ',
    <strong key='full_name'>{brandItemCode?.name}</strong>,
    '?',
  ]

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.SETUP.SETTINGS.ITEM-CODES'})}
      </PageTitle>
      <CardItemCode
        onDelete={onDelete}
        onBulkDelete={onBulkDelete}
        reloadData={reloadData}
        dataChecked={dataChecked}
        setDataChecked={setDataChecked}
        page={page}
        setPage={setPage}
        totalPage={totalPage}
        setTotalPage={setTotalPage}
        setPageFrom={setPageFrom}
        resetKeyword={resetKeyword}
        setResetKeyword={setResetKeyword}
      />
      <Alert
        setShowModal={setShowModalConfirm}
        showModal={showModal}
        loading={loading}
        body={msg_alert}
        type={'delete'}
        title={'Delete Item Code'}
        confirmLabel={'Delete'}
        onConfirm={() => {
          confirmDeleteItemCode()
        }}
        onCancel={() => {
          setShowModalConfirm(false)
        }}
      />
    </>
  )
}

export default ItemCode
