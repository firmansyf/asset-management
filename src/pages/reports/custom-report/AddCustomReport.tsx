import {ToastMessage} from '@components/toast-message'
import {PageSubTitle} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {FC, memo, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {useLocation, useNavigate} from 'react-router-dom'

import {
  deleteCustomReport,
  detailCustomReport,
  saveCustomReport,
  updateCustomReport,
} from '../Service'
import CardReport from './CardReport'
import {initTableColumns as initColumns} from './constant'
import ModalDelete from './DeleteReport'
import ModalSaveAs from './SaveAs'
import ModalSetupColumns from './SetupColumn'

let AddCustomReport: FC = () => {
  const intl: any = useIntl()
  const location: any = useLocation()
  const navigate: any = useNavigate()
  const guid: any = new URLSearchParams(location?.search).get('type')

  const [saveType, setSaveType] = useState<any>({})
  const [columns, onSaveColumns] = useState<any>([])
  const [detailReport, setDetailReport] = useState<any>({})
  const [showModalSaveAs, setShowModalSaveAs] = useState<boolean>(false)
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false)
  const [showModalSetupColumns, setShowModalSetupColumns] = useState<boolean>(false)

  const onSubmitReport = (e: any) => {
    if (saveType === 'save' || saveType === 'update') {
      updateCustomReport(guid, {...e, columns})
        .then(
          ({
            data: {
              message,
              data: {guid},
            },
          }: any) => {
            detailCustomReport(guid)
              .then(({data: {data: detail}}: any) => {
                const {columns}: any = detail || {}
                setDetailReport(detail)
                onSaveColumns(columns)
              })
              .catch(() => '')

            setShowModalSaveAs(false)
            navigate(
              {
                pathname: '/reports/list-custom-report',
                search: `type=${guid}`,
              },
              {replace: true}
            )
            ToastMessage({type: 'success', message})
          }
        )
        .catch(({response}: any) => {
          const {devMessage, data, message} = response?.data || {}
          if (!devMessage) {
            const {fields} = data || {}
            if (fields === undefined) {
              ToastMessage({message: message, type: 'error'})
            }
            fields &&
              Object.keys(fields || {})?.forEach((item: any) => {
                ToastMessage({message: fields[item]?.[0], type: 'error'})
              })
          }
        })
    } else {
      saveCustomReport({...e, columns})
        .then(
          ({
            data: {
              message,
              data: {guid},
            },
          }: any) => {
            setShowModalSaveAs(false)
            navigate({
              pathname: '/reports/list-custom-report',
              search: `type=${guid}`,
            })
            ToastMessage({type: 'success', message})
          }
        )
        .catch(({response}: any) => {
          const {devMessage, data, message} = response?.data || {}
          if (!devMessage) {
            const {fields} = data || {}
            if (fields === undefined) {
              ToastMessage({message: message, type: 'error'})
            }
            fields &&
              Object.keys(fields || {})?.forEach((item: any) => {
                ToastMessage({message: fields[item]?.[0], type: 'error'})
              })
          }
        })
    }
  }

  const onDeleteReport = (guid: string) => {
    if (guid) {
      deleteCustomReport(guid)
        .then(({data: {message}}: any) => {
          setShowModalDelete(false)
          navigate({
            pathname: '/reports/list-custom-report',
            search: 'type=new',
          })
          ToastMessage({type: 'success', message})
        })
        .catch(() => '')
    }
  }

  useEffect(() => {
    if (guid === 'new' || !guid) {
      setDetailReport({})
      onSaveColumns(initColumns.map(({value}: any) => value))
    } else {
      detailCustomReport(guid)
        .then(({data: {data}}: any) => {
          const {columns} = data || {}
          setDetailReport(data)
          onSaveColumns(columns)
        })
        .catch(() => '')
    }
  }, [guid])

  return (
    <>
      <PageTitle breadcrumbs={[]} arrowBack={{isActive: true, url: '/reports/custom-report'}}>
        {detailReport?.name || intl.formatMessage({id: 'MENU.REPORTS.CUSTOM_REPORT'})}
      </PageTitle>
      <PageSubTitle title={`Set up your own customized report`} />
      <CardReport
        detailReport={detailReport}
        columns={columns}
        setShowModalSaveAs={setShowModalSaveAs}
        setSaveType={setSaveType}
        setShowModalDelete={setShowModalDelete}
        setShowModalSetupColumns={setShowModalSetupColumns}
      />
      <ModalSetupColumns
        columns={columns}
        showModal={showModalSetupColumns}
        setShowModal={setShowModalSetupColumns}
        onSaveColumns={onSaveColumns}
      />
      <ModalSaveAs
        detailReport={detailReport}
        showModal={showModalSaveAs}
        setShowModal={setShowModalSaveAs}
        saveType={saveType}
        onSubmitReport={onSubmitReport}
      />
      <ModalDelete
        detailReport={detailReport}
        showModal={showModalDelete}
        setShowModal={setShowModalDelete}
        onDeleteReport={onDeleteReport}
      />
    </>
  )
}

AddCustomReport = memo(
  AddCustomReport,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default AddCustomReport
