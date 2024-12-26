import {getCompany} from '@api/company'
import {Select} from '@components/select/ajax'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorExpiredToken} from '@helpers'
import {addContact} from '@pages/user-management/redux/ContactCRUD'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

import {getTags} from '../tags/core/service'

const ContactSchema = Yup.object().shape({
  name: Yup.string().required('Contact Name is required'),
  company_guid: Yup.string().required('Company is required'),
  tag_guid: Yup.string().required('Tags is required'),
})

const AddContact: FC<any> = ({
  contactDetail,
  showModal,
  setShowModal,
  reloadContact,
  setReloadContact,
}) => {
  const [loading, setLoading] = useState(false)

  const handleSubmit = (value: any) => {
    setLoading(true)
    const params = {
      name: value.name,
      title: value.title,
      company_guid: value.company_guid,
      email: value.email,
      phonenumber: value.phonenumber,
      facebook: value.facebook,
      twitter: value.twitter,
      tags: [{tag_guid: value.tag_guid}],
    }

    if (contactDetail) {
      // edit contact here
    } else {
      addContact(params)
        .then((res: any) => {
          ToastMessage({message: res?.data?.message, type: 'success'})
          setLoading(false)
          setShowModal(false)
          setReloadContact(reloadContact + 1)
        })
        .catch((err: any) => {
          errorExpiredToken(err)
          setLoading(false)
          if (err?.response?.data?.devMessage === false) {
            ToastMessage({message: 'The name has already been taken.', type: 'error'})
          }
        })
    }
  }

  return (
    <Modal
      dialogClassName='modal-md'
      show={showModal}
      onHide={() => {
        setShowModal(false)
      }}
    >
      <Formik
        initialValues={{
          name: '',
          title: '',
          company_guid: '',
          email: '',
          phonenumber: '',
          facebook: '',
          twitter: '',
          tag_guid: '',
        }}
        validationSchema={ContactSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({setFieldValue}) => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>{contactDetail ? 'Edit' : 'Add'} a Contact</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div>
                <label htmlFor='name' className={`${configClass?.label} required`}>
                  Contact Name
                </label>
                <Field
                  type='text'
                  name='name'
                  placeholder='Enter Contact Name'
                  className={configClass?.form}
                />
                <div className='fv-plugins-message-container invalid-feedback'>
                  <ErrorMessage name='name' />
                </div>
              </div>
              <div>
                <label htmlFor='title' className={configClass?.label}>
                  Title
                </label>
                <Field
                  type='text'
                  name='title'
                  placeholder='Enter Title'
                  className={configClass?.form}
                />
              </div>
              <div>
                <label htmlFor='company_guid' className={`${configClass?.label} required`}>
                  Choose Company
                </label>
                <Select
                  sm={true}
                  className='col p-0'
                  api={getCompany}
                  params={false}
                  reload={false}
                  placeholder='Choose Company'
                  onChange={(e: any) => {
                    setFieldValue('company_guid', e?.value || '')
                  }}
                  parse={(e: any) => {
                    return {
                      value: e.guid,
                      label: e.name,
                    }
                  }}
                />
                <div className='fv-plugins-message-container invalid-feedback'>
                  <ErrorMessage name='company_guid' />
                </div>
              </div>
              <div>
                <label htmlFor='email' className={configClass?.label}>
                  Email
                </label>
                <Field
                  type='text'
                  name='email'
                  placeholder='Enter Email'
                  className={configClass?.form}
                />
              </div>
              <div>
                <label htmlFor='phonenumber' className={configClass?.label}>
                  Phone Number
                </label>
                <Field
                  type='text'
                  name='phonenumber'
                  placeholder='Enter Phone Number'
                  className={configClass?.form}
                />
              </div>
              <div>
                <label htmlFor='facebook' className={configClass?.label}>
                  Facebook
                </label>
                <Field
                  type='text'
                  name='facebook'
                  placeholder='Enter Facebook'
                  className={configClass?.form}
                />
              </div>
              <div>
                <label htmlFor='twitter' className={configClass?.label}>
                  Twitter
                </label>
                <Field
                  type='text'
                  name='twitter'
                  placeholder='Enter Twitter'
                  className={configClass?.form}
                />
              </div>
              <div className='mt-2'>
                <label htmlFor='tag_guid' className={`${configClass?.label} required`}>
                  Choose Tags
                </label>
                <Select
                  sm={true}
                  className='col p-0'
                  api={getTags}
                  params={false}
                  reload={false}
                  placeholder='Choose Tags'
                  onChange={(e: any) => setFieldValue('tag_guid', e?.value || '')}
                  parse={(e: any) => {
                    return {
                      value: e.guid,
                      label: e.name,
                    }
                  }}
                />
                <div className='fv-plugins-message-container invalid-feedback'>
                  <ErrorMessage name='tag_guid' />
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button disabled={loading} className='btn-sm' type='submit' variant='primary'>
                {!loading && (
                  <span className='indicator-label'>{contactDetail ? 'Save' : 'Add'}</span>
                )}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </Button>
              <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
                Cancel
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default AddContact
