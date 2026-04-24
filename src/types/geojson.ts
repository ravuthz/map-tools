import type { Feature, FeatureCollection, Geometry } from 'geojson'

export type DrawFeature = Feature<Geometry, Record<string, unknown>>
export type DrawFeatureCollection = FeatureCollection<Geometry, Record<string, unknown>>

export type DrawMode = 'select' | 'point' | 'line_string' | 'polygon' | 'rectangle'
export type ToggleStyle = 'icon-only' | 'sidebar'
export type ToolButtonLayout = 'horizontal' | 'vertical'
