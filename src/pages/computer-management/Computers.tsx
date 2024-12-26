import {Search} from '@components/form/search'
import {KTSVG} from '@helpers'
import {PageTitle} from '@metronic/layout/core'
import {FC} from 'react'
import {useIntl} from 'react-intl'

const CardComputers: FC = () => {
  const intl: any = useIntl()

  const onSearch = () => ''

  return (
    <div className='card card-custom'>
      <div className='card-header'>
        <div className='d-flex justify-content-between w-100'>
          <div className='d-flex' style={{width: '400px', height: '50px', paddingTop: '16px'}}>
            <Search bg='solid' onChange={onSearch} />

            <a
              className='btn btn-sm btn-light'
              data-bs-toggle='collapse'
              data-bs-target='#collapseExample'
              aria-expanded='false'
              aria-controls='collapseExample'
            >
              <KTSVG path={'/media/icons/duotone/Text/Filter.svg'} className={'svg-icon-sm'} />
              Filter
            </a>
          </div>
          <div className='card-toolbar'>
            <div className='dropdown' style={{marginRight: '5px'}}>
              <button
                className='btn btn-sm btn-light dropdown-toggle'
                type='button'
                id='dropdownMenuButton1'
                data-bs-toggle='dropdown'
                aria-expanded='false'
              >
                Export
              </button>
              <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                <li>
                  <a className='dropdown-item' href='#'>
                    PDF
                  </a>
                </li>
                <li>
                  <a className='dropdown-item' href='#'>
                    Excel
                  </a>
                </li>
              </ul>
            </div>
            <div className='dropdown'>
              <button
                className='btn btn-sm btn-light dropdown-toggle'
                type='button'
                id='dropdownMenuButton1'
                data-bs-toggle='dropdown'
                aria-expanded='false'
              >
                Columns
              </button>
              <ul className='dropdown-menu' aria-labelledby='dropdownMenuButton1'>
                <li>
                  <a className='dropdown-item' href='#'>
                    Action
                  </a>
                </li>
                <li>
                  <a className='dropdown-item' href='#'>
                    Another action
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <div className='collapse' id='collapseExample'>
        <div className='p-8 border-bottom'>
          {intl.formatMessage({
            id: 'SOME_PLACEHOLDER_CONTENT_FOR_THE_COLLAPSE_COMPONENT_THIS_PANEL_IS_HIDDEN_BY_DEFAULT_BUT_REVEALED_WHEN_THE_USER_ACTIVATES',
          })}
        </div>
      </div>
      <div className='card-body'>
        <table className='table table-row-dashed table-row-gray-300 gy-7'>
          <thead>
            <tr className='fw-bolder fs-6 text-gray-800'>
              <th>#</th>
              <th>View</th>
              <th>Asset ID</th>
              <th>Customer ID</th>
              <th>Asset Category</th>
              <th>Asset Name</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>System Architect</td>
              <td>Edinburgh</td>
              <td>61</td>
              <td>2011/04/25</td>
              <td>$320,800</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Accountant</td>
              <td>Tokyo</td>
              <td>63</td>
              <td>2011/07/25</td>
              <td>$170,750</td>
            </tr>
            <tr>
              <td>3</td>
              <td>Accountant</td>
              <td>Tokyo</td>
              <td>63</td>
              <td>2011/07/25</td>
              <td>$170,750</td>
            </tr>
            <tr>
              <td>4</td>
              <td>Accountant</td>
              <td>Tokyo</td>
              <td>63</td>
              <td>2011/07/25</td>
              <td>$170,750</td>
            </tr>
            <tr>
              <td>5</td>
              <td>Accountant</td>
              <td>Tokyo</td>
              <td>63</td>
              <td>2011/07/25</td>
              <td>$170,750</td>
            </tr>
            <tr>
              <td>6</td>
              <td>Accountant</td>
              <td>Tokyo</td>
              <td>63</td>
              <td>2011/07/25</td>
              <td>$170,750</td>
            </tr>
            <tr>
              <td>7</td>
              <td>Accountant</td>
              <td>Tokyo</td>
              <td>63</td>
              <td>2011/07/25</td>
              <td>$170,750</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

const Computers: FC = () => {
  const intl = useIntl()
  return (
    <>
      <PageTitle breadcrumbs={[]}>
        {intl.formatMessage({id: 'MENU.COMPUTER_MANAGEMENT.COMPUTERS'})}
      </PageTitle>
      <CardComputers />
    </>
  )
}

export default Computers
