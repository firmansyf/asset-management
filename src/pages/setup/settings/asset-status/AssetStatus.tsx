import {PageTitle} from '@metronic/layout/core'
import {FC, useState} from 'react'
import {useIntl} from 'react-intl'

import {AddAssetStatus} from './AddAssetStatus'
import {BulkDeleteAssetStatus} from './BulkDeleteAssetStatus'
import CardAssetStatus from './CardAssetStatus'
import {DeleteAssetStatus} from './DeleteAssetStatus'
import {DetailAssetStatus} from './DetailAssetStatus'

const AssetStatus: FC = () => {
  const intl = useIntl()
  const [totalPage, setTotalPage] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [totalPerPage, setTotalPerPage] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)

  const [reloadDelete] = useState<number>(0)
  const [dataChecked, setDataChecked] = useState<any>([])
  const [showModal, setShowModalConfirm] = useState<boolean>(false)
  const [assetStatusName, setAssetStatusName] = useState<string>('')
  const [assetStatusGuid, setAssetStatusGuid] = useState<string>('')
  const [assetStatusDetail, setAssetStatusDetail] = useState<any>()
  const [assignAssetStatus, setAssignAssetStatus] = useState<any>([])
  const [reloadAssetStatus, setReloadAssetStatus] = useState<number>(0)
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)
  const [showModalAssetStatus, setShowModalAssetStatus] = useState<boolean>(false)
  const [showModalDetailAssetStatus, setShowModalDetailAssetStatus] = useState<boolean>(false)

  const onDelete = (e: any) => {
    const {name, guid}: any = e || {}
    setAssetStatusName(name || '')
    setAssetStatusGuid(guid || '')
    setShowModalConfirm(true)
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.SETUP.SETTINGS.ASSET_STATUS'})}
      </PageTitle>
      <CardAssetStatus
        page={page}
        setPage={setPage}
        setTotalPerPage={setTotalPerPage}
        totalPage={totalPage}
        setTotalPage={setTotalPage}
        resetKeyword={resetKeyword}
        setResetKeyword={setResetKeyword}
        onDelete={onDelete}
        dataChecked={dataChecked}
        reloadDelete={reloadDelete}
        setDataChecked={setDataChecked}
        reloadAssetStatus={reloadAssetStatus}
        setAssetStatusDetail={setAssetStatusDetail}
        setAssignAssetStatus={setAssignAssetStatus}
        setShowModalConfirmBulk={setShowModalConfirmBulk}
        setShowModalAssetStatus={setShowModalAssetStatus}
        setShowModalDetailAssetStatus={setShowModalDetailAssetStatus}
      />

      <AddAssetStatus
        showModal={showModalAssetStatus}
        reloadAssetStatus={reloadAssetStatus}
        assetStatusDetail={assetStatusDetail}
        setShowModal={setShowModalAssetStatus}
        setReloadAssetStatus={setReloadAssetStatus}
      />

      <DeleteAssetStatus
        showModal={showModal}
        setDataChecked={setDataChecked}
        assetStatusName={assetStatusName}
        assetStatusGuid={assetStatusGuid}
        setShowModal={setShowModalConfirm}
        reloadAssetStatus={reloadAssetStatus}
        assignAssetStatus={assignAssetStatus}
        setReloadAssetStatus={setReloadAssetStatus}
        totalPage={totalPage}
        totalPerPage={totalPerPage}
        page={page}
        setPage={setPage}
        setResetKeyword={setResetKeyword}
      />

      <BulkDeleteAssetStatus
        showModal={showModalBulk}
        dataChecked={dataChecked}
        setDataChecked={setDataChecked}
        reloadAssetStatus={reloadAssetStatus}
        assignAssetStatus={assignAssetStatus}
        setShowModal={setShowModalConfirmBulk}
        setReloadAssetStatus={setReloadAssetStatus}
        totalPage={totalPage}
        totalPerPage={totalPerPage}
        page={page}
        setPage={setPage}
        setResetKeyword={setResetKeyword}
      />

      <DetailAssetStatus
        reloadAssetStatus={reloadAssetStatus}
        assetStatusDetail={assetStatusDetail}
        showModal={showModalDetailAssetStatus}
        setReloadAssetStatus={setReloadAssetStatus}
        setShowModal={setShowModalDetailAssetStatus}
      />
    </>
  )
}

export default AssetStatus
