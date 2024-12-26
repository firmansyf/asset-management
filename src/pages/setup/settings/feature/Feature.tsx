import {CustomRadio} from '@components/form/CustomRadio'
import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {PageTitle} from '@metronic/layout/core'
import {savePreference} from '@redux'
import {useQuery} from '@tanstack/react-query'
import axios from 'axios'
import {remove, sortBy} from 'lodash'
import {FC, useEffect, useState} from 'react'
import {useIntl} from 'react-intl'
import {shallowEqual, useSelector} from 'react-redux'

import {getFeature, updateFeature} from './Service'

const CardFeature: FC = () => {
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {date_format, time_format, timezone, country, preference, currency}: any =
    preferenceStore || {}

  const [imageIcon, setImageIcon] = useState<any>('')

  useEffect(() => {
    ToastMessage({type: 'clear'})
  }, [])

  const onFeatureChange = (unique_name: string, value: number) => {
    updateFeature(unique_name, {value})
      .then(() => '')
      .catch(({response}: any) => {
        const {message} = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }

  const saveButton = () => {
    const message = `Successfully updated`
    ToastMessage({message: message, type: 'success'})
    getFeature({orderCol: 'name', orderDir: 'asc'}).then(({data: {data}}: any) => {
      const updatePreferance: any = {
        date_format: date_format,
        time_format: time_format,
        timezone: timezone,
        country: country,
        preference: preference,
        currency: currency,
        feature: data,
      }
      savePreference(updatePreferance || {})
    })
    setTimeout(() => window.location.reload(), 1000)
  }

  const featuresQuery: any = useQuery({
    queryKey: ['getFeature'],
    queryFn: async () => {
      const res: any = await getFeature({orderCol: 'name', orderDir: 'asc'})
      const data: any = res?.data?.data || {}
      remove(data, (data: any) => data?.unique_name === 'item_code')
      const dataResult: any = sortBy(data, 'name')
      return dataResult
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })

  const features: any = featuresQuery?.data || []

  useEffect(() => {
    axios
      .get('/media/icons/duotone/Code/Done-circle.svg')
      .then(({data}: any) =>
        setImageIcon(data?.toString()?.replace('<?xml version="1.0" encoding="UTF-8"?>', ''))
      )
  }, [])

  return (
    <div className='card card-custom' style={{background: '#fff'}}>
      {!featuresQuery?.isFetched ? (
        <div className='row'>
          <div className='col-12 text-center'>
            <PageLoader />
          </div>
        </div>
      ) : (
        <div className='card-body px-0 py-5'>
          {features &&
            features?.length > 0 &&
            features?.map(({name, description, value, unique_name}: any, index: number) => {
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
                      <h3 className='mb-0'>{name}</h3>

                      <div className='text-gray-600'>{description}</div>
                    </div>
                  </div>
                  <div className='ms-auto'>
                    <CustomRadio
                      col='col-auto mt-3'
                      labelClass='fs-6'
                      options={[
                        {value: 1, label: 'Yes'},

                        {value: 0, label: 'No'},
                      ]}
                      defaultValue={value}
                      onChange={(e: any) => onFeatureChange(unique_name, e)}
                    />
                  </div>
                </div>
              )
            })}
          <div className='border-top border-gray-300 pt-4 text-end'>
            <button className='btn btn-primary' onClick={saveButton}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const Feature: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.SETUP.SETTINGS.FEATURES'})}
      </PageTitle>
      <CardFeature />
    </>
  )
}

export default Feature
