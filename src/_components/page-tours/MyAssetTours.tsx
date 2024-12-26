import {getFeatureAsset} from '@pages/setup/settings/feature/Service'
import {find} from 'lodash'
import {FC, useEffect, useReducer, useState} from 'react'
import JoyRide, {ACTIONS, EVENTS, STATUS} from 'react-joyride'
import {shallowEqual, useSelector} from 'react-redux'

const TOUR_STEPS: any = [
  {
    target: '.setup-my-assets',
    content: (
      <>
        <div
          className='center'
          style={{textAlign: 'center', fontSize: '14px', marginBottom: '-12px'}}
        >
          My Assets allows other users to add or confirm assets for you.
        </div>
        {/* <div className='mt-5' style={{textAlign: 'center', fontSize: '14px'}}>
          <strong>Note: </strong>Employee must be added as Asset Data user to perform these action.
        </div> */}
      </>
    ),
    disableBeacon: true, // This makes the tour to start automatically without clicking
    hideCloseButton: true,
  },
]

const INITIAL_STATE: any = {
  key: new Date(), // This field makes the tour to re-render when we restart the tour
  run: false,
  continuous: true,
  loading: false,
  stepIndex: 0,
  steps: TOUR_STEPS,
}

// Reducer will manage updating the local state
const reducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case 'START':
      return {...state, run: true}
    case 'RESET':
      return {...state, stepIndex: 0}
    case 'STOP':
      return {...state, run: false}
    case 'NEXT_OR_PREV':
      return {...state, ...action.payload}
    case 'RESTART':
      return {
        ...state,
        stepIndex: 0,
        run: true,
        loading: false,
        key: new Date(),
      }
    default:
      return state
  }
}

const MyAssetTours: FC<any> = () => {
  const [tourState, dispatch] = useReducer(reducer, INITIAL_STATE)
  const [myAssetSetup, setMyAssetSetup] = useState<boolean>(true)
  const user: any = useSelector(({currentUser}: any) => currentUser, shallowEqual)
  const {role_name}: any = user || {}

  useEffect(() => {
    getFeatureAsset({})
      .then(({data: {data: arr}}: any) => {
        const data: any = find(arr, {value: 0})
        if (data === undefined) {
          setMyAssetSetup(true)
        } else {
          setMyAssetSetup(false)
        }
      })
      .catch(() => '')
  }, [])

  useEffect(() => {
    // Auto start the tour if the tour is not viewed before
    // if (!localStorage.getItem('tour')) {
    //   dispatch({type: 'START'})
    // }
    if (!myAssetSetup && (role_name === 'owner' || role_name === 'admin')) {
      dispatch({type: 'START'})
    }
  }, [myAssetSetup, role_name])

  // Set once tour is viewed, skipped or closed
  const setTourViewed = () => {
    // localStorage.setItem('tour', '1')
  }

  const callback = (data: any) => {
    const {action, index, type, status}: any = data

    if (
      // If close button clicked, then close the tour
      action === ACTIONS.CLOSE ||
      // If skipped or end tour, then close the tour
      (status === STATUS.SKIPPED && tourState.run) ||
      status === STATUS.FINISHED
    ) {
      setTourViewed()
      dispatch({type: 'STOP'})
    } else if (type === EVENTS.STEP_AFTER || type === EVENTS.TARGET_NOT_FOUND) {
      // Check whether next or back button click and update the step.
      dispatch({
        type: 'NEXT_OR_PREV',
        payload: {stepIndex: index + (action === ACTIONS.PREV ? -1 : 1)},
      })
    }
  }

  return (
    <JoyRide
      {...tourState}
      callback={callback}
      showSkipButton={true}
      floaterProps={{placement: 'left'}}
      styles={{
        tooltipContainer: {
          textAlign: 'left',
        },
        buttonBack: {
          marginRight: 10,
        },
        buttonNext: {
          display: 'none',
        },
        options: {
          zIndex: 1000,
        },
      }}
      locale={{
        last: 'End tour',
      }}
    />
  )
}

export default MyAssetTours
