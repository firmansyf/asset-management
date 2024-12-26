import {PageTitle} from '@metronic/layout/core'
import {FC, memo, useState} from 'react'
import {useIntl} from 'react-intl'

import BulkDeletePreventive from './bulkDelete'
import CardPreventive from './card'
import DeletePreventive from './delete'

let Preventive: FC = () => {
  const intl = useIntl()

  const [reloadPreventive, setReloadPreventive] = useState<number>(0)
  const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false)
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)
  const [dataChecked, setDataChecked] = useState<any>([])
  const [preventiveGuid, setPreventiveGuid] = useState<string>('')
  const [preventiveName, setPreventiveName] = useState<string>('')
  const [page, setPage] = useState<number>(1)
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)

  const onDelete = (e: any) => {
    const {guid, name} = e || {}
    setPreventiveName(name)
    setPreventiveGuid(guid)
    setShowModalConfirm(true)
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.MAINTENANCE.PREVENTIVE'})}
      </PageTitle>
      <CardPreventive
        onDelete={onDelete}
        setShowModalConfirmBulk={setShowModalConfirmBulk}
        reloadPreventive={reloadPreventive}
        dataChecked={dataChecked}
        setDataChecked={setDataChecked}
        page={page}
        setPage={setPage}
        setPageFrom={setPageFrom}
        totalPage={totalPage}
        setTotalPage={setTotalPage}
        resetKeyword={resetKeyword}
        setResetKeyword={setResetKeyword}
      />

      <DeletePreventive
        showModal={showModalConfirm}
        setShowModal={setShowModalConfirm}
        setReloadPreventive={setReloadPreventive}
        reloadPreventive={reloadPreventive}
        preventiveGuid={preventiveGuid}
        preventiveName={preventiveName}
        totalPage={totalPage}
        pageFrom={pageFrom}
        setPage={setPage}
        page={page}
        setResetKeyword={setResetKeyword}
      />

      <BulkDeletePreventive
        showModal={showModalBulk}
        setShowModal={setShowModalConfirmBulk}
        setReloadPreventive={setReloadPreventive}
        reloadPreventive={reloadPreventive}
        dataChecked={dataChecked}
        setDataChecked={setDataChecked}
        totalPage={totalPage}
        pageFrom={pageFrom}
        setPage={setPage}
        page={page}
        setResetKeyword={setResetKeyword}
      />
    </>
  )
}

Preventive = memo(
  Preventive,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default Preventive
