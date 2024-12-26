import {CustomRadio} from '@components/form/CustomRadio'
import {KTSVG} from '@helpers'
import {editFeature} from '@pages/wizards/redux/WizardService'
import axios from 'axios'
import {FC, memo, useCallback, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'

type Props = {
  feature?: any
}

let Step6: FC<Props> = ({feature}) => {
  const intl: any = useIntl()
  const [features, setFeatures] = useState<any>([])
  const [imageIcon, setImageIcon] = useState<any>('')

  useEffect(() => {
    if (feature) {
      setFeatures(feature)
    }
  }, [feature])

  const setFeature = useCallback(
    ({unique_name, value}) => {
      const val: any = features?.map((v: any) => {
        const {unique_name: name}: any = v
        if (name === unique_name) {
          return {
            ...v,
            value,
          }
        }
        return v
      })
      setFeatures(val)
    },
    [features]
  )

  useEffect(() => {
    axios.get('/media/icons/duotone/Code/Done-circle.svg').then(({data}: any) => {
      setImageIcon(data?.toString()?.replace('<?xml version="1.0" encoding="UTF-8"?>', ''))
    })
  }, [])

  return (
    <div className='w-100'>
      <div className='pb-5 mb-5' style={{borderBottom: '3px dashed #eee'}}>
        <h3 data-cy='headerFeature' className='fw-bolder text-dark mb-3'>
          <KTSVG
            path='/media/icons/duotone/Design/Verified.svg'
            className='svg-icon-primary svg-icon-2x me-2'
          />
          Features
        </h3>
        <div className='notice d-flex align-items-center bg-light-warning rounded border-warning border border-dashed p-3'>
          <KTSVG
            path='/media/icons/duotone/Code/Warning-1-circle.svg'
            className='svg-icon-warning svg-icon-2x me-2'
          />
          <p className='m-0 fw-bold' data-cy='info-title'>
            {intl.formatMessage({id: 'PLEASE_CHOOSE_YOUR_FEATURES'})}
          </p>
        </div>
      </div>
      <div className='form-row'>
        {Array.isArray(features) &&
          features?.map(({description, name, unique_name, value}: any, index: number) => {
            return (
              <div
                key={index}
                className='mb-8 p-4 border border-primary border-dashed rounded d-flex align-items-center card-hover'
              >
                <div className='d-flex align-items-start'>
                  <div className='symbol symbol-30px me-2'>
                    <div className='symbol-label bg-light-success'>
                      <span
                        className='svg-icon svg-icon-success svg-icon-2x'
                        dangerouslySetInnerHTML={{__html: imageIcon}}
                      ></span>
                    </div>
                  </div>
                  <div className=''>
                    <h3 className='mb-0'>{name || '-'}</h3>
                    <div className='text-gray-600'>{description || '-'}</div>
                  </div>
                </div>
                <div className='ms-auto row'>
                  <div className='col'>
                    <CustomRadio
                      rowClass='flex-nowrap'
                      col='col-auto mt-3'
                      labelClass='fs-6'
                      options={[
                        {value: 1, label: 'Enable'},
                        {value: 0, label: 'Disable'},
                      ]}
                      defaultValue={value}
                      onChange={(e: any) => {
                        editFeature(unique_name, e)
                        setFeature({unique_name, value: e})
                      }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
      </div>
    </div>
  )
}

Step6 = memo(Step6, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export {Step6}
