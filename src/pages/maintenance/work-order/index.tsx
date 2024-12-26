import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import {Forbidden} from '@metronic/partials'
import {FC, memo, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'

import CardWorkOrder from './card'
import DeleteWorkOrder from './delete'

let WorkOrder: FC = () => {
  const intl = useIntl()
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {feature} = preferenceStore || {}

  const [page, setPage] = useState<number>(1)
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [workOrderGuid, setWorkOrderGuid] = useState<any>()
  const [workOrderName, setWorkOrderName] = useState<any>()
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)
  const [reloadWorkOrder, setReloadWorkOrder] = useState<number>(0)
  const [pagePermission, setPagePermission] = useState<boolean>(true)
  const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false)

  useEffect(() => {
    if (Object.keys(feature)?.length > 0) {
      feature
        ?.filter((features: {unique_name: any}) => features?.unique_name === 'maintenance')
        ?.map((feature: any) => setPagePermission(feature?.value === 0 ? false : true))
    }
  }, [feature])

  const onDelete = (e: any) => {
    const {guid, wo_title}: any = e || {}
    ToastMessage({type: 'clear'})

    setShowModalConfirm(true)
    setWorkOrderGuid(guid || '')
    setWorkOrderName(wo_title || '')
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.MAINTENANCE.WORKORDER'})}
      </PageTitle>
      {!pagePermission ? (
        <Forbidden />
      ) : (
        <>
          <CardWorkOrder
            page={page}
            setPage={setPage}
            onDelete={onDelete}
            totalPage={totalPage}
            setPageFrom={setPageFrom}
            setTotalPage={setTotalPage}
            resetKeyword={resetKeyword}
            reloadWorkOrder={reloadWorkOrder}
            setResetKeyword={setResetKeyword}
            setReloadWorkOrder={setReloadWorkOrder}
          />

          <DeleteWorkOrder
            page={page}
            setPage={setPage}
            pageFrom={pageFrom}
            totalPage={totalPage}
            showModal={showModalConfirm}
            workOrderGuid={workOrderGuid}
            workOrderName={workOrderName}
            setResetKeyword={setResetKeyword}
            reloadWorkOrder={reloadWorkOrder}
            setShowModal={setShowModalConfirm}
            setReloadWorkOrder={setReloadWorkOrder}
          />
        </>
      )}
    </>
  )
}

WorkOrder = memo(WorkOrder, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default WorkOrder
