import {Nodata} from '@components/pages'
import {lazy, Suspense} from 'react'

const Forum: any = lazy(() => import('@pages/help-desk/forum-page'))
const ForumDetail: any = lazy(() => import('@pages/help-desk/forum-page/DetailForum'))
const Ticket: any = lazy(() => import('@pages/help-desk/ticket'))
const TicketColumn: any = lazy(() => import('@pages/help-desk/ticket/TicketColumn'))
const TicketDetail: any = lazy(() => import('@pages/help-desk/ticket/TicketDetail'))

const routes: any = [
  {
    path: 'help-desk/*',
    children: [
      // FORUM
      {
        path: 'forum/*',
        element: (
          <Suspense fallback=''>
            <Forum />
          </Suspense>
        ),
        children: [
          {
            index: true,
            allUser: true,
            element: <Nodata text='Please select the forum to show detail !' />,
          },
          {path: 'detail-forum/:guid', allUser: true, element: ForumDetail},
        ],
      },
      // TICKET
      {
        path: 'ticket/*',
        children: [
          {index: true, permission: 'help-desk.ticket.view', element: Ticket},
          {path: 'columns', permission: 'help-desk.ticket.setup-column', element: TicketColumn},
          {path: 'detail/:guid', permission: 'help-desk.ticket.view', element: TicketDetail},
        ],
      },
    ],
  },
]

export default routes
