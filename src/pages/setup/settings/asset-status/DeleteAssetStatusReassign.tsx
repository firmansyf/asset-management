import {ToastMessage} from '@components/toast-message'
import {configClass, errorExpiredToken} from '@helpers'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {FC, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import * as Yup from 'yup'

import {deleteBulkAssetStatus} from './Service'

const AssetStatusSchema = Yup.object().shape({
  asset_status_guid: Yup.string().required('Select Asset Status name is required'),
})

type DeleteAssetStatusReassignProps = {
  showModalDeleteReassign: any
  setShowModal: any
  setShowModalDeleteReassign: any
  setReloadAssetStatus: any
  reloadAssetStatus: any
  assetStatusGuid: any
  cantDeleteInfo: any
  assignAssetStatus: any
  setDataChecked: any
}

const DeleteAssetStatusReassign: FC<DeleteAssetStatusReassignProps> = ({
  showModalDeleteReassign,
  setShowModal,
  setShowModalDeleteReassign,
  setReloadAssetStatus,
  reloadAssetStatus,
  assetStatusGuid,
  cantDeleteInfo,
  assignAssetStatus,
  setDataChecked,
}) => {
  const [reassignAssetStatus, setreassignAssetStatus] = useState<string>('')
  const [loadingAssetStatus, setLoadingAssetStatus] = useState<boolean>(false)

  const onClickDeleteModal = (values: any) => {
    setLoadingAssetStatus(true)

    const params: any = {
      reassignTo: values?.asset_status_guid,
      guids: assetStatusGuid,
    }

    if (assetStatusGuid) {
      deleteBulkAssetStatus(params)
        .then((res: any) => {
          ToastMessage({type: 'success', message: res?.data?.message})
          setLoadingAssetStatus(false)
          setShowModalDeleteReassign(false)
          setShowModal(false)
          setReloadAssetStatus(reloadAssetStatus + 1)
          setDataChecked([])
        })
        .catch((err: any) => {
          errorExpiredToken(err)
          ToastMessage({message: err?.response?.data?.message, type: 'error'})
          setLoadingAssetStatus(false)
        })
    }
  }

  return (
    <Modal
      dialogClassName='modal-md'
      show={showModalDeleteReassign}
      onHide={() => setShowModalDeleteReassign(false)}
    >
      <Formik
        initialValues={{
          asset_status_guid: reassignAssetStatus || '',
        }}
        validationSchema={AssetStatusSchema}
        onSubmit={onClickDeleteModal}
      >
        {() => (
          <Form className='justify-content-center' noValidate>
            <Modal.Header>
              <Modal.Title>Delete Asset Status</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className='text-gray-500 mb-10 text-left'>
                {cantDeleteInfo?.data?.data_status?.join(', ')} is currently assigned to{' '}
                {cantDeleteInfo?.data?.data_status?.length || 0} asset(s). Please reassign the
                assets to other asset status before deleting it.
              </div>
              <div className='col-md-12'>
                <label htmlFor='name' className='text-dark required'>
                  Reassign to Asset Status
                </label>
                <Field
                  as='select'
                  name='asset_status_guid'
                  className={configClass?.select}
                  onClick={({target: {value}}: any) => setreassignAssetStatus(value || '')}
                >
                  <option value=''>Select Asset Status</option>
                  {assignAssetStatus &&
                    assignAssetStatus?.length > 0 &&
                    assignAssetStatus?.map(
                      ({guid, name}: any) =>
                        assetStatusGuid?.find((item: any) => item !== guid) && (
                          <option key={guid} value={guid || ''}>
                            {name || '-'}
                          </option>
                        )
                    )}
                </Field>
                <div className='fv-plugins-message-container invalid-feedback'>
                  <ErrorMessage name='asset_status_guid' />
                </div>
              </div>
              <div className='text-gray-500 mt-10 text-left'>
                Note: this action cannot be undone.
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button className='btn-sm' type='submit' form-id='' variant='primary'>
                {!loadingAssetStatus && (
                  <span className='indicator-label'>Reassign Asset Status and Delete</span>
                )}
                {loadingAssetStatus && (
                  <span className='indicator-progress' style={{display: 'block'}}>
                    Please wait...
                    <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                  </span>
                )}
              </Button>
              <Button
                className='btn-sm'
                variant='secondary'
                onClick={() => setShowModalDeleteReassign(false)}
              >
                Cancel
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  )
}

export {DeleteAssetStatusReassign}
