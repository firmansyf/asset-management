import {ViewerCustom} from '@components/viewer/indexViewCustom'
import {
  configClass,
  detectMobileScreen,
  isValidURL,
  KTSVG,
  preferenceDate,
  urlToFile,
} from '@helpers'
import {approveAssetReview, rejectAssetReview} from '@pages/asset-management/redux/AssetRedux'
import {ErrorMessage, Field, Form, Formik} from 'formik'
import {uniq} from 'lodash'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {shallowEqual, useSelector} from 'react-redux'
import Swal from 'sweetalert2'
import * as Yup from 'yup'

const RejectSchema: any = Yup.object().shape({
  comment: Yup.string().required('Reject commnet is required'),
})

const File: FC<any> = ({onClick = () => '', name = 'File', base64 = undefined}) => {
  return (
    <div onClick={onClick} className='text-center cursor-pointer'>
      {name?.includes('image/') ? (
        <div
          style={{
            background: `url(${base64}) center / cover no-repeat`,
          }}
          className='mx-auto border w-100px h-100px rounded'
        />
      ) : (
        <KTSVG className='svg-icon-3x' path='/media/icons/duotone/Interface/File.svg' />
      )}
      <small className='text-gray-800 d-block w-100 pt-0 text-truncate'>{name}</small>
    </div>
  )
}

