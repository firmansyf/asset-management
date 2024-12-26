import filter from 'lodash/filter'
import includes from 'lodash/includes'
import {FC, memo, useEffect} from 'react'

import RoleTable from '../sections/RoleTable'

type HelpdeskRolesProps = {
  roleHelpDesk: any
  workingHourRoles: any
  setWorkingHourRoles: any
  shiftsRoles: any
  setShiftsRoles: any
  tagsRoles: any
  setTagsRoles: any
  ticketsRoles: any
  setTicketsRoles: any
  helpdeskRoles: any
  setHelpdeskRoles: any
}
let HelpdeskRoles: FC<HelpdeskRolesProps> = ({
  roleHelpDesk,
  workingHourRoles,
  setWorkingHourRoles,
  shiftsRoles,
  setShiftsRoles,
  tagsRoles,
  setTagsRoles,
  ticketsRoles,
  setTicketsRoles,
  helpdeskRoles,
  setHelpdeskRoles,
}) => {
  useEffect(() => {
    roleHelpDesk.map((data_role: any) => {
      const data_shift = [
        'help-desk.shift.view',
        'help-desk.shift.add',
        'help-desk.shift.edit',
        'help-desk.shift.delete',
        'help-desk.shift.export',
      ]
      const dataShift: any = filter(data_role?.items, (role: any) =>
        includes(data_shift, role?.name)
      )
      return setShiftsRoles(dataShift as never)
    })

    roleHelpDesk.map((data_role: any) => {
      const data_working_hour = [
        'help-desk.working-hour.view',
        'help-desk.working-hour.add',
        'help-desk.working-hour.edit',
        'help-desk.working-hour.delete',
        'help-desk.working-hour.export',
      ]
      const dataWorkingHour: any = filter(data_role?.items, (role: any) =>
        includes(data_working_hour, role?.name)
      )
      return setWorkingHourRoles(dataWorkingHour as never)
    })

    roleHelpDesk.map((data_role: any) => {
      const data_ticket = [
        'help-desk.ticket.view',
        'help-desk.ticket.add',
        'help-desk.ticket.edit',
        'help-desk.ticket.delete',
        'help-desk.ticket.export',
        'help-desk.ticket.setup-column',
      ]
      const dataTicket: any = filter(data_role?.items, (role: any) =>
        includes(data_ticket, role?.name)
      )
      return setTicketsRoles(dataTicket as never)
    })

    roleHelpDesk.map((data_role: any) => {
      const data_tag = [
        'help-desk.tag.view',
        'help-desk.tag.add',
        'help-desk.tag.edit',
        'help-desk.tag.delete',
        'help-desk.tag.export',
      ]
      const dataTags: any = filter(data_role?.items, (role: any) => includes(data_tag, role?.name))
      return setTagsRoles(dataTags as never)
    })

    roleHelpDesk.map((data_role: any) => {
      const data_helpdesk = [
        'help-desk.view',
        // 'help-desk.add',
        // 'help-desk.edit',
        // 'help-desk.delete',
      ]
      const dataHelpdesk: any = filter(data_role?.items, (role: any) =>
        includes(data_helpdesk, role?.name)
      )
      return setHelpdeskRoles(dataHelpdesk as never)
    })
  }, [
    roleHelpDesk,
    setShiftsRoles,
    setWorkingHourRoles,
    setTicketsRoles,
    setTagsRoles,
    setHelpdeskRoles,
  ])

  return (
    <div className='container'>
      <div className='mb-0 mt-10'>
        <h3>Permission</h3>
      </div>
      <div className='mb-10'>Set user&lsquo;s permission add/edit/delete/view.</div>
      <div className='row'>
        <div className='col-sm-12 col-md-6 col-lg-6'>
          <RoleTable
            dataRoles={helpdeskRoles}
            setDataRoles={setHelpdeskRoles}
            roleName={'helpdesk'}
            roleTitle={'Helpdesk'}
          />
          <RoleTable
            dataRoles={workingHourRoles}
            setDataRoles={setWorkingHourRoles}
            roleName={'working-hour'}
            roleTitle={'Working Hour'}
          />
          <RoleTable
            dataRoles={shiftsRoles}
            setDataRoles={setShiftsRoles}
            roleName={'shifts'}
            roleTitle={'Shifts'}
          />
        </div>
        <div className='col-sm-12 col-md-6 col-lg-6'>
          <RoleTable
            dataRoles={ticketsRoles}
            setDataRoles={setTicketsRoles}
            roleName={'ticket'}
            roleTitle={'Ticket'}
          />
          <RoleTable
            dataRoles={tagsRoles}
            setDataRoles={setTagsRoles}
            roleName={'tags'}
            roleTitle={'Tags'}
          />
        </div>
      </div>
    </div>
  )
}

HelpdeskRoles = memo(
  HelpdeskRoles,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default HelpdeskRoles
