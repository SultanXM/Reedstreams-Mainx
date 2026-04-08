// ============================================
// ADMIN API - Default Source Management
// ============================================

const API_BASE = '/api'

export interface DefaultSourceSetting {
  id: number
  source_name: string
  is_default: boolean
  priority: number
  is_active: boolean
}

export interface DefaultSourceResponse {
  default_source: string | null
  all_sources: DefaultSourceSetting[]
}

/**
 * Get current default source and all available sources
 * GET /api/admin/default-source
 */
export async function getDefaultSource(): Promise<DefaultSourceResponse> {
  try {
    const res = await fetch(`${API_BASE}/admin/default-source`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!res.ok) {
      console.warn('Failed to fetch default source, returning empty response')
      return { default_source: null, all_sources: [] }
    }
    return res.json()
  } catch (error) {
    console.warn('Error fetching default source:', error)
    return { default_source: null, all_sources: [] }
  }
}

/**
 * Get list of all source settings (including inactive)
 * GET /api/admin/default-source/list
 */
export async function getAllSources(): Promise<DefaultSourceSetting[]> {
  try {
    const res = await fetch(`${API_BASE}/admin/default-source/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (!res.ok) {
      console.warn('Failed to fetch sources, returning empty array')
      return []
    }
    return res.json()
  } catch (error) {
    console.warn('Error fetching sources:', error)
    return []
  }
}

/**
 * Update default source setting
 * PUT /api/admin/default-source
 */
export async function updateDefaultSource(params: {
  source_name: string
  is_default: boolean
  priority?: number
  is_active?: boolean
}): Promise<DefaultSourceSetting | null> {
  try {
    const res = await fetch(`${API_BASE}/admin/default-source`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    })
    if (!res.ok) {
      console.warn('Failed to update default source')
      return null
    }
    return res.json()
  } catch (error) {
    console.warn('Error updating default source:', error)
    return null
  }
}
