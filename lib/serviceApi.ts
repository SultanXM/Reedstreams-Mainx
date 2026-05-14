export const SERVICE_API_BASE =
  process.env.NEXT_PUBLIC_SERVICE_API_URL ||
  process.env.NEXT_PUBLIC_STREAM_API_URL ||
  process.env.NEXT_PUBLIC_VIEW_API ||
  'http://api.reedstreams.live'
