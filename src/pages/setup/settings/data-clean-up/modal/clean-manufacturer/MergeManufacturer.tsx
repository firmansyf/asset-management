/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-empty-function */
import {DataTable} from '@components/datatable'
import {PageLoader} from '@components/loader/cloud'
import {getDetailManufacturer, getManufacturer} from '@pages/setup/settings/manufacture/Service'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

import {MergeConfiration} from './MergeConfirmation'

type Props = {
  keyword: any
  setKeyword: any
  showModal: any
  setShowModal: any
  dataCheckedRadio: any
  setDataCheckedRadio: any
}

const MergeManufacturerModal: FC<Props> = ({
  keyword,
  setKeyword,
  showModal,
  setShowModal,
  dataCheckedRadio,
  setDataCheckedRadio = function () {},
}) => {
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingForm, setLoadingForm] = useState<boolean>(true)
  const [totalPage, setTotalPage] = useState<number>(0)
  const [dataManufacturer, setDataManufacturer] = useState<any>([])
  const [showMergeModal, setShowMergeModal] = useState<boolean>(false)
  const [dataChecked, setDataChecked] = useState<any>([])
  const [dataCheckedName, setDataCheckedName] = useState<string>('')

  const columns: any = [
    {header: 'checkbox', width: '20px'},
    {header: 'Manufacturer', value: 'name', sort: true},
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
      getDetailManufacturer(dataCheckedRadio).then(({data: {data: res}}: any) => {
        setDataCheckedName(res?.name)
      })
    }
  })

  useEffect(() => {
    if (showModal) {
      setLoading(true)
      const filter: any = {guid: `except:${dataCheckedRadio}`}
      getManufacturer({page, limit, keyword, orderDir, orderCol, filter})
        .then(({data: {data: res_man, meta}}: any) => {
          const {total}: any = meta || {}
          setTotalPage(total)

          if (res_man) {
            const data: any = res_man?.map((manufacture: any) => {
              const {guid, name}: any = manufacture || {}
              return {
                original: manufacture,
                checkbox: manufacture,
                guid: guid,
                name,
              }
            })
            setDataManufacturer(data as never[])
          }
          setTimeout(() => setLoading(false), 800)
        })
        .catch(() => setTimeout(() => setLoading(false), 800))
    }
  }, [showModal, page, limit, keyword, orderDir, orderCol])

  const onChecked = (e: any) => {
    const ar_guid: any = []
    e?.forEach((ticked: any) => {
      const {checked} = ticked || {}
      if (checked) {
        const {original} = ticked || {}
        const {guid} = original || {}
        ar_guid?.push(guid)
      }
    })
    setDataChecked(ar_guid as never[])
  }

  const onClickMerge = () => {
    setShowModal(false)
    setShowMergeModal(true)
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
            <div className='text-center mb-4'>
              <span>
                Select the manufacturer(s) to. <br /> merge with <strong>{dataCheckedName}</strong>
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
                  onChecked={onChecked}
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
            onClick={onClickMerge}
          >
            {!loading && <span className='indicator-label'>Merge</span>}
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
      <MergeConfiration
        keyword={keyword}
        setKeyword={setKeyword}
        showModal={showMergeModal}
        setShowModal={setShowMergeModal}
        dataCheckedRadio={dataCheckedRadio}
        setDataCheckedRadio={setDataCheckedRadio}
        dataChecked={dataChecked}
        setDataChecked={setDataChecked}
      />
    </>
  )
}

const MergeManufacturer = memo(
  MergeManufacturerModal,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export {MergeManufacturer}
