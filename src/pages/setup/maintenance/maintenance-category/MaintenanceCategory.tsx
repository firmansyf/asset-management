import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import {FC, memo, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'

import ModalAddMintenanceCategory from './AddMaintenanceCategory'
import CardMaintenanceCategory from './CardMintenanceCategory'
import ModalDeleteMintenanceCategory from './DeleteMaintenanceCategory'
import ModalDetailMintenanceCategory from './DetailMaintenanceCategory'

let MaintenanceCategory: FC = () => {
  const intl = useIntl()
  const [showModal, setShowModalConfirm] = useState<boolean>(false)
  const [reloadMaintenanceCategory, setReloadMaintenanceCategory] = useState<number>(0)
  const [detailMaintenanceCategory, setDetailMaintenanceCategory] = useState<number>()
  const [showModalCustomer, setShowModalCustomer] = useState<boolean>(false)
  const [showDetail, setShowDetail] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)

  const onDelete = (e: any) => {
    setDetailMaintenanceCategory(e)
    setShowModalConfirm(true)
  }

  const onDetail = (e: any) => {
    setDetailMaintenanceCategory(e)
    setShowDetail(true)
  }

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.SETUP.MAINTENANCE.MAINTENANCE_CATEGORY'})}
      </PageTitle>

      <CardMaintenanceCategory
        reloadMaintenanceCategory={reloadMaintenanceCategory}
        onDelete={onDelete}
        onDetail={onDetail}
        setDetailMaintenanceCategory={setDetailMaintenanceCategory}
        setShowModalCustomer={setShowModalCustomer}
        page={page}
        setPage={setPage}
        pageFrom={pageFrom}
        setPageFrom={setPageFrom}
        totalPage={totalPage}
        setTotalPage={setTotalPage}
        resetKeyword={resetKeyword}
        setResetKeyword={setResetKeyword}
      />

      <ModalAddMintenanceCategory
        setReloadMaintenanceCategory={setReloadMaintenanceCategory}
        reloadMaintenanceCategory={reloadMaintenanceCategory}
        showModal={showModalCustomer}
        setShowModal={setShowModalCustomer}
        detailMaintenanceCategory={detailMaintenanceCategory}
      />

      <ModalDeleteMintenanceCategory
        setReloadMaintenanceCategory={setReloadMaintenanceCategory}
        reloadMaintenanceCategory={reloadMaintenanceCategory}
        showModal={showModal}
        setShowModal={setShowModalConfirm}
        detailMaintenanceCategory={detailMaintenanceCategory}
        totalPage={totalPage}
        pageFrom={pageFrom}
        setPage={setPage}
        page={page}
        setResetKeyword={setResetKeyword}
      />

      <ModalDetailMintenanceCategory
        detailMaintenanceCategory={detailMaintenanceCategory}
        showDetail={showDetail}
        setShowDetail={setShowDetail}
      />
    </>
  )
}

MaintenanceCategory = memo(
  MaintenanceCategory,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default MaintenanceCategory
