import {deleteLocation, printLocation} from '@api/Service'
import {Alert} from '@components/alert'
import Tooltip from '@components/alert/tooltip'
import {ToastMessage} from '@components/toast-message'
import {FC, useState} from 'react'
import {useNavigate} from 'react-router-dom'

import AddLocation from '../AddLocation'

type ActionProps = {
  setShowModalEmail: any
  detailLocation: any
  setReloadLocation: any
  reloadLocation: any
}

const LocationActions: FC<ActionProps> = ({
  setShowModalEmail,
  detailLocation,
  setReloadLocation,
  reloadLocation,
}) => {
  const navigate: any = useNavigate()
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [printLoading, setPrintLoading] = useState<boolean>(false)
  const [showModal, setShowModalLocation] = useState<boolean>(false)
  const [onClickForm, setOnClickForm] = useState<boolean>(true)

  const confirmDeleteLocation = () => {
    setLoading(true)
    deleteLocation(detailLocation?.guid)
      .then(({data: {message}}: any) => {
        setTimeout(() => {
          setLoading(false)
          setShowModalDelete(false)
          navigate('/location/location')
          ToastMessage({type: 'success', message})
        }, 1000)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const print = () => {
    setPrintLoading(true)
    printLocation(detailLocation.guid)
      .then(({data: {url, message}}: any) => {
        window.open(url, '_blank')
        setPrintLoading(false)
        ToastMessage({type: 'success', message})
      })
      .catch(() => {
        setPrintLoading(false)
      })
  }

  const onEdit = () => {
    setShowModalLocation(true)
    if (detailLocation?.guid) {
      setShowModalLocation(true)
    }
  }

  let msg_alert = [
    'Are you sure you want to delete this location ',
    <strong key='location_name'>{detailLocation?.name}</strong>,
    '?',
  ]

  if (detailLocation?.total_asset > 0) {
    msg_alert = [
      'Are you sure you want to delete this location ',
      <strong key='location_name'>{detailLocation?.name}</strong>,
      '?',
      <br key='newline1' />,
      <br key='newline2' />,
      <strong key='total_asset'>{detailLocation?.total_asset}</strong>,
      ' asset(s) is/are currently being assigned to this location. if you proceed to delete this location, it will be removed from the asset(s)',
    ]
  }

  return (
    <>
      <div className='row'>
        <div className='col-auto mb-5 pe-0'>
          <Tooltip placement='top' title='Print'>
            <div
              data-cy='printLocation'
              className='d-flex align-items-center justify-content-center w-35px h-35px radius-10 cursor-pointer bg-light-primary border border-dashed border-primary shadow-sm'
              onClick={print}
            >
              {printLoading ? (
                <span className='spinner-border spinner-border-sm text-primary' />
              ) : (
                <i className='fa fa-lg fa-print text-primary'></i>
              )}
            </div>
          </Tooltip>
        </div>

        <div className='col-auto mb-5 pe-0'>
          <Tooltip placement='top' title='Edit'>
            <div
              data-cy='editLocation'
              onClick={() => onEdit()}
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
              data-cy='deleteLocation'
            >
              <i className='fa fa-lg fa-trash-alt text-danger'></i>
            </div>
          </Tooltip>
        </div>

        <div className='col-auto mb-5 pe-0'>
          <Tooltip placement='top' title='Email'>
            <div
              data-cy='locationEmail'
              className='d-flex align-items-center justify-content-center w-35px h-35px radius-10 cursor-pointer bg-light-success border border-dashed border-success shadow-sm'
              onClick={() => {
                setShowModalEmail(true)
              }}
            >
              <i className='fa fa-lg fa-envelope text-success'></i>
            </div>
          </Tooltip>
        </div>
      </div>

      <Alert
        setShowModal={setShowModalDelete}
        showModal={showModalDelete}
        loading={loading}
        body={msg_alert}
        type={'delete'}
        title={'Delete Location'}
        confirmLabel={'Delete'}
        onConfirm={confirmDeleteLocation}
        onCancel={() => setShowModalDelete(false)}
      />

      <AddLocation
        showModal={showModal}
        setShowModalLocation={setShowModalLocation}
        setReloadLocation={setReloadLocation}
        reloadLocation={reloadLocation}
        locationDetail={detailLocation}
        onClickForm={onClickForm}
        setOnClickForm={setOnClickForm}
      />
    </>
  )
}

export default LocationActions
