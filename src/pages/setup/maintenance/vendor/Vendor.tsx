import {Search} from '@components/form/search'
import {configClass, KTSVG} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {FC, memo} from 'react'
import {useIntl} from 'react-intl'

const label = 'Alert Team'

const CardVendor: FC<any> = ({onSearch}) => (
  <>
    <div className='d-flex flex-wrap flex-stack mb-6'>
      <div className='d-flex align-items-center position-relative me-4 my-1'>
        <KTSVG
          path='/media/icons/duotone/General/Search.svg'
          className='svg-icon-3 position-absolute ms-3'
        />
        <Search bg='solid' onChange={onSearch} />
      </div>
      <div className='d-flex'>
        <div style={{marginRight: '5px'}}>
          <button
            className='btn btn-sm btn-primary'
            type='button'
            data-bs-toggle='modal'
            data-bs-target='#kt_modal_create_app'
          >
            + Add New {label}
          </button>
        </div>
      </div>
    </div>

    <div className='card card-custom'>
      <div className='card-body'>
        <table className='table table-row-dashed table-row-gray-300 gy-3'>
          <thead>
            <tr className='fw-bolder fs-6 text-gray-800'>
              <th>Department Name</th>
              <th>Company Name</th>
              <th style={{width: '50px'}}>Edit</th>
              <th style={{width: '50px'}}>Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <span className='mt-2'>Edinburgh</span>
              </td>
              <td>61</td>
              <td>Edit</td>
              <td>Delete</td>
            </tr>
            <tr>
              <td>Edinburgh</td>
              <td>61</td>
              <td>Edit</td>
              <td>Delete</td>
            </tr>
          </tbody>
        </table>
        <div className='d-flex flex-stack flex-wrap pt-10'>
          <div className='fs-6 fw-bold text-gray-700 d-flex'>
            <select
              className={configClass?.select}
              name='country'
              style={{width: '80px', marginRight: '10px'}}
            >
              <option value=''>10</option>
              <option value=''>25</option>
              <option value=''>50</option>
              <option value=''>100</option>
              <option value=''>250</option>
            </select>
            <span style={{position: 'relative', top: '5px'}}>Showing 1 to 10 of 50 entries</span>
          </div>
          <ul className='pagination'>
            <li className='page-item previous'>
              <a href='#' className='page-link'>
                <i className='previous'></i>
              </a>
            </li>

            <li className='page-item active'>
              <a href='#' className='page-link'>
                1
              </a>
            </li>

            <li className='page-item'>
              <a href='#' className='page-link'>
                2
              </a>
            </li>

            <li className='page-item'>
              <a href='#' className='page-link'>
                3
              </a>
            </li>
            <li className='page-item next'>
              <a href='#' className='page-link'>
                <i className='next'></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </>
)

let MaintenanceVendor: FC = () => {
  const intl: any = useIntl()

  const onSearch = () => ''

  return (
    <>
      <PageTitle breadcrumbs={[]}>{intl.formatMessage({id: 'MENU.SETUP.ALERT.TEAM'})}</PageTitle>
      <CardVendor onSearch={onSearch} />

      <div className='modal fade' id='kt_modal_create_app' aria-hidden='true'>
        <div className='modal-dialog modal-dialog-centered mw-600px'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h2>Add New {label}</h2>
              <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
                <KTSVG path='/media/icons/duotone/Navigation/Close.svg' className='svg-icon-1' />
              </div>
            </div>
            <div className='modal-body py-lg-8 px-lg-8'></div>
            <div className='modal-footer'>
              <button className='btn btn-secondary mb-5'>Cancel</button>
              <button type='submit' id='setting-company' className='btn btn-primary mb-5'>
                <span className='indicator-label'>Save</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className='modal fade' id='detail_company' aria-hidden='true'>
        <div className='modal-dialog modal-dialog-centered mw-900px'>
          <div className='modal-content'>
            <div className='modal-header'>
              <h2>Detail {label}</h2>
              <div className='btn btn-sm btn-icon btn-active-color-primary' data-bs-dismiss='modal'>
                <KTSVG path='/media/icons/duotone/Navigation/Close.svg' className='svg-icon-1' />
              </div>
            </div>
            <div className='modal-body py-lg-8 px-lg-8'></div>
          </div>
        </div>
      </div>
    </>
  )
}

MaintenanceVendor = memo(
  MaintenanceVendor,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {MaintenanceVendor}
