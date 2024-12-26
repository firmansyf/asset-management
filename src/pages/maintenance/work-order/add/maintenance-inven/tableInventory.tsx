/* eslint-disable react-hooks/exhaustive-deps */
import {Alert} from '@components/alert'
import Tooltip from '@components/alert/tooltip'
import {ToastMessage} from '@components/toast-message'
import {KTSVG} from '@helpers'
import {deleteMaintenenceInventory, getListTableInvenWo} from '@pages/maintenance/Service'
import {FC, useEffect, useState} from 'react'

import {AddTableInventory} from './modalAdd'
type Props = {
  idWo: any
}
const TableInventory: FC<Props> = ({idWo}) => {
  const [showModalDelete, setShowModalDelete] = useState<boolean>(false)
  const [detail, setDetail] = useState<any>()
  const [showModal, setShowModal] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [resInven, setResInven] = useState<any>([])
  const [reloadInven, setReloadInven] = useState<number>(0)
  const [reloadDelInven, setReloadDelInven] = useState<number>(0)

  useEffect(() => {
    const convertToObj = resInven.reduce((a: any, b: any) => Object.assign(a, b), {})
    setDetail(convertToObj)
  }, [])
  useEffect(() => {
    getListTableInvenWo(idWo)
      .then(({data: {data: res}}: any) => {
        setResInven(res)
      })
      .catch(() => '')
  }, [idWo, detail, reloadInven, reloadDelInven])
  const confirmDelete = () => {
    deleteMaintenenceInventory(detail?.guid)
      .then((res: any) => {
        setLoading(false)
        setShowModalDelete(false)
        setReloadDelInven(reloadDelInven + 1)
        ToastMessage({message: res?.data?.message, type: 'success'})
      })
      .catch(() => {
        setLoading(false)
      })
  }
  const msg_alert = [
    'Are you sure you want to delete this Inventory ',
    <strong key='inventory_name'>{detail?.inventory_name}</strong>,
    '?',
  ]
  //   if (!data?.guid) { return <DatatableLoader className='my-5' count={3} /> }
  return (
    <>
      <Alert
        setShowModal={setShowModalDelete}
        showModal={showModalDelete}
        loading={loading}
        body={msg_alert}
        type={'delete'}
        title={'Delete Maintenance Inventory'}
        confirmLabel={'Delete'}
        onConfirm={() => {
          confirmDelete()
        }}
        onCancel={() => {
          setShowModalDelete(false)
        }}
      />
      <div className='mb-3 fw-bolder'>
        <span
          data-cy='addInvoice'
          onClick={() => {
            setDetail(undefined)
            setShowModal(true)
          }}
          className='btn btn-sm btn-light-primary radius-50 p-2'
        >
          <span className='btn btn-icon w-20px h-20px btn-primary rounded-circle'>
            <i className='las la-plus text-white' />
          </span>
          <span className='px-2'>Add Inventory</span>
        </span>
      </div>

      <table className='table table-borderless table-striped table-hover'>
        <thead>
          <tr className='bg-primary text-white'>
            <th className='fw-bolder p-3'>No</th>
            <th className='fw-bolder p-3'>Inventory</th>
            <th className='fw-bolder p-3'>Location Inventory</th>
            <th className='fw-bolder p-3'>Quantity</th>
            <th className='fw-bolder p-3'>Price</th>
            <th className='fw-bolder p-3 text-center'>Action</th>
          </tr>
        </thead>
        <tbody>
          {resInven?.length > 0 ? (
            Array.isArray(resInven) &&
            resInven?.map((e: any, index: any) => {
              const {inventory_name, location_name, quantity, price} = e || {}
              return (
                <tr key={index} className='table-tr-border-none fw-bolder'>
                  <td className='text-center'>{index + 1}</td>
                  <td>{inventory_name || '-'}</td>
                  <td>{location_name || '-'}</td>
                  <td>{quantity || '-'}</td>
                  <td>{price || '-'}</td>

                  <td className='d-flex justify-content-center text-nowrap'>
                    <Tooltip placement='top' title='Edit'>
                      <a
                        href='#'
                        onClick={() => {
                          setDetail(e)
                          setShowModal(true)
                        }}
                        data-cy='editInvoice'
                        className='mx-1 align-items-center justify-content-center w-30px h-30px btn btn-icon radius-50 btn-light-warning'
                      >
                        <KTSVG path='/images/edit-icon.svg' className='svg-icon-2' />
                      </a>
                    </Tooltip>

                    <Tooltip placement='top' title='Delete'>
                      <a
                        href='#'
                        onClick={() => {
                          setDetail(e)
                          setShowModalDelete(true)
                        }}
                        data-cy='deleteInvoice'
                        className='align-items-center justify-content-center w-30px h-30px btn btn-icon radius-50 btn-light-danger'
                      >
                        <KTSVG path='/images/remove-icon.svg' className='svg-icon-2' />
                      </a>
                    </Tooltip>
                  </td>
                </tr>
              )
            })
          ) : (
            <tr className='text-gray-400 text-center fw-bold'>
              <td colSpan={6} className='border' style={{backgroundColor: '#eff2f5'}}>
                <div className='d-flex flex-column'>
                  <div className=''>
                    <img
                      src={'/media/svg/others/no-data.png'}
                      style={{opacity: 0.5}}
                      className='w-auto h-100px'
                    />
                  </div>
                  No Data Added.
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <AddTableInventory
        showModal={showModal}
        setShowModal={setShowModal}
        detail={detail}
        loading={loading}
        setDetail={setDetail}
        setReload={setReloadInven}
        reload={reloadInven}
        setLoading={setLoading}
        guid={idWo}
        guidInven={detail?.guid}
      />
    </>
  )
}
export {TableInventory}
