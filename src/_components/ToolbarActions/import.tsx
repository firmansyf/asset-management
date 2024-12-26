import {hasPermission} from '@helpers'
import {keyBy, mapValues} from 'lodash'
import {FC, useEffect, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {shallowEqual, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

interface Props {
  actionName: string
  pathName: string
  type: string
  permission: string
}

const ToolbarImport: FC<Props> = ({actionName, pathName, type, permission}) => {
  const navigate = useNavigate()
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {feature} = preferenceStore || {}
  const [features, setFeatures] = useState<any>({})

  useEffect(() => {
    if (feature) {
      const resObj: any = keyBy(feature, 'unique_name')
      setFeatures(mapValues(resObj, 'value'))
    }
  }, [feature])

  return (
    <>
      {permission === 'null' ? (
        <>
          {features?.bulk_import === 1 && (
            <Dropdown.Item
              href='#'
              onClick={() => {
                navigate({pathname: pathName, search: `type=${type}`})
              }}
            >
              {actionName}
            </Dropdown.Item>
          )}
        </>
      ) : (
        <>
          {hasPermission(`${permission}`) && features?.bulk_import === 1 && (
            <Dropdown.Item
              href='#'
              onClick={() => {
                navigate({pathname: pathName, search: `type=${type}`})
              }}
            >
              {actionName}
            </Dropdown.Item>
          )}
        </>
      )}
    </>
  )
}

export default ToolbarImport
