import {CustomRadio} from '@components/form/CustomRadio'
import {ToastMessage} from '@components/toast-message'
import {KTSVG} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {FC, useEffect, useState} from 'react'
import {Button} from 'react-bootstrap'
import {useIntl} from 'react-intl'

import {getCustomize, postCustomize} from './Service'

const CardCustomize: FC<any> = () => {
  const [data, setData] = useState<any>({})
  const [dataUpdate, setDataUpdate] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [loadingCancel, setLoadingCancel] = useState<boolean>(false)

  useEffect(() => {
    getCustomize({})
      .then(({data: {data: res}}: any) => {
        if (res) {
          setData(res || {})
          setDataUpdate(res || {})
          setLoadingCancel(false)
        }
      })
      .catch(() => {
        setData({})
        setDataUpdate({})
        setLoadingCancel(false)
      })
  }, [loadingCancel])

  const onNotifChange = (item: any, value: any) => {
    if (Object.keys(dataUpdate || {})?.length > 0) {
      const result: any = {}
      Object.keys(dataUpdate || {}).forEach((row: any) => {
        result[row] = {
          label: dataUpdate?.[row]?.label || '',
          is_active: row === item ? (value === 'true' ? 1 : 0) : dataUpdate?.[row]?.is_active,
        }
      })
      setDataUpdate(result)
    }
  }

  const saveButton = () => {
    setLoading(true)
    postCustomize({modules: dataUpdate})
      .then(() => {
        setLoading(false)
        ToastMessage({type: 'success', message: 'Successfully updated'})
        setTimeout(() => {
          window.location.reload()
        }, 1500)
      })
      .catch(({response}: any) => {
        const {message} = response?.data || {}
        ToastMessage({type: 'error', message})
      })
  }

  return (
    <div className='card card-custom' style={{background: '#fff'}}>
      <div className='card-body px-0 py-5'>
        <p
          style={{
            marginBottom: '30px',
            paddingBottom: '15px',
            fontSize: '14px',
            borderBottom: '1px solid #fafafa',
          }}
        >
          You can customize the notification you want to show in the bell
        </p>

        {!loadingCancel &&
          Object.keys(data || {})?.map((item: any, index: any) => {
            return (
              <div
                className='mb-8 p-4 border border-primary border-dashed rounded d-flex align-items-center card-hover'
                key={index}
              >
                <div className='d-flex align-items-start'>
                  <div className='symbol symbol-30px me-2'>
                    <div className='symbol-label bg-light-success'>
                      <KTSVG
                        path='/media/icons/duotone/General/Notifications1.svg'
                        className='svg-icon-success svg-icon-2x'
                      />
                    </div>
                  </div>
                  <div className=''>
                    <h3 className='mb-0' style={{marginTop: '6px'}}>
                      {data?.[item]?.label || ''}
                    </h3>
                  </div>
                </div>
                <div className='ms-auto'>
                  <CustomRadio
                    name={item}
                    col='col-auto mt-3'
                    labelClass='fs-6'
                    options={[
                      {value: 'true', label: 'Yes'},
                      {value: 'false', label: 'No'},
                    ]}
                    defaultValue={`${!!data?.[item]?.is_active}`}
                    onChange={(e: any) => onNotifChange(item, e)}
                  />
                </div>
              </div>
            )
          })}

        <div className='border-top border-gray-300 pt-4 text-end'></div>
        <div className='text-end'>
          <Button
            disabled={loadingCancel}
            className='btn-sm ms-3'
            type='button'
            variant='secondary'
            onClick={() => setLoadingCancel(true)}
          >
            {!loadingCancel && <span className='indicator-label'>{'Cancel'}</span>}
            {loadingCancel && (
              <span className='indicator-progress' style={{display: 'block'}}>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </Button>
          <Button
            disabled={loading}
            className='btn-sm ms-3'
            type='button'
            variant='primary'
            onClick={saveButton}
          >
            {!loading && <span className='indicator-label'>{'Save'}</span>}
            {loading && (
              <span className='indicator-progress' style={{display: 'block'}}>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

const Customize: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'HELPDESK.CUSTOMIZE'})}</PageTitle>
      <CardCustomize />
    </>
  )
}

export default Customize
