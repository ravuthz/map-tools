import { useEffect, useMemo, useRef } from 'react'
import maplibregl, { type LngLatLike } from 'maplibre-gl'
import MapboxDraw from '@mapbox/mapbox-gl-draw'
import DrawRectangle from 'mapbox-gl-draw-rectangle-mode'
import type { FeatureCollection } from 'geojson'
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

    map.addControl(new maplibregl.NavigationControl(), 'top-right')
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
