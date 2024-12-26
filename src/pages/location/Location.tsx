/* eslint-disable react-hooks/exhaustive-deps */
import {deleteLocation} from '@api/Service'
import {Alert} from '@components/alert'
import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import {FC, useCallback, useState} from 'react'
import {useIntl} from 'react-intl'

import BulkDeleteLocation from './BulkDeleteLocation'
import CardLocationPage from './CardLocation'

const Locations: FC = () => {
  const intl: any = useIntl()

  const [loading, setLoading] = useState<boolean>(false)
  const [dataChecked, setDataChecked] = useState<any>([])
  const [total_asset, setTotalAsset] = useState<number>(0)
  const [reloadDelete, setReloadDelete] = useState<number>(1)
  const [locationname, setLocationName] = useState<string>('')
  const [locationguid, setLocationGuid] = useState<string>('')
  const [showModal, setShowModalConfirm] = useState<boolean>(false)
  const [reloadBulkLocation, setReloadBulkLocation] = useState<number>(0)
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)
  const [page, setPage] = useState<number>(1)
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)

  const confirmDeleteLocation = useCallback(() => {
    setLoading(true)
    deleteLocation(locationguid)
      .then(({data: {message}}: any) => {
        setTimeout(() => {
          const total_data_page: number = totalPage - pageFrom
          const current_page: number = page
          if (total_data_page - 1 <= 0) {
            if (current_page > 1) {
              setPage(current_page - 1)
            } else {
              setPage(current_page)
              setResetKeyword(true)
            }
          } else {
            setPage(current_page)
          }
          setLoading(false)
          setDataChecked([])
          setShowModalConfirm(false)
          setReloadDelete(reloadDelete + 1)
          ToastMessage({type: 'success', message})
        }, 1000)
      })
      .catch(() => setLoading(false))
  }, [locationguid, reloadDelete])

  let msg_alert: any = [
    'Are you sure you want to delete this location ',
    <strong key='location_name'>{locationname || ''}</strong>,
    '?',
  ]

  if (total_asset > 0) {
    msg_alert = [
      'Are you sure you want to delete this location ',
      <strong key='location_name'>{locationname || ''}</strong>,
      '?',
      <br key='newline1' />,
      <br key='newline2' />,
      <strong key='total_asset'>{total_asset || 0}</strong>,
      ' asset(s) is/are currently being assigned to this location. if you proceed to delete this location, it will be removed from the asset(s)',
    ]
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.LOCATION'})}</PageTitle>

      <CardLocationPage
        dataChecked={dataChecked}
        reloadDelete={reloadDelete}
        setTotalAsset={setTotalAsset}
        setDataChecked={setDataChecked}
        setLocationName={setLocationName}
        setLocationGuid={setLocationGuid}
        reloadBulkLocation={reloadBulkLocation}
        setShowModalConfirm={setShowModalConfirm}
        setShowModalConfirmBulk={setShowModalConfirmBulk}
        page={page}
        setPage={setPage}
        setPageFrom={setPageFrom}
        totalPage={totalPage}
        setTotalPage={setTotalPage}
        resetKeyword={resetKeyword}
        setResetKeyword={setResetKeyword}
      />

      <BulkDeleteLocation
        dataChecked={dataChecked}
        showModal={showModalBulk}
        setDataChecked={setDataChecked}
        reloadSubLocation={reloadBulkLocation}
        setShowModal={setShowModalConfirmBulk}
        setReloadSubLocation={setReloadBulkLocation}
        totalPage={totalPage}
        pageFrom={pageFrom}
        setPage={setPage}
        page={page}
        setResetKeyword={setResetKeyword}
      />

      <Alert
        type={'delete'}
        body={msg_alert}
        loading={loading}
        showModal={showModal}
        confirmLabel={'Delete'}
        title={'Delete Location'}
        setShowModal={setShowModalConfirm}
        onConfirm={() => confirmDeleteLocation()}
        onCancel={() => setShowModalConfirm(false)}
      />
    </>
  )
}

export default Locations
