import {Title} from '@components/form/Title'
import {PageLoader} from '@components/loader/cloud'
import {ToastMessage} from '@components/toast-message'
import {configClass, numberWithCommas, preferenceDate, preferenceDateTime} from '@helpers'
import {getFeature} from '@pages/setup/settings/feature/Service'
import {getEmployeeDetail} from '@pages/user-management/redux/EmployeeCRUD'
import moment from 'moment'
import {FC, memo, useEffect, useState} from 'react'
import {Modal} from 'react-bootstrap'

interface Props {
  data: any
  setShowModalDetail: any
  showModalDetail: any
}

let DetailEmployee: FC<Props> = ({setShowModalDetail, showModalDetail, data}) => {
  const pref_date = preferenceDate()
  const pref_date_time = preferenceDateTime()
  const [detail, setDetail] = useState<any>({})
  const [customField, setCustomField] = useState<any>([])
  const [isEnableFeatureCF, setIsEnableFeatureCF] = useState<any>(0)
  const [loadingDetail, setLoadingDetail] = useState<boolean>(true)
  useEffect(() => {
    if (showModalDetail) {
      setTimeout(() => ToastMessage({type: 'clear'}), 800)
    }
  }, [showModalDetail])
  useEffect(() => {
    if (showModalDetail) {
      getFeature({orderCol: 'name', orderDir: 'asc'}).then(({data: {data: result}}) => {
        if (result) {
          const cf: any = result.find(({unique_name}: any) => unique_name === 'custom_field')
          setIsEnableFeatureCF(cf?.value || 0)
        }
      })
    }
  }, [showModalDetail])

  useEffect(() => {
    if (showModalDetail && data?.guid) {
      getEmployeeDetail(data?.guid).then(({data: {data: res}}) => {
        setDetail(res)
        setCustomField(res?.custom_fields)
      })
    }
  }, [data, showModalDetail])

  useEffect(() => {
    setLoadingDetail(true)
    if (showModalDetail) {
      setTimeout(() => {
        setLoadingDetail(false)
      }, 400)
    }
  }, [showModalDetail])
  return (
    <Modal
      dialogClassName='modal-md'
      show={showModalDetail}
      onHide={() => {
        setShowModalDetail(false)
      }}
    >
      <Modal.Header closeButton>
        <Modal.Title>Employee Detail</Modal.Title>
      </Modal.Header>
      {loadingDetail ? (
        <div className='row'>
          <div className='col-12 text-center'>
            <PageLoader height={250} />
          </div>
        </div>
      ) : (
        <Modal.Body>
          <div className='row'>
            <div className='col-md-12 mt-n5'>
              <Title title='Employees' uppercase={false} space={0} />
            </div>
            <div className='col-6'>
              <div className={configClass?.title}>Full Name</div>
              <div className='mb-4'>{detail?.full_name || '-'}</div>
              <div className={configClass?.title}>Job Title</div>
              <div className='mb-4'>{detail?.job_title || '-'}</div>
              <div className={configClass?.title}>Location</div>
              <div className='mb-4'>{detail?.location?.name || '-'}</div>
              <div className={configClass?.title}>Department</div>
              <div className='mb-4'>{detail?.company_department?.name || '-'}</div>
            </div>
            <div className='col-6'>
              <div className={configClass?.title}>Employee ID</div>
              <div className='mb-4'>{detail?.employee_id || '-'}</div>
              <div className={configClass?.title}>Email</div>
              <div className='mb-4'>{detail?.email || '-'}</div>
              <div className={configClass?.title}>Company</div>
              <div className='mb-4'>{detail?.company?.name || '-'}</div>
            </div>

            {customField && customField?.length > 0 && (
              <div className='col-md-12'>
                <Title title='Custom Fields' uppercase={false} space={0} />
              </div>
            )}

            {customField &&
              isEnableFeatureCF === 1 &&
              customField?.map((custom: any, index: any) => (
                <div className='col-md-6 mb-4' key={index}>
                  <div className={configClass?.title}>{custom.name}</div>
                  <div className=''>
                    {custom.value ? (
                      <>
                        {![
                          'dropdown',
                          'radio',
                          'checkbox',
                          'currency',
                          'date',
                          'datetime',
                          'gps',
                          'numeric',
                        ].includes(custom.element_type) && custom.value}
                        {custom.element_type === 'date' &&
                          (custom?.value ? moment(custom?.value).format(pref_date) : '-')}
                        {custom.element_type === 'datetime' &&
                          (custom?.value ? moment(custom?.value).format(pref_date_time) : '-')}
                        {custom.element_type === 'currency' &&
                          (custom?.value?.code || '') +
                            ' ' +
                            numberWithCommas(custom?.value?.amount)}
                        {custom.element_type === 'numeric' &&
                          numberWithCommas(custom?.value, false)}
                        {custom.element_type === 'checkbox' &&
                          custom.options
                            .filter((filter: any) => custom.value.includes(filter.key))
                            .map((m: any) => m.value)
                            .join(', ')}
                        {['dropdown', 'radio'].includes(custom.element_type) &&
                          custom.options.find((find: any) => find.key === custom.value).value}
                        {custom.element_type === 'gps' &&
                          `Long : ${custom?.value?.lat}, Lat : ${custom?.value?.lng}`}
                      </>
                    ) : (
                      '-'
                    )}
                  </div>
                </div>
              ))}
          </div>
        </Modal.Body>
      )}
    </Modal>
  )
}

DetailEmployee = memo(
  DetailEmployee,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default DetailEmployee
