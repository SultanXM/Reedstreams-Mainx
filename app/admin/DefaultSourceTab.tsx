'use client'

import { useState, useEffect } from 'react'
import { DefaultSourceSetting, getDefaultSource, getAllSources, updateDefaultSource } from '../../lib/admin'
import styles from './AdminPage.module.css'

interface DefaultSourceTabProps {
  token: string
  showMessage: (msg: string, isError?: boolean) => void
}

export default function DefaultSourceTab({ token, showMessage }: DefaultSourceTabProps) {
  const [loading, setLoading] = useState(true)
  const [sources, setSources] = useState<DefaultSourceSetting[]>([])
  const [defaultSource, setDefaultSource] = useState<string | null>(null)
  const [saving, setSaving] = useState<string | null>(null)
  const [resetting, setResetting] = useState(false)

  useEffect(() => {
    loadSources()
  }, [])

  const loadSources = async () => {
    setLoading(true)
    try {
      const response = await getDefaultSource()
      let allSources = response.all_sources || []

      // If no sources returned, try the list endpoint as fallback
      if (allSources.length === 0) {
        try {
          allSources = await getAllSources()
        } catch {
          // If list endpoint also fails, sources are truly empty
        }
      }

      setSources(allSources)
      setDefaultSource(response.default_source)
    } catch (err: any) {
      showMessage(err.message || 'Failed to load sources', true)
    } finally {
      setLoading(false)
    }
  }

  const handleResetSources = async () => {
    if (!confirm('Reset all sources to active? This will reactivate every source.')) return
    setResetting(true)
    try {
      // Reactivate all known sources
      const knownSources = ['echo', 'streamtape', 'filemoon', 'mp4upload', 'doodstream', 'voe', 'streamwish']
      for (const src of knownSources) {
        try {
          await updateDefaultSource({ source_name: src, is_default: false, is_active: true })
        } catch {
          // Source might not exist yet, skip
        }
      }
      showMessage('All sources reset to active!')
      loadSources()
    } catch (err: any) {
      showMessage(err.message || 'Failed to reset sources', true)
    } finally {
      setResetting(false)
    }
  }

  const handleSetDefault = async (sourceName: string) => {
    if (sourceName === defaultSource) return
    setSaving(sourceName)
    try {
      await updateDefaultSource({ source_name: sourceName, is_default: true })
      setSources(prev => prev.map(s => ({ ...s, is_default: s.source_name === sourceName })))
      setDefaultSource(sourceName)
      showMessage(`Default source set to ${sourceName.toUpperCase()}`)
    } catch (err: any) {
      showMessage(err.message || 'Failed to update default source', true)
    } finally {
      setSaving(null)
    }
  }

  const handleToggleActive = async (source: DefaultSourceSetting) => {
    setSaving(source.source_name)
    try {
      await updateDefaultSource({
        source_name: source.source_name,
        is_default: source.is_default,
        is_active: !source.is_active,
      })
      setSources(prev => prev.map(s => ({
        ...s,
        is_active: s.source_name === source.source_name ? !s.is_active : s.is_active
      })))
      showMessage(`Source ${source.source_name.toUpperCase()} ${!source.is_active ? 'activated' : 'deactivated'}`)
    } catch (err: any) {
      showMessage(err.message || 'Failed to update source', true)
    } finally {
      setSaving(null)
    }
  }

  if (loading) {
    return <div className={styles.emptyState}>Loading source settings...</div>
  }

  return (
    <>
      {sources.length === 0 ? (
        <div className={styles.emptyState}>
          <p>No sources found. All sources may be deactivated.</p>
          <button
            onClick={handleResetSources}
            disabled={resetting}
            className={styles.actionButton}
            style={{ marginTop: '12px' }}
          >
            {resetting ? 'Resetting...' : 'Reset All Sources'}
          </button>
        </div>
      ) : (
        <div className={styles.listContainer}>
          {sources.map((source) => (
            <div
              key={source.id}
              className={`${styles.itemCard} ${source.is_default ? styles.itemCardDefault : ''} ${!source.is_active ? styles.itemCardInactive : ''}`}
            >
              <div className={styles.itemRow}>
                <div className={styles.itemInfo}>
                  <div className={styles.usernameRow}>
                    <span className={styles.sourceLabel}>{source.source_name.toUpperCase()}</span>
                    {source.is_default && (
                      <span className={styles.badgeDefault}>DEFAULT</span>
                    )}
                    {!source.is_active && (
                      <span className={styles.badgeInactive}>INACTIVE</span>
                    )}
                  </div>
                  <p className={styles.itemSubtext}>
                    Priority: {source.priority} · Status: {source.is_active ? 'Active' : 'Inactive'}
                  </p>
                </div>

                <div className={styles.itemActions}>
                  <button
                    onClick={() => handleSetDefault(source.source_name)}
                    disabled={source.is_default || saving === source.source_name || !source.is_active}
                    className={`${styles.btnSmall} ${source.is_default ? styles.btnSmallActive : ''}`}
                  >
                    {saving === source.source_name ? 'Saving...' : source.is_default ? 'Current Default' : 'Set Default'}
                  </button>
                  <button
                    onClick={() => handleToggleActive(source)}
                    disabled={saving === source.source_name}
                    className={`${styles.btnSmall} ${source.is_active ? styles.btnTimeout : styles.btnUnban}`}
                  >
                    {source.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
