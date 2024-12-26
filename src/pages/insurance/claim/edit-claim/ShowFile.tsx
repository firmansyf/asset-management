import {IMAGES} from '@components/viewer/images'
import {ViewerCustom} from '@components/viewer/indexViewCustom'
import {Video} from '@components/viewer/video'
import {FC, memo} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {shallowEqual, useSelector} from 'react-redux'

let ShowFile: FC<any> = ({showModal, setShowModal, data}) => {
  const {url, download_url, title, mime_type = ''}: any = data || {}

  const extension: any = title?.split('.')?.slice(-1)?.[0]
  const token: any = useSelector(({token}: any) => token, shallowEqual)

  // const [zoom, setZoom] = useState<number>(1)
  // const [degree, setDegree] = useState<number>(0)
  // const [degreeVal, setDegreeVal] = useState<string>('')

  // const isLandscape: boolean = Math.abs((degree / 90) % 2) === 0
  // const isMinZoom: boolean = zoom < (isLandscape ? 0.5 : 0.8)
  // const isMaxZoom: boolean = zoom > (isLandscape ? 2 : 2.5)

  // useEffect(() => {
  //   return () => {
  //     setDegree(0)
  //     setZoom(1)
  //   }
  // }, [showModal])

  // useEffect(() => {
  //   if (degree === 90) {
  //     setDegreeVal('45% 60%')
  //   } else if (degree === -90) {
  //     setDegreeVal('55% 55%')
  //   } else if (degree === 180 || degree === -180) {
  //     setDegreeVal('50% 70%')
  //   } else if (degree === 270) {
  //     setDegreeVal('55% 55%')
  //   } else if (degree === -270) {
  //     setDegreeVal('45% 55%')
  //   } else {
  //     setDegreeVal('50% 0%')
  //   }
  // }, [degree])

  return (
    <Modal dialogClassName='modal-lg' show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title>
          View{' '}
          {mime_type === 'image/jpeg' || mime_type === 'image/png'
            ? mime_type === 'application/pdf'
              ? 'PDF'
              : 'Image'
            : 'File'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className='m-1'>
          {mime_type && mime_type?.indexOf('image') >= 0 && url && (
            // <div
            //   className='d-flex flex-center overflow-auto custom-scroll-bar py-10'
            //   style={{height: '50vh'}}
            // >
            //   <div
            //     className='w-100 h-100'
            //     style={{
            //       background: `#fff url(${url}?token=${token}) top center / contain no-repeat`,
            //       transform: `rotate(${degree}deg) scale(${isLandscape ? zoom : zoom - 0.4})`,
            //       // transformOrigin: `inherit`,
            //       transformOrigin: `${degreeVal}`,
            //     }}
            //   />
            // </div>
            <IMAGES
              src={`${url}?token=${token}`}
              title={title}
              setShowModal={setShowModal}
              showModal={showModal}
            />
          )}

          {mime_type === 'application/pdf' && extension?.toLowerCase() === 'pdf' && (
            <ViewerCustom type={mime_type} src={`${url}?token=${token}`} />
          )}

          {['mp4', 'avi', 'wmv', 'mov', 'mkv', 'ts']?.includes(extension?.toLowerCase()) && (
            <Video src={`${url}?token=${token}`} />
          )}

          {mime_type !== 'image/jpeg' &&
            mime_type !== 'image/png' &&
            mime_type !== 'application/pdf' && <p className='text-center'>{title}</p>}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button className='btn-sm' variant='secondary' onClick={() => setShowModal(false)}>
          Close
        </Button>
        {/* (mime_type === 'image/jpeg' || mime_type === 'image/png') && (
          <div className='mx-2'>
            { ROTATE BTN }
            <ButtonGroup size='sm' className='mx-2'>
              <Button
                className='pe-2 ps-4 btn-success'
                onClick={() => {
                  setDegree((prev: number) => (prev !== -270 ? prev - 90 : 0))
                }}
              >
                <i className='fas fa-undo fs-3' />
              </Button>
              <Button
                className='ps-3 pe-3 btn-success'
                onClick={() => {
                  setDegree((prev: number) => (prev !== 270 ? prev + 90 : 0))
                }}
              >
                <i className='fas fa-redo fs-3' />
              </Button>
            </ButtonGroup>
            { ZOOM BTN }
            <ButtonGroup size='sm' className='mx-2'>
              <Button
                className='pe-2 ps-4'
                variant={isMinZoom ? 'light' : 'success'}
                disabled={isMinZoom}
                onClick={() => {
                  !isMinZoom && setZoom((prev: number) => prev - 0.1)
                }}
              >
                <i className='fas fa-search-minus fs-3' />
              </Button>
              <Button
                className='ps-3 pe-3'
                variant={isMaxZoom ? 'light' : 'success'}
                disabled={isMaxZoom}
                onClick={() => {
                  !isMaxZoom && setZoom((prev: number) => prev + 0.1)
                }}
              >
                <i className='fas fa-search-plus fs-3' />
              </Button>
            </ButtonGroup>
            { RESET BTN }
            <ButtonGroup size='sm' className='mx-2'>
              <Button
                className='pe-2 ps-4 btn-success'
                onClick={() => {
                  setDegree(0)
                  setZoom(1)
                }}
              >
                <i className='fas fa-sync fs-3' />
              </Button>
            </ButtonGroup>
          </div>
        ) */}

        <Button
          className='btn-sm'
          variant='primary'
          onClick={() => {
            window.open(`${download_url}?token=${token}`, '_blank')
          }}
        >
          Download {mime_type === 'image/jpeg' || mime_type === 'image/png' ? 'Image' : 'File'}
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

ShowFile = memo(ShowFile, (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next))
export default ShowFile
