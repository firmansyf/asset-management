import {CaptureConsole, Debug, Dedupe} from '@sentry/integrations'
import * as Sentry from '@sentry/react'
import {BrowserTracing} from '@sentry/tracing'

const allowUrls: any = [
  /https?:\/\/([a-zA-Z\d-]+\.){0,}?assetdata\.io/,
  // /https?:\/\/([a-zA-Z\d-]+\.){0,}?assetd\.zone/,
  // /https?:\/\/([a-zA-Z\d-]+\.){0,}?localhost(:[0-9]+)/,
]

const integrations: any = [
  new Dedupe(),
  new Debug({debugger: false, stringify: false}),
  new CaptureConsole({levels: process.env.NODE_ENV === 'development' ? ['error'] : []}),
]

if (allowUrls?.filter((f: any) => f?.test(window?.location?.origin))?.length > 0) {
  integrations.push(
    new BrowserTracing({
      idleTimeout: 30000,
      traceFetch: true,
      traceXHR: true,
      finalTimeout: 30000,
    })
  )
}

export const config: any = {
  dsn: 'https://4e60136c646c4a2da1631cba340aecd3@o1006783.ingest.sentry.io/5971253',
  release: 'v2.0.0',
  allowUrls,
  integrations,
  tracesSampleRate: 0.6,
  // environment: process.env.SENTRY_ENVIRONMENT,
  environment: 'production',
  maxBreadcrumbs: 5,
  autoSessionTracking: true,
  beforeBreadcrumb(breadcrumb: any, _hint: any) {
    return breadcrumb?.level === 'error' ? breadcrumb : null
  },
  beforeSend(event: any, hint: any) {
    // const {
    //   originalException: {isAxiosError = false},
    // }: any = hint || {}
    const {originalException}: any = hint || {}
    const {isAxiosError}: any = originalException || {}
    if (isAxiosError) {
      return null
    }
    if (event?.exception && event?.exception?.values?.length > 0) {
      return event
    } else {
      return null
    }
  },
  ignoreErrors: [
    // list of errors that's not reported to sentry
    'Non-Error promise rejection captured',
    'ChunkLoadError',
    "TypeError: Cannot read properties of undefined (reading 'permissions')",
    "TypeError: Cannot read properties of null (reading 'getAttribute')", // SVG issue
    'AbortError: The user aborted a request.', // user canceled request to api caused of slow network connection or to fast doing action while request not finished yet
    'TypeError: Failed to fetch',
    'PSPDFKitError',
    'PSPDFKitError: File not in PDF format or corrupted.', // initialize first running in new deployment will show this message
    'PSPDFKitError: The mounting container has no width.', // initialize first running in new deployment will show this message
    'FirebaseError',
    'ResizeObserver loop limit exceeded',
    'ResizeObserver loop completed with undelivered notifications',
    'TypeError: this._iframeAutoHeight is not a function',
  ],
}

export const sentry: any = Sentry
