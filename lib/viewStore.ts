// Global View Store - Shared across API routes
// In production, replace this with Redis or a database

type ViewStore = Map<string, Set<string>>;

// Use global to persist across hot reloads and route modules
declare global {
  var __VIEW_STORE__: ViewStore | undefined;
}

// Initialize or reuse existing store
const viewStore: ViewStore = global.__VIEW_STORE__ || new Map<string, Set<string>>();

// Save reference to global for persistence
global.__VIEW_STORE__ = viewStore;

export default viewStore;
