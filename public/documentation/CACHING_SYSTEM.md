# Custom Caching System Documentation

## Overview

The SPAC application implements a custom, in-memory caching system built on top of Vuex (Vue's state management library). This system efficiently manages API responses to minimize redundant network requests and improve application performance.

## Architecture

### Core Components

The caching system consists of three main components:

1. **Vuex Store** (`src/store.js`) - Central state management
2. **Content Service** (`src/services/Content.js`) - GraphQL API interface
3. **View Components** - Components that request cached content

### How It Works

```
View Component
    ↓
    ├─→ Creates contentMap (Map of queries to fetch)
    ├─→ Calls store.dispatch("cacheContent", contentMap)
    ↓
Vuex Store (cacheContent action)
    ├─→ Checks if each query is already cached (by hash)
    ├─→ Only fetches uncached queries from API
    ├─→ Stores results in cache Map
    ↓
View Component
    ├─→ Retrieves cached content via getContentFromCache getter
    ├─→ Renders data to user
```

## Implementation Details

### Cache Key Generation

Cache keys are generated using MD5 hashes of query identifiers:

```javascript
import { getHash } from "@/services/Utilities";

const queryName = "getNews";
const hash = getHash(queryName); // Returns MD5 hash
```

**Location:** `src/services/Utilities.js` - `getHash()` function

### Cache Storage

The cache is stored as a JavaScript `Map` in the Vuex state:

```javascript
// In src/store.js state
cache: new Map()
```

**Key:** MD5 hash of query identifier  
**Value:** API response data (array or object)

### Cache Mutations

#### SET_CACHE
Stores a query result in the cache:

```javascript
// Mutation
SET_CACHE(state, { hash, query }) {
  state.cache.set(hash, query);
}
```

#### CLEAR_CACHE
Clears all cached data:

```javascript
// Mutation
CLEAR_CACHE(state) {
  state.cache.clear();
}
```

### Cache Actions

#### cacheContent
Main action for fetching and caching content:

```javascript
async cacheContent({ commit, state, getters }, contentMap)
```

**Parameters:**
- `contentMap` (Map): Map of query configurations

**contentMap Structure:**
```javascript
const contentMap = new Map();
contentMap.set("queryName", {
  hash: getHash("queryName"),
  query: queryFunction,
  params: { /* query parameters */ }
});
```

**Returns:**
```javascript
{
  itemsCached: number,           // Items fetched in this call
  totalCacheSize: number,        // Total items in cache
  millisecondsToComplete: number, // Time taken
  previouslyCached: boolean      // Whether items were already cached
}
```

### Cache Getters

#### inCache
Checks if a query result is cached:

```javascript
getters.inCache(hash) // Returns boolean
```

#### getContentFromCache
Retrieves cached content:

```javascript
getters.getContentFromCache(contentMap, key)
```

**Parameters:**
- `contentMap` (Map): The same map used in cacheContent
- `key` (string): The key used when setting the map entry

**Returns:** Cached data or empty array if not found

## Usage Patterns

### Basic Usage Example

```javascript
// In a Vue component
async fetchContent() {
  this.loading = true;

  // 1. Create content map
  const contentMap = new Map();
  const newsName = "getNews";
  contentMap.set(newsName, {
    hash: getHash(newsName),
    query: getAllNews,
    params: {}
  });

  // 2. Dispatch caching action
  await this.$store.dispatch("cacheContent", contentMap);

  // 3. Retrieve from cache
  this.news = this.$store.getters.getContentFromCache(
    contentMap,
    newsName
  );

  this.loading = false;
}
```

### Multiple Queries Example

```javascript
const contentMap = new Map();

// Add first query
contentMap.set("getNews", {
  hash: getHash("getNews"),
  query: getAllNews,
  params: {}
});

// Add second query
contentMap.set("getPublications", {
  hash: getHash("getPublications"),
  query: getAllPublications,
  params: {}
});

// Fetch both (only uncached ones hit the API)
await this.$store.dispatch("cacheContent", contentMap);

// Retrieve both
const news = this.$store.getters.getContentFromCache(contentMap, "getNews");
const publications = this.$store.getters.getContentFromCache(
  contentMap,
  "getPublications"
);
```

### Parameterized Queries Example

```javascript
const contentMap = new Map();
const slug = "my-page";
const queryName = `getPage-${slug}`;

contentMap.set(queryName, {
  hash: getHash(queryName),
  query: getPage,
  params: { slug }
});

await this.$store.dispatch("cacheContent", contentMap);
const page = this.$store.getters.getContentFromCache(contentMap, queryName);
```

## Cache Invalidation

### Current Strategy

The caching system uses a **session-based cache invalidation** strategy:

- Cache persists for the duration of the user's session
- Cache is cleared when the app initializes via `initApp` action
- Manual cache clearing available via `CLEAR_CACHE` mutation

### Clearing Cache

```javascript
// Clear all cached content
this.$store.commit("CLEAR_CACHE");

// Clear localStorage route tracking
this.$store.commit("CLEAR_LOCAL_STORAGE");
```

## Performance Considerations

### Benefits

1. **Reduced API Calls:** Identical queries within a session only hit the API once
2. **Faster Navigation:** Cached data loads instantly on revisits
3. **Parallel Requests:** Multiple uncached queries execute in parallel via `Promise.all()`
4. **Debug Logging:** Optional debug output shows cache performance metrics

### Enabling Debug Mode

Set `debug: true` in `src/config.json`:

```json
{
  "debug": true
}
```

This logs cache operations to the browser console.

## Common Patterns in Views

Most view components follow this pattern:

1. **News.vue** - Fetches all news
2. **Publications.vue** - Fetches all publications
3. **MeetingsSingle.vue** - Fetches single meeting by slug
4. **TagsSingle.vue** - Fetches content by tag
5. **Home.vue** - Fetches multiple content types

All use the same caching mechanism with different query functions.

## Extending the Caching System

### Adding a New Cached Query

1. Create query function in `src/services/Content.js`
2. In your component, create a contentMap entry
3. Call `cacheContent` action
4. Retrieve with `getContentFromCache` getter

Example:

```javascript
// In Content.js
const getMyData = async ({ param }) => {
  try {
    const data = await queryEndpoint(getMyDataQuery(param));
    return data.data.data.myData;
  } catch (e) {
    EventBus.$emit("contentServiceError", e.toString());
    return [];
  }
};

// In your component
const contentMap = new Map();
contentMap.set("myData", {
  hash: getHash("myData"),
  query: getMyData,
  params: { param: "value" }
});

await this.$store.dispatch("cacheContent", contentMap);
const myData = this.$store.getters.getContentFromCache(contentMap, "myData");
```

## Troubleshooting

### Data Not Appearing

1. Check browser console for errors
2. Verify query function returns data in expected format
3. Ensure hash is correctly generated
4. Check that contentMap key matches retrieval key

### Cache Not Working

1. Verify `cacheContent` action completes
2. Check that `inCache` getter returns true for subsequent calls
3. Enable debug mode to see cache operations

### Performance Issues

1. Check API response times
2. Monitor cache size in debug output
3. Consider implementing cache size limits if needed

