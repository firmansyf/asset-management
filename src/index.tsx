/* eslint-disable simple-import-sort/imports */

// import {AuthProvider} from '@auth'
import {Provider as ReduxProvider} from 'react-redux'
import {store, persistor} from '@redux'
import {PersistGate} from 'redux-persist/integration/react'
import {LocalizationProvider} from '@mui/x-date-pickers'
import {AdapterMoment} from '@mui/x-date-pickers/AdapterMoment'
import {FC} from 'react'
import {createRoot} from 'react-dom/client'

import {MetronicI18nProvider} from '@metronic/i18n/Metronici18n'
import {QueryClient} from '@tanstack/react-query'
import {createSyncStoragePersister} from '@tanstack/query-sync-storage-persister'
import {PersistQueryClientProvider} from '@tanstack/react-query-persist-client'
import {BrowserRouter} from './routes'

// import 'bootstrap/dist/css/bootstrap.min.css'
import '@metronic/assets/sass/style.scss'
import './global.scss'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      keepPreviousData: true,
      refetchOnMount: true,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
      suspense: false,
      cacheTime: 1000 * 60 * 60 * 12, // 12 hours
      // staleTime: Infinity,
      useErrorBoundary: false,
    },
  },
})

const persister: any = createSyncStoragePersister({
  storage: window.localStorage,
})

const El: FC<any> = () => {
  return (
    <MetronicI18nProvider>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <PersistQueryClientProvider client={queryClient} persistOptions={{persister}}>
          <ReduxProvider store={store}>
            <PersistGate loading={null} persistor={persistor}>
              <BrowserRouter />
            </PersistGate>
          </ReduxProvider>
        </PersistQueryClientProvider>
      </LocalizationProvider>
    </MetronicI18nProvider>
  )
}

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const root: any = createRoot(document.getElementById('root')!)
root.render(<El />)
