/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import {FC, useCallback, useState} from 'react'
import {useIntl} from 'react-intl'

import {AddManufacturer} from './AddManufacturer'
import CardManufacturer from './CardManufacturer'
import {DetailManufacturer} from './DetailManufacturer'
import {deleteBulkManufacturer, deleteManufacturer} from './Service'

const Manufacturer: FC = () => {
  const intl: any = useIntl()
  const [totalPage, setTotalPage] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [totalPerPage, setTotalPerPage] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)

  const [loading, setLoading] = useState<boolean>(false)
  const [dataChecked, setDataChecked] = useState<any>([])
  const [deleteReload, setReloadDelete] = useState<number>(0)
  const [showModal, setShowModalConfirm] = useState<boolean>(false)
  const [manufacturerDetail, setManufacturerDetail] = useState<any>()
  const [manufacturerName, setManufacturerName] = useState<string>('')
  const [manufacturerGuid, setManufacturerGuid] = useState<string>('')
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false)
  const [reloadManufacturer, setReloadManufacturer] = useState<number>(0)
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)
  const [showModalManufacturer, setShowModalManufacturer] = useState<boolean>(false)

  const confirmDeleteManufacturer = useCallback(() => {
    setLoading(true)
    deleteManufacturer(manufacturerGuid)
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
  }, [manufacturerGuid, deleteReload, page, totalPage, totalPerPage])

  const onDelete = (e: any) => {
    const {name, guid} = e || {}
    setManufacturerName(name || '')
    setManufacturerGuid(guid || '')
    setShowModalConfirm(true)
  }

  const confirmBulkDeleteManufacturer = useCallback(() => {
    setLoading(true)
    deleteBulkManufacturer({guids: dataChecked})
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
            setReloadDelete(deleteReload + 1)
          }, 1000)
        }
      })
      .catch(({response}: any) => {
        setLoading(false)
        const {message}: any = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }, [dataChecked, deleteReload, page, totalPage, totalPerPage])

  const msg_alert: any = [
    'Are you sure you want to delete this manufacturer ',
    <strong key='manufacture_name'>{manufacturerName || ''}</strong>,
    '?',
  ]

  const msg_alert_bulk_delete: any = [
    'Are you sure you want to delete',
    <strong key='full_name'> {dataChecked?.length || 0} </strong>,
    'manufacturer data?',
  ]

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.SETUP.SETTINGS.MANUFACTURER'})}
      </PageTitle>

      <CardManufacturer
        onDelete={onDelete}
        deleteReload={deleteReload}
        dataChecked={dataChecked}
        setDataChecked={setDataChecked}
        setShowModalDetail={setShowModalDetail}
        reloadManufacturer={reloadManufacturer}
        setManufacturerDetail={setManufacturerDetail}
        setShowModalConfirmBulk={setShowModalConfirmBulk}
        setShowModalManufacturer={setShowModalManufacturer}
        setPage={setPage}
        page={page}
        totalPage={totalPage}
        setTotalPage={setTotalPage}
        setTotalPerPage={setTotalPerPage}
        resetKeyword={resetKeyword}
        setResetKeyword={setResetKeyword}
      />

      <AddManufacturer
        showModal={showModalManufacturer}
        reloadManufacturer={reloadManufacturer}
        manufacturerDetail={manufacturerDetail}
        setShowModal={setShowModalManufacturer}
        setReloadManufacturer={setReloadManufacturer}
      />

      <Alert
        type={'delete'}
        body={msg_alert}
        loading={loading}
        showModal={showModal}
        confirmLabel={'Delete'}
        title={'Delete Manufacturer'}
        setShowModal={setShowModalConfirm}
        onCancel={() => setShowModalConfirm(false)}
        onConfirm={() => confirmDeleteManufacturer()}
      />

      <Alert
        type={'delete'}
        loading={loading}
        confirmLabel={'Delete'}
        showModal={showModalBulk}
        body={msg_alert_bulk_delete}
        title={'Delete Manufacturer'}
        setShowModal={setShowModalConfirmBulk}
        onCancel={() => setShowModalConfirmBulk(false)}
        onConfirm={() => confirmBulkDeleteManufacturer()}
      />

      <DetailManufacturer
        showModal={showModalDetail}
        dataDetail={manufacturerDetail}
        setShowModal={setShowModalDetail}
      />
    </>
  )
}

export default Manufacturer
