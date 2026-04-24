import { useEffect, useMemo, useRef } from 'react'
import maplibregl, { type LngLatLike } from 'maplibre-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import DrawRectangle from 'mapbox-gl-draw-rectangle-mode'
import type { FeatureCollection } from 'geojson'
import { toast } from 'sonner'
import 'maplibre-gl/dist/maplibre-gl.css'
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import type { DrawMode } from '@/types/geojson'

interface MapDrawProps {
  mode: DrawMode
  featureCollection: FeatureCollection
  onChange: (fc: FeatureCollection) => void
  drawRef: React.MutableRefObject<MapboxDraw | null>
}

const STYLE = 'https://demotiles.maplibre.org/style.json'

function createSearchControl(): maplibregl.IControl {
  let container: HTMLDivElement | undefined

  function searchCoordinates(map: maplibregl.Map) {
    const query = window.prompt('Search coordinates (longitude, latitude):')
    if (!query) return

    const [lng, lat] = query
      .trim()
      .split(/[,\s]+/)
      .map(Number)

    if (!Number.isFinite(lng) || !Number.isFinite(lat) || lng < -180 || lng > 180 || lat < -90 || lat > 90) {
      toast.error('Enter coordinates as longitude, latitude.')
      return
    }

    map.flyTo({
      center: [lng, lat],
      zoom: Math.max(map.getZoom(), 12),
      essential: true,
    })
  }

  return {
    onAdd(map) {
      container = document.createElement('div')
      container.className = 'maplibregl-ctrl maplibregl-ctrl-group map-tools-search-control'

      const button = document.createElement('button')
      button.type = 'button'
      button.className = 'map-tools-search-button'
      button.title = 'Search coordinates'
      button.setAttribute('aria-label', 'Search coordinates')
      button.addEventListener('click', () => searchCoordinates(map))

      const icon = document.createElement('span')
      icon.className = 'map-tools-search-icon'
      icon.setAttribute('aria-hidden', 'true')
      button.appendChild(icon)

      container.appendChild(button)
      return container
    },
    onRemove() {
      container?.parentNode?.removeChild(container)
    },
  }
}

export function MapDraw({ mode, featureCollection, onChange, drawRef }: MapDrawProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)

  const startCenter = useMemo<LngLatLike>(() => [0, 20], [])

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: STYLE,
      center: startCenter,
      zoom: 1.6,
    })

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: { trash: false },
      modes: {
        ...MapboxDraw.modes,
        draw_rectangle: DrawRectangle,
      },
      defaultMode: 'simple_select',
    })

    map.addControl(createSearchControl(), 'top-right')
    map.addControl(new maplibregl.NavigationControl(), 'top-right')
    map.addControl(
      new maplibregl.GeolocateControl({
        positionOptions: { enableHighAccuracy: true },
        fitBoundsOptions: { maxZoom: 16 },
        trackUserLocation: true,
        showAccuracyCircle: true,
        showUserLocation: true,
      }),
      'top-right',
    )
    map.addControl(draw as unknown as maplibregl.IControl, 'top-right')

    map.on('draw.create', () => onChange(draw.getAll() as FeatureCollection))
    map.on('draw.update', () => onChange(draw.getAll() as FeatureCollection))
    map.on('draw.delete', () => onChange(draw.getAll() as FeatureCollection))

    drawRef.current = draw
    mapRef.current = map

    return () => {
      map.remove()
      drawRef.current = null
      mapRef.current = null
    }
  }, [drawRef, onChange, startCenter])

  useEffect(() => {
    const draw = drawRef.current
    if (!draw) return
    const idSet = new Set(draw.getAll().features.map((f) => f.id))
    featureCollection.features.forEach((feature) => {
      if (!idSet.has(feature.id)) draw.add(feature)
    })
  }, [featureCollection, drawRef])

  useEffect(() => {
    const draw = drawRef.current
    if (!draw) return
    const modeMap: Record<DrawMode, string> = {
      select: 'simple_select',
      point: 'draw_point',
      line_string: 'draw_line_string',
      polygon: 'draw_polygon',
      rectangle: 'draw_rectangle',
    }
    draw.changeMode(modeMap[mode])
  }, [mode, drawRef])

  return <div ref={mapContainer} className="h-full w-full rounded-xl" />
}
