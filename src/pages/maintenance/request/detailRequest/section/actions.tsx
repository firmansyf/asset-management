import {Alert} from '@components/alert'
import Tooltip from '@components/alert/tooltip'
import {ToastMessage} from '@components/toast-message'
import {deleteRequest} from '@pages/maintenance/request/core/service'
import {FC, memo, useState} from 'react'
import {useNavigate} from 'react-router-dom'

type Props = {
  data: any
}

let Actions: FC<Props> = ({data}) => {
  const navigate = useNavigate()
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const {guid} = data || {}
  const onEdit = () => {
    navigate(`/maintenance/request/edit?id=${guid}`)
  }
  const confirmDeleteAsset = () => {
    setLoading(true)
    deleteRequest(data?.guid)
      .then(({data: {message}}: any) => {
        setTimeout(() => {
          setLoading(false)
          setShowModalDelete(false)
          navigate('/maintenance/request')
          ToastMessage({type: 'success', message})
        }, 1000)
      })
      .catch((err: any) => {
        setLoading(false)
        ToastMessage({type: 'error', message: err?.response?.data?.message})
      })
  }

  return (
    <>
      <div className='row'>
        <div className='col-auto mb-5 pe-0'>
          <Tooltip placement='top' title='Edit'>
            <div
              data-cy='editRequest'
              onClick={onEdit}
              className='d-flex align-items-center justify-content-center w-35px h-35px radius-10 cursor-pointer bg-light-warning border border-dashed border-warning shadow-sm'
            >
              <i className='fa fa-lg fa-pencil-alt text-warning'></i>
            </div>
          </Tooltip>
        </div>
        <div className='col-auto mb-5 pe-0'>
          <Tooltip placement='top' title='Delete'>
            <div
              className='d-flex align-items-center justify-content-center w-35px h-35px radius-10 cursor-pointer bg-light-danger border border-dashed border-danger shadow-sm'
              onClick={() => setShowModalDelete(true)}
              data-cy='btnDetailDelete'
            >
              <i className='fa fa-lg fa-trash-alt text-danger'></i>
            </div>
          </Tooltip>
        </div>
      </div>
      <Alert
        setShowModal={setShowModalDelete}
        showModal={showModalDelete}
        loading={loading}
        body={
          <p className='m-0'>
            Are you sure you want to delete Request Title <strong>{data?.title}</strong> ?
          </p>
        }
        type={'delete'}
        title={'Delete Request'}
        confirmLabel={'Delete'}
        onConfirm={confirmDeleteAsset}
        onCancel={() => setShowModalDelete(false)}
      />
    </>
  )
}

Actions = memo(Actions, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export {Actions}
