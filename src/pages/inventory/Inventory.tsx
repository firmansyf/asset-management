/* eslint-disable react-hooks/exhaustive-deps */
import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import {Forbidden} from '@metronic/partials'
import {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'

import BulkDeleteInventory from './BulkDeleteInventory'
import CardInventory from './CardInventory'
import DeleteInventory from './DeleteInventory'

const Inventory: FC = () => {
  const intl: any = useIntl()

  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [keyword, setKeyword] = useState<string>('')
  const [orderCol, setOrderCol] = useState<string>('inventory_idno')
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [filterAll, setFilterAll] = useState<any>({})
  const [reloadInventory, setReloadInventory] = useState<number>(0)
  const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false)
  const [inventoryGuid, setInventoryGuid] = useState<any>()
  const [inventoryName, setInventoryName] = useState<any>()
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)
  const [dataChecked, setDataChecked] = useState<any>([])
  const [pagePermission, setPagePermission] = useState<boolean>(true)
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)

  const onDelete = (e: any) => {
    const {guid, inventory_name}: any = e || {}
    setShowModalConfirm(true)
    setInventoryGuid(guid || '')
    setInventoryName(inventory_name || '')
  }

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.INVENTORY'})}</PageTitle>
      {!pagePermission ? (
        <Forbidden />
      ) : (
        <>
          <CardInventory
            onDelete={onDelete}
            reloadInventory={reloadInventory}
            setShowModalConfirmBulk={setShowModalConfirmBulk}
            dataChecked={dataChecked}
            setDataChecked={setDataChecked}
            page={page}
            setPage={setPage}
            limit={limit}
            setLimit={setLimit}
            totalPage={totalPage}
            keyword={keyword}
            setKeyword={setKeyword}
            orderCol={orderCol}
            setOrderCol={setOrderCol}
            orderDir={orderDir}
            setOrderDir={setOrderDir}
            setPageFrom={setPageFrom}
            filterAll={filterAll}
            setFilterAll={setFilterAll}
            resetKeyword={resetKeyword}
            setResetKeyword={setResetKeyword}
            pagePermission={pagePermission}
            setPagePermission={setPagePermission}
            setTotalPage={setTotalPage}
          />

          <DeleteInventory
            showModal={showModalConfirm}
            setShowModal={setShowModalConfirm}
            setReloadInventory={setReloadInventory}
            reloadInventory={reloadInventory}
            inventoryGuid={inventoryGuid}
            inventoryName={inventoryName}
            setDataChecked={setDataChecked}
            totalPage={totalPage}
            pageFrom={pageFrom}
            setPage={setPage}
            page={page}
            setResetKeyword={setResetKeyword}
          />

          <BulkDeleteInventory
            showModal={showModalBulk}
            setShowModal={setShowModalConfirmBulk}
            setReloadInventory={setReloadInventory}
            reloadInventory={reloadInventory}
            dataChecked={dataChecked}
            setDataChecked={setDataChecked}
            totalPage={totalPage}
            pageFrom={pageFrom}
            setPage={setPage}
            page={page}
            setResetKeyword={setResetKeyword}
          />
        </>
      )}
    </>
  )
}

export default Inventory
