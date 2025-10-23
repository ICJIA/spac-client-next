# Caching System Clarification

**📅 Last Updated**: October 23, 2025

## Overview

The SPAC application uses a **session-only in-memory caching system** to optimize performance. This document clarifies what this means and provides important context about the system.

## Key Points

### ⚠️ Session-Only (NOT Persistent)

The cache is **NOT persistent** across:
- ❌ Page reloads (F5, Cmd+R)
- ❌ New browser tabs
- ❌ New browser sessions
- ❌ Closing and reopening the browser
- ❌ Navigating away and returning later

### ✅ What IS Cached

The cache persists **only** for:
- ✅ Repeated page lookups within the same browser session
- ✅ Navigation between pages without reloading
- ✅ The duration of the current browser tab

## Purpose

This custom caching system was implemented to **optimize repeated page lookups within a single session**. The goal was to:

1. Reduce redundant API calls when users revisit pages
2. Provide faster navigation within a browsing session
3. Minimize network traffic for repeated queries

## Historical Context

At the time this caching system was implemented, **Apollo GraphQL did not have robust caching features**. Since then, Apollo Client has evolved significantly and now includes:

- Sophisticated query result caching
- Automatic cache updates
- Persistent cache options
- Advanced cache management

However, this custom system remains in place and continues to provide session-level performance optimization for repeated content access.

## How It Works

### Cache Lifecycle

```
User opens browser
    ↓
Page loads (cache is empty)
    ↓
First query hits API, result is cached
    ↓
User navigates to another page
    ↓
Same query is found in cache (no API call)
    ↓
User reloads page
    ↓
Cache is cleared (empty again)
    ↓
First query hits API again
```

### Implementation Details

- **Storage**: JavaScript `Map` in Vuex state (memory only)
- **Keys**: MD5 hashes of query identifiers
- **Scope**: Per browser tab
- **Lifetime**: Duration of browser session

## Benefits

1. **Reduced API Calls**: Identical queries within a session only hit the API once
2. **Faster Navigation**: Cached data loads instantly when revisiting pages
3. **Parallel Requests**: Multiple uncached queries execute in parallel
4. **Efficient**: Minimal memory overhead for typical usage

## Limitations

1. **No Cross-Session Persistence**: Cache is lost on page reload
2. **Memory-Based Only**: No persistent storage (localStorage, IndexedDB, etc.)
3. **Single Tab Only**: Each browser tab has its own independent cache
4. **Session-Specific**: Only useful for repeated lookups within a single session

## For Developers

### When Testing

- Keep the page open and navigate without reloading to see cache benefits
- Page reloads will clear the cache (expected behavior)
- Each new tab starts with an empty cache

### When Debugging

- Enable debug mode in `src/config.json` to see cache operations
- Check browser console for cache performance metrics
- Remember: First page load will always hit the API

### When Extending

- The caching system is transparent to components
- Add new queries following the existing pattern
- Cache invalidation happens automatically on app initialization

## Manual Cache Clearing

```javascript
// Clear all cached content
this.$store.commit("CLEAR_CACHE");

// Clear localStorage route tracking
this.$store.commit("CLEAR_LOCAL_STORAGE");
```

Use cases:
- After backend content updates
- When user explicitly requests a refresh
- During development/testing

## Future Considerations

If persistent caching is needed in the future, consider:
- Upgrading to Apollo Client's built-in caching
- Implementing localStorage-based persistence
- Using IndexedDB for larger datasets
- Implementing service worker caching

---

**Summary**: This is a session-only, in-memory caching system designed to optimize repeated page lookups within a single browsing session. It is not persistent and is cleared on page reload or new browser sessions.

