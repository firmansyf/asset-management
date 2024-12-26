import {ListLoader} from '@components/loader/list'
import {configClass} from '@helpers'
import debounce from 'lodash/debounce'
import {FC, useEffect, useRef, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'

import {getAssetLite} from '../Services'

type Props = {
  showModal: any
  setShowModal: any
  detail?: any
  onAttach: any
  attachedAsset?: any
}

const CheckList: FC<any> = ({uniq, name, description: _desc, category, onChange, active}) => {
  return (
    <label
      className={`d-flex align-items-center cursor-default py-2 px-3 ${
        active ? 'bg-light-primary text-primary' : 'bg-hover-gray-100'
      }`}
    >
      <div className='form-check form-check-sm form-check-custom form-check-solid'>
        <input
          className='form-check-input border border-gray-300'
          type='checkbox'
          name='checkall'
          value='false'
          defaultChecked={active}
          onChange={({target: {checked}}: any) => onChange(checked)}
        />
      </div>
      <div className='ps-3'>
        <div className='fw-bold text-capitalize text-truncate'>{name}</div>
        <div className='fs-9'>{uniq}</div>
        {/* <div className='text-gray-600 fs-8 text-truncate'>{description || '-'}</div> */}
      </div>
      <div className='ms-auto'>
        <span className='badge badge-white text-primary'>{category}</span>
      </div>
    </label>
  )
}

const AttachAsset: FC<Props> = ({
  showModal,
  setShowModal,
  onAttach,
  detail = {},
  attachedAsset,
}) => {
  const searcRef: any = useRef()

  const [meta, setMeta] = useState<any>({})
  const [data, setData] = useState<any>([])
  const [guids, setGuids] = useState<any>([])
  const [keyword, setKeyword] = useState<string>('')
  const [loadingSearch, setLoadingSearch] = useState<boolean>(false)

  useEffect(() => {
    if (showModal) {
      setTimeout(() => {
        searcRef?.current?.focus()
      }, 100)
      setLoadingSearch(true)
      const notGuids: any = detail?.asset?.map(({guid}: any) => guid) || []
      getAssetLite({page: 1, limit: 10, guid: notGuids})
        .then(({data: {meta: resMeta, data: res}}: any) => {
          const data: any = []
          res?.forEach((item: any) => {
            const dt: any = attachedAsset?.find(({guid}: any) => guid === item?.guid)
            if (dt === undefined) {
              data.push(item)
            }
          })
          setData(data as never[])
          setMeta(resMeta)
          setLoadingSearch(false)

          if (data?.length === 0) {
            handleShowMore()
          }
        })
        .catch(() => setLoadingSearch(false))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showModal, detail, attachedAsset])

  const onSearch = debounce((q: any) => {
    setKeyword(q)
    const notGuids: any = detail?.asset?.map(({guid}: any) => guid) || []
    getAssetLite({page: 1, limit: 10, keyword: q, guid: notGuids})
      .then(({data: {meta: resMeta, data: res}}: any) => {
        setMeta(resMeta)
        setData(res)
      })
      .finally(() => {
        setTimeout(() => {
          setLoadingSearch(false)
        }, 300)
      })
  }, 1000)

  const onSubmit: any = () => {
    onAttach(guids)
    setGuids([])
    setShowModal(false)
  }

  const handleShowMore = () => {
    const notGuids: any = detail?.asset?.map(({guid}: any) => guid) || []
    getAssetLite({page: (meta?.current_page || 1) + 1, limit: 10, keyword, guid: notGuids})
      .then(({data: {meta: resMeta, data: res}}: any) => {
        setMeta(resMeta)
        setData((prev: any) => [...prev, ...res])
      })
      .catch(() => '')
  }

  const onClose = () => {
    setShowModal(false)
    setData([])
  }

  return (
    <Modal dialogClassName='modal-md' show={showModal} onHide={onClose}>
      <Modal.Body className='p-2'>
        <div className='row'>
          <div className='col-12'>
            <div className='input-group input-group-sm input-group-solid d-flex flex-center'>
              <div className='input-group-text pe-0'>
                <i className='las la-search fs-3' />
              </div>
              <input
                ref={searcRef}
                type='text'
                className={configClass?.form}
                onChange={({target: {value}}: any) => {
                  setLoadingSearch(true)
                  onSearch(value)
                }}
              />
              {loadingSearch && (
                <div className='pe-3'>
                  <span className='spinner-border spinner-border-sm text-primary fs-9 w-15px h-15px' />
                </div>
              )}
            </div>
          </div>
          {!loadingSearch ? (
            data?.length > 0 ? (
              <div className='col-12 pt-3' style={{maxHeight: '60vh', overflowY: 'auto'}}>
                {data?.map((m: any) => (
                  <CheckList
                    key={m?.guid}
                    active={guids?.map(({guid}: any) => guid)?.includes(m?.guid)}
                    uniq={m?.asset_id}
                    name={m?.name}
                    description={m?.description}
                    category={m?.category?.name || '-'}
                    onChange={(e: boolean) => {
                      const res: any = e
                        ? guids?.concat(m)
                        : guids?.filter((f: any) => f?.guid !== m?.guid)
                      setGuids(res)
                    }}
                  />
                ))}
                {meta?.current_page < meta?.last_page && (
                  <div className='text-center mt-5'>
                    <div className='btn btn-sm btn-light-primary' onClick={handleShowMore}>
                      Show more
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className='col-12 mt-5'>
                <div className='d-flex flex-center h-100px text-gray-400'>No data found</div>
              </div>
            )
          ) : (
            <div className='col-12 mt-2'>
              <div className='row ms-0'>
                <ListLoader className='col-12 mt-3' height={20} count={3} />
              </div>
            </div>
          )}
          <div className='col-12'>
            <div className='d-flex justify-content-end p-3 pt-4 border-top mt-5'>
              <Button
                className='btn-sm me-2'
                variant='secondary'
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
              <Button
                className='btn-sm'
                type='submit'
                disabled={!guids?.length}
                form-id=''
                variant='primary'
                onClick={onSubmit}
              >
                Attach
              </Button>
            </div>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  )
}

export default AttachAsset
