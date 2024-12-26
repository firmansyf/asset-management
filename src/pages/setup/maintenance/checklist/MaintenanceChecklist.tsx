import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import {FC, memo, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'

import CardMaintenanceChecklist from './CardMintenanceChecklist'
import ModalDeleteMintenanceChecklist from './DeleteMaintenanceChecklist'
import ModalDetailMintenanceChecklist from './DetailMaintenanceChecklist'

let MaintenanceChecklist: FC = () => {
  const intl = useIntl()

  const [showModal, setShowModalConfirm] = useState<boolean>(false)
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false)
  const [reloadMaintenanceChecklist, setReloadMaintenanceChecklist] = useState<number>(0)
  const [detailMaintenanceChecklist, setDetailMaintenanceChecklist] = useState<any>({})
  const [page, setPage] = useState<number>(1)
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)

  const onDelete = (e: any) => {
    setDetailMaintenanceChecklist(e)
    setShowModalConfirm(true)
    ToastMessage({type: 'clear'})
  }

  const onDetail = (e: any) => {
    setDetailMaintenanceChecklist(e)
    setShowModalDetail(true)
    ToastMessage({type: 'clear'})
  }

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.SETUP.MAINTENANCE.MAINTENANCE_CHECKLIST'})}
      </PageTitle>

      <CardMaintenanceChecklist
        reloadMaintenanceChecklist={reloadMaintenanceChecklist}
        onDelete={onDelete}
        onDetail={onDetail}
        page={page}
        setPage={setPage}
        pageFrom={pageFrom}
        setPageFrom={setPageFrom}
        totalPage={totalPage}
        setTotalPage={setTotalPage}
        resetKeyword={resetKeyword}
        setResetKeyword={setResetKeyword}
      />

      <ModalDetailMintenanceChecklist
        showModal={showModalDetail}
        setShowModal={setShowModalDetail}
        detail={detailMaintenanceChecklist}
      />

      <ModalDeleteMintenanceChecklist
        setReloadMaintenanceChecklist={setReloadMaintenanceChecklist}
        reloadMaintenanceChecklist={reloadMaintenanceChecklist}
        showModal={showModal}
        setShowModal={setShowModalConfirm}
        detailMaintenanceChecklist={detailMaintenanceChecklist}
        totalPage={totalPage}
        pageFrom={pageFrom}
        setPage={setPage}
        page={page}
        setResetKeyword={setResetKeyword}
      />
    </>
  )
}

MaintenanceChecklist = memo(
  MaintenanceChecklist,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default MaintenanceChecklist
