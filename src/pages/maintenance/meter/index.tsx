import {PageTitle} from '@metronic/layout/core'
import {FC, memo, useState} from 'react'
import {useIntl} from 'react-intl'

import BulkDeleteMeter from './bulkDelete'
import CardMeter from './card'
import DeleteMeter from './delete'

let Meter: FC = () => {
  const intl: any = useIntl()

  const [page, setPage] = useState<number>(1)
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [meterGuid, setMeterGuid] = useState<string>('')
  const [meterName, setMeterName] = useState<string>('')
  const [dataChecked, setDataChecked] = useState<any>([])
  const [reloadMeter, setReloadMeter] = useState<number>(0)
  const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false)
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)

  const onDelete = (e: any) => {
    const {guid, name}: any = e || {}

    setMeterName(name || '')
    setMeterGuid(guid || '')
    setShowModalConfirm(true)
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.MAINTENANCE.METER'})}</PageTitle>
      <CardMeter
        page={page}
        setPage={setPage}
        onDelete={onDelete}
        totalPage={totalPage}
        reloadMeter={reloadMeter}
        dataChecked={dataChecked}
        setPageFrom={setPageFrom}
        resetKeyword={resetKeyword}
        setTotalPage={setTotalPage}
        setReloadMeter={setReloadMeter}
        setDataChecked={setDataChecked}
        setResetKeyword={setResetKeyword}
        setShowModalConfirmBulk={setShowModalConfirmBulk}
      />

      <DeleteMeter
        page={page}
        setPage={setPage}
        pageFrom={pageFrom}
        meterGuid={meterGuid}
        meterName={meterName}
        totalPage={totalPage}
        reloadMeter={reloadMeter}
        showModal={showModalConfirm}
        setReloadMeter={setReloadMeter}
        setResetKeyword={setResetKeyword}
        setShowModal={setShowModalConfirm}
      />

      <BulkDeleteMeter
        page={page}
        setPage={setPage}
        pageFrom={pageFrom}
        totalPage={totalPage}
        reloadMeter={reloadMeter}
        dataChecked={dataChecked}
        showModal={showModalBulk}
        setDataChecked={setDataChecked}
        setReloadMeter={setReloadMeter}
        setResetKeyword={setResetKeyword}
        setShowModal={setShowModalConfirmBulk}
      />
    </>
  )
}

Meter = memo(Meter, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default Meter
