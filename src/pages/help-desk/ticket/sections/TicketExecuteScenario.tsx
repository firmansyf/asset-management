import Tooltip from '@components/alert/tooltip'
import {ListLoader} from '@components/loader/list'
import {ToastMessage} from '@components/toast-message'
import {errorValidation} from '@helpers'
import {executeScenario, getScenario} from '@pages/help-desk/scenario/Service'
import {FC, useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'

type PropTypes = {
  guid: any
  showModal: any
  setShowModal: any
  onSuccess: any
}

const ModalExecuteScenario: FC<PropTypes> = ({guid, showModal, setShowModal, onSuccess}) => {
  const navigate: any = useNavigate()
  const [data, setData] = useState<any>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (showModal) {
      setLoading(true)
      getScenario({})
        .then(({data: {data: res}}: any) => {
          setData(res)
          setLoading(false)
        })
        .catch(() => {
          setLoading(false)
        })
    } else {
      setData([])
    }
  }, [showModal])

  const execute: any = (scenario_guid: any) => {
    executeScenario(guid, scenario_guid)
      .then(({data: {message}}: any) => {
        onSuccess()
        setShowModal(false)
        ToastMessage({type: 'success', message})
      })
      .catch((err: any) => {
        Object.values(errorValidation(err)).map((message: any) =>
          ToastMessage({type: 'error', message})
        )
      })
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        {' '}
        <Modal.Title>Execute Scenario</Modal.Title>{' '}
      </Modal.Header>
      <Modal.Body>
        {loading ? (
          <div className='row'>
            <ListLoader className='col-12 mb-3' height={35} count={3} />
          </div>
        ) : (
          <div className='row'>
            {data?.length > 0 ? (
              data.map(({guid: scenario_guid, name, description, actions}: any, index: number) => (
                <div className='col-md-12 mb-3' key={index}>
                  <div className='d-flex align-items-center border border-ea p-3 rounded'>
                    <div className='d-flex my-1'>
                      <div className='btn btn-icon h-20px w-20px rounded-circle btn-primary p-1 me-2'>
                        <i className='las la-paste fs-7' />
                      </div>
                      <div className=''>
                        <p className='m-0 fw-bolder fs-7'>{name}</p>
                        <p className='m-0 fs-8'>{description || '-'}</p>
                      </div>
                    </div>
                    <div className='text-center ms-auto me-3'>
                      <Tooltip
                        placement='auto'
                        title={
                          <ol className='text-start m-0 ps-3'>
                            {actions?.length > 0 &&
                              actions?.map(({unique_name}: any, index: number) => (
                                <li key={index} className='text-capitalize'>
                                  {unique_name?.replace('_', ' ')}
                                </li>
                              ))}
                          </ol>
                        }
                      >
                        <div className='cursor-default'>
                          <p className='m-0 fw-bold text-primary'>{actions?.length || 0}</p>
                          <p className='m-0 fs-8 fw-bold text-gray-500' style={{lineHeight: 0.5}}>
                            act
                          </p>
                        </div>
                      </Tooltip>
                    </div>
                    <button
                      className='btn btn-sm btn-flex btn-light text-dark p-2 fs-bolder'
                      onClick={() => execute(scenario_guid)}
                    >
                      <i className='las la-paste fs-5 text-dark' />
                      Execute
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className='text-center my-5'>
                <span className='text-gray-400'>No scenario found. to create new scenario, </span>
                <u
                  className='text-primary fw-bolder cursor-pointer'
                  onClick={() => navigate('/help-desk/scenario/add')}
                >
                  Click Here
                </u>
              </div>
            )}
          </div>
        )}
      </Modal.Body>
    </Modal>
  )
}

export default ModalExecuteScenario
