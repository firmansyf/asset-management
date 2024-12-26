import {getCompany} from '@api/company'
import {deleteBulkDepartment, deleteDepartment} from '@api/department'
import {Alert} from '@components/alert'
import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import {FC, useCallback, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'

import AddDepartment from './AddDepartment'
import CardDepartment from './CardDepartment'
import DetailDepartment from './DetailDepartment'

const Department: FC = () => {
  const intl = useIntl()
  const [totalPage, setTotalPage] = useState<number>(0)
  const [totalPerPage, setTotalPerPage] = useState<number>(0)
  const [page, setPage] = useState<number>(1)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)

  const [showModal, setShowModalConfirm] = useState(false)
  const [showModalAdd, setShowModal] = useState(false)
  const [reloadDelete, setReloadDelete] = useState(0)
  const [departmentName, setDepartmentName] = useState('')
  const [departmentGuid, setDepartmentGuid] = useState('')
  const [loading, setLoading] = useState(false)
  const [company, setCompany] = useState([])
  const [departementDetail, setDepartementDetail] = useState()
  const [reloadDepartment, setReloadDepartment] = useState(0)
  const [showModalDetail, setShowModalDetail] = useState(false)
  const [dataChecked, setDataChecked] = useState([])
  const [showModalBulk, setShowModalConfirmBulk] = useState(false)
  const [messageAlert, setMessage] = useState<any>(false)

  useEffect(() => {
    getCompany({})
      .then(({data: {data: res}}) => {
        setCompany(res)
      })
      .catch(() => '')
  }, [])

  const confirmDeleteUser = useCallback(() => {
    setLoading(true)
    deleteDepartment(departmentGuid)
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
          setReloadDelete(reloadDelete + 1)
          setDataChecked([])
        }, 1000)
      })
      .catch((error: any) => {
        ToastMessage({message: error?.response?.data?.message, type: 'error'})
        setLoading(false)
      })
  }, [departmentGuid, reloadDelete, totalPage, page, totalPerPage])

  const onDelete = (e: any) => {
    const {name, guid} = e || {}
    setDepartmentName(name)
    setDepartmentGuid(guid)
    setShowModalConfirm(true)
  }

  const onBulkDelete = (e: any) => {
    deleteBulkDepartment({guids: e})
      .then(({data}) => {
        setReloadDelete(reloadDelete + 1)
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
        setDataChecked([])
        ToastMessage({message: data.message, type: 'success'})
      })
      .catch((error: any) => {
        ToastMessage({message: error?.response?.data?.message, type: 'error'})
      })
  }

  const msg_alert: any = [
    'Are you sure you want to delete this department ',
    <strong key='department_name'>{departmentName}</strong>,
    '?',
  ]
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.SETUP.SETTINGS.DEPARTMENT'})}
      </PageTitle>

      <CardDepartment
        company={company}
        onDelete={onDelete}
        onBulkDelete={onBulkDelete}
        setShowModal={setShowModal}
        setDepartmentDetail={setDepartementDetail}
        reloadDelete={reloadDelete}
        reloadDepartment={reloadDepartment}
        departemenDetail={departementDetail}
        showModalDetail={showModalDetail}
        setShowModalDetail={setShowModalDetail}
        dataChecked={dataChecked}
        setDataChecked={setDataChecked}
        showModalBulk={showModalBulk}
        setShowModalConfirmBulk={setShowModalConfirmBulk}
        messageAlert={messageAlert}
        setMessage={setMessage}
        totalPage={totalPage}
        setTotalPage={setTotalPage}
        setTotalPerPage={setTotalPerPage}
        page={page}
        setPage={setPage}
        resetKeyword={resetKeyword}
        setResetKeyword={setResetKeyword}
        totalPerPage={totalPerPage}
      />

      <AddDepartment
        company={company}
        setShowModal={setShowModal}
        showModal={showModalAdd}
        departementDetail={departementDetail}
        setReloadDepartment={setReloadDepartment}
        reloadDepartment={reloadDepartment}
      />

      <DetailDepartment
        data={departementDetail}
        showModal={showModalDetail}
        setShowModal={setShowModalDetail}
      />

      <Alert
        setShowModal={setShowModalConfirm}
        showModal={showModal}
        loading={loading}
        body={msg_alert}
        type={'delete'}
        title={'Delete Department'}
        confirmLabel={'Delete'}
        onConfirm={() => {
          confirmDeleteUser()
        }}
        onCancel={() => {
          setShowModalConfirm(false)
        }}
      />

      <Alert
        setShowModal={setShowModalConfirmBulk}
        showModal={showModalBulk}
        loading={false}
        body={messageAlert}
        type={'delete'}
        title={'Delete Department'}
        confirmLabel={'Delete'}
        onConfirm={() => {
          onBulkDelete(dataChecked)
          setShowModalConfirmBulk(false)
          setDataChecked([])
        }}
        onCancel={() => {
          setShowModalConfirmBulk(false)
        }}
      />
    </>
  )
}

export default Department
