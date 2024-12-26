import {DataTable} from '@components/datatable'
import {Search} from '@components/form/searchAlert'
import {PageLoader} from '@components/loader/cloud'
import {KTSVG} from '@helpers'
import {getModel} from '@pages/setup/settings/model/Service'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

import {MergeModel} from './MergeModel'

type Props = {
  showModal: any
  setShowModal: any
}

const ChooseModelModal: FC<Props> = ({showModal, setShowModal}) => {
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [keyword, setKeyword] = useState<string>('')
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [dataBrand, setDataBrand] = useState<any>([])
  const [dataCheckedRadio, setDataCheckedRadio] = useState<any>('')
  const [showNextModal, setShowNextModal] = useState<boolean>(false)

  const columns: any = [
    {header: 'radio', width: '20px'},
    {header: 'Model', value: 'name', sort: true},
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

  const onSearch = (e: any) => {
    setPage(1)
    setDataCheckedRadio('')
    setKeyword(e ? `*${e}*` : '')
  }

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
    const thisDataCheckedRadio: any = dataCheckedRadio
    setDataCheckedRadio(thisDataCheckedRadio)
  }

  const onPageChange = (e: any) => {
    setPage(e)
    const thisDataCheckedRadio: any = dataCheckedRadio
    setDataCheckedRadio(thisDataCheckedRadio)
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  useEffect(() => {
    if (showModal) {
      setLoading(true)
      getModel({page, limit, keyword, orderDir, orderCol})
        .then(({data: {data: res_man, meta}}: any) => {
          const {total} = meta || {}
          setTotalPage(total)

          if (res_man) {
            const data: any = res_man?.map((model: any) => {
              const {guid, name, manufacturer}: any = model || {}
              const {name: manufacture_name}: any = manufacturer || {}
              return {
                original: model,
                radio: model,
                guid: guid,
                name,
                manufacture_name: manufacture_name || '-',
              }
            })
            setDataBrand(data as never[])
          }
          setTimeout(() => setLoading(false), 800)
        })
        .catch(() => setTimeout(() => setLoading(false), 800))
    }
  }, [showModal, page, limit, keyword, orderDir, orderCol])

  const onCheckedRadio = (e: any) => {
    setDataCheckedRadio(e)
  }

  const onClickNext = () => {
    setShowModal(false)
    setShowNextModal(true)
  }

  return (
    <>
      <Modal dialogClassName='modal-md' show={showModal} onHide={onClose}>
        {loadingForm ? (
          <div className='row'>
            <div className='col-12 text-center'>
              <PageLoader height={250} />
            </div>
          </div>
        ) : (
          <Modal.Body>
            <div className='text-center'>
              <h4>Choose the correct model in the list below.</h4>
            </div>
            <div className='mt-10 mb-5'>
              <div className='d-flex align-items-center position-relative me-4 my-1'>
                <KTSVG
                  path='/media/icons/duotone/General/Search.svg'
                  className='svg-icon-3 position-absolute ms-3'
                />
                <Search bg='solid' onChange={onSearch} width='300px' />
              </div>
            </div>
            <div className='card card-custom card-table'>
              <div className='card-body'>
                <DataTable
                  page={page}
                  limit={limit}
                  onSort={onSort}
                  data={dataBrand}
                  columns={columns}
                  loading={loading}
                  total={totalPage}
                  onCheckedRadio={onCheckedRadio}
                  onChangePage={onPageChange}
                  onChangeLimit={onChangeLimit}
                />
              </div>
            </div>
          </Modal.Body>
        )}
        <Modal.Footer>
          <Button
            disabled={dataCheckedRadio === '' ? true : false}
            className='btn-sm'
            variant='primary'
            onClick={onClickNext}
          >
            {!loading && <span className='indicator-label'>Next</span>}
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

      <MergeModel
        keyword={keyword}
        setKeyword={setKeyword}
        showModal={showNextModal}
        setShowModal={setShowNextModal}
        dataCheckedRadio={dataCheckedRadio}
        setDataCheckedRadio={setDataCheckedRadio}
      />
    </>
  )
}

const ChooseModel = memo(
  ChooseModelModal,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {ChooseModel}