const ModalFile: FC<any> = ({isData, show, setShow, type = undefined}) => {
  const token: any = useSelector(({token}: any) => token, shallowEqual)

  const closeModal = () => {
    setShow(false)
  }

  return (
    <Modal scrollable={true} dialogClassName='modal-lg' show={show} onHide={closeModal}>
      <Modal.Header>
        <Modal.Title>{'View File'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='text-center'>
          <ViewerCustom src={`${isData}?token=${token}`} type={type} />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className='btn btn-sm btn-light' onClick={closeModal}>
          Close
        </div>
      </Modal.Footer>
    </Modal>
  )
}

const ModalApprovalReview: FC<any> = ({
  showModal,
  setShowModal,
  detail,
  detailAsset,
  setReloadAssetApproval,
}) => {
  const pref_date: any = preferenceDate()
  const {fields}: any = detail || {}
  const token: any = useSelector(({token}: any) => token, shallowEqual)
  const {guid, approval_type}: any = detailAsset || {}

  const [loading, setLoading] = useState<boolean>(false)
  const [rejacetAction, setRejacetAction] = useState<boolean>(false)
  const [imageDetail, setImageDetail] = useState<any>()
  const [showModalImage, setShowModalImage] = useState<any>(false)
  const [fileType, setFileType] = useState<any>(undefined)
  const [fieldsMapper, setFieldsMapper] = useState<any>([])
  const [isMobile, setIsMobile] = useState<boolean>(false)

  const handleResizeScreen = () => {
    setIsMobile(detectMobileScreen())
  }

  useEffect(() => {
    window.addEventListener('resize', handleResizeScreen)
  })

  useEffect(() => {
    fields?.forEach(async (m: any) => {
      m.new_value_base64 = undefined || null
      m.new_value_type = undefined || null
      if (isValidURL(m?.new_value)) {
        const newFile: any = await urlToFile(`${m?.new_value}?token=${token}`, m?.field)
        if (!['text/html']?.includes(newFile?.file?.type)) {
          m.new_value_type = newFile?.file?.type
          m.new_value_base64 = newFile?.base64
        }
      }
      setFieldsMapper((prev: any) => uniq([...prev, m]))
    })
    return () => {
      setFieldsMapper([])
    }
  }, [fields, token])

  const onApprove = () => {
    setLoading(true)
    const params: any = {
      comment: '',
    }
    approveAssetReview(guid, params).then(({data}: any) => {
      if (data) {
        setLoading(false)
        setShowModal(false)

        Swal.fire({
          imageUrl: '/images/approved.png',
          imageWidth: 65,
          imageHeight: 65,
          imageAlt: 'Custom image',
          title: 'Asset Approved',
          text: 'Asset Assignee status changed to Approved',
          allowOutsideClick: false,
          showConfirmButton: true,
          confirmButtonColor: '#050990',
          confirmButtonText: 'Ok',
        }).then(() => {
          setReloadAssetApproval(true)
        })
      }
    })
  }

  const onReject = (values: any) => {
    setLoading(true)
    const params: any = {
      comment: values?.comment || '',
    }

    rejectAssetReview(guid, params).then(({data}: any) => {
      setLoading(false)
      setShowModal(false)
      setRejacetAction(false)

      Swal.fire({
        imageUrl: '/images/rejected.png',
        imageWidth: 65,
        imageHeight: 65,
        imageAlt: 'Custom image',
        html: `<h2>Asset Rejected</h2>
          <p>Asset Assignee status changed to Rejected</p>
          <p>Ticket created for assignee to review</p><br>
          <p>Ticket Number: <a href="${window.location.origin}/help-desk/ticket/detail/${data?.ticket?.guid}" target="_blank">${data?.ticket?.id}</a></p>
          <p>Assignee: ${data?.ticket?.assignee}</p>
          `,
        allowOutsideClick: false,
        showConfirmButton: true,
        confirmButtonColor: '#050990',
        confirmButtonText: 'Ok',
      }).then(() => {
        if (data) {
          setReloadAssetApproval(true)
        }
      })
    })
  }

  return (
    <>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        dialogClassName='modal-lg modal-dialog-centered'
      >
        <Formik
          initialValues={{
            comment: '',
          }}
          enableReinitialize
          validationSchema={RejectSchema}
          onSubmit={onReject}
        >
          {() => {
            return (
              <Form className='justify-content-center' noValidate>
                <Modal.Header>
                  <Modal.Title>Review {approval_type}</Modal.Title>
                </Modal.Header>
                <Modal.Body
                  style={
                    isMobile
                      ? {overflowY: 'auto', marginLeft: '10px', marginRight: '10px'}
                      : {overflowY: 'auto'}
                  }
                >
                  {fieldsMapper?.length > 0 ? (
                    <table
                      className='table w-full table-sm table-striped table-hover m-0 gx-3 border rounded overflow-hidden'
                      style={{
                        maxWidth: '100%',
                      }}
                    >
                      <thead>
                        <tr>
                          <th className='fw-bolder bg-primary text-white text-center py-1'>Date</th>
                          <th className='fw-bolder bg-primary text-white text-center py-1'>
                            Action By
                          </th>
                          <th className='fw-bolder bg-primary text-white text-center py-1'>
                            Field
                          </th>
                          <th className='fw-bolder bg-primary text-white text-center py-1'>
                            Initial Value
                          </th>
                          <th className='fw-bolder bg-primary text-white text-center py-1'>
                            New Value
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td
                            className='p-2 border align-top text-center'
                            rowSpan={fields?.length > 0 ? fields?.length + 1 : 1}
                          >
                            {detail?.date !== null &&
                            detail?.date !== undefined &&
                            moment(detail?.date).isValid()
                              ? moment(detail?.date).format(pref_date)
                              : '-'}
                          </td>
                          <td
                            className='p-2 border align-top text-center'
                            rowSpan={fields?.length > 0 ? fields?.length + 1 : 1}
                          >{`${detail?.action_by || ''}`}</td>
                        </tr>
                        {Array.isArray(fieldsMapper) &&
                          fieldsMapper?.length > 0 &&
                          fieldsMapper?.map(
                            (
                              {
                                field,
                                initial_value,
                                new_value,
                                new_value_base64,
                                new_value_type,
                              }: any,
                              index: any
                            ) => {
                              const keyIndex: number = index + 1
                              return (
                                <tr key={keyIndex}>
                                  <td className='p-2 border text-center'>{field || '-'}</td>
                                  <td className='p-2 border text-center'>{initial_value || '-'}</td>

                                  {new_value_base64 ? (
                                    <td className='p-2 border text-center'>
                                      <File
                                        onClick={() => {
                                          setFileType(new_value_type)
                                          setImageDetail(new_value)
                                          setShowModalImage(true)
                                        }}
                                        name={new_value_type}
                                        type={new_value_type}
                                        base64={new_value_base64}
                                      />
                                    </td>
                                  ) : (
                                    <td className='p-2 border text-center'>{new_value || '-'}</td>
                                  )}
                                </tr>
                              )
                            }
                          )}
                      </tbody>
                    </table>
                  ) : (
                    <>
                      {!rejacetAction && (
                        <div className='text-center'>
                          <img
                            src={'/media/svg/others/no-data.png'}
                            alt='no-data'
                            style={{opacity: 0.5}}
                            className='w-auto h-100px'
                          />
                          <div className='text-gray-400 fw-bold'>No Data Available</div>
                        </div>
                      )}
                    </>
                  )}

                  {rejacetAction && (
                    <div className='mt-2'>
                      <label htmlFor='comment' className={`${configClass?.label} required`}>
                        Reject Comments
                      </label>
                      <Field
                        name='comment'
                        as='textarea'
                        type='text'
                        placeholder='Enter Reject Comments'
                        className={configClass?.form}
                      />
                      <div className='fv-plugins-message-container invalid-feedback'>
                        <ErrorMessage name='comment' />
                      </div>
                    </div>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  {!rejacetAction && (
                    <>
                      <div className='btn btn-sm btn-success' onClick={onApprove}>
                        Approve
                      </div>
                      <div
                        className='btn btn-sm btn-danger'
                        onClick={() => {
                          setRejacetAction(true)
                        }}
                      >
                        Reject
                      </div>
                    </>
                  )}
                  {rejacetAction && (
                    <>
                      <Button
                        className='btn-sm'
                        variant='secondary'
                        onClick={() => setRejacetAction(false)}
                      >
                        Cancel
                      </Button>
                      <Button className='btn-sm' type='submit' form-id='' variant='danger'>
                        {!loading && <span className='indicator-label'>Reject</span>}
                        {loading && (
                          <span className='indicator-progress' style={{display: 'block'}}>
                            Please wait...
                            <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
                          </span>
                        )}
                      </Button>
                    </>
                  )}
                </Modal.Footer>
              </Form>
            )
          }}
        </Formik>
      </Modal>

      <ModalFile
        isData={imageDetail}
        show={showModalImage}
        type={fileType}
        setShow={() => setShowModalImage(false)}
      />
    </>
  )
}

const ModalAssetReview = memo(
  ModalApprovalReview,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default ModalAssetReview
