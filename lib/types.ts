export interface Sport {
  id: string
  name: string
}

export interface Team {
  name: string
  badge?: string
}

export interface Match {
  id: string
  title: string
  date: string
  competition?: string
  stadium?: string
  teams?: {
    home?: Team
    away?: Team
  }
  sources?: Array<{
    source: string
    id: string
  }>
}

export interface Stream {
  embedUrl: string
  streamNo: number
  language: string
  hd: boolean
  sourceIdentifier?: string
}