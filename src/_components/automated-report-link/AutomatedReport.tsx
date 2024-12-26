import {hasPermission} from '@helpers'
import ModalAutomatedReport from '@pages/reports/automated-report/ModalAddEdit'
import {keyBy, mapValues} from 'lodash'
import {FC, useEffect, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown'
import {shallowEqual, useSelector} from 'react-redux'
import {useNavigate} from 'react-router-dom'

interface Props {
  type: string
  name: string
  columns: Array<object>
}

const AutomatedRreport: FC<Props> = ({type, name, columns}) => {
  const navigate: any = useNavigate()
  const preferenceStore: any = useSelector(({preference}: any) => preference, shallowEqual)
  const {feature} = preferenceStore || {}

  const [showModalAutomatedReport, setShowModalAutomatedReport] = useState(false)
  const [features, setFeatures] = useState<any>({})

  useEffect(() => {
    if (feature) {
      const resObj: any = keyBy(feature, 'unique_name')
      setFeatures(mapValues(resObj, 'value'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {hasPermission('reports.automation_report.add') && features?.automated_report === 1 && (
        <Dropdown.Item onClick={() => setShowModalAutomatedReport(true)}>
          Automated Report
        </Dropdown.Item>
      )}

      {hasPermission('reports.automation_report.view') && (
        <ModalAutomatedReport
          type={'add'}
          detail={{name: name, type: type}}
          columns={columns}
          showModal={showModalAutomatedReport}
          setShowModal={setShowModalAutomatedReport}
          onSubmit={() => {
            setShowModalAutomatedReport(false)
            navigate('/reports/automated-report')
          }}
        />
      )}
    </>
  )
}

export {AutomatedRreport}
