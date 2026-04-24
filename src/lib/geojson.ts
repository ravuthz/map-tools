import type { Feature, FeatureCollection, GeoJsonObject, Geometry, Position } from 'geojson'

function validatePosition(position: Position): string[] {
  const [lon, lat] = position
  const errors: string[] = []
  if (typeof lon !== 'number' || lon < -180 || lon > 180) {
    errors.push(`Invalid longitude: ${lon}. Must be between -180 and 180.`)
  }
  if (typeof lat !== 'number' || lat < -90 || lat > 90) {
    errors.push(`Invalid latitude: ${lat}. Must be between -90 and 90.`)
  }
  return errors
}

function walkCoords(coords: unknown, errors: string[]): void {
  if (!Array.isArray(coords)) return
  if (coords.length > 0 && typeof coords[0] === 'number') {
    errors.push(...validatePosition(coords as Position))
    return
  }
  coords.forEach((c) => walkCoords(c, errors))
}

function validateGeometry(geometry: Geometry | null, errors: string[]): void {
  if (!geometry) {
    errors.push('Geometry is null.')
    return
  }
  walkCoords((geometry as Geometry).coordinates as unknown, errors)
}

export function normalizeGeoJson(input: GeoJsonObject): FeatureCollection {
  if ('crs' in input) {
    throw new Error('GeoJSON `crs` is deprecated and not supported. Use EPSG:4326 coordinate order [longitude, latitude].')
  }

  if (input.type === 'FeatureCollection') return input

  if (input.type === 'Feature') {
    return {
      type: 'FeatureCollection',
      features: [input as Feature],
    }
  }

  throw new Error('Input must be a GeoJSON Feature or FeatureCollection.')
}

export function validateGeoJson(input: GeoJsonObject): { valid: boolean; errors: string[]; normalized?: FeatureCollection } {
  try {
    const normalized = normalizeGeoJson(input)
    const errors: string[] = []
    normalized.features.forEach((feature, index) => {
      if (feature.type !== 'Feature') {
        errors.push(`Item at index ${index} is not a Feature.`)
        return
      }
      validateGeometry(feature.geometry, errors)
    })

    return { valid: errors.length === 0, errors, normalized }
  } catch (error) {
    return { valid: false, errors: [error instanceof Error ? error.message : 'Invalid GeoJSON.'] }
  }
}

export function toFormattedGeoJson(collection: FeatureCollection): string {
  return JSON.stringify(collection, null, 2)
}

export const sampleGeoJson: FeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { id: 1, name: 'Point' },
      geometry: { type: 'Point', coordinates: [103.851959, 1.29027] },
    },
    {
      type: 'Feature',
      properties: { id: 2, name: 'LineString' },
      geometry: {
        type: 'LineString',
        coordinates: [
          [-41.40338, 0],
          [-20, 5],
          [0, 10],
          [20, 15],
        ],
      },
    },
    {
      type: 'Feature',
      properties: { id: 3, name: 'Polygon' },
      geometry: {
        type: 'Polygon',
        coordinates: [[[-30, 40], [-10, 30], [0, 40], [-10, 50], [-30, 40]]],
      },
    },
  ],
}
