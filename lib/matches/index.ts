export type {
  APIMatch,
  Stream,
  Sport,
  MatchStatus,
  MatchWithStatus,
  MatchFilter,
} from './service'

export {
  fetchSports,
  fetchMatchesBySport,
  fetchAllMatches,
  fetchLiveMatches,
  fetchPopularMatches,
  fetchStreams,
  getTeamBadgeUrl,
  getPosterUrl,
  addMatchStatus,
  filterMatches,
} from './service'

export { MatchesProvider, useMatches, MatchesContext } from './provider'
