/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import {ToastMessage} from '@components/toast-message'
import {PageLink, PageTitle} from '@metronic/layout/core'
import {FC, memo, useCallback, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'

import {messageAlert} from '../component/CustomFieldHelpers'
import {checkDeleteCustomField, deleteCustomFieldAsset} from '../redux/ReduxCustomField'
import CardCustomFieldWorkOrder from './CardCustomFieldWorkOrder'

let CustomFieldWorkOrder: FC = () => {
  const intl: any = useIntl()
  const breadCrumbs: Array<PageLink> = []
  const [showModal, setShowModalConfirm] = useState<boolean>(false)
  const [cfDetail, setCFDetail] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [reloadData, setReloadData] = useState<any>(0)
  const [checked, setChecked] = useState<any>([])
  const [checkDelete, setCheckDelete] = useState<any>({})
  const [mandatoryDelete, setMandatoryDelete] = useState<any>(false)
  const [page, setPage] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)
  const [pageFrom, setPageFrom] = useState<number>(0)

  const confirmDeleteCF = useCallback(() => {
    setLoading(true)
    deleteCustomFieldAsset(cfDetail?.guid)
      .then(({data: {message}}: any) => {
        setTimeout(() => {
          ToastMessage({type: 'success', message: message})
          setLoading(false)
          setShowModalConfirm(false)
          setReloadData(reloadData + 1)
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
          setChecked([])
        }, 1000)
      })
      .catch((err: any) => {
        ToastMessage({message: err?.response?.data?.message, type: 'error'})
      })
  }, [cfDetail, reloadData])

  const onDelete = (e: any) => {
    const params: any = {
      section_type: 'maintenance',
      guids: [e?.guid],
    }

    if (e?.rules) {
      e?.rules?.map((item: any) => {
        if (item?.key === 'required') {
          setMandatoryDelete(item?.value !== 'nullable' ? true : false)
        }
        return null
      })
    }

    setCFDetail(e)
    setShowModalConfirm(true)
    checkDeleteCustomField(params)
      .then(({data: res}: any) => {
        if (res) {
          setCheckDelete(res)
        }
      })
      .catch(() => setCheckDelete([]))
  }

  const msg_alert: any = messageAlert(cfDetail?.name, checkDelete?.error, mandatoryDelete)

  useEffect(() => {
    ToastMessage({type: 'clear'})
    return () => {
      ToastMessage({type: 'clear'})
    }
  }, [])

  return (
    <>
      <PageTitle breadcrumbs={breadCrumbs}>
        {intl.formatMessage({id: 'PAGETITLE.SETUP.CUSTOM_FIELDS.MAINTENANCE'})}
      </PageTitle>
      <CardCustomFieldWorkOrder
        onDelete={onDelete}
        setReloadData={setReloadData}
        reloadData={reloadData}
        checked={checked}
        setChecked={setChecked}
        totalPage={totalPage}
        setTotalPage={setTotalPage}
        resetKeyword={resetKeyword}
        setResetKeyword={setResetKeyword}
        pageFrom={pageFrom}
        setPageFrom={setPageFrom}
        page={page}
        setPage={setPage}
      />
      <Alert
        setShowModal={setShowModalConfirm}
        showModal={showModal}
        loading={loading}
        body={msg_alert}
        type={'delete'}
        title={'Delete Custom Field Maintenance'}
        confirmLabel={'Delete'}
        onConfirm={() => {
          confirmDeleteCF()
        }}
        onCancel={() => {
          setShowModalConfirm(false)
        }}
      />
    </>
  )
}

CustomFieldWorkOrder = memo(
  CustomFieldWorkOrder,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default CustomFieldWorkOrder
