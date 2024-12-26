import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import {FC, useState} from 'react'
import {useIntl} from 'react-intl'

import {ModalAddCategory} from './AddCategory'
import {CardCategory} from './CardCategory'
import {ModalDeleteCategory} from './DeleteCategory'
import {ModalDeleteCategoryBulk} from './DeleteCategoryBulk'
import {ModalDetailCategory} from './DetailCategory'
import {checkCategoryDeleteStatus} from './redux/CategoryCRUD'

const Category: FC = () => {
  const intl = useIntl()
  const [page, setPage] = useState<number>(1)
  const [totalPerPage, setTotalPerPage] = useState<number>(0)
  const [resetKeyword, setResetKeyword] = useState<boolean>(false)
  const [totalPage, setTotalPage] = useState<number>(0)

  const [showModal, setShowModalConfirm] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const [categoryGuid, setGuid] = useState('')
  const [reloadCategory, setReloadCategory] = useState<any>(0)
  const [categoryDetail, setDetailCategory] = useState()
  const [showModalCategory, setShowModalCategory] = useState(false)
  const [showDetail, setShowDetail] = useState(false)
  const [checkErrorDeleteStatus, setErrorCheckDeleteStatus] = useState(false)
  const [cantDeleteInfo, setCantDeleteInfo] = useState([])
  const [assignCategory, setAssignCategory] = useState([])
  const [showModalBulk, setShowModalConfirmBulk] = useState(false)
  const [dataChecked, setDataChecked] = useState([])
  const [checkErrorStatusDeleteBulk, setcheckErrorStatusDeleteBulk] = useState(false)
  const [cantDeleteInfoBulk, setCantDeleteInfoBulk] = useState([])

  const onDelete = (e: any) => {
    const {name, guid} = e || {}
    setCategoryName(name)
    setGuid(guid)
    setDetailCategory(e)
    setShowModalConfirm(true)
    checkCategoryDeleteStatus(guid)
      .then((res: any) => {
        setErrorCheckDeleteStatus(res?.data?.error)
        setCantDeleteInfo(res?.data?.data)
      })
      .catch((err: any) => {
        ToastMessage({message: err?.response?.data?.message, type: 'error'})
      })
  }

  const onDetail = (e: any) => {
    setDetailCategory(e)
    setShowDetail(true)
  }

  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.SETUP.SETTINGS.CATEGORY'})}
      </PageTitle>

      <CardCategory
        reloadCategory={reloadCategory}
        onDelete={onDelete}
        onDetail={onDetail}
        setDetailCategory={setDetailCategory}
        setShowModalCategory={setShowModalCategory}
        setAssignCategory={setAssignCategory}
        dataChecked={dataChecked}
        setDataChecked={setDataChecked}
        setCheckErrorStatusDeleteBulk={setcheckErrorStatusDeleteBulk}
        setCantDeleteInfoBulk={setCantDeleteInfoBulk}
        setShowModalConfirmBulk={setShowModalConfirmBulk}
        setTotalPerPage={setTotalPerPage}
        page={page}
        setPage={setPage}
        resetKeyword={resetKeyword}
        setResetKeyword={setResetKeyword}
        totalPage={totalPage}
        setTotalPage={setTotalPage}
        totalPerPage={totalPerPage}
      />

      <ModalAddCategory
        setReloadCategory={setReloadCategory}
        reloadCategory={reloadCategory}
        showModal={showModalCategory}
        setShowModal={setShowModalCategory}
        categoryDetail={categoryDetail}
      />

      <ModalDeleteCategory
        setReloadCategory={setReloadCategory}
        reloadCategory={reloadCategory}
        showModal={showModal}
        setShowModal={setShowModalConfirm}
        categoryDetail={categoryDetail}
        categoryName={categoryName}
        categoryGuid={categoryGuid}
        checkErrorDeleteStatus={checkErrorDeleteStatus}
        cantDeleteInfo={cantDeleteInfo}
        assignCategory={assignCategory}
        setDataChecked={setDataChecked}
        totalPerPage={totalPerPage}
        totalPage={totalPage}
        page={page}
        setPage={setPage}
        setResetKeyword={setResetKeyword}
      />

      <ModalDeleteCategoryBulk
        showModal={showModalBulk}
        setShowModal={setShowModalConfirmBulk}
        setReloadCategory={setReloadCategory}
        reloadCategory={reloadCategory}
        dataChecked={dataChecked}
        checkErrorStatusDeleteBulk={checkErrorStatusDeleteBulk}
        cantDeleteInfo={cantDeleteInfoBulk}
        assignCategory={assignCategory}
        setDataChecked={setDataChecked}
        totalPerPage={totalPerPage}
        totalPage={totalPage}
        page={page}
        setPage={setPage}
        setResetKeyword={setResetKeyword}
      />

      <ModalDetailCategory
        data={categoryDetail}
        showDetail={showDetail}
        setShowDetail={setShowDetail}
      />
    </>
  )
}

export default Category
