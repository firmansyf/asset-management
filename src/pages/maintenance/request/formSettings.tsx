import {Select} from '@components/select/select'
import {ToastMessage} from '@components/toast-message'
import {Form, Formik} from 'formik'
import {FC, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

import {saveFormSettings} from './core/service'

type Props = {
  showModal: any
  setShowModal: any
  settingFormData: any
  settingFormOption: any
  reloadSettingForm: any
  setReloadSettingForm: any
}

const FormSettingsModal: FC<Props> = ({
  showModal,
  setShowModal,
  settingFormData,
  settingFormOption,
  reloadSettingForm,
  setReloadSettingForm,
}) => {
  const [optSetingForm, setOptSetingForm] = useState([])

  const handleOnSubmit = (value: any) => {
    const params = {
      asset: {
        name: settingFormData?.asset?.name,
        value: value?.asset || 'nullable',
      },
      location: {
        name: settingFormData?.location?.name,
        value: value?.location || 'nullable',
      },
      worker: {
        name: settingFormData?.worker?.name,
        value: value?.worker || 'nullable',
      },
      due_date: {
        name: settingFormData?.due_date?.name,
        value: value?.due_date || 'nullable',
      },
      category: {
        name: settingFormData?.category?.name,
        value: value?.category || 'nullable',
      },
      team: {
        name: settingFormData?.team?.name,
        value: value?.team || 'nullable',
      },
    }
    saveFormSettings(params)
      .then((res: any) => {
        ToastMessage({type: 'success', message: res?.data?.message})
        setReloadSettingForm(reloadSettingForm + 1)
        setShowModal(false)
      })
      .catch(() => '')
  }

  useEffect(() => {
    if (settingFormOption !== undefined) {
      const setingForm: any = Object.entries(settingFormOption || {}).map((key: any) => {
        return {value: key[0], label: key[1]}
      })
      setOptSetingForm(setingForm)
    }
  }, [settingFormOption])

  const configClass: any = {
    label: 'space-3 text-uppercase fw-bolder fs-8 mb-1 text-black-200',
    row: 'row mb-1 mt-6',
    size: 'sm',
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={{
          team: settingFormData?.team?.value,
          worker: settingFormData?.worker?.value,
          asset: settingFormData?.asset?.value,
          due_date: settingFormData?.due_date?.value,
          category: settingFormData?.category?.value,
          location: settingFormData?.location?.value,
        }}
        enableReinitialize
        onSubmit={(values: any) => {
          handleOnSubmit(values)
        }}
      >
        {({values, setFieldValue}) => {
          return (
            <Form className='justify-content-center' noValidate>
              <Modal.Header closeButton>
                <Modal.Title>Form Settings Request</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className={configClass.row}>
                  <label htmlFor='asset' className={`${configClass.label}`}>
                    {settingFormData?.asset?.name}
                  </label>
                  <Select
                    name='asset'
                    placeholder='Choose option'
                    defaultValue={values?.asset}
                    onChange={({value}: any) => {
                      setFieldValue('asset', value)
                    }}
                    data={optSetingForm}
                  />
                </div>
                <div className={configClass.row}>
                  <label htmlFor='category' className={`${configClass.label}`}>
                    {settingFormData?.category?.name}
                  </label>
                  <Select
                    name='category'
                    placeholder='Choose option'
                    defaultValue={values?.category}
                    onChange={({value}: any) => {
                      setFieldValue('category', value)
                    }}
                    data={optSetingForm}
                  />
                </div>
                <div className={configClass.row}>
                  <label htmlFor='due_date' className={`${configClass.label}`}>
                    {settingFormData?.due_date?.name}
                  </label>
                  <Select
                    name='due_date'
                    placeholder='Choose option'
                    defaultValue={values?.due_date}
                    onChange={({value}: any) => {
                      setFieldValue('due_date', value)
                    }}
                    data={optSetingForm}
                  />
                </div>
                <div className={configClass.row}>
                  <label htmlFor='location' className={`${configClass.label}`}>
                    {settingFormData?.location?.name}
                  </label>
                  <Select
                    name='location'
                    placeholder='Choose option'
                    defaultValue={values?.location}
                    onChange={({value}: any) => {
                      setFieldValue('location', value)
                    }}
                    data={optSetingForm}
                  />
                </div>
                <div className={configClass.row}>
                  <label htmlFor='team' className={`${configClass.label}`}>
                    {settingFormData?.team?.name}
                  </label>
                  <Select
                    name='team'
                    placeholder='Choose option'
                    defaultValue={values?.team}
                    onChange={({value}: any) => {
                      setFieldValue('team', value)
                    }}
                    data={optSetingForm}
                  />
                </div>
                <div className={configClass.row}>
                  <label htmlFor='worker' className={`${configClass.label}`}>
                    {settingFormData?.worker?.name}
                  </label>
                  <Select
                    name='worker'
                    placeholder='Choose option'
                    defaultValue={values?.worker}
                    onChange={({value}: any) => {
                      setFieldValue('worker', value)
                    }}
                    data={optSetingForm}
                  />
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                  Save
                </Button>
              </Modal.Footer>
            </Form>
          )
        }}
      </Formik>
    </Modal>
  )
}

export {FormSettingsModal}
