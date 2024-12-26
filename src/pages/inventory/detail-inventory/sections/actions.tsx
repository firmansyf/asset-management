import Tooltip from '@components/alert/tooltip'
import {FC, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {useNavigate} from 'react-router-dom'

import {ModalReservation} from '../modal-reservation'

export const Actions: FC<any> = ({
  setShowModal,
  setShowModalRemoveStock,
  setShowModalHistoryStock,
  setShowModalAddStock,
  data,
  detail,
  onPrintInventory,
  reloadReservation,
  setReloadReservation,
  onDelete,
  reserved,
}) => {
  const [showModalReservation, setShowModalReservation] = useState<boolean>(false)
  const [loadingClone, setLoadingClone] = useState<boolean>(false)
  const {guid} = data || {}
  const navigate = useNavigate()
  return (
    <div className='row m-0 align-items-center'>
      <div className='col-auto row'>
        <Tooltip placement='top' title='Print'>
          <div
            className='d-flex align-items-center justify-content-center w-35px h-35px radius-10 cursor-pointer bg-light-primary border border-dashed border-primary shadow-sm'
            onClick={() => {
              onPrintInventory()
            }}
          >
            <i className='fa fa-lg fa-print text-primary'></i>
          </div>
        </Tooltip>

        <div className='col-auto mb-5 pe-0'>
          <Tooltip placement='top' title='Edit'>
            <div
              onClick={() => navigate(`/inventory/add?id=${guid}`)}
              className='d-flex align-items-center justify-content-center w-35px h-35px radius-10 cursor-pointer bg-light-warning border border-dashed border-warning shadow-sm'
            >
              <i className='fa fa-lg fa-pencil-alt text-warning'></i>
            </div>
          </Tooltip>
        </div>
      </div>

      <div className='col-auto mb-5 pe-0'>
        <Tooltip placement='top' title='Delete'>
          <div
            className='d-flex align-items-center justify-content-center w-35px h-35px radius-10 cursor-pointer bg-light-danger border border-dashed border-danger shadow-sm'
            onClick={onDelete}
          >
            <i className='fa fa-lg fa-trash-alt text-danger'></i>
          </div>
        </Tooltip>
      </div>

      <div className='col-auto mb-5 pe-0'>
        <Tooltip placement='top' title='Email'>
          <div
            className='d-flex align-items-center justify-content-center w-35px h-35px radius-10 cursor-pointer bg-light-success border border-dashed border-success shadow-sm'
            data-cy='btn-email'
            onClick={() => {
              setShowModal(true)
            }}
          >
            <i className='fa fa-lg fa-envelope text-success'></i>
          </div>
        </Tooltip>
      </div>

      <div className='col-auto mb-5 pe-0'>
        <Tooltip placement='top' title='Clone'>
          <div
            className='d-flex align-items-center justify-content-center w-35px h-35px radius-10 cursor-pointer bg-light-dark border border-dashed border-dark shadow-sm'
            data-cy='btn-email'
            onClick={() => {
              setLoadingClone(false)
              navigate(`/inventory/add-clone?guid=${guid}`)
            }}
          >
            {!loadingClone && <i className='fa fa-lg fa-clone text-dark'></i>}
            {loadingClone && <span className='spinner-border spinner-border-sm text-primary' />}
          </div>
        </Tooltip>
      </div>

      <div className='dropdown col-auto ms-auto mb-5 d-flex align-items-center justify-content-end'>
        <Dropdown className='me-2'>
          <Dropdown.Toggle variant='light-primary' size='sm' id='dropdown-basic' data-cy='moreMenu'>
            More
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              href='#'
              data-cy='btnReservation'
              onClick={() => setShowModalReservation(true)}
            >
              Reserve
            </Dropdown.Item>
            <Dropdown.Item
              href='#'
              data-cy='btnHistorystock'
              onClick={() => {
                setShowModalHistoryStock(true)
              }}
            >
              History Stock
            </Dropdown.Item>
            <Dropdown.Item
              href='#'
              onClick={() => {
                setShowModalRemoveStock(true)
              }}
            >
              Remove Stock
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>

        <Dropdown className='ms-2'>
          <Dropdown.Toggle variant='light-primary' size='sm' id='dropdown-basic' data-cy='addMenu'>
            Add
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item
              href='#'
              data-cy='btnAddstock'
              onClick={() => {
                setShowModalAddStock(true)
              }}
            >
              Add Stock
            </Dropdown.Item>
            <Dropdown.Item
              href='#'
              data-cy='addStockDetail'
              onClick={() => navigate(`/inventory/detail/${guid}/add-stock-detail`)}
            >
              Add Stock Detail
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
      <ModalReservation
        showModal={showModalReservation}
        setShowModal={setShowModalReservation}
        detail={detail}
        inventory={data}
        reloadReservation={reloadReservation}
        setReloadReservation={setReloadReservation}
        reserved={reserved}
      />
    </div>
  )
}
