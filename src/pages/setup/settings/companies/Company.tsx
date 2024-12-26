import {checkDeleteStatus} from '@api/company'
import {ToastMessage} from '@components/toast-message'
import {hasPermission, permissionValidator} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {FC, useState} from 'react'
import {useIntl} from 'react-intl'

import {AddCompany} from './AddCompany'
import {CardCompany} from './CardCompany'
import {DeleteCompany} from './DeleteCompany'
import {DeleteCompanyBulk} from './DeleteCompanyBulk'

const Company: FC = () => {
  const intl = useIntl()
  const deletePermission: boolean = hasPermission('setting.company.delete') || false
  const [page, setPage] = useState<number>(1)
  const [totalPerPage, setTotalPerPage] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)
  const [totalPage, setTotalPage] = useState<number>(0)

  const [showModal, setShowModalConfirm] = useState<boolean>(false)
  const [companyName, setCompanyName] = useState<string>('')
  const [companyGuid, setGuid] = useState<string>('')
  const [, setLoading] = useState<boolean>(false)
  const [reloadDelete] = useState<any>(1)
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)
  const [dataChecked, setDataChecked] = useState<any>([])
  const [dataCheckedSelect, setDataCheckedSelect] = useState<any>([])
  const [reloadCompany, setReloadCompany] = useState<number>(0)
  const [checkErrorDeleteStatus, setErrorCheckDeleteStatus] = useState<boolean>(false)
  const [checkErrorStatusDeleteBulk, setcheckErrorStatusDeleteBulk] = useState<boolean>(false)
  const [cantDeleteInfoBulk, setCantDeleteInfoBulk] = useState<any>([])
  const [cantDeleteInfo, setCantDeleteInfo] = useState<any>([])
  const [assignCompany, setAssignCompany] = useState<any>([])
  const [showModalAdd, setShowModalAdd] = useState<boolean>(false)
  const [companyDetail, setCompanyDetail] = useState<any>()

  const onDelete = (e: any) => {
    if (!deletePermission) {
      permissionValidator(deletePermission, 'Delete Company')
    } else {
      const {name, guid} = e || {}
      setCompanyName(name)
      setGuid(guid)
      setShowModalConfirm(true)
      checkDeleteStatus(guid)
        .then((res: any) => {
          setErrorCheckDeleteStatus(res?.data?.error)
          setCantDeleteInfo(res?.data?.data)
        })
        .catch((err: any) => {
          ToastMessage({message: err?.response?.data?.message, type: 'error'})
          setLoading(false)
        })
    }
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.SETUP.SETTINGS.COMPANY'})}
      </PageTitle>

      <CardCompany
        onDelete={onDelete}
        reloadDelete={reloadDelete}
        setShowModalConfirmBulk={setShowModalConfirmBulk}
        dataChecked={dataChecked}
        setDataChecked={setDataChecked}
        reloadCompany={reloadCompany}
        setReloadCompany={setReloadCompany}
        setAssignCompany={setAssignCompany}
        setLoading={setLoading}
        setCheckErrorStatusDeleteBulk={setcheckErrorStatusDeleteBulk}
        setCantDeleteInfoBulk={setCantDeleteInfoBulk}
        companyDetail={companyDetail}
        setCompanyDetail={setCompanyDetail}
        setShowModalAdd={setShowModalAdd}
        deletePermission={deletePermission}
        setDataCheckedSelect={setDataCheckedSelect}
        setPage={setPage}
        page={page}
        setTotalPerPage={setTotalPerPage}
        resetKeyword={resetKeyword}
        setResetKeyword={setResetKeyword}
        totalPage={totalPage}
        setTotalPage={setTotalPage}
        totalPerPage={totalPerPage}
      />

      <AddCompany
        showModal={showModalAdd}
        setShowModal={setShowModalAdd}
        companyDetail={companyDetail}
        reloadCompany={reloadCompany}
        setReloadCompany={setReloadCompany}
      />

      <DeleteCompany
        showModal={showModal}
        setShowModal={setShowModalConfirm}
        setReloadCompany={setReloadCompany}
        reloadCompany={reloadCompany}
        companyName={companyName}
        companyGuid={companyGuid}
        checkErrorDeleteStatus={checkErrorDeleteStatus}
        cantDeleteInfo={cantDeleteInfo}
        assignCompany={assignCompany}
        setDataChecked={setDataChecked}
        totalPage={totalPage}
        totalPerPage={totalPerPage}
        setPage={setPage}
        page={page}
        setResetKeyword={setResetKeyword}
      />

      <DeleteCompanyBulk
        showModal={showModalBulk}
        setShowModal={setShowModalConfirmBulk}
        setReloadCompany={setReloadCompany}
        reloadCompany={reloadCompany}
        dataChecked={dataChecked}
        checkErrorStatusDeleteBulk={checkErrorStatusDeleteBulk}
        cantDeleteInfo={cantDeleteInfoBulk}
        assignCompany={assignCompany}
        setDataChecked={setDataChecked}
        dataCheckedSelect={dataCheckedSelect}
        totalPage={totalPage}
        totalPerPage={totalPerPage}
        page={page}
        setPage={setPage}
        setResetKeyword={setResetKeyword}
      />
    </>
  )
}

export default Company
