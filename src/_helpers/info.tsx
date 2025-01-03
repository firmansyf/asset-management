import {Loader} from '@googlemaps/js-api-loader'
import axios from 'axios'

export const googleMapLoader: any = new Loader({
  apiKey: 'AIzaSyAggoTSg-KhhQTI9IZjbkZzsVYD-qT1cqI',
  version: 'weekly',
  authReferrerPolicy: 'origin',
  libraries: ['places', 'geometry', 'drawing', 'marker', 'visualization'],
})

export const getClientOS: any = () => {
  const unknown: any = '-'

  // browser
  const nVer: any = navigator?.appVersion
  const nAgt: any = navigator?.userAgent
  let browser: any = navigator?.appName
  let version: any = '' + parseFloat(navigator?.appVersion)
  let majorVersion: any = parseInt(navigator?.appVersion, 10)
  let nameOffset: any, verOffset: any, ix: any

  // Opera
  if ((verOffset = nAgt?.indexOf('Opera')) !== -1) {
    browser = 'Opera'
    version = nAgt?.substring(verOffset + 6)
    if ((verOffset = nAgt?.indexOf('Version')) !== -1) {
      version = nAgt?.substring(verOffset + 8)
    }
  }
  // Opera Next
  if ((verOffset = nAgt?.indexOf('OPR')) !== -1) {
    browser = 'Opera'
    version = nAgt?.substring(verOffset + 4)
  }
  // Legacy Edge
  else if ((verOffset = nAgt?.indexOf('Edge')) !== -1) {
    browser = 'Microsoft Legacy Edge'
    version = nAgt?.substring(verOffset + 5)
  }
  // Edge (Chromium)
  else if ((verOffset = nAgt?.indexOf('Edg')) !== -1) {
    browser = 'Microsoft Edge'
    version = nAgt?.substring(verOffset + 4)
  }
  // MSIE
  else if ((verOffset = nAgt?.indexOf('MSIE')) !== -1) {
    browser = 'Microsoft Internet Explorer'
    version = nAgt?.substring(verOffset + 5)
  }
  // Chrome
  else if ((verOffset = nAgt?.indexOf('Chrome')) !== -1) {
    browser = 'Chrome'
    version = nAgt?.substring(verOffset + 7)
  }
  // Safari
  else if ((verOffset = nAgt?.indexOf('Safari')) !== -1) {
    browser = 'Safari'
    version = nAgt?.substring(verOffset + 7)
    if ((verOffset = nAgt?.indexOf('Version')) !== -1) {
      version = nAgt?.substring(verOffset + 8)
    }
  }
  // Firefox
  else if ((verOffset = nAgt?.indexOf('Firefox')) !== -1) {
    browser = 'Firefox'
    version = nAgt?.substring(verOffset + 8)
  }
  // MSIE 11+
  else if (nAgt?.indexOf('Trident/') !== -1) {
    browser = 'Microsoft Internet Explorer'
    version = nAgt?.substring(nAgt?.indexOf('rv:') + 3)
  }
  // Other browsers
  else if ((nameOffset = nAgt?.lastIndexOf(' ') + 1) < (verOffset = nAgt?.lastIndexOf('/'))) {
    browser = nAgt?.substring(nameOffset, verOffset)
    version = nAgt?.substring(verOffset + 1)
    if (browser?.toLowerCase() === browser?.toUpperCase()) {
      browser = navigator?.appName
    }
  }
  // trim the version string
  if ((ix = version?.indexOf(';')) !== -1) version = version?.substring(0, ix)
  if ((ix = version?.indexOf(' ')) !== -1) version = version?.substring(0, ix)
  if ((ix = version?.indexOf(')')) !== -1) version = version?.substring(0, ix)

  majorVersion = parseInt('' + version, 10)
  if (isNaN(majorVersion)) {
    version = '' + parseFloat(navigator?.appVersion)
    majorVersion = parseInt(navigator?.appVersion, 10)
  }

  // mobile version
  const mobile: any = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer)

  // system
  let os: any = unknown
  const clientStrings: any = [
    {s: 'Windows 10', r: /(Windows 10.0|Windows NT 10.0)/},
    {s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/},
    {s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/},
    {s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/},
    {s: 'Windows Vista', r: /Windows NT 6.0/},
    {s: 'Windows Server 2003', r: /Windows NT 5.2/},
    {s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/},
    {s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/},
    {s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/},
    {s: 'Windows 98', r: /(Windows 98|Win98)/},
    {s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/},
    {s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
    {s: 'Windows CE', r: /Windows CE/},
    {s: 'Windows 3.11', r: /Win16/},
    {s: 'Android', r: /Android/},
    {s: 'Open BSD', r: /OpenBSD/},
    {s: 'Sun OS', r: /SunOS/},
    {s: 'Chrome OS', r: /CrOS/},
    {s: 'Linux', r: /(Linux|X11(?!.*CrOS))/},
    {s: 'iOS', r: /(iPhone|iPad|iPod)/},
    {s: 'Mac OS X', r: /Mac OS X/},
    {s: 'Mac OS', r: /(Mac OS|MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
    {s: 'QNX', r: /QNX/},
    {s: 'UNIX', r: /UNIX/},
    {s: 'BeOS', r: /BeOS/},
    {s: 'OS/2', r: /OS\/2/},
    {
      s: 'Search Bot',
      r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/,
    },
  ]
  for (const id in clientStrings) {
    const cs: any = clientStrings?.[id]
    if (cs?.r?.test(nAgt)) {
      os = cs?.s
      break
    }
  }

  let osVersion: any = unknown

  if (/Windows/.test(os)) {
    osVersion = /Windows (.*)/.exec(os)?.[1]
    os = 'Windows'
  }

  switch (os) {
    case 'Mac OS':
    case 'Mac OS X':
    case 'Android':
      osVersion = // eslint-disable-next-line no-useless-escape
        /(?:Android|Mac OS|Mac OS X|MacPPC|MacIntel|Mac_PowerPC|Macintosh) ([\.\_\d]+)/.exec(
          nAgt
        )?.[1]
      break

    case 'iOS':
      osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer)
      osVersion = osVersion?.[1] + '.' + osVersion?.[2] + '.' + (osVersion?.[3] | 0)
      break
    default:
      osVersion = 0
  }

  return {
    browser,
    browserVersion: version,
    browserMajorVersion: majorVersion,
    mobile,
    os,
    osVersion,
  }
}

export const getClientInfo: any = async () => {
  let locationIsEnabled: boolean = false
  const info: any = (await axios('https://ipapi.co/json'))?.data
  const ip: any = info?.ip
  let coordinates: any = {lat: info?.latitude, lng: info?.longitude}
  let address: any = `${info?.city && `${info?.city}, `} ${info?.region && `${info?.region}, `} ${
    info?.country_name || ''
  }`
  let address_components: any = []

  if ('geolocation' in navigator) {
    navigator?.geolocation?.getCurrentPosition(() => null)
    locationIsEnabled =
      (await navigator?.permissions?.query({name: 'geolocation'}))?.state === 'granted'

    if (locationIsEnabled) {
      coordinates = await new Promise(
        (resolve: any) =>
          navigator?.geolocation?.getCurrentPosition(({coords: {latitude, longitude}}: any) =>
            resolve({lat: latitude, lng: longitude})
          )
      )
    }

    const google: any = await googleMapLoader?.load()

    address = (
      await new google.maps.Geocoder().geocode({latLng: coordinates} as any)
    )?.results?.find(({formatted_address}: any) => formatted_address)
    address_components = address?.address_components
  }

  const {browser, os}: any = getClientOS() || {}
  return {
    ip,
    address: address?.formatted_address,
    address_components,
    coordinates,
    browser,
    os,
    locationIsEnabled,
  }
}
