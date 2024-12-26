import cx from 'classnames'
import {FC, memo, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

const dataPlaceholder: any = [
  {
    tab: 'team',
    datas: ['team_name'],
  },
  {
    tab: 'ticket',
    datas: ['ticket_id', 'ticket_name', 'ticket_description', 'ticket_url', 'ticket_due_date'],
  },
  {
    tab: 'ticket_fields',
    datas: [
      'ticket_status',
      'ticket_priority_guid',
      'ticket_report_channel_guid',
      'ticket_type_guid',
    ],
  },
  {
    tab: 'submitter',
    datas: ['submitter_name', 'submitter_phone_number', 'submitter_email'],
  },
  {
    tab: 'company',
    datas: ['company_name'],
  },
]

let Placeholder: FC<any> = ({values, setValue}) => {
  const [tab, setTab] = useState<any>('team')
  const [show, setShow] = useState<boolean>(false)

  const onSelect = (value: any) => {
    let oldValue: any = values?.replace('<p>', '')
    oldValue = oldValue?.replace('</p>', '')
    setValue(oldValue + ' ' + value)
  }
  return (
    <>
      <Button className='btn-sm btn-light-primary mb-4' onClick={() => setShow(true)}>
        Insert Placeholder
      </Button>
      <Modal dialogClassName='modal-md' centered={false} show={show} onHide={() => setShow(false)}>
        <div
          className='d-flex align-items-center justify-content-between text-primary p-5'
          style={{borderRadius: '0.5rem 0.5rem 0 0'}}
        >
          <div className='fw-bolder fs-5'>Insert Placeholder</div>
        </div>
        <Modal.Body className='p-0'>
          <ul className='nav nav-tabs nav-line-tabs nav-line-tabs-2x fs-7 bg-gray-100'>
            {dataPlaceholder?.map(({tab: tabName}) => (
              <li className='nav-item' key={tabName}>
                <div
                  className={cx(
                    'm-0 px-5 py-2 cursor-pointer text-capitalize',
                    tab === tabName && 'bg-primary border-primary text-white fw-bolder'
                  )}
                  onMouseEnter={() => setTab(tabName)}
                >
                  {tabName?.split('_')?.join(' ')}
                </div>
              </li>
            ))}
          </ul>
          <div className='tab-content px-5 pt-4'>
            {dataPlaceholder?.map(({tab: tabName, datas}: any) => (
              <div
                key={tabName}
                className={cx(
                  'tab-pane fade py-3',
                  {show: tab === tabName},
                  {active: tab === tabName}
                )}
              >
                <div className='row'>
                  {datas?.map((name: any) => (
                    <div className='col-auto mb-5 px-2' key={`${tabName}-${name}`}>
                      <code
                        className='btn btn-shadow border border-dashed border-gray-300 m-0 btn-active-light-danger btn-sm p-2 fs-8 fw-bolder'
                        onClick={() => onSelect(`{{ ${name} }}`)}
                      >
                        {`{{ ${name} }}`}
                      </code>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type='button'
            className='btn-sm'
            variant='secondary'
            onClick={() => setShow(false)}
          >
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

Placeholder = memo(
  Placeholder,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default Placeholder
