/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import {ToastMessage} from '@components/toast-message'
import {PageLink, PageTitle} from '@metronic/layout/core'
import {
  checkDeleteCustomField,
  deleteCustomFieldAsset,
} from '@pages/setup/custom-field/redux/ReduxCustomField'
import {FC, memo, useCallback, useState} from 'react'
import {useIntl} from 'react-intl'

import {messageAlert} from '../component/CustomFieldHelpers'
import CardCustomFieldAsset from './CardCustomFieldAsset'

let CustomFieldAsset: FC<any> = () => {
  const intl: any = useIntl()
  const breadCrumbs: Array<PageLink> = []
  const [cfDetail, setCFDetail] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [reloadData, setReloadData] = useState<number>(1)
  const [checkDelete, setCheckDelete] = useState<any>({})
  const [mandatoryDelete, setMandatoryDelete] = useState<any>(false)
  const [page, setPage] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [showModal, setShowModalConfirm] = useState<boolean>(false)

  const confirmDeleteCF = useCallback(() => {
    setLoading(true)
    deleteCustomFieldAsset(cfDetail?.guid)
      .then(({data: {message}}: any) => {
        setTimeout(() => {
          setLoading(false)
          setShowModalConfirm(false)
          setReloadData(reloadData + 1)
          ToastMessage({message, type: 'success'})
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
        }, 1000)
      })
      .catch(({response}: any) => {
        const {message} = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }, [cfDetail, reloadData])

  const onDelete = (e: any) => {
    const params: any = {
      section_type: 'assets',
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
        res && setCheckDelete(res)
      })
      .catch(() => setCheckDelete([]))
  }

  const msg_alert: any = messageAlert(cfDetail?.name, checkDelete?.error, mandatoryDelete)

  return (
    <>
      <PageTitle breadcrumbs={breadCrumbs}>
        {intl.formatMessage({id: 'PAGETITLE.SETUP.CUSTOM_FIELDS.ASSET'})}
      </PageTitle>

      <CardCustomFieldAsset
        onDelete={onDelete}
        reloadData={reloadData}
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
        type={'delete'}
        body={msg_alert}
        loading={loading}
        showModal={showModal}
        confirmLabel={'Delete'}
        setShowModal={setShowModalConfirm}
        title={'Delete Custom Field Asset'}
        onConfirm={() => confirmDeleteCF()}
        onCancel={() => setShowModalConfirm(false)}
      />
    </>
  )
}

CustomFieldAsset = memo(
  CustomFieldAsset,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default CustomFieldAsset
