import Tooltip from '@components/alert/tooltip'
import {ToastMessage} from '@components/toast-message'
import AddMeter from '@pages/maintenance/meter/add/add'
import ValidationSchema from '@pages/maintenance/meter/add/validation'
import {printMeter} from '@pages/maintenance/Service'
import {FC, memo, useState} from 'react'

let Actions: FC<any> = ({data, onDelete, reload, setReload}) => {
  const [meterSchema, setMeterSchema] = useState<any>([])
  const [printLoading, setPrintLoading] = useState<boolean>(false)
  const [showModalAdd, setShowModalAdd] = useState<boolean>(false)

  const handlePrint = () => {
    const {guid} = data || {}
    setPrintLoading(true)
    guid
      ? printMeter(guid)
          .then(({data: {url, message}}: any) => {
            setPrintLoading(false)
            window.open(url, '_blank')
            ToastMessage({type: 'success', message})
          })
          .catch(() => setPrintLoading(false))
      : setPrintLoading(false)
  }

  return (
    <>
      <div className='row m-0 align-items-center'>
        <div className='col-auto row'>
          <div className='col-auto mb-5 mx-1 pe-0'>
            <Tooltip placement='top' title='Print'>
              <div
                data-cy='printTicket'
                onClick={handlePrint}
                className='d-flex align-items-center justify-content-center w-35px h-35px radius-10 cursor-pointer bg-light-primary border border-dashed border-primary shadow-sm'
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
                onClick={() => setShowModalAdd(true)}
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
                onClick={onDelete}
              >
                <i className='fa fa-lg fa-trash-alt text-danger'></i>
              </div>
            </Tooltip>
          </div>
        </div>
      </div>

      <AddMeter
        meterDetail={data}
        reloadMeter={reload}
        showModal={showModalAdd}
        meterSchema={meterSchema}
        setReloadMeter={setReload}
        setShowModal={setShowModalAdd}
      />

      <ValidationSchema setMeterSchema={setMeterSchema} />
    </>
  )
}

Actions = memo(Actions, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default Actions
