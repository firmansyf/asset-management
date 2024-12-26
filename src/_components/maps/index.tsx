// https://developers.google.com/maps/documentation/javascript
// https://developers.google.com/maps/documentation/javascript/places

import {BasicSlider} from '@components/form/slider'
import {ToastMessage} from '@components/toast-message'
import {configClass, getClientInfo, googleMapLoader} from '@helpers'
import {useDeepEffect} from '@hooks'
import {debounce} from 'lodash'
import {FC, memo, useEffect, useRef, useState} from 'react'
import {renderToString} from 'react-dom/server'

const geocode: any = async ({maps, coordinates}) =>
  (await new maps.Geocoder().geocode({latLng: coordinates}))?.results?.find(
    ({formatted_address}: any) => formatted_address
  )

const labelInfoWindow: any = ({text, className = 'fw-bold fs-7 text-primary'}: any) =>
  renderToString(<div className={className}>{text || ''}</div>)

const addressIsUndefined: any = (geocode: any) => {
  const {address_components}: any = geocode || {}
  const address_types: any = address_components?.[0]?.types
  const res: boolean =
    address_components?.length === 1 &&
    address_types?.length === 1 &&
    address_types?.[0] === 'plus_code'
  return res
}

const defaultptions: any = {
  markerOffset: -15,
  maxZoom: 15,
  minZoom: 2,
}

