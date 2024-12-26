import {addRole} from '@api/role-and-permision'
import {ToastMessage} from '@components/toast-message'
import {configClass, errorExpiredToken, errorValidation} from '@helpers'
import {Field, Form, Formik} from 'formik'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

const RolesSchema = Yup.object().shape({
  name: Yup.string().required('Role Name is required'),
})

const AddRole: FC<any> = ({
  showModal,
  setShowModal,
  reloadRoles,
  setReloadRoles,
  setDataChecked,
}) => {
  const [validation, setValidation] = useState<any>('')
  const [loading, setLoading] = useState<boolean>(false)

  const handleSubmit = (value: any) => {
    setValidation('')
    setLoading(true)
    const role_name = value?.name?.replace(/\s/g, '_')
    const params = {
      name: role_name?.toLowerCase() || '',
      label: value?.name || '',
      description: value?.description || '',
    }

    addRole(params)
      .then(({data: {message}}: any) => {
        ToastMessage({message, type: 'success'})
        setLoading(false)
        setShowModal(false)
        setDataChecked(undefined)
        setReloadRoles(reloadRoles + 1)
      })
      .catch((err: any) => {
        errorExpiredToken(err)
        setLoading(false)
        const error = errorValidation(err)
        if (error?.name && error?.label) {
          setValidation(error?.name)
        } else {
          setValidation(error?.label)
        }
      })
  }
  const onCancel = () => {
    setValidation('')
    setShowModal(false)
  }
  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Formik
        initialValues={{
          name: '',
          description: '',
        }}
        validationSchema={RolesSchema}
        enableReinitialize
        onSubmit={handleSubmit}
      >
        {({isValid}) => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Create New Roles</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='mt-2'>
                <label htmlFor='name' className={`${configClass?.label} required`}>
                  Role Name
                </label>
                <Field
                  name='name'
                  type='text'
                  placeholder='Enter Role Name'
                  className={
                    isValid && validation === ''
                      ? `${configClass?.form} mb-3`
                      : `${configClass?.form} is-invalid mb-3`
                  }
                />
                <div className='fv-plugins-message-container invalid-feedback'>
                  {validation !== '' && (
                    <>
                      {' '}
                      <span>{validation}</span> <br />{' '}
                    </>
                  )}
                </div>
              </div>
              <div className='mt-2'>
                <label htmlFor='description' className={configClass?.label}>
                  Description
                </label>
                <Field
                  name='description'
                  type='text'
                  placeholder='Enter Role Description'
                  className={configClass?.form}
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button disabled={loading} className='btn-sm' type='submit' variant='primary'>
                {!loading && <span className='indicator-label'>Save</span>}
                {loading && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </Button>
              <Button className='btn-sm' variant='secondary' type='reset' onClick={onCancel}>
                Cancel
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export default AddRole
