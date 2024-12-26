import {Alert} from '@components/alert'
import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import {FC, useCallback, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'

import {getPeril} from '../type-of-perils/Service'
import {AddclaimDocument} from './AddClaimDocument'
import {CardDocument} from './CardDocument'
import {DetailClaimDocument} from './DetailClaimDocument'
import {deleteDocument} from './Service'

const ClaimDocument: FC = () => {
  const intl = useIntl()
  const [showModal, setShowModalConfirm] = useState(false)
  const [perilName, setPerilName] = useState('')
  const [perilGuid, setPerilGuid] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleteReload, setReloadDelete] = useState(0)
  const [reloadDocument, setReloadDocument] = useState(0)
  const [documentDetail, setDocumentDetail] = useState()
  const [showModalDocument, setShowModalDocument] = useState(false)
  const [showModalDetail, setShowModalDetail] = useState(false)
  const [optPerils, setDataPeril] = useState([])

  useEffect(() => {
    getPeril({})
      .then(({data: {data: res}}) => {
        setDataPeril(res)
      })
      .catch(() => '')
  }, [])

  const confirmDelete = useCallback(() => {
    setLoading(true)
    deleteDocument(perilGuid)
      .then((res: any) => {
        setTimeout(() => {
          ToastMessage({message: res?.data?.message, type: 'error'})
          setLoading(false)
          setShowModalConfirm(false)
          setReloadDelete(deleteReload + 1)
        }, 1000)
      })
      .catch((e: any) => {
        setLoading(false)
        ToastMessage({message: e?.response?.data?.message, type: 'error'})
      })
  }, [deleteReload, perilGuid])

  const onDelete = (e: any) => {
    const {name, guid} = e || {}
    setPerilName(name)
    setPerilGuid(guid)
    setShowModalConfirm(true)
  }

  const msg_alert = [
    'Are you sure you want to delete this document ',
    <strong key='peril_name'>{perilName}</strong>,
    '?',
  ]

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.SETUP.INSURANCE.DOCUMENT'})}
      </PageTitle>
      <CardDocument
        onDelete={onDelete}
        deleteReload={deleteReload}
        reloadDocument={reloadDocument}
        setDocumentDetail={setDocumentDetail}
        setShowModalDocument={setShowModalDocument}
        setShowModalDetail={setShowModalDetail}
      />

      <AddclaimDocument
        showModal={showModalDocument}
        setShowModal={setShowModalDocument}
        setReload={setReloadDocument}
        reload={reloadDocument}
        detail={documentDetail}
        optPerils={optPerils}
      />

      <DetailClaimDocument
        showModal={showModalDetail}
        setShowModal={setShowModalDetail}
        detail={documentDetail}
      />

      <Alert
        setShowModal={setShowModalConfirm}
        showModal={showModal}
        loading={loading}
        body={msg_alert}
        type={'delete'}
        title={'Delete Document'}
        confirmLabel={'Delete'}
        onConfirm={() => {
          confirmDelete()
        }}
        onCancel={() => {
          setShowModalConfirm(false)
        }}
      />
    </>
  )
}

export default ClaimDocument
