import {FC, memo} from 'react'
import {Button, Modal} from 'react-bootstrap'

import {DefaultFormChange} from './DefaultFormChange'

const SaveConfirm: FC<any> = ({
  showModal,
  setShowModal,
  handleSubmit,
  setKeepOnPage,
  values,
  detailInvoice,
  setDetailInvoice,
  setShowAddInvoice,
  setShowModalDelete,
  setMode,
  resetForm,
  setFormChange,
  confirmAction,
  setConfirmAction,
  detailDoc,
  setDetailDoc,
  guidDoc,
  setShowGuidDocument,
  setShowModalDocument,
}) => {
  const onSave = () => {
    setShowModal(false)
    setKeepOnPage(true)
    handleSubmit(values)
  }

  const onDiscard = () => {
    switch (confirmAction) {
      case 'add-invoice': {
        setDetailInvoice(undefined)
        setShowAddInvoice(true)
        break
      }
      case 'edit-invoice': {
        setDetailInvoice(detailInvoice)
        setShowAddInvoice(true)
        break
      }
      case 'remove-invoice': {
        setDetailInvoice(detailInvoice)
        setShowModalDelete(true)
        break
      }
      case 'add-document': {
        setDetailDoc(undefined)
        setShowGuidDocument(guidDoc)
        setShowModalDocument(true)
        break
      }
      case 'edit-document': {
        setDetailDoc(detailDoc)
        setShowGuidDocument(guidDoc)
        setShowModalDocument(true)
        break
      }
      case 'remove-document': {
        setDetailDoc(detailDoc)
        setShowModalDelete(true)
        break
      }
      default:
        break
    }
    setMode('edit')
    setShowModal(false)
    resetForm()
    setFormChange(DefaultFormChange)
    setConfirmAction('')
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>Update Insurance Claim</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='mt-2'>
          This page contains unsaved changes. <br />
          Please save before upload/edit file.
          <div></div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className='btn-sm' variant='primary' onClick={onSave}>
          Save
        </Button>
        <Button className='btn-sm' variant='secondary' onClick={onDiscard}>
          Discard
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

const UnsaveFormConfirm = memo(
  SaveConfirm,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {UnsaveFormConfirm}
