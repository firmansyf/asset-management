import {PageLoader} from '@components/loader/cloud'
import {configClass} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import {FC} from 'react'
import {Button, Modal} from 'react-bootstrap'

import {getDetailMaintenanceChecklist} from './Service'

const DetailMintenanceChecklist: FC<any> = ({detail, showModal, setShowModal}) => {
  const detailMaintenanceChecklistQuery: any = useQuery({
    queryKey: ['getDetailMaintenanceChecklist', {guid: detail?.guid}],
    queryFn: async () => {
      if (detail?.guid) {
        const res: any = await getDetailMaintenanceChecklist(detail?.guid)
        const dataResult: any = res?.data?.data
        return dataResult
      } else {
        return {}
      }
    },
  })

  const data: any = detailMaintenanceChecklistQuery?.data || {}

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header>
        <Modal.Title>Maintenance Checklist Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {detailMaintenanceChecklistQuery?.isFetched ? (
          <div className='row'>
            <div className='col-md-12 mb-4'>
              <div className={configClass?.title}>Maintenance Checklist</div>
              <p className='ms-5 mt-2'>{data?.name || '-'} </p>
            </div>

            <div className='col-md-12 mb-4'>
              <div className={configClass?.title}>Maintenance Description</div>
              <p className='ms-5 mt-2'>{data?.description || '-'} </p>
            </div>

            <div className='col-md-12 mb-4'>
              <div className={configClass?.title + ' my-1'}>Task Review</div>
              <div style={{maxHeight: '314px', overflowY: 'auto', padding: '0px 15px'}}>
                {data?.tasks &&
                  data?.tasks?.length > 0 &&
                  data?.tasks?.map((item: any, key: number) => (
                    <div
                      className='row mt-2 mx-0'
                      style={{
                        border: '2px solid #eef2f5',
                        borderRadius: '10px',
                        fontSize: '12px',
                      }}
                      key={key}
                    >
                      <div
                        className='col-1 pt-5'
                        style={{
                          borderRight: '2px solid #eef2f5',
                          borderTopLeftRadius: '7px',
                          borderBottomLeftRadius: '7px',
                          fontSize: '12px',
                          textAlign: 'center',
                        }}
                      >
                        {key + 1}
                      </div>
                      <div className='col-6 pt-5'>
                        <p className='pt-1'>{item?.name}</p>
                      </div>

                      <div className='col-5 py-2'>
                        {item?.field_type === 'select_dropdown' ||
                        item?.field_type === 'sub_task_status' ? (
                          <select
                            name='type'
                            className={configClass?.select}
                            style={{fontSize: '12px'}}
                            defaultValue={
                              item?.option !== null && item?.option?.length > 0
                                ? item?.option[0]
                                : ''
                            }
                          >
                            <option value='' disabled>
                              Choose type
                            </option>
                            {item?.option !== null &&
                              item?.option?.length > 0 &&
                              item?.option?.map((val: any, key: any) => (
                                <option value={val} key={key}>
                                  {val}
                                </option>
                              ))}
                          </select>
                        ) : item?.field_type === 'number' ? (
                          <input
                            type='number'
                            name='type'
                            placeholder='Enter Number'
                            className={configClass?.form}
                            style={{height: '38px', fontSize: '12px'}}
                          />
                        ) : item?.field_type === 'text' ? (
                          <input
                            type='text'
                            name='type'
                            placeholder='Enter Text'
                            className={configClass?.form}
                            style={{height: '38px', fontSize: '12px'}}
                          />
                        ) : (
                          ''
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        ) : (
          <PageLoader height={250} />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default DetailMintenanceChecklist
