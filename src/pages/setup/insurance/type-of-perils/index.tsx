import {Alert} from '@components/alert'
import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import {FC, useCallback, useState} from 'react'
import {useIntl} from 'react-intl'

import {AddTypeOfPeril} from './AddTypeOfPeril'
import {CardTypeOfPeril} from './CardTypeOfPeril'
import {DetailPeril} from './DetailTypeOfPeril'
import {deletePeril} from './Service'

const TypeOfPeril: FC = () => {
  const intl = useIntl()
  const [showModal, setShowModalConfirm] = useState(false)
  const [perilName, setPerilName] = useState('')
  const [perilGuid, setGuid] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleteReload, setReloadDelete] = useState(0)
  const [dataChecked, setDataChecked] = useState([])
  const [reloadPeril, setReloadPeril] = useState(0)
  const [perilDetail, setPerilDetail] = useState()
  const [showModalPeril, setShowModalPeril] = useState(false)
  const [showModalDetail, setShowModalDetail] = useState(false)

  const confirmDelete = useCallback(() => {
    setLoading(true)
    deletePeril(perilGuid)
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
    setGuid(guid)
    setShowModalConfirm(true)
  }

  const msg_alert = [
    'Are you sure you want to delete this peril ',
    <strong key='peril_name'>{perilName}</strong>,
    '?',
  ]

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.SETUP.INSURANCE.PERILS'})}
      </PageTitle>
      <CardTypeOfPeril
        onDelete={onDelete}
        deleteReload={deleteReload}
        dataChecked={dataChecked}
        setDataChecked={setDataChecked}
        reloadPeril={reloadPeril}
        setPerilDetail={setPerilDetail}
        setShowModalPeril={setShowModalPeril}
        setShowModalDetail={setShowModalDetail}
      />

      <AddTypeOfPeril
        showModal={showModalPeril}
        setShowModal={setShowModalPeril}
        setReload={setReloadPeril}
        reload={reloadPeril}
        detail={perilDetail}
      />

      <DetailPeril
        showModal={showModalDetail}
        setShowModal={setShowModalDetail}
        detail={perilDetail}
      />

      <Alert
        setShowModal={setShowModalConfirm}
        showModal={showModal}
        loading={loading}
        body={msg_alert}
        type={'delete'}
        title={'Delete Peril'}
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

export default TypeOfPeril
