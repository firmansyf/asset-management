import {Alert} from '@components/alert'
import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import {FC, useCallback, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'

import {CardBrand} from './CardBrand'
import {deleteBrand, deleteBulkBrand} from './Service'

const Brand: FC = () => {
  const intl = useIntl()
  const [page, setPage] = useState<number>(1)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [totalPerPage, setTotalPerPage] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)
  const [showModal, setShowModalConfirm] = useState(false)
  const [brandDetail, setBrandDetail] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [reloadData, setReloadData] = useState(0)
  const [dataChecked, setDataChecked] = useState([])

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  const confirmDeleteBrand = useCallback(() => {
    setLoading(true)
    deleteBrand(brandDetail.guid)
      .then((res: any) => {
        setTimeout(() => {
          ToastMessage({message: res?.data?.message, type: 'success'})
          setLoading(false)
          const total_data_page: number = totalPage - totalPerPage
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
          setShowModalConfirm(false)

          setReloadData(reloadData + 1)
          setDataChecked([])
        }, 1000)
      })
      .catch((error: any) => {
        ToastMessage({message: error?.response?.data?.message, type: 'success'})
        setLoading(false)
      })
  }, [brandDetail, reloadData, totalPage, totalPerPage, page])

  const onDelete = (e: any) => {
    setBrandDetail(e)
    setShowModalConfirm(true)
  }

  // BulkDeleteMark
  const onBulkDelete = (e: any) => {
    deleteBulkBrand({guids: e})
      .then(({data}) => {
        setReloadData(reloadData + 1)
        const total_data_page: number = totalPage - totalPerPage
        const thisPage: any = page
        if (total_data_page - dataChecked?.length <= 0) {
          if (thisPage > 1) {
            setPage(thisPage - 1)
          } else {
            setPage(thisPage)
            setResetKeyword(true)
          }
        } else {
          setPage(thisPage)
        }
        ToastMessage({message: data.message, type: 'success'})
        setDataChecked([])
      })
      .catch((error: any) => {
        ToastMessage({message: error?.response?.data?.message, type: 'success'})
      })
  }

  const msg_alert: any = [
    'Are you sure you want to delete this brand ',
    <strong key='full_name'>{brandDetail.name}</strong>,
    '?',
  ]
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.SETUP.SETTINGS.BRANDS'})}
      </PageTitle>
      <CardBrand
        onDelete={onDelete}
        onBulkDelete={onBulkDelete}
        reloadData={reloadData}
        dataChecked={dataChecked}
        setDataChecked={setDataChecked}
        page={page}
        setPage={setPage}
        setTotalPerPage={setTotalPerPage}
        totalPage={totalPage}
        setTotalPage={setTotalPage}
        resetKeyword={resetKeyword}
        setResetKeyword={setResetKeyword}
        totalPerPage={totalPerPage}
      />
      <Alert
        setShowModal={setShowModalConfirm}
        showModal={showModal}
        loading={loading}
        body={msg_alert}
        type={'delete'}
        title={'Delete Brand'}
        confirmLabel={'Delete'}
        onConfirm={() => {
          confirmDeleteBrand()
        }}
        onCancel={() => {
          setShowModalConfirm(false)
        }}
      />
    </>
  )
}

export default Brand
