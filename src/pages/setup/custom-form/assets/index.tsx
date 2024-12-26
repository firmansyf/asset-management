import {Alert} from '@components/alert'
import CustomForm from '@components/dnd-kit/index'
import {ToastMessage} from '@components/toast-message'
import {errorValidation} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import flatMap from 'lodash/flatMap'
import qs from 'qs'
import {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {useLocation, useNavigate} from 'react-router-dom'

import AddEditGroup from '../addEditGroup'
import {deleteGroup, getCustomForm, saveCustomForm} from '../service'

interface PutDataTypes {
  guid: string
  order: number
  parent_guid?: string | null
}

const Index: FC<any> = () => {
  const intl = useIntl()
  const navigate = useNavigate()
  const {search} = useLocation()
  const {id} = qs.parse(search, {ignoreQueryPrefix: true}) || {}
  const [data, setData] = useState<any>([])
  const [showModalSave, setShowModalSave] = useState<boolean>(false)
  const [showModalGroup, setShowModalGroup] = useState<boolean>(false)
  const [showModalDeleteGroup, setShowModalDeleteGroup] = useState<boolean>(false)
  const [loadingBtn, setLoadingBtn] = useState<boolean>(false)
  const [reload, setReload] = useState<boolean>(false)
  const [detail, setDetail] = useState<any>(undefined)
  const [pageIsLoading, setPageIsLoading] = useState<boolean>(false)
  useEffect(() => {
    setPageIsLoading(true)
    getCustomForm('asset')
      .then(({data: {data}}: any) => {
        setData(data?.filter(({forms}: any) => forms))
        setTimeout(() => {
          setPageIsLoading(false)
        }, 1000)
      })
      .catch(() => {
        setPageIsLoading(false)
      })
  }, [reload])
  const onSave: any = () => {
    setLoadingBtn(true)
    const arrGroup: Array<PutDataTypes> = data?.map(({guid, order}: PutDataTypes) => ({
      guid,
      order,
      parent_guid: null,
    }))
    const arrForms: Array<PutDataTypes> = flatMap(
      data,
      ({forms}: any) =>
        forms?.map(({guid, order, parent_guid}: PutDataTypes) => ({guid, order, parent_guid}))
    )
    const forms: Array<PutDataTypes> = [...arrGroup, ...arrForms]
    saveCustomForm({module: 'asset', forms})
      .then(({data: {message}}: any) => {
        setLoadingBtn(false)
        setShowModalSave(false)
        ToastMessage({type: 'success', message})
        setTimeout(() => {
          navigate(id ? `/asset-management/edit?id=${id}` : '/asset-management/add')
        }, 100)
      })
      .catch((err: any) => {
        setLoadingBtn(false)
        Object.values(errorValidation(err) || {}).map((message: any) =>
          ToastMessage({type: 'error', message})
        )
      })
  }
  const onDeleteGroup: any = () => {
    setLoadingBtn(true)
    const arrGroup: Array<PutDataTypes> = data?.map(({guid, order}: PutDataTypes) => ({
      guid,
      order,
      parent_guid: null,
    }))
    const arrForms: Array<PutDataTypes> = flatMap(
      data,
      ({forms}: any) =>
        forms?.map(({guid, order, parent_guid}: PutDataTypes) => ({guid, order, parent_guid}))
    )
    const forms: Array<PutDataTypes> = [...arrGroup, ...arrForms]
    saveCustomForm({module: 'asset', forms}).then(() => {
      deleteGroup(detail?.guid)
        .then(({data: {data: res, message}}: any) => {
          setData((prev: any) => prev?.filter(({guid}: any) => guid !== res?.guid))
          setLoadingBtn(false)
          setShowModalDeleteGroup(false)
          ToastMessage({type: 'success', message})
        })
        .catch((err: any) => {
          setLoadingBtn(false)
          Object.values(errorValidation(err) || {}).map((message: any) =>
            ToastMessage({type: 'error', message})
          )
        })
    })
  }
  return (
    <>
      <PageTitle>{intl.formatMessage({id: 'MENU.SETUP.CUSTOM_FORM.ASSET'})}</PageTitle>
      <CustomForm
        data={data}
        onChange={setData}
        loading={pageIsLoading}
        onAddGroup={() => {
          setDetail(undefined)
          setShowModalGroup(true)
        }}
        onEditGroup={(e: any) => {
          setDetail(e)
          setShowModalGroup(true)
        }}
        onDeleteGroup={(e: any) => {
          setDetail(e)
          setShowModalDeleteGroup(true)
        }}
        onSave={() => setShowModalSave(true)}
      />
      {/* MODAL SAVE */}
      <Alert
        showModal={showModalSave}
        setShowModal={setShowModalSave}
        loading={loadingBtn}
        body={
          <div>
            Are you sure want to save <strong>&quot;Custom Asset Form&quot;</strong> ?
          </div>
        }
        type={'save'}
        key={'save'}
        title={`Save Asset Form`}
        confirmLabel={'Save'}
        onConfirm={onSave}
        onCancel={() => setShowModalSave(false)}
      />
      {/* MODAL DELETE GROUP */}
      <Alert
        showModal={showModalDeleteGroup}
        setShowModal={setShowModalDeleteGroup}
        loading={loadingBtn}
        body={
          <div>
            Are you sure want to delete <strong>&quot;{detail?.label}&quot;</strong> ?
          </div>
        }
        type={'delete'}
        key={'delete'}
        title={`Delete Group`}
        confirmLabel={'Delete'}
        onConfirm={onDeleteGroup}
        onCancel={() => setShowModalDeleteGroup(false)}
      />
      {/* MODAL ADD EDIT GROUP */}
      <AddEditGroup
        moduleName='asset'
        show={showModalGroup}
        setShow={setShowModalGroup}
        detail={detail}
        setReload={(res: any) => {
          const isExist: any = data?.find(({guid}: any) => guid === res?.guid)?.guid
          if (isExist) {
            const result: any = data?.map((m: any) => {
              if (res?.guid === m?.guid) {
                m.label = res?.label || m?.label
              }
              return m
            })
            setData(result)
          } else {
            setReload(!reload)
          }
        }}
      />
    </>
  )
}

export default Index
