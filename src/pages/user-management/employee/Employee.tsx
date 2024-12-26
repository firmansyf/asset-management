/* eslint-disable react-hooks/exhaustive-deps */
import {getCompany} from '@api/company'
import {Alert} from '@components/alert'
import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import AddLocation from '@pages/location/AddLocation'
import {AddCompany} from '@pages/setup/settings/companies/AddCompany'
import AddDepartment from '@pages/setup/settings/departements/AddDepartment'
import {FC, useCallback, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'

import {deleteBulkEmployee, deleteEmployee} from '../redux/EmployeeCRUD'
import CardEmployee from './CardEmployee'

const Employee: FC = () => {
  const intl: any = useIntl()

  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [company, setCompany] = useState<any>([])
  const [keyword, setKeyword] = useState<string>('')
  const [filterAll, setFilterAll] = useState<any>({})
  const [pageFrom, setPageFrom] = useState<number>(0)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [dataChecked, setDataChecked] = useState<any>([])
  const [reloadDelete, setReloadDelete] = useState<any>(1)
  const [companyDetail, setCompanyDetail] = useState<any>()
  const [reloadCompany, setReloadCompany] = useState<any>(0)
  const [locationDetail, setLocationDetail] = useState<any>()
  const [reloadLocation, setReloadLocation] = useState<any>(1)
  const [employeeName, setEmployeeName] = useState<string>('')
  const [employeeGuid, setEmployeeGuid] = useState<string>('')
  const [reloadEmployee, setReloadEmployee] = useState<any>(1)
  const [orderCol, setOrderCol] = useState<string>('full_name')
  const [onClickForm, setOnClickForm] = useState<boolean>(false)
  const [departmentDetail, setDepartmentDetail] = useState<any>()
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)
  const [reloadDepartment, setReloadDepartment] = useState<any>(0)
  const [showModal, setShowModalConfirm] = useState<boolean>(false)
  const [showModalCompany, setShowModalCompany] = useState<boolean>(false)
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)
  const [showModalLocation, setShowModalLocation] = useState<boolean>(false)
  const [showModalDepartment, setShowModalDepartment] = useState<boolean>(false)

  const msg_alert: any = [
    'Are you sure you want to delete this employee ',
    <strong key='full_name'>{employeeName || ''}</strong>,
    '?',
  ]

  const msg_alert_bulk_delete: any = [
    'Are you sure you want to delete',
    <strong key='full_name'> {dataChecked?.length || 0} </strong>,
    'employee data?',
  ]

  const confirmDeleteEmployee = useCallback(() => {
    setLoading(true)
    deleteEmployee(employeeGuid).then(({status, data: {message}}: any) => {
      if (status === 200) {
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

        setTimeout(() => {
          setLoading(false)
          setDataChecked([])
          setShowModalConfirm(false)
          setReloadDelete(reloadDelete + 1)
        }, 1000)
      }
    })
  }, [employeeGuid, reloadDelete])

  const confirmBulkDeleteEmployee = useCallback(() => {
    setLoading(true)
    deleteBulkEmployee({guids: dataChecked})
      .then(({status, data: {message}}) => {
        if (status === 200) {
          const total_data_page: number = totalPage - pageFrom
          const thisPage: any = page

          setTimeout(() => {
            setLoading(false)
            setDataChecked([])
            setShowModalConfirmBulk(false)
            setReloadDelete(reloadDelete + 1)
            ToastMessage({message, type: 'success'})
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
          }, 1000)
        }
      })
      .catch(({response}: any) => {
        const {message} = response?.data || {}
        ToastMessage({message, type: 'error'})
        setLoading(false)
      })
  }, [dataChecked, reloadDelete])

  useEffect(() => {
    ToastMessage({type: 'clear'})

    getCompany({}).then(({data: {data: res}}: any) => {
      res && setCompany(res)
    })
  }, [])

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.USER_MANAGEMENT.EMPLOYEE'})}
      </PageTitle>

      <CardEmployee
        page={page}
        limit={limit}
        setPage={setPage}
        keyword={keyword}
        orderCol={orderCol}
        orderDir={orderDir}
        setLimit={setLimit}
        filterAll={filterAll}
        totalPage={totalPage}
        setKeyword={setKeyword}
        dataChecked={dataChecked}
        setOrderDir={setOrderDir}
        onClickForm={onClickForm}
        setOrderCol={setOrderCol}
        setPageFrom={setPageFrom}
        setFilterAll={setFilterAll}
        resetKeyword={resetKeyword}
        reloadDelete={reloadDelete}
        setTotalPage={setTotalPage}
        reloadCompany={reloadCompany}
        setDataChecked={setDataChecked}
        setOnClickForm={setOnClickForm}
        reloadEmployee={reloadEmployee}
        reloadLocation={reloadLocation}
        setEmployeeGuid={setEmployeeGuid}
        setEmployeeName={setEmployeeName}
        setResetKeyword={setResetKeyword}
        setCompanyDetail={setCompanyDetail}
        reloadDepartment={reloadDepartment}
        setLocationDetail={setLocationDetail}
        setReloadEmployee={setReloadEmployee}
        setShowModalConfirm={setShowModalConfirm}
        setShowModalCompany={setShowModalCompany}
        setDepartmentDetail={setDepartmentDetail}
        setShowModalLocation={setShowModalLocation}
        setShowModalDepartment={setShowModalDepartment}
        setShowModalConfirmBulk={setShowModalConfirmBulk}
      />

      <AddLocation
        onClickForm={onClickForm}
        showModal={showModalLocation}
        reloadLocation={reloadLocation}
        locationDetail={locationDetail}
        setReloadLocation={setReloadLocation}
        setShowModalLocation={setShowModalLocation}
      />

      <AddCompany
        showModal={showModalCompany}
        setShowModal={setShowModalCompany}
        companyDetail={companyDetail}
        reloadCompany={reloadCompany}
        setReloadCompany={setReloadCompany}
      />

      <AddDepartment
        company={company}
        setShowModal={setShowModalDepartment}
        showModal={showModalDepartment}
        departementDetail={departmentDetail}
        setReloadDepartment={setReloadDepartment}
        reloadDepartment={reloadDepartment}
      />

      <Alert
        type={'delete'}
        body={msg_alert}
        loading={loading}
        showModal={showModal}
        confirmLabel={'Delete'}
        title={'Delete Employee'}
        setShowModal={setShowModalConfirm}
        onConfirm={() => confirmDeleteEmployee()}
        onCancel={() => setShowModalConfirm(false)}
      />

      <Alert
        type={'delete'}
        loading={loading}
        confirmLabel={'Delete'}
        title={'Delete Employee'}
        showModal={showModalBulk}
        body={msg_alert_bulk_delete}
        setShowModal={setShowModalConfirmBulk}
        onConfirm={() => confirmBulkDeleteEmployee()}
        onCancel={() => setShowModalConfirmBulk(false)}
      />
    </>
  )
}

export default Employee