let GoogleMaps: FC<any> = ({
  latitude,
  longitude,
  readOnly = false,
  onChange = () => '',
  height = '250px',
}) => {
  const {markerOffset, maxZoom, minZoom}: any = defaultptions
  const mapRef: any = useRef()
  const markerRef: any = useRef()
  const searchRef: any = useRef()
  const searchCard: any = useRef()

  const [mapCore, setMapCore] = useState<any>()
  const [mapsCore, setMapsCore] = useState<any>()
  const [markerCore, setMarkerCore] = useState<any>()
  const [circleCore, setCircleCore] = useState<any>()
  const [labelCore, setLabelCore] = useState<any>()

  const [coordinates, setCoordinates] = useState<any>({lat: 0, lng: 0})
  const [searchResult, setsearchResult] = useState<any>([])
  const [inputLoading, setInputLoading] = useState<boolean>(false)
  const [clickMyLocationLoading, setClickMyLocationLoading] = useState<boolean>(false)
  const [nearmeIsChecked, setNearmeIsChecked] = useState<boolean>(false)
  const [distance, setDistance] = useState<any>(1)

  // SET DEFAULT COORDINATES
  useEffect(() => {
    setNearmeIsChecked(false)
    if (!parseInt(latitude) || !parseInt(longitude)) {
      getClientInfo()
        .then((res: any) => {
          setCoordinates(res?.coordinates)
          onChange(res?.coordinates, res?.address_components)
        })
        .catch((err: any) => {
          setCoordinates({lat: 0, lng: 0})
          onChange({lat: 0, lng: 0}, [])
          ToastMessage({type: 'error', message: err?.message})
        })
    } else {
      setCoordinates({lat: parseFloat(latitude), lng: parseFloat(longitude)})
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [latitude, longitude])

  useDeepEffect(() => {
    if (mapRef?.current && markerRef?.current && searchRef?.current) {
      googleMapLoader
        .load()
        .then(async (google: any) => {
          const {maps} = google || {}
          setMapsCore(maps)

          // INIT MAP
          const map: any = await new maps.Map(mapRef?.current, {
            mapTypeControl: false,
            fullscreenControl: false,
            streetViewControl: false,
            scrollwheel: false,
            clickableIcons: false,
            disableDoubleClickZoom: true,
            zoomControl: !readOnly,
            draggable: !readOnly,
            keyboardShortcuts: false,
            noClear: true,
            center: {
              lat: coordinates?.lat || 0,
              lng: coordinates?.lng || 0,
            },
            zoom: coordinates?.lat && coordinates?.lng ? maxZoom : minZoom,
          })

          setMapCore(map)

          map.addListener('projection_changed', () => {
            setTimeout(() => map.panBy(0, markerOffset), 300)
          })

          // DRAW POLYGONS -> CIRCLE
          const circle: any = new maps.Circle({
            strokeColor: '#050990',
            strokeOpacity: 0.5,
            strokeWeight: 2,
            fillColor: '#050990',
            fillOpacity: 0.1,
            map: null,
            center: null,
            radius: null,
          })

          setCircleCore(circle)

          // MARKER
          const location: any = await geocode({maps, coordinates})
          const marker = await new maps.Marker({
            map,
            draggable: !readOnly,
            animation: maps.Animation.DROP,
            position: coordinates,
            optimized: true,
            zIndex: 99,
            crossOnDrag: false,
          })

          setMarkerCore(marker)

          const label: any = await new maps.InfoWindow({
            content: labelInfoWindow({text: location?.formatted_address}),
            maxWidth: 300,
            minWidth: 100,
            disableAutoPan: true,
            pixelOffset: await new maps.Size(0, 0),
          })
          await label.open({anchor: marker, map})

          setLabelCore(label)

          marker.addListener('animation_changed', async () => {
            const newLocation: any = await geocode({
              maps,
              coordinates: marker.getPosition().toJSON(),
            })
            if (addressIsUndefined(newLocation)) {
              map.setZoom(minZoom)
            } else {
              map.setZoom(maxZoom)
            }
          })

          marker.addListener('dragstart', async () => {
            setsearchResult([])
            searchRef.current.value = ''
          })

          marker.addListener('drag', () => {
            circle.setCenter(marker.getPosition().toJSON())
          })

          marker.addListener('dragend', async () => {
            const newLocation: any = await geocode({
              maps,
              coordinates: marker.getPosition().toJSON(),
            })
            label.setContent(labelInfoWindow({text: newLocation?.formatted_address}))
            map.panTo(marker.getPosition().toJSON())
            map.panBy(0, markerOffset)
            if (addressIsUndefined(newLocation) && !circle?.radius) {
              setTimeout(() => map.setZoom(minZoom), 300)
            } else if (!circle?.radius) {
              const currentZoom: any = map.getZoom() || 0
              setTimeout(() => map.setZoom(currentZoom > maxZoom ? currentZoom : maxZoom), 300)
            }
            setTimeout(() => {
              onChange(marker.getPosition().toJSON(), newLocation?.address_components)
            }, 300)
          })

          map.addListener('zoom_changed', () => {
            map.panTo(marker.getPosition().toJSON())
            map.panBy(0, markerOffset)
          })

          // INIT SEARCH UI
          if (!readOnly) {
            const options: any = {
              fields: ['formatted_address', 'geometry', 'name'],
              strictBounds: false,
            }
            map.controls[maps.ControlPosition.TOP_LEFT].push(searchCard?.current)
            const autocomplete: any = new maps.places.Autocomplete(searchRef?.current, options)
            autocomplete.bindTo('bounds', maps)
          }
        })
        .catch(() => '')
    }
  }, [coordinates])

  const onSearch = debounce(
    async ({target: {value: val}}: any) => {
      if (val && nearmeIsChecked) {
        const service: any = new mapsCore.places.PlacesService(mapCore)
        service.nearbySearch(
          {
            keyword: val,
            location: markerCore.getPosition().toJSON(),
            radius: (distance || 1) * 1000,
          },
          (res: any) => {
            const result: any = res?.map((m: any) => {
              return {
                place_id: m?.place_id,
                description: (
                  <div className=''>
                    <div className='fw-bolder text-primary mb-1'>{m?.name}</div>
                    <div className='fw-normal'>{m?.vicinity}</div>
                  </div>
                ),
              }
            })
            setsearchResult(result)
          }
        )
      } else if (val && !nearmeIsChecked) {
        const autoCompleteService: any = new mapsCore.places.AutocompleteService()
        let autoCompleteResult: any = await new Promise((resolve: any) =>
          autoCompleteService.getPlacePredictions({input: val}, (res: any) => resolve(res))
        )
        autoCompleteResult = await autoCompleteResult?.map(({place_id, description}: any) => ({
          place_id,
          description,
        }))
        setsearchResult(autoCompleteResult)
      } else {
        setsearchResult([])
      }
      setInputLoading(false)
    },
    1000,
    {leading: false, trailing: true}
  )

  const onClickSearchResult = async (place_id: any) => {
    const getCoordinatesFromPlaceId: any = (
      await new mapsCore.Geocoder().geocode({
        placeId: place_id,
      })
    )?.results?.[0]
    const latlng: any = getCoordinatesFromPlaceId?.geometry?.location?.toJSON()
    markerCore.setOptions({position: latlng})
    labelCore.setContent(labelInfoWindow({text: getCoordinatesFromPlaceId?.formatted_address}))
    setTimeout(() => {
      mapCore.panTo(latlng)
      mapCore.panBy(0, markerOffset)
      mapCore.setZoom(defaultptions?.maxZoom)
      if (nearmeIsChecked) {
        setDistance(1)
        circleCore.setOptions({
          center: latlng,
          radius: 1000,
        })
      }
      setClickMyLocationLoading(false)
    }, 300)
    setsearchResult([])
    searchRef.current.value = ''
    onChange(latlng, getCoordinatesFromPlaceId?.address_components)
  }

  const onClickNearme: any = () => {
    setsearchResult([])
    searchRef.current.value = ''
    setDistance(1)
    setNearmeIsChecked((prev: boolean) => {
      mapCore.setZoom(defaultptions?.maxZoom)
      circleCore.setOptions(
        !prev
          ? {
              map: mapCore,
              center: markerCore?.getPosition().toJSON(),
              radius: 1000,
            }
          : {map: null, center: null, radius: null}
      )

      return !prev
    })
  }

  const onDistanceChange: any = (e: any) => {
    e = parseInt(e || 1)
    setDistance(e)
    circleCore.setOptions({radius: (e || 1) * 1000})
    changeDistance(e)
  }

  const changeDistance: any = debounce(
    (e: any) => {
      let zoomLevel: any = 12
      if (e > 40) {
        zoomLevel = 9
      } else if (e > 20) {
        zoomLevel = 10
      } else if (e > 10) {
        zoomLevel = 11
      } else if (e > 5) {
        zoomLevel = 12
      } else if (e > 2) {
        zoomLevel = 13
      } else if (e === 2) {
        zoomLevel = 14
      } else if (e === 1) {
        zoomLevel = 15
      }
      mapCore.setZoom(zoomLevel)
    },
    100,
    {leading: false, trailing: true}
  )

  const goToMyLcation: any = () => {
    setClickMyLocationLoading(true)
    getClientInfo()
      .then(async (info: any) => {
        const {coordinates: latlng}: any = info || {lat: 0, lng: 0}
        const {place_id}: any = (await geocode({maps: mapsCore, coordinates: latlng})) || {}
        onClickSearchResult(place_id)
      })
      .catch((err: any) => {
        setClickMyLocationLoading(false)
        ToastMessage({type: 'error', message: err?.message})
      })
  }

  return (
    <>
      <div ref={mapRef} className='w-100' style={{height}}>
        <div ref={searchCard} className='bg-white rounded w-200px m-3 shadow'>
          <div className='d-flex justify-content-between'>
            <div
              className='d-inline-flex flex-center p-3 cursor-default w-auto cursor-default'
              onClick={goToMyLcation}
            >
              {clickMyLocationLoading ? (
                <>
                  <span className='spinner-border spinner-border-sm text-gray-500' />
                  <span className='ms-2 text-gray-500'>loading...</span>
                </>
              ) : (
                <>
                  <i className='fas fa-map-marker-alt text-danger fs-6' />
                  <div className='fw-bold ms-2'>My Location</div>
                </>
              )}
            </div>
            <div
              className='d-inline-flex flex-center p-3 cursor-default w-auto cursor-default'
              onClick={onClickNearme}
            >
              <span
                className={`btn btn-icon w-15px h-15px rounded-circle bg-${
                  nearmeIsChecked ? 'warning' : 'gray-300'
                }`}
              >
                <i className='fas fa-check text-white fs-9' />
              </span>
              <div className='fw-bold ms-2'>Near me</div>
            </div>
          </div>
          {nearmeIsChecked && (
            <div className='d-flex align-items-center justify-content-between px-3 mb-2'>
              <BasicSlider
                placement='top'
                min={1}
                max={50}
                defaultValue={1}
                value={distance}
                onChange={onDistanceChange}
              />
              <div className='fw-bold mb-2'>
                <span className='fs-5 fw-bolder'>{distance}</span> km
              </div>
            </div>
          )}
          <div className='d-flex align-items-center flex-nowrap w-100 position-relative bg-gray-100'>
            <div className='ps-3'>
              <i className='fas fa-search text-primary' />
            </div>
            <input
              className={configClass?.form}
              ref={searchRef}
              placeholder='Search location here'
              onKeyDown={(e: any) => e?.key?.toLowerCase() === 'enter' && e.preventDefault()}
              onChange={(e: any) => {
                setInputLoading(true)
                onSearch(e)
              }}
            />
            {inputLoading && (
              <div className='position-absolute end-0 pe-3'>
                <span className='spinner-border spinner-border-sm text-muted' />
              </div>
            )}
          </div>
          <div
            className='row m-0 overflow-auto'
            style={{maxHeight: nearmeIsChecked ? '125px' : '150px'}}
          >
            {searchResult?.map(({place_id, description}: any, index: number) => (
              <div
                key={index}
                className='col-12 py-2 fw-bold cursor-pointer bg-hover-gray-100 searchResult'
                onClick={() => onClickSearchResult(place_id)}
              >
                <div className='d-flex my-1'>
                  <i className='fas fa-map-marker-alt fs-6 me-2 text-danger' />
                  <div>{description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div ref={markerRef} />
      </div>
      <style>{`.gm-style-iw > button[aria-label=Close] { display: none !important; }`}</style>
    </>
  )
}

GoogleMaps = memo(
  GoogleMaps,
  (prev: any, next: any) => JSON.stringify(prev) === JSON.stringify(next)
)
export default GoogleMaps
