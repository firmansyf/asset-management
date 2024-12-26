/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import Tooltip from '@components/alert/tooltip'
import {ToastMessage} from '@components/toast-message'
import {FC, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

import {AddEditForum} from '../AddEditForum'
import {deleteDisscussionForum} from '../service'

type Props = {
  data: any
  reload: any
  setReload: any
  showReply: any
  setShowReply: any
  setIsReplyLoading: any
  isReplyLoading: any
}

const ActionBtn: FC<Props> = ({data, reload, setReload}) => {
  const navigate = useNavigate()
  const [showModal, setShowModalEdit] = useState(false)
  const [showModalDel, setShowModalDel] = useState(false)
  const [loading, setLoading] = useState(false)
  const [redirect, setRedirect] = useState<boolean>(false)

  const onDelete = () => {
    setLoading(true)

    deleteDisscussionForum(data?.guid)
      .then((res: any) => {
        setShowModalDel(false)
        ToastMessage({type: 'success', message: res?.data?.message})
        setTimeout(() => setRedirect(true), 3000)
      })
      .catch(() => '')
  }

  useEffect(() => {
    redirect && navigate(`/help-desk/forum`)
  }, [redirect])

  const msg_alert = [
    'Are you sure you want to delete ',
    <strong key='summary_name'>{data?.title}</strong>,
    '?',
  ]

  return (
    <>
      <div className='ms-3'>
        <Tooltip placement='top' title='Edit'>
          <div
            onClick={() => setShowModalEdit(true)}
            className='d-flex align-items-center justify-content-center w-30px h-30px radius-5 cursor-pointer'
          >
            <i className='fa fa-lg fa-pencil-alt text-warning'></i>
          </div>
        </Tooltip>
      </div>
      <div className='ms-3'>
        <Tooltip placement='top' title='Delete'>
          <div
            className='d-flex align-items-center justify-content-center w-30px h-30px radius-5 cursor-pointer'
            onClick={() => setShowModalDel(true)}
          >
            <i className='fa fa-lg fa-trash-alt text-danger'></i>
          </div>
        </Tooltip>
      </div>

      <Alert
        setShowModal={setShowModalDel}
        showModal={showModalDel}
        loading={loading}
        body={msg_alert}
        type={'delete'}
        title={'Delete Forum'}
        confirmLabel={'Delete'}
        onConfirm={() => {
          onDelete()
        }}
        onCancel={() => {
          setShowModalDel(false)
        }}
      />

      <AddEditForum
        detailForum={data}
        showModal={showModal}
        setShowModal={setShowModalEdit}
        reload={reload}
        setReload={setReload}
      />
    </>
  )
}

export {ActionBtn}
