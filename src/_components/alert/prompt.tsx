import {FC, useCallback, useState} from 'react'
import {Button, Modal} from 'react-bootstrap'
import {
  // UNSAFE_NavigationContext as NavigationContext,
  unstable_useBlocker as useBlocker,
  // unstable_usePrompt as usePrompt,
  useBeforeUnload,
  useNavigate,
} from 'react-router-dom'

const Prompt: FC<any> = ({message, when = true, onLocationChange: _onLocationChange}) => {
  const navigate: any = useNavigate()
  // const {navigator}: any = useContext(NavigationContext)
  const [nextLocation, setNextLocation] = useState<any>('/')
  const [show, setShow] = useState<boolean>(false)
  const [forceNavigate, setforceNavigate] = useState<boolean>(false)

  useBeforeUnload(
    useCallback(
      (e: any) => {
        if (when) {
          e.preventDefault()
          e.returnValue = null
        }
      },
      [when]
    ),
    {capture: true}
  )

  // usePrompt({
  //   when,
  //   message: 'Discard unsaved changes?',
  // })

  useBlocker((state: any) => {
    setNextLocation(state?.nextLocation)
    if (when) {
      setShow(true)
    }
    return when && !forceNavigate
  })

  // useEffect(() => {
  //   if (!when) {
  //     return
  //   }

  //   const push = navigator.push
  //   navigator.push = (...args: Parameters<typeof push>) => {
  //     setShow(true)
  //     onLocationChange(args?.[0])
  //     if (show) {
  //       push(...args)
  //     }
  //   }

  //   return () => {
  //     navigator.push = push
  //   }
  // }, [navigator, when, show, onLocationChange])

  return show ? (
    <>
      <Modal dialogClassName='modal-md modal-margin-top' show={show} onHide={() => setShow(false)}>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button
            className='btn-sm'
            variant='primary'
            onClick={() => {
              setforceNavigate(true)
              setTimeout(() => {
                navigate(nextLocation)
              }, 100)
            }}
          >
            <span>Yes</span>
          </Button>
          <Button
            className='btn-sm'
            variant='secondary'
            onClick={() => {
              setShow(false)
            }}
          >
            <span>No</span>
          </Button>
        </Modal.Footer>
      </Modal>
      <style>
        {`.modal-margin-top {
        margin: 20rem auto 0;
      }`}
      </style>
    </>
  ) : null
}

export default Prompt
