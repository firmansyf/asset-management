import {dispatchFireBase} from '@api/firebase'
import {deleteUser} from '@api/UserCRUD'
import {Alert} from '@components/alert'
import {ToastMessage} from '@components/toast-message'
import {FC, memo} from 'react'

interface Props {
  loading: boolean
  showModal: boolean
  userDetail: any
  setLoading: any
  setShowModal: any
  reloadDelete: any
  setShowDelete: any
  setReloadDelete: any
  setDataChecked: any
  totalPage: any
  pageFrom: any
  setPage: any
  page: any
  setResetKeyword: any
}

let DeleteUser: FC<Props> = ({
  setReloadDelete,
  setShowDelete,
  setShowModal,
  reloadDelete,
  setLoading,
  userDetail,
  showModal,
  loading,
  setDataChecked,
  totalPage,
  pageFrom,
  setPage,
  page,
  setResetKeyword,
}) => {
  const handleConfirm = () => {
    setLoading(true)

    const params = {notify_user: 1}

    deleteUser(userDetail?.guid, params)
      .then((res: any) => {
        const total_data_page: number = totalPage - pageFrom
        if (total_data_page - 1 <= 0) {
          if (page > 1) {
            setPage(page - 1)
          } else {
            setPage(page)
            setResetKeyword(true)
          }
        } else {
          setPage(page)
        }
        setLoading(false)
        setShowDelete(false)
        setShowModal(false)
        setReloadDelete(reloadDelete + 1)
        ToastMessage({type: 'success', message: res?.data?.message})
        setDataChecked([])
        dispatchFireBase(`user_guid/${userDetail?.guid}`, {deleted_at: Date.now()})
      })
      .catch((e: any) => {
        setLoading(false)
        ToastMessage({type: 'error', message: e?.response?.data?.message})
      })
  }

  const messageAlert = [
    'Are you sure you want to delete this user ',
    <strong key='full_name'>{userDetail?.first_name}</strong>,
    '?',
  ]

  return (
    <Alert
      loading={loading}
      setShowModal={setShowModal}
      showModal={showModal}
      body={messageAlert}
      type={'delete'}
      title={'Delete User'}
      confirmLabel={'Delete'}
      onConfirm={handleConfirm}
      onCancel={() => setShowModal(false)}
    />
  )
}

DeleteUser = memo(
  DeleteUser,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default DeleteUser
