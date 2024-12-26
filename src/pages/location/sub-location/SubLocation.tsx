import {PageTitle} from '@metronic/layout/core'
import {FC, useState} from 'react'
import {useIntl} from 'react-intl'

import {ModalAddSubLocation} from './AddSublocation'
import {BulkDeleteSubLocation} from './BulkDeleteSubLocation'
import {CardSubLocation} from './CardSubLocation'
import {DeleteSubLocation} from './DeleteSubLocation'
import {DetailSubLocation} from './DetailSubLocation'

const SubLocations: FC = () => {
  const intl = useIntl()
  const [subLocationName, setSubLocationName] = useState<string>('')
  const [subLocationGuid, setSubLocationGuid] = useState<string>('')
  const [reloadDelete] = useState<number>(0)
  const [reloadSubLocation, setReloadSubLocation] = useState<number>(0)
  const [subLocationDetail, setSubLocationDetail] = useState<any>()
  const [dataChecked, setDataChecked] = useState<any>([])
  const [showModalSubLocation, setShowModalSubLocation] = useState<boolean>(false)
  const [showModalSubLocationDetail, setShowModalSubLocationDetail] = useState<boolean>(false)
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)
  const [showModal, setShowModalConfirm] = useState<boolean>(false)
  const [optLocation, setOptionLocation] = useState<any>([])
  const [page, setPage] = useState<number>(1)
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)

  const onDelete = (e: any) => {
    const {name, guid} = e || {}
    setSubLocationName(name)
    setSubLocationGuid(guid)
    setShowModalConfirm(true)
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.SUBLOCATION'})}</PageTitle>
      <CardSubLocation
        onDelete={onDelete}
        reloadSubLocation={reloadSubLocation}
        reloadDelete={reloadDelete}
        setSubLocationDetail={setSubLocationDetail}
        setShowModalConfirmBulk={setShowModalConfirmBulk}
        dataChecked={dataChecked}
        setDataChecked={setDataChecked}
        setShowModalSubLocation={setShowModalSubLocation}
        setShowModalSubLocationDetail={setShowModalSubLocationDetail}
        setOptionLocation={setOptionLocation}
        page={page}
        setPage={setPage}
        setPageFrom={setPageFrom}
        totalPage={totalPage}
        setTotalPage={setTotalPage}
        resetKeyword={resetKeyword}
        setResetKeyword={setResetKeyword}
      />

      <ModalAddSubLocation
        showModal={showModalSubLocation}
        setShowModal={setShowModalSubLocation}
        setReloadSubLocation={setReloadSubLocation}
        reloadSubLocation={reloadSubLocation}
        subLocationDetail={subLocationDetail}
        location={optLocation}
      />

      <DeleteSubLocation
        showModal={showModal}
        setShowModal={setShowModalConfirm}
        setReloadSubLocation={setReloadSubLocation}
        reloadSubLocation={reloadSubLocation}
        subLocationName={subLocationName}
        subLocationGuid={subLocationGuid}
        setDataChecked={setDataChecked}
        totalPage={totalPage}
        pageFrom={pageFrom}
        setPage={setPage}
        page={page}
        setResetKeyword={setResetKeyword}
      />

      <BulkDeleteSubLocation
        showModal={showModalBulk}
        setShowModal={setShowModalConfirmBulk}
        setReloadSubLocation={setReloadSubLocation}
        reloadSubLocation={reloadSubLocation}
        dataChecked={dataChecked}
        setDataChecked={setDataChecked}
        totalPage={totalPage}
        pageFrom={pageFrom}
        setPage={setPage}
        page={page}
        setResetKeyword={setResetKeyword}
      />

      <DetailSubLocation
        showModal={showModalSubLocationDetail}
        setShowModal={setShowModalSubLocationDetail}
        subLocationDetail={subLocationDetail}
      />
    </>
  )
}

export default SubLocations
