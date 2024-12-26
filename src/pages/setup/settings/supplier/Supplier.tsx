import {Alert} from '@components/alert'
import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import {FC, useCallback, useState} from 'react'
import {useIntl} from 'react-intl'

import {CardSupplier} from './CardSupplier'
import {deleteBulkSupplier, deleteSupplier} from './Service'

const Supplier: FC = () => {
  const intl = useIntl()
  const [page, setPage] = useState<number>(1)
  const [totalPerPage, setTotalPerPage] = useState<number>(0)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)

  const [showModal, setShowModalConfirm] = useState(false)
  const [supplierName, setSupplierName] = useState('')
  const [supplierGuid, setSupplierGuid] = useState('')
  const [loading, setLoading] = useState(false)
  const [showModalBulk, setShowModalConfirmBulk] = useState(false)
  const [dataChecked, setDataChecked] = useState([])
  const [deleteReload, setReloadDelete] = useState(0)

  const confirmDeleteSupplier = useCallback(() => {
    setLoading(true)
    deleteSupplier(supplierGuid)
      .then((res: any) => {
        if (res.status === 200) {
          ToastMessage({message: res?.data?.message, type: 'success'})
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
            setShowModalConfirm(false)
            setReloadDelete(deleteReload + 1)
            setDataChecked([])
          }, 1000)
        }
      })
      .catch((err: any) => {
        ToastMessage({message: err?.response?.data?.message, type: 'error'})
        setLoading(false)
      })
  }, [supplierGuid, deleteReload, page, totalPage, totalPerPage])

  const confirmBulkDeleteSupplier = useCallback(() => {
    setLoading(true)
    deleteBulkSupplier({guids: dataChecked})
      .then((res: any) => {
        if (res.status === 200) {
          ToastMessage({message: res?.data?.message, type: 'success'})
          setTimeout(() => {
            setLoading(false)
            setShowModalConfirmBulk(false)
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
            setReloadDelete(deleteReload + 1)
          }, 1000)
        }
      })
      .catch((err: any) => {
        ToastMessage({message: err?.response?.data?.message, type: 'error'})
        setLoading(false)
      })
  }, [dataChecked, deleteReload, page, totalPage, totalPerPage])

  const msg_alert_bulk_delete: any = [
    'Are you sure you want to delete',
    <strong key='full_name'> {dataChecked?.length} </strong>,
    'supplier data?',
  ]

  const msg_alert: any = [
    'Are you sure you want to delete this supplier ',
    <strong key='full_name'>{supplierName}</strong>,
    '?',
  ]
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.SETUP.SETTINGS.SUPPLIERS'})}
      </PageTitle>

      <CardSupplier
        setShowModalConfirmBulk={setShowModalConfirmBulk}
        dataChecked={dataChecked}
        setDataChecked={setDataChecked}
        deleteReload={deleteReload}
        setSupplierName={setSupplierName}
        setSupplierGuid={setSupplierGuid}
        setShowModalConfirm={setShowModalConfirm}
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
        setShowModal={setShowModalConfirm}
        showModal={showModal}
        loading={loading}
        body={msg_alert}
        type={'delete'}
        title={'Delete Supplier'}
        confirmLabel={'Delete'}
        onConfirm={() => {
          confirmDeleteSupplier()
        }}
        onCancel={() => {
          setShowModalConfirm(false)
        }}
      />

      <Alert
        setShowModal={setShowModalConfirmBulk}
        showModal={showModalBulk}
        loading={loading}
        body={msg_alert_bulk_delete}
        type={'delete'}
        title={'Delete Supplier'}
        confirmLabel={'Delete'}
        onConfirm={() => {
          confirmBulkDeleteSupplier()
        }}
        onCancel={() => {
          setShowModalConfirmBulk(false)
        }}
      />
    </>
  )
}

export default Supplier
