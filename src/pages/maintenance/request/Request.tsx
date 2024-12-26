/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import {Forbidden} from '@metronic/partials'
import {FC, useCallback, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'

import {CardRequest} from './CardRequest'
import UpdateStatusConfirm from './confirm/ConfirmModal'
import {deleteRequest} from './core/service'
import {FormSettingsModal} from './formSettings'

const Request: FC = () => {
  const intl: any = useIntl()
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {feature} = preferenceStore || {}

  const [page, setPage] = useState<number>(1)
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [titleName, setTitleName] = useState<string>('')
  const [dataChecked, setDataChecked] = useState<any>([])
  const [reloadTable, setReloadTable] = useState<number>(0)
  const [requestGuid, setRequestGuid] = useState<string>('')
  const [reloadDelete, setReloadDelete] = useState<number>(0)
  const [settingFormData, setSettingFormData] = useState<any>()
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)
  const [showModal, setShowModalConfirm] = useState<boolean>(false)
  const [settingFormOption, setSettingFormOption] = useState<any>()
  const [pagePermission, setPagePermission] = useState<boolean>(true)
  const [reloadSettingForm, setReloadSettingForm] = useState<number>(0)
  const [showModalBulkStatus, setShowModalBulkStatus] = useState<boolean>(false)
  const [showModalFormSettings, setShowModalFormSettings] = useState<boolean>(false)

  const msg_alert: any = [
    'Are you sure you want to delete this ',
    <strong key='full_name'>{titleName || ''}</strong>,
    ' Request?',
  ]

  const handleDelete = useCallback(() => {
    setLoading(true)
    deleteRequest(requestGuid)
      .then(({data: {message}}: any) => {
        const total_data_page: number = totalPage - pageFrom
        const thisPage: any = page
        if (total_data_page - 1 <= 0) {
          if (thisPage > 1) {
            setPage(thisPage - 1)
          } else {
            setPage(thisPage)
            setResetKeyword(true)
          }
        } else {
          setPage(thisPage)
        }

        setLoading(false)
        setDataChecked([])
        setShowModalConfirm(false)
        setReloadDelete(reloadDelete + 1)
        ToastMessage({message, type: 'success'})
      })
      .catch(({response}: any) => {
        const {message}: any = response?.data || {}
        ToastMessage({message, type: 'error'})
        setLoading(false)
      })
  }, [requestGuid, reloadDelete])

  useEffect(() => {
    if (Object.keys(feature || {})?.length > 0) {
      feature
        ?.filter((features: {unique_name: any}) => features?.unique_name === 'maintenance')
        ?.map((feature: any) => setPagePermission(feature?.value === 0 ? false : true))
    }
  }, [feature])

  useEffect(() => {
    setSettingFormData({})
    setSettingFormOption({})
  }, [reloadSettingForm])

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MAINTENANCE.REQUEST'})}</PageTitle>
      {!pagePermission ? (
        <Forbidden />
      ) : (
        <>
          <CardRequest
            page={page}
            setPage={setPage}
            totalPage={totalPage}
            setTitle={setTitleName}
            setGuid={setRequestGuid}
            setPageFrom={setPageFrom}
            dataChecked={dataChecked}
            setTotalPage={setTotalPage}
            reloadDelete={reloadDelete}
            resetKeyword={resetKeyword}
            setDataChecked={setDataChecked}
            setResetKeyword={setResetKeyword}
            setShowModalConfirm={setShowModalConfirm}
            setShowModalFormSettings={setShowModalFormSettings}
          />

          <UpdateStatusConfirm
            dataChecked={dataChecked}
            reloadTable={reloadTable}
            showModal={showModalBulkStatus}
            setDataChecked={setDataChecked}
            setReloadTable={setReloadTable}
            setShowModal={setShowModalBulkStatus}
          />

          <FormSettingsModal
            showModal={showModalFormSettings}
            settingFormData={settingFormData}
            settingFormOption={settingFormOption}
            reloadSettingForm={reloadSettingForm}
            setShowModal={setShowModalFormSettings}
            setReloadSettingForm={setReloadSettingForm}
          />

          <Alert
            type={'delete'}
            body={msg_alert}
            loading={loading}
            showModal={showModal}
            confirmLabel={'Delete'}
            title={'Delete Request'}
            setShowModal={setShowModalConfirm}
            onConfirm={() => handleDelete()}
            onCancel={() => setShowModalConfirm(false)}
          />
        </>
      )}
    </>
  )
}

export default Request
