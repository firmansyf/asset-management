/* eslint-disable react-hooks/exhaustive-deps */
import {getUser} from '@api/UserCRUD'
import {Alert} from '@components/alert'
import {DataTable} from '@components/datatable'
import {matchColumns} from '@components/dnd/table'
import {ExportPdfExcel} from '@components/export/ExportPdfExcel'
import {Search} from '@components/form/searchAlert'
import {ToastMessage} from '@components/toast-message'
import {guidBulkChecked, hasPermission, KTSVG} from '@helpers'
import {useQuery} from '@tanstack/react-query'
import {keyBy, mapValues} from 'lodash'
import {FC, memo, useEffect, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {shallowEqual, useSelector} from 'react-redux'

import {AddAlertTeam} from './AddAlertTeam'
import {DetailAlertTeam} from './DetailAlertTeam'
import {deleteBulkAlertTeam, exportAlertTeam, getAlertTeam} from './Service'

const label: any = 'Team'

let CardAlertTeam: FC<any> = ({
  deleteReload,
  onDelete,
  dataChecked,
  setDataChecked,
  page,
  setPage,
  setPageFrom,
  totalPage,
  setTotalPage,
  pageFrom,
  resetKeyword,
  setResetKeyword,
}) => {
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {feature} = preferenceStore || {}

  const [meta, setMeta] = useState<any>({})
  const [detail, setDetail] = useState<any>()
  const [limit, setLimit] = useState<number>(10)
  const [reload, setReload] = useState<number>(0)
  const [dataUser, setDataUser] = useState<any>([])
  const [features, setFeatures] = useState<any>({})
  const [keyword, setKeyword] = useState<string>('')
  const [messageAlert, setMessage] = useState<any>()
  const [orderDir, setOrderDir] = useState<string>('asc')
  const [orderCol, setOrderCol] = useState<string>('name')
  const [totalPerPage, setTotalPerPage] = useState<number>(0)
  const [showModalDetail, setShowModalDetail] = useState<boolean>(false)
  const [showModalBulk, setShowModalConfirmBulk] = useState<boolean>(false)
  const [showModalAlertTeam, setShowModalAlertTeam] = useState<boolean>(false)

  const teamAdd: any = hasPermission('team.add') || false
  const teamEdit: any = hasPermission('team.edit') || false
  const teamView: any = hasPermission('team.view') || false
  const teamDelete: any = hasPermission('team.delete') || false

  let columns: any = []
  if (teamDelete) {
    columns = [...columns, {header: 'Checkbox', width: '20px'}]
  }

  columns = [
    ...columns,
    {header: 'View', width: '20px'},
    {header: 'Team Name', sort: true, value: 'name'},
    {header: 'Description', sort: true, value: 'description'},
    {header: 'Total Member', sort: true, value: 'total_members'},
    {header: 'Working Hours', sort: true, value: 'working_hour_name'},
  ]

  if (teamEdit) {
    columns = [...columns, {header: 'Edit', width: '20px'}]
  }

  if (teamDelete) {
    columns = [...columns, {header: 'Delete', width: '20px'}]
  }

  const onExport = (e: any) => {
    const fields = 'name,description,total_members,working_hour'
    exportAlertTeam({type: e, keyword, columns: fields})
      .then(({data: {data, message}}: any) => {
        ToastMessage({type: 'success', message})
        setTimeout(() => totalPage <= 500 && window.open(data.url, '_blank'), 1000)
      })
      .catch(({response}: any) => {
        const {message} = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }

  const onSort = (value: any) => {
    setOrderCol(value)
    setOrderDir(orderDir === 'asc' ? 'desc' : 'asc')
  }

  const onChangeLimit = (e: any) => {
    setPage(1)
    setLimit(e)
  }

  const onPageChange = (e: any) => {
    setPage(e)
  }

  const onSearch = (e: any) => {
    setPage(1)
    setKeyword(e ? `*${e}*` : '')
  }

  const onDetail = (e: any) => {
    setDetail(e)
    setShowModalDetail(true)
  }

  const onChecked = (e: any) => {
    const ar_guid: any = guidBulkChecked(e)
    setDataChecked(ar_guid)
  }

  const onEdit = (e: any) => {
    setDetail(e)
    setShowModalAlertTeam(true)
  }

  const onBulkDelete = (e: any) => {
    deleteBulkAlertTeam({guids: e})
      .then(({data}: any) => {
        const total_data_page: number = totalPage - pageFrom
        setReload(reload + 1)
        ToastMessage({message: data.message, type: 'success'})
        if (total_data_page - dataChecked?.length <= 0) {
          if (page > 1) {
            setPage(page - 1)
          } else {
            setPage(page)
            setResetKeyword(true)
          }
        } else {
          setPage(page)
        }
      })
      .catch(({response}: any) => {
        const {message} = response?.data || {}
        ToastMessage({message, type: 'error'})
      })
  }

  const messageBulk: any = [
    `Are you sure want to delete `,
    <strong key='notunique'>{dataChecked?.length}</strong>,
    ` ${dataChecked?.length > 1 ? 'alert teams' : 'alert team'} ?`,
  ]

  const alertTeamQuery: any = useQuery({
    // initialData: {data: []},
    queryKey: [
      'getAlertTeam',
      {
        page,
        limit,
        keyword,
        reload,
        deleteReload,
        orderDir,
        orderCol,
        teamDelete,
      },
    ],
    queryFn: async () => {
      if (columns?.length > 0) {
        const res: any = await getAlertTeam({
          page,
          limit,
          keyword,
          orderDir,
          orderCol,
        })
        const {total, from}: any = res?.data?.meta || {}
        setPageFrom(from)
        setTotalPage(total)
        setMeta(res?.data?.meta || {})
        const resData: any = res?.data?.data?.map((team: any) => {
          const {working_hour}: any = team || {}
          const {name: working_hour_name}: any = working_hour || {}
          return {
            ...team,
            original: team,
            working_hour_name: working_hour_name || '-',
          }
        })
        setTotalPerPage(resData?.length || 0)
        return matchColumns(resData, columns)
      } else {
        return []
      }
    },
    // refactor react-query v5 (change onError => throwOnError)
    onError: ({response}: any) => {
      ToastMessage({message: response?.data?.message, type: 'error'})
    },
  })
  const dataAlertTeam: any = alertTeamQuery?.data || []

  useEffect(() => {
    getUser({limit: 2000}).then(({data: {data: res}}: any) => {
      const data_user: any = res?.map(({guid, email}: any) => ({
        value: guid || '',
        label: email || '',
      }))
      setDataUser(data_user as never[])
    })
  }, [])

  useEffect(() => {
    if (feature) {
      const resObj: any = keyBy(feature, 'unique_name')
      setFeatures(mapValues(resObj, 'value'))
    }
  }, [feature])

  useEffect(() => {
    if (totalPerPage === 0 && Object.keys(meta || {})?.length > 0) {
      setPage(meta?.current_page > 1 ? meta?.current_page - 1 : 1)
    }
  }, [totalPerPage, meta])

  return (
    <>
      <div className='card card-custom card-table'>
        <div className='card-table-header'>
          <div className='d-flex flex-wrap flex-stack'>
            <div className='d-flex align-items-center position-relative me-4 my-1'>
              <KTSVG
                path='/media/icons/duotone/General/Search.svg'
                className='svg-icon-3 position-absolute ms-3'
              />

              <Search
                bg='solid'
                onChange={onSearch}
                resetKeyword={resetKeyword}
                setResetKeyword={setResetKeyword}
              />
            </div>

            <div className='d-flex my-1'>
              <div style={{marginRight: '5px'}}>
                {dataChecked?.length > 0 && teamDelete && (
                  <button
                    type='button'
                    data-cy='bulkDeleteTeam'
                    className='btn btn-sm btn-primary me-2'
                    onClick={() => {
                      setMessage(messageBulk)
                      setShowModalConfirmBulk(true)
                    }}
                  >
                    <span className='indicator-label'>Delete Selected</span>
                  </button>
                )}

                {teamAdd && (
                  <button
                    type='button'
                    data-cy='addTeam'
                    className='btn btn-sm btn-primary'
                    onClick={() => {
                      setDetail(undefined)
                      setShowModalAlertTeam(true)
                    }}
                  >
                    + Add New {label || ''}
                  </button>
                )}
              </div>

              <div className='dropdown'>
                <Dropdown>
                  <Dropdown.Toggle variant='light-primary' size='sm' id='dropdown-basic'>
                    Actions
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <ExportPdfExcel onExport={onExport} />
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
          </div>
        </div>

        <div className='card-body'>
          <DataTable
            page={page}
            limit={limit}
            onEdit={onEdit}
            onSort={onSort}
            edit={teamEdit}
            view={teamView}
            del={teamDelete}
            total={totalPage}
            columns={columns}
            onDelete={onDelete}
            onDetail={onDetail}
            data={dataAlertTeam}
            onChecked={onChecked}
            onChangePage={onPageChange}
            onChangeLimit={onChangeLimit}
            loading={!alertTeamQuery?.isFetched}
          />
        </div>
      </div>

      <AddAlertTeam
        reload={reload}
        detail={detail}
        users={dataUser}
        features={features}
        setReload={setReload}
        showModal={showModalAlertTeam}
        setShowModal={setShowModalAlertTeam}
      />

      <DetailAlertTeam
        dataDetail={detail}
        showModal={showModalDetail}
        setShowModal={setShowModalDetail}
      />

      <Alert
        loading={false}
        type={'delete'}
        body={messageAlert}
        confirmLabel={'Delete'}
        showModal={showModalBulk}
        title={'Bulk Delete Team'}
        setShowModal={setShowModalConfirmBulk}
        onCancel={() => setShowModalConfirmBulk(false)}
        onConfirm={() => {
          onBulkDelete(dataChecked)
          setShowModalConfirmBulk(false)
          setDataChecked([])
        }}
      />
    </>
  )
}

CardAlertTeam = memo(
  CardAlertTeam,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)

export {CardAlertTeam}
