import {Alert} from '@components/alert'
import Tooltip from '@components/alert/tooltip'
import {ToastMessage} from '@components/toast-message'
import {AddPolicy} from '@pages/insurance/policies/AddPolicy'
import {deleteInsurancePolicies, printInsurance} from '@pages/insurance/policies/Service'
import ValidationSchema from '@pages/insurance/policies/ValidationSchema'
import {getCustomField} from '@pages/setup/custom-field/redux/ReduxCustomField'
import {getDatabaseInsurance} from '@pages/setup/databases/Serivce'
import {FC, memo, useEffect, useState} from 'react'
import {useNavigate} from 'react-router-dom'

let Actions: FC<any> = ({
  data,
  reloadPolicy,
  setReloadPolicy,
  reloadAsset,
  setReloadAsset,
  setShowModal,
}) => {
  const navigate: any = useNavigate()

  const [mode, setMode] = useState<any>('view')
  const [loading, setLoading] = useState<boolean>(false)
  const [printLoading, setPrintLoading] = useState<boolean>(false)
  const [showModal, setShowModalPolicy] = useState<boolean>(false)
  const [optDatabase, setDatabaseOption] = useState<any>([])
  const [insuranceSchema, setInsuranceSchema] = useState<any>([])
  const [onClickForm, setOnClickForm] = useState<boolean>(false)
  const [defaultPhoneNumber, setDefaultPhoneNumber] = useState<any>('')
  const [defaultCustomField, setDefaultCustomField] = useState<any>([])
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false)

  const confirmDeleteInsurancePolicies = () => {
    setLoading(true)
    deleteInsurancePolicies(data?.guid)
      .then(({data: {message}}: any) => {
        setTimeout(() => {
          setLoading(false)
          setShowModalDelete(false)
          navigate('/insurance/policies')
          setTimeout(() => ToastMessage({type: 'clear'}), 300)
          setTimeout(() => ToastMessage({message, type: 'success'}), 400)
        }, 1000)
      })
      .catch(({response}: any) => {
        setLoading(false)
        const {message} = response?.data || {}
        ToastMessage({type: 'error', message})
      })
  }

  const print = () => {
    setPrintLoading(true)
    printInsurance(data?.guid)
      .then(({data: {url, message}}: any) => {
        window.open(url, '_blank')
        ToastMessage({type: 'success', message})
        setPrintLoading(false)
      })
      .catch(() => setPrintLoading(false))
  }

  useEffect(() => {
    setLoading(true)
    getCustomField({filter: {section_type: 'insurance_policy'}}).then(
      ({data: {data: res_custom_field}}: any) => {
        setDefaultCustomField(res_custom_field)
        setTimeout(() => setLoading(false), 2000)
      }
    )

    getDatabaseInsurance({}).then(({data: {data: res_database}}: any) => {
      res_database && setDatabaseOption(res_database)
    })
  }, [])

  useEffect(() => {
    if (showModal) {
      const phoneNumber = data?.phone_number ? data?.phone_number?.replace('+', '') : ''
      setDefaultPhoneNumber(phoneNumber?.replace('-', ''))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal])

  return (
    <>
      <div className='row'>
        <div className='col-auto mb-5 pe-0'>
          <Tooltip placement='top' title='Print'>
            <div
              data-cy='printInsurancePolicy'
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
              data-cy='editInsurancePolicy'
              onClick={() => {
                setMode('edit')
                setShowModalPolicy(true)
              }}
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

        <div className='col-auto mb-5 pe-0'>
          <Tooltip placement='top' title='Email'>
            <div
              className='d-flex align-items-center justify-content-center w-35px h-35px radius-10 cursor-pointer bg-light-success border border-dashed border-success shadow-sm'
              onClick={() => {
                setShowModal(true)
              }}
            >
              <i className='fa fa-lg fa-envelope text-success'></i>
            </div>
          </Tooltip>
        </div>
      </div>

      <AddPolicy
        policyDetail={data}
        setShowModalPolicy={setShowModalPolicy}
        showModal={showModal}
        setReloadPolicy={setReloadPolicy}
        reloadPolicy={reloadPolicy}
        optDatabase={optDatabase}
        insuranceSchema={insuranceSchema}
        onClickForm={onClickForm}
        setOnClickForm={setOnClickForm}
        defaultCustomField={defaultCustomField}
        reloadAsset={reloadAsset}
        setReloadAsset={setReloadAsset}
        setDefaultPhoneNumber={setDefaultPhoneNumber}
        defaultPhoneNumber={defaultPhoneNumber}
        mode={mode}
      />

      <ValidationSchema setInsuranceSchema={setInsuranceSchema} optDatabase={optDatabase} />

      <Alert
        setShowModal={setShowModalDelete}
        showModal={showModalDelete}
        loading={loading}
        body={
          <p className='m-0'>
            Are you sure you want to delete <strong>{data?.name}</strong> ?
          </p>
        }
        type={'delete'}
        title={'Delete Insurance Policy'}
        confirmLabel={'Delete'}
        onConfirm={confirmDeleteInsurancePolicies}
        onCancel={() => setShowModalDelete(false)}
      />
    </>
  )
}

Actions = memo(Actions)
export {Actions}
