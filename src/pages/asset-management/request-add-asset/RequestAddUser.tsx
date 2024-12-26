/* eslint-disable react-hooks/exhaustive-deps */
import {getColumnUser, getTemporaryUserUserList, getUserV1, postBulkSelectUser} from '@api/UserCRUD'
import {DataTable} from '@components/datatable'
import {matchColumns, toColumns} from '@components/dnd/table'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {guidBulkChecked, KTSVG, setUserStatus} from '@helpers'
import {FC, memo, useEffect, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

interface User {
  showModal?: boolean
  setShowModalUser?: any
  setReloadTempUser?: any
  reloadTempUser: any
  setSelectedUser: any
  selectedUser: any
}

let RequestAddUser: FC<User> = ({
  showModal,
  setShowModalUser,
  setReloadTempUser,
  reloadTempUser,
  setSelectedUser,
  selectedUser,
}) => {
  const [_meta, setMeta] = useState<any>({})
  const [page, setPage] = useState<number>(1)
  const [limit, setLimit] = useState<number>(10)
  const [columns, setColumns] = useState<any>([])
  const [keyword, setKeyword] = useState<string>()
  const [dataUser, setDataUSer] = useState<any>([])
  const [orderCol, setOrderCol] = useState<string>('first_name')
  const [totalPage, setTotalPage] = useState<number>(0)
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [dataChecked, setDataChecked] = useState<any>([])
  const [dataUserTemp, setDataUserTemp] = useState<any>([])
  const [loadingUser, setLoadingUser] = useState<boolean>(false)
  const [loadingDatatable, setLoadingDatatable] = useState<boolean>(true)

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e || '')
  }

  const onChecked = (e: any) => {
    const ar_guid: any = guidBulkChecked(e)
    setDataChecked(ar_guid as never[])
  }

  const handleSubmit = () => {
    setLoadingUser(true)
    if (dataChecked && dataChecked?.length > 0) {
      postBulkSelectUser({guids: dataChecked}).then(({data: {message}}: any) => {
        onHide()
        setLoadingUser(false)
        setSelectedUser(selectedUser + 1)
        setReloadTempUser(reloadTempUser + 1)
        ToastMessage({message, type: 'success'})
      })
    } else {
      setLoadingUser(false)
      ToastMessage({
        type: 'error',
        message: 'At least select one Users for your Request Add Asset.',
      })
    }
  }

  const onHide = () => {
    setPage(1)
    setLimit(10)
    setKeyword('')
    setTotalPage(0)
    setShowModalUser(false)
  }

  const onRender = (val: any) => ({
    user_status: setUserStatus(val),
  })

  const onSelectUser = () => {
    setLoadingDatatable(true)
    const params = {page, limit, orderCol, orderDir}
    getTemporaryUserUserList(params)
      .then(({data: {data: res_users}}: any) => {
        const data_table_temp: any = []
        res_users?.forEach((item: any) => {
          data_table_temp?.push(item?.guid)
        })
        setDataUserTemp(data_table_temp?.join())

        setTimeout(() => {
          setShowModalUser(true)
          setLoadingDatatable(false)
        }, 200)
      })
      .catch(() => {
        setTimeout(() => {
          setShowModalUser(true)
          setLoadingDatatable(false)
        }, 200)
      })
  }

  useEffect(() => {
    getColumnUser({}).then(
      ({
        data: {
          data: {fields},
        },
      }: any) => {
        const mapColumns: any = toColumns(fields, {checked: true, order: true})?.map(
          ({value, label: header, is_sortable}: any) => {
            let val: any = value
            let head: any = header
            value === 'status' && (val = 'user_status')
            header === 'Company Department Name' && (head = 'Department')
            return {
              value: val,
              header: head,
              sort: is_sortable === 1 ? true : false,
            }
          }
        )

        if (mapColumns?.length) {
          let columnsCustom: any = []
          columnsCustom = [...columnsCustom, {header: 'checkbox', width: '20px'}, ...mapColumns]
          setColumns(columnsCustom)
        } else {
          setColumns([])
        }
      }
    )
  }, [showModal])

  const setParmas = (dataUserTemp: any) => {
    let params: any = {}
    if (dataUserTemp !== '') {
      const except: any = {guid: dataUserTemp || ''}
      params = {page, limit, keyword, orderCol, orderDir, except}
    } else {
      params = {page, limit, keyword, orderCol, orderDir}
    }
    return params
  }

  useEffect(() => {
    if (showModal) {
      const params: any = setParmas(dataUserTemp)
      const currentLimit: number = limit || 10

      setLoadingDatatable(true)
      getUserV1(params)
        .then(({data: {data: res, meta: metas}}: any) => {
          const {current_page, total}: any = metas || {}
          const data: any = []
          res?.forEach((item: any) => {
            data?.push(item)
          })
          setLimit(currentLimit)
          setTotalPage(total)
          setMeta(metas || {})
          setPage(current_page)
          setDataUSer(matchColumns(data, columns))
          setTimeout(() => setLoadingDatatable(false), 800)
        })
        .catch(() => setTimeout(() => setLoadingDatatable(false), 800))
    }
  }, [page, limit, keyword, orderCol, columns, orderDir, showModal])

  return (
    <>
      <button
        type='button'
        data-cy='addUser'
        onClick={() => onSelectUser()}
        className='btn btn-sm btn-primary'
      >
        + Add User
      </button>

      <Modal dialogClassName='modal-lg' show={showModal} onHide={onHide}>
        <Modal.Header closeButton>
          <Modal.Title>Select Users</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='card card-custom card-table'>
            <div className='card-header'>
              <div className='d-flex flex-wrap flex-stack'>
                <div className='d-flex align-items-center position-relative'>
                  <KTSVG
                    path='/media/icons/duotone/General/Search.svg'
                    className='svg-icon-3 position-absolute ms-3'
                  />
                  <Search bg='solid' onChange={onSearch} />
                </div>
              </div>
            </div>

            <div className='card-body'>
              <DataTable
                limit={limit}
                onSort={onSort}
                data={dataUser}
                render={onRender}
                total={totalPage}
                columns={columns}
                onChecked={onChecked}
                loading={loadingDatatable}
                customEmptyTable='No Users'
                onChangeLimit={onChangeLimit}
                onChangePage={(e: any) => setPage(e)}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            type='submit'
            id='isBtn-user'
            variant='primary'
            className='btn-sm'
            disabled={loadingUser}
            onClick={handleSubmit}
          >
            {!loadingUser && <span className='indicator-label'>Add to List</span>}
            {loadingUser && (
              <span className='indicator-progress' style={{display: 'block'}}>
                Please wait...
                <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
              </span>
            )}
          </Button>
          <Button className='btn-sm' variant='secondary' onClick={onHide}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

RequestAddUser = memo(
  RequestAddUser,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)

export {RequestAddUser}
