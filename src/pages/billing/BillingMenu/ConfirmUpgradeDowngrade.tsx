import {ToastMessage} from '@components/toast-message'
import {arrayConcat, errorValidation} from '@helpers'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {useNavigate} from 'react-router-dom'

import {updateOwnerSubscription} from '../Service'
import {planDescription} from './PlanDescription'

type BulkDeleteProps = {
  showModal: any
  setShowModal: any
  changeStatus: any
  defaultPlan: any
  selectedPlan: any
  changeStatusText: any
  defaultGroup: any
  selectedGroup: any
  selectedUniqueID: any
  defaultName: any
  selectedName: any
}

const ConfirmUpgradeDowngrade: FC<BulkDeleteProps> = ({
  showModal,
  setShowModal,
  changeStatus,
  defaultPlan,
  selectedPlan,
  changeStatusText,
  defaultGroup,
  selectedGroup,
  selectedUniqueID,
  defaultName,
  selectedName,
}) => {
  const navigate = useNavigate()
  const [featureChangeLists, setFeatureChangeLists] = useState([])

  const sendPlan = () => {
    if (selectedUniqueID !== '') {
      updateOwnerSubscription({plan: selectedUniqueID})
        .then(({data: {message}}: any) => {
          setShowModal(false)
          ToastMessage({type: 'success', message})
          navigate(`/billing`)
        })
        .catch((err: any) => {
          Object.values(errorValidation(err || {})).forEach((message: any) =>
            ToastMessage({type: 'error', message})
          )
          setShowModal(false)
        })
    }
  }

  // eslint-disable-next-line sonarjs/cognitive-complexity
  useEffect(() => {
    // defaultGroup 3 => Standar
    // defaultGroup 4 => Professional
    // defaultGroup 5 => Advance

    if (changeStatus === 'Downgrade') {
      if (defaultGroup === 5) {
        if (selectedGroup === 4) {
          setFeatureChangeLists(planDescription[1].feature_change_lists)
        } else {
          setFeatureChangeLists(
            arrayConcat(
              planDescription[0]?.feature_change_lists,
              planDescription[1]?.feature_change_lists
            )
          )
        }
      }
      if (defaultGroup === 4) {
        setFeatureChangeLists(planDescription[0]?.feature_change_lists)
      }
    } else {
      if (defaultGroup === 3) {
        if (selectedGroup === 4) {
          setFeatureChangeLists(planDescription[0]?.feature_change_lists)
        } else {
          setFeatureChangeLists(
            arrayConcat(
              planDescription[0]?.feature_change_lists,
              planDescription[1]?.feature_change_lists
            )
          )
        }
      }
      if (defaultGroup === 4) {
        setFeatureChangeLists(arrayConcat(planDescription[1].feature_change_lists))
      }
    }
  }, [changeStatus, defaultGroup, selectedGroup])

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header>
        <Modal.Title>
          Are you sure you want to {changeStatus === 'Downgrade' ? 'downgrade' : 'upgrade'} your
          plan?
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='text-black mb-3'>
          Your plan will be {changeStatus === 'Downgrade' ? 'downgraded' : 'upgraded'} from
          {defaultPlan === selectedPlan ? (
            <>
              <strong key='default_plan'> {defaultName} </strong> to
              <strong key='selected_plan'> {selectedName} </strong> ?
            </>
          ) : (
            <>
              <strong key='default_plan'> {defaultPlan} </strong> to
              <strong key='selected_plan'> {selectedPlan} </strong> ?
            </>
          )}
        </div>
        <div className='text-black-800 mb-3'>
          {defaultPlan !== selectedPlan && (
            <>
              <div className='mt-5'>{changeStatusText}</div>
              <ul className='fa-ul mt-2'>
                {featureChangeLists?.map(({title}: any) => {
                  return (
                    <li key={title}>
                      {changeStatus === 'Upgrade' && (
                        <>
                          <span className='fa-li'>
                            <i className='fas fa-check text-success'></i>
                          </span>
                          {title}
                        </>
                      )}

                      {changeStatus === 'Downgrade' && (
                        <>
                          <span className='fa-li'>
                            <i className='fas fa-times text-light-gray'></i>
                          </span>
                          <span className='text-light-gray'>{title}</span>
                        </>
                      )}
                    </li>
                  )
                })}
              </ul>
            </>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
          Cancel
        </Button>
        <Button
          className='btn-sm'
          type='submit'
          form-id=''
          variant='primary'
          onClick={() => sendPlan()}
        >
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export {ConfirmUpgradeDowngrade}
