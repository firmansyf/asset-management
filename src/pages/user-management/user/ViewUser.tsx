import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {configClass} from '@helpers'
import {FC, useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap'
import {shallowEqual, useSelector} from 'react-redux'

interface Props {
  data: any
  show: boolean
  onHide: any
}

const ViewUser: FC<Props> = ({show, onHide, data}) => {
  const token: any = useSelector(({token}: any) => token, shallowEqual)
  const [loadingDetail, setLoadingDetail] = useState<boolean>(true)

  let color: any = ''
  if (data?.user_status?.toLowerCase() === 'owner') {
    color = '-primary'
  } else if (data?.user_status?.toLowerCase() === 'unverified') {
    color = '-info'
  } else if (data?.user_status?.toLowerCase() === 'verified') {
    color = '-success'
  } else if (data?.user_status?.toLowerCase() === 'suspended') {
    color = '-danger'
  } else {
    //
  }

  useEffect(() => {
    if (show) {
      setTimeout(() => ToastMessage({type: 'clear'}), 800)
    }
  }, [show])

  useEffect(() => {
    setLoadingDetail(true)
    if (show) {
      setTimeout(() => {
        setLoadingDetail(false)
      }, 400)
    }
  }, [show])

  return (
    <Modal dialogClassName='modal-md' show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>User Detail</Modal.Title>
      </Modal.Header>
      {loadingDetail ? (
        <div className='row'>
          <div className='col-12 text-center'>
            <PageLoader height={250} />
          </div>
        </div>
      ) : (
        <Modal.Body>
          <div className='row'>
            <div className='col-12'>
              <div
                className='symbol symbol-60px symbol-lg-60px symbol-fixed position-relative me-5'
                data-cy='userProfile'
              >
                <div
                  className='symbol-label'
                  style={{
                    backgroundImage: `url(${
                      data?.photos?.[0]?.url
                        ? `${data?.photos?.[0]?.url}?token=${token}`
                        : '/images/no-image-profile.jpeg'
                    })`,
                  }}
                />
              </div>
              <div className='separator separator-dashed my-5'></div>
            </div>
            <div className='col-6'>
              <div className={configClass?.title}>Employee ID</div>
              <div className='mb-4'>{data?.employee_number || '-'}</div>
              <div className={configClass?.title}>First Name</div>
              <div className='mb-4'>{data?.first_name || '-'}</div>
              <div className={configClass?.title}>Job Title</div>
              <div className='mb-4'>{data?.job_title || '-'}</div>
              <div className={configClass?.title}>Company</div>
              <div className='mb-4'>{data?.company?.name || '-'}</div>
              <div className={configClass?.title}>Email</div>
              <div className='mb-4'>{data?.email || '-'}</div>
            </div>

            <div className='col-6'>
              <div className={configClass?.title}>Last Name</div>
              <div className='mb-4'>{data?.last_name || '-'}</div>
              <div className={configClass?.title}>Role</div>
              <div className='mb-4'>{data?.roles?.[0]?.label || '-'}</div>
              <div className={configClass?.title}>Department</div>
              <div className='mb-4'>{data?.company_department?.name || '-'}</div>
              <div className={configClass?.title}>Status</div>
              <div className={`badge badge-light${color} mt-1`}>{data?.user_status || ' - '}</div>
            </div>
          </div>
        </Modal.Body>
      )}
    </Modal>
  )
}

export default ViewUser
