/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-empty-function */
import {DataTable} from '@components/datatable'
import {PageLoader} from '@components/loader/cloud'
import {IMG} from '@helpers'
import {getBrand, getDetailBrand} from '@pages/setup/settings/brand/Service'
import {mergeBrand} from '@pages/setup/settings/data-clean-up/Service'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import Swal from 'sweetalert2'

type Props = {
  keyword: any
  setKeyword: any
  showModal: any
  setShowModal: any
  dataCheckedRadio: any
  setDataCheckedRadio: any
  dataChecked: any
  setDataChecked: any
}

const MergeConfiration: FC<Props> = ({
  keyword,
  setKeyword,
  showModal,
  setShowModal,
  dataCheckedRadio,
  setDataCheckedRadio = function () {},
  dataChecked,
  setDataChecked = function () {},
}) => {
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [dataManufacturer, setDataManufacturer] = useState<any>([])
  const [dataCheckedName, setDataCheckedName] = useState<string>('')

  const columns: any = [
    {header: 'Brand', value: 'name', sort: true},
    {header: 'Model', value: 'manufacturer_model_name', sort: true},
    {header: 'Manufacturer', value: 'manufacturer_name', sort: true},
  ]

  useEffect(() => {
    if (showModal) {
      setLoadingForm(true)
      setTimeout(() => {
        setLoadingForm(false)
      }, 400)
    }
  }, [showModal])

  const onClose = () => {
    setShowModal(false)
    setKeyword('')
    setDataCheckedRadio('')
  }

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  const onPageChange = (e: any) => {
    setPage(e)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  useEffect(() => {
    if (showModal && dataCheckedRadio !== '') {
      getDetailBrand(dataCheckedRadio).then(({data: {data: res}}: any) => {
        setDataCheckedName(res?.name)
      })
    }
  })

  useEffect(() => {
    if (showModal) {
      setLoading(true)
      const filter: any = {guid: dataChecked?.join(';')}
      getBrand({page, limit, keyword, orderDir, orderCol, filter})
        .then(({data: {data: res_man, meta}}: any) => {
          const {total}: any = meta || {}
          setTotalPage(total)

          if (res_man) {
            const data: any = res_man?.map((brand: any) => {
              const {guid, name, manufacturer, manufacturer_model}: any = brand || {}
              const {name: manufacturer_model_name}: any = manufacturer_model
              const {name: manufacturer_name}: any = manufacturer
              return {
                original: brand,
                guid: guid,
                name,
                manufacturer_model_name: manufacturer_model_name || '-',
                manufacturer_name: manufacturer_name || '-',
              }
            })
            setDataManufacturer(data as never[])
          }
          setTimeout(() => setLoading(false), 800)
        })
        .catch(() => setTimeout(() => setLoading(false), 800))
    }
  }, [showModal, page, limit, keyword, orderDir, orderCol])

  const onClickConfirm = () => {
    const params: any = {
      target_guid: dataCheckedRadio,
      cleanup_guids: dataChecked,
    }

    mergeBrand(params)
      .then(({data: {message}}: any) => {
        Swal.fire({
          html: `<img src='/images/success.png' width='75' />
            <h1 class='text-primary mt-4'>Success</h1>
            <p>${message}</p>
            `,
          showConfirmButton: true,
          allowOutsideClick: false,
          confirmButtonColor: '#050990',
          confirmButtonText: 'OK',
        })
        setShowModal(false)
      })
      .catch(() => setTimeout(() => setLoading(false), 800))
    setDataChecked([])
  }

  return (
    <Modal dialogClassName='modal-lg' show={showModal} onHide={onClose}>
      {loadingForm ? (
        <div className='row'>
          <div className='col-12 text-center'>
            <PageLoader height={250} />
          </div>
        </div>
      ) : (
        <Modal.Body>
          <div className='text-center mb-4'>
            <div className='mb-3'>
              <IMG path='/images/alert2.png' width={75} />
            </div>
            <span>
              Merge all to
              <br /> Manufacturer: <strong>{dataCheckedName}</strong>
            </span>
          </div>

          <div className='card card-custom card-table'>
            <div className='card-body'>
              <DataTable
                page={page}
                limit={limit}
                onSort={onSort}
                data={dataManufacturer}
                columns={columns}
                loading={loading}
                total={totalPage}
                onChangePage={onPageChange}
                onChangeLimit={onChangeLimit}
              />
            </div>
          </div>
        </Modal.Body>
      )}
      <Modal.Footer>
        <Button
          disabled={dataChecked?.length > 0 ? false : true}
          className='btn-sm'
          variant='primary'
          onClick={onClickConfirm}
        >
          {!loading && <span className='indicator-label'>Confirm</span>}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </Button>
        <Button className='btn-sm' variant='secondary' onClick={onClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

const MergeBrandConfiration = memo(
  MergeConfiration,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {MergeBrandConfiration}
