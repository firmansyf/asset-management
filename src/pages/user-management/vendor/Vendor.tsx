import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'

import {AddVendor} from './AddVendor'
import {BulkDeleteVendor} from './BulkDeleteVendor'
import CardVendor from './CardVendor'
import {DeleteVendor} from './DeleteVendor'
import {DetailVendor} from './DetailVendor'

const Vendor: FC = () => {
  const intl: any = useIntl()

  const [filterStatus] = useState<any>('')
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [filterAll, setFilterAll] = useState<any>({})
  const [totalPage, setTotalPage] = useState<number>(0)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [dataChecked, setDataChecked] = useState<any>([])
  const [vendorGuid, setVendorGuid] = useState<string>('')
  const [vendorName, setVendorName] = useState<string>('')
  const [vendorDetail, setVendorDetail] = useState<any>({})
  const [reloadVendor, setReloadVendor] = useState<number>(0)
  const [orderCol, setOrderCol] = useState<string>('vendor_id')
  const [showModal, setShowModaVendor] = useState<boolean>(false)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false)
  const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false)
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)

  const onDelete = (e: any) => {
    const {guid, name} = e || {}
    setVendorName(name || '')
    setVendorGuid(guid || '')
    setShowModalConfirm(true)
  }

  useEffect(() => {
    setTimeout(() => ToastMessage({type: 'clear'}), 800)
  }, [])

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.VENDOR'})}</PageTitle>

      <CardVendor
        page={page}
        limit={limit}
        keyword={keyword}
        setPage={setPage}
        orderCol={orderCol}
        setLimit={setLimit}
        onDelete={onDelete}
        orderDir={orderDir}
        filterAll={filterAll}
        totalPage={totalPage}
        setKeyword={setKeyword}
        dataChecked={dataChecked}
        setOrderCol={setOrderCol}
        setPageFrom={setPageFrom}
        setOrderDir={setOrderDir}
        reloadVendor={reloadVendor}
        setFilterAll={setFilterAll}
        resetKeyword={resetKeyword}
        setTotalPage={setTotalPage}
        filterStatus={filterStatus}
        setDataChecked={setDataChecked}
        setResetKeyword={setResetKeyword}
        setVendorDetail={setVendorDetail}
        setShowModaVendor={setShowModaVendor}
        setShowModalDetail={setShowModalDetail}
        setShowModalConfirmBulk={setShowModalConfirmBulk}
      />

      <AddVendor
        showModal={showModal}
        reloadVendor={reloadVendor}
        vendorDetail={vendorDetail}
        setReloadVendor={setReloadVendor}
        setShowModaVendor={setShowModaVendor}
      />

      <DeleteVendor
        page={page}
        setPage={setPage}
        pageFrom={pageFrom}
        totalPage={totalPage}
        vendorGuid={vendorGuid}
        vendorName={vendorName}
        reloadVendor={reloadVendor}
        showModal={showModalConfirm}
        setDataChecked={setDataChecked}
        setResetKeyword={setResetKeyword}
        setReloadVendor={setReloadVendor}
        setShowModal={setShowModalConfirm}
      />

      <BulkDeleteVendor
        page={page}
        setPage={setPage}
        pageFrom={pageFrom}
        totalPage={totalPage}
        dataChecked={dataChecked}
        showModal={showModalBulk}
        reloadVendor={reloadVendor}
        setDataChecked={setDataChecked}
        setReloadVendor={setReloadVendor}
        setResetKeyword={setResetKeyword}
        setShowModal={setShowModalConfirmBulk}
      />

      <DetailVendor
        vendorDetail={vendorDetail}
        showModal={showModalDetail}
        setShowModal={setShowModalDetail}
      />
    </>
  )
}

export default Vendor
