import {Alert} from '@components/alert'
import Tooltip from '@components/alert/tooltip'
import {ToastMessage} from '@components/toast-message'
import {deletePO, printPO} from '@pages/purchase-order/Services'
import {FC, useState} from 'react'
import {useNavigate} from 'react-router-dom'

type ActionsProps = {
  detailPO: any
  reloadPODetail: any
  setReloadPODetail: any
}

const Actions: FC<ActionsProps> = ({detailPO}) => {
  const {guid}: any = detailPO || {}
  const navigate: any = useNavigate()

  const [loading, setLoading] = useState<boolean>(false)
  const [printLoading, setPrintLoading] = useState<boolean>(false)
  const [showModalPrint, setShowModalPrint] = useState<boolean>(false)
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false)

  const confirmDeletePO = () => {
    setLoading(true)
    deletePO(guid)
      .then(({data: {message}}: any) => {
        setTimeout(() => {
          setLoading(false)
          setShowModalDelete(false)
          navigate('/purchase-order')
          ToastMessage({type: 'success', message})
        }, 1000)
      })
      .catch(({response}: any) => {
        setLoading(false)
        const {message} = response?.data || {}
        ToastMessage({type: 'error', message})
      })
  }

  const handlePrint = () => {
    setShowModalPrint(true)
  }

  const printPurchaseOrder = () => {
    setPrintLoading(true)
    printPO(guid)
      .then(({data: {url, message}}: any) => {
        window.open(url, '_blank')
        setPrintLoading(false)
        setShowModalPrint(false)
        ToastMessage({type: 'success', message})
      })
      .catch(({response}: any) => {
        setPrintLoading(false)
        if (response) {
          const {devMessage, data, message} = response?.data || {}
          if (!devMessage) {
            const {fields} = data || {}

            if (fields === undefined) {
              ToastMessage({message, type: 'error'})
            } else {
              Object.keys(fields || {}).forEach((item: any) => {
                ToastMessage({message: fields?.[item]?.[0] || '', type: 'error'})
              })
            }
          }
        }
      })
  }

  return (
    <>
      <div className='row'>
        <div className='col-auto mb-5 pe-0'>
          <Tooltip placement='top' title='Print'>
            <div
              className='d-flex align-items-center justify-content-center w-35px h-35px radius-10 cursor-pointer bg-light-primary border border-dashed border-primary shadow-sm'
              onClick={handlePrint}
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
              onClick={() => navigate(`/purchase-order/edit/${guid}`)}
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
            >
              <i className='fa fa-lg fa-trash-alt text-danger'></i>
            </div>
          </Tooltip>
        </div>

        <div className='col-auto mb-5 pe-0'>
          <Tooltip placement='top' title='Email'>
            <div
              className='d-flex align-items-center justify-content-center w-35px h-35px radius-10 cursor-pointer bg-light-success border border-dashed border-success shadow-sm'
              onClick={() => ''}
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
        body={
          <p className='m-0'>
            Are you sure you want to delete <strong>{detailPO?.name || ''}</strong> ?
          </p>
        }
        type={'delete'}
        title={'Confirm Delete'}
        confirmLabel={'Delete'}
        onConfirm={confirmDeletePO}
        onCancel={() => setShowModalDelete(false)}
      />

      <Alert
        setShowModal={setShowModalPrint}
        showModal={showModalPrint}
        loading={printLoading}
        body={
          <div className='form-check form-check-custom form-check-solid'>
            <span className='m-0'>
              Do you want to print <strong>{detailPO?.po_id || ''}</strong> ?
            </span>
          </div>
        }
        type={'print'}
        title={'Print Purchase Order'}
        confirmLabel={'Yes'}
        onConfirm={printPurchaseOrder}
        onCancel={() => setShowModalPrint(false)}
      />
    </>
  )
}

export {Actions}
