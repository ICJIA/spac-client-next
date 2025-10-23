# SPAC Client Website - Project Documentation

**📅 Last Updated**: October 23, 2025

## Project Overview

### Repository Information
- **Repository**: [ICJIA/spac-client-next](https://github.com/ICJIA/spac-client-next)
- **Live URL**: [https://spac.illinois.gov](https://spac.illinois.gov)
- **Project Name**: spac-client-next-prod
- **Version**: 0.1.0

### Purpose and Goals
The SPAC (Illinois Sentencing Policy Advisory Council) client website is a Vue.js-based frontend application that serves as the public-facing website for SPAC. The site provides access to publications, news/announcements, meeting information, and other resources related to sentencing policy in Illinois.

SPAC was created to collect, analyze and present data from all relevant sources to more accurately determine the consequences of sentencing policy decisions and to review the effectiveness and efficiency of current sentencing policies and practices. SPAC reports directly to the Governor and the General Assembly.

### Key Features
- **Publications Management**: Categorized publications with search and filtering capabilities
- **News/Announcements**: Latest updates and announcements from SPAC
- **Meeting Information**: Council meetings, archives, and upcoming events
- **Search Functionality**: Full-text search across all content types using Fuse.js
- **Responsive Design**: Mobile-first design using Vuetify framework
- **Content Management**: Dynamic content served from Strapi CMS backend
- **SEO Optimization**: Automated sitemap generation and meta tag management

### Project History
- Built as a Vue.js 2.x application with Vuetify UI framework
- Deployed on Netlify with serverless functions
- Uses Strapi CMS as backend content management system
- Implements custom build process for search indexing and sitemap generation

## Technology Stack

### Core Framework
- **Vue.js**: 2.6.12 (main frontend framework)
- **Vue Router**: 3.4.3 (client-side routing)
- **Vuex**: 3.5.1 (state management)
- **Vue CLI**: 4.5.6 (build tooling and development server)

### UI Framework & Styling
- **Vuetify**: 2.4.3 (Material Design component framework)
- **Material Design Icons**: @mdi/font 5.6.55
- **Sass**: ~1.32.0 (CSS preprocessing)
- **Node Sass**: 4.9.0

### Content Management & Data
- **Strapi CMS**: Backend content management (external API)
- **GraphQL**: Data querying with graphql-request 1.8.2
- **Axios**: 0.19.0 (HTTP client for API requests)
- **Markdown-it**: 10.0.0 (markdown processing with plugins)

### Build Tools & Development
- **Vue CLI Service**: 4.5.6 (build system and dev server)
- **Babel**: ES6+ transpilation with babel-polyfill
- **ESLint**: 6.7.2 (code linting with Prettier integration)
- **Webpack**: Bundling (via Vue CLI)

### Search & Utility Libraries
- **Fuse.js**: 3.4.6 (fuzzy search functionality)
- **Lodash**: 4.17.15 (utility functions)
- **Moment.js**: 2.24.0 (date manipulation)
- **Crypto-js**: 3.1.9-1 (cryptographic functions)

### Analytics & Monitoring
- **Vue Analytics**: 5.22.1 (Google Analytics integration)
- **Google Analytics ID**: UA-150580082-1
- **NProgress**: 0.2.0 (loading progress indicators)

### Deployment & Hosting
- **Netlify**: Primary hosting platform with CDN
- **Netlify Functions**: Serverless backend functions
- **Netlify Lambda**: 1.6.3 (local development of functions)
- **Domain**: spac.illinois.gov (custom domain)

## Architecture Overview

### High-Level Architecture
The SPAC website follows a JAMstack architecture pattern:

1. **Frontend**: Vue.js SPA with static generation capabilities
2. **Backend**: Headless Strapi CMS providing GraphQL API
3. **Build Process**: Custom scripts for search indexing and sitemap generation
4. **Deployment**: Netlify with automated builds and serverless functions
5. **Content Delivery**: Global CDN with edge caching

### Data Flow Patterns
1. **Content Fetching**: GraphQL queries to Strapi CMS during build time
2. **Search Index**: Pre-built JSON index for client-side search
3. **Routing**: Client-side routing with dynamic route generation
4. **State Management**: Centralized Vuex store for application state
5. **Caching**: Local storage for route referrers and content caching

### Key Design Patterns
- **Component-Based Architecture**: Reusable Vue components with clear separation of concerns
- **Service Layer Pattern**: Dedicated service modules for API interactions and utilities
- **Event Bus Pattern**: Global event communication between components
- **Configuration-Driven**: JSON configuration for enums, categories, and settings
- **Progressive Enhancement**: Core functionality works without JavaScript

### Integration Points
- **Strapi CMS API**: GraphQL endpoint for content management
- **Google Analytics**: User behavior tracking and analytics
- **Thumbor Image Service**: Dynamic image resizing and optimization
- **Archive Server**: External document archive integration
- **Social Media**: LinkedIn and X/Twitter integration

## Directory Structure

```
spac-client-next/
├── public/                     # Static assets and build output
│   ├── index.html             # Main HTML template
│   ├── sitemap.xml            # Generated sitemap
│   └── robots.txt             # Search engine directives
├── src/                       # Source code
│   ├── api/                   # Generated API data
│   │   ├── routes.json        # Generated routes for sitemap
│   │   └── searchIndex.json   # Generated search index
│   ├── assets/                # Static assets (images, fonts)
│   │   └── img/               # Image assets
│   ├── components/            # Vue components
│   │   ├── App*.vue           # Layout components (Nav, Footer, Drawer)
│   │   ├── Base*.vue          # Base/utility components
│   │   ├── Home*.vue          # Homepage-specific components
│   │   ├── List*.vue          # List/table components
│   │   └── *.vue              # Feature-specific components
│   ├── css/                   # Global styles
│   │   └── app.css            # Main stylesheet
│   ├── lambda/                # Netlify function source
│   │   └── *.js               # Serverless function handlers
│   ├── mixins/                # Vue mixins
│   │   └── handleClicks.js    # Click handling utilities
│   ├── plugins/               # Vue plugins
│   │   └── vuetify.js         # Vuetify configuration
│   ├── sass/                  # Sass stylesheets
│   │   └── main.scss          # Main Sass file
│   ├── services/              # Service layer
│   │   ├── Content.js         # Content API service
│   │   ├── Search.js          # Search functionality
│   │   ├── Utilities.js       # Utility functions
│   │   └── *.js               # Other services
│   ├── views/                 # Page components
│   │   ├── Home.vue           # Homepage
│   │   ├── News*.vue          # News/announcements pages
│   │   ├── Publications*.vue  # Publications pages
│   │   ├── Meetings*.vue      # Meetings pages
│   │   └── *.vue              # Other page components
│   ├── config.json            # Application configuration
│   ├── main.js                # Application entry point
│   ├── router.js              # Vue Router configuration
│   └── store.js               # Vuex store configuration
├── netlify/                   # Netlify function builds
│   └── *.js                   # Compiled serverless functions
├── buildSearchIndex.js        # Search index generation script
├── buildSitemap.js            # Sitemap generation script
├── package.json               # Dependencies and scripts
├── vue.config.js              # Vue CLI configuration
├── netlify.toml               # Netlify deployment configuration
├── audit-log.md               # Project change log
├── audit-log-prompt.md        # Audit log template
└── .env.sample                # Environment variables template
```

### Key Configuration Files
- **package.json**: Dependencies, scripts, and project metadata
- **vue.config.js**: Vue CLI and Vuetify configuration
- **src/config.json**: Application settings, API endpoints, and enums
- **netlify.toml**: Deployment and function configuration
- **.env**: Environment variables (not in repository)

### Generated vs Source Files
- **Generated**: `src/api/`, `public/sitemap.xml`, `netlify/` functions
- **Source**: All other files in `src/`, build scripts, configuration files
- **Build Output**: `dist/` directory (created during build, not in repository)

## Key Components

### Layout Components
- **App.vue**: Main application wrapper with navigation, drawer, and footer
- **AppNav.vue**: Primary navigation bar with responsive design and dropdown menus
- **AppFooter.vue**: Site footer with links, social media icons, and branding
- **AppDrawer.vue**: Mobile navigation drawer with site sections
- **Breadcrumb.vue**: Dynamic breadcrumb navigation based on current route

### Content Components
- **BaseContent.vue**: Wrapper component for page content with loading states
- **BaseList.vue**: Reusable list component for displaying collections
- **NewsCard.vue**: Individual news/announcement item display
- **PublicationCard.vue**: Publication item with metadata and download links
- **MeetingCard.vue**: Meeting information display with dates and details
- **BiographyCard.vue**: Council member biography display

### Page Components
- **Home.vue**: Homepage with featured content sections
- **Section.vue**: Generic section page with dynamic content
- **Page.vue**: Individual page component with table of contents
- **News.vue**: News archive listing with pagination
- **Publications.vue**: Publications listing with category filtering
- **Meetings.vue**: Meetings listing with category and date filtering
- **Search.vue**: Search results page with filtering options

### Utility Components
- **Search.vue**: Global search functionality with autocomplete
- **SearchMini.vue**: Compact search component for mobile
- **TagList.vue**: Tag display with custom label mapping
- **TOC.vue**: Table of contents generator for long content
- **Loader.vue**: Loading spinner component
- **Toggle.vue**: Generic toggle/switch component

### State Management Components
- **store.js**: Centralized Vuex store with modules for:
  - Application state (loading, sections, search index)
  - Configuration management
  - API status monitoring
  - Content caching

## API Documentation

### External API Integrations

#### Strapi CMS GraphQL API
- **Endpoint**: Configured in `src/config.json` as `baseURL`
- **Authentication**: None required for public content
- **Query Types**: Pages, News/Posts, Publications, Meetings, Biographies, Sections, Tags

**Example Query Structure**:
```graphql
{
  pages(where: {isPublished: true}) {
    title
    slug
    content
    summary
    searchMeta
    section {
      title
      slug
    }
    tags {
      name
      slug
    }
  }
}
```

#### Content Types and Endpoints
1. **Pages**: `/pages` - Static content pages with sections
2. **News/Posts**: `/posts` - News articles and announcements
3. **Publications**: `/publications` - Research reports and documents
4. **Meetings**: `/meetings` - Council meetings and archives
5. **Biographies**: `/biographies` - Council member profiles
6. **Sections**: `/sections` - Site navigation sections
7. **Tags**: `/tags` - Content categorization tags

### Data Processing Workflows

#### Search Index Generation (`buildSearchIndex.js`)
1. Fetches all published content from Strapi GraphQL API
2. Processes content for search optimization
3. Generates `src/api/searchIndex.json` for client-side search
4. Includes metadata, titles, summaries, and searchable content

#### Sitemap Generation (`buildSitemap.js`)
1. Fetches all published content with URLs and update dates
2. Generates route mappings based on content categories
3. Creates `src/api/routes.json` for dynamic routing
4. Outputs `public/sitemap.xml` for search engines

#### Content Caching Strategy
- **Local Storage**: Route referrers and user preferences
- **Vuex Store**: Application state and content cache
- **Build-time Caching**: Pre-generated search index and routes
- **CDN Caching**: Netlify edge caching for static assets

## Custom Caching System

### Overview

The SPAC application implements a sophisticated, in-memory caching system built on top of Vuex (Vue's state management library). This system efficiently manages API responses to minimize redundant network requests and improve application performance.

### Architecture

The caching system consists of three main components:

1. **Vuex Store** (`src/store.js`) - Central state management with cache storage
2. **Content Service** (`src/services/Content.js`) - GraphQL API interface with query functions
3. **View Components** - Components that request cached content

### How the Caching System Works

```
View Component
    ↓
    ├─→ Creates contentMap (Map of queries to fetch)
    ├─→ Calls store.dispatch("cacheContent", contentMap)
    ↓
Vuex Store (cacheContent action)
    ├─→ Checks if each query is already cached (by MD5 hash)
    ├─→ Only fetches uncached queries from API
    ├─→ Stores results in cache Map
    ↓
View Component
    ├─→ Retrieves cached content via getContentFromCache getter
    ├─→ Renders data to user
```

### Cache Key Generation

Cache keys are generated using MD5 hashes of query identifiers:

```javascript
import { getHash } from "@/services/Utilities";

const queryName = "getNews";
const hash = getHash(queryName); // Returns MD5 hash
```

**Location**: `src/services/Utilities.js` - `getHash()` function

### Cache Storage

The cache is stored as a JavaScript `Map` in the Vuex state:

```javascript
// In src/store.js state
cache: new Map()
```

- **Key**: MD5 hash of query identifier
- **Value**: API response data (array or object)

### Core Cache Operations

#### SET_CACHE Mutation
Stores a query result in the cache:

```javascript
SET_CACHE(state, { hash, query }) {
  state.cache.set(hash, query);
}
```

#### CLEAR_CACHE Mutation
Clears all cached data:

```javascript
CLEAR_CACHE(state) {
  state.cache.clear();
}
```

#### cacheContent Action
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

#### inCache Getter
Checks if a query result is cached:

```javascript
getters.inCache(hash) // Returns boolean
```

#### getContentFromCache Getter
Retrieves cached content:

```javascript
getters.getContentFromCache(contentMap, key)
```

**Parameters:**
- `contentMap` (Map): The same map used in cacheContent
- `key` (string): The key used when setting the map entry

**Returns:** Cached data or empty array if not found

### Usage Patterns

#### Basic Usage Example

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

#### Multiple Queries Example

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

#### Parameterized Queries Example

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

### Cache Invalidation

#### Current Strategy

The caching system uses a **session-based cache invalidation** strategy:

- Cache persists for the duration of the user's session
- Cache is cleared when the app initializes via `initApp` action
- Manual cache clearing available via `CLEAR_CACHE` mutation

#### Clearing Cache

```javascript
// Clear all cached content
this.$store.commit("CLEAR_CACHE");

// Clear localStorage route tracking
this.$store.commit("CLEAR_LOCAL_STORAGE");
```

### Performance Considerations

#### Benefits

1. **Reduced API Calls**: Identical queries within a session only hit the API once
2. **Faster Navigation**: Cached data loads instantly on revisits
3. **Parallel Requests**: Multiple uncached queries execute in parallel via `Promise.all()`
4. **Debug Logging**: Optional debug output shows cache performance metrics

#### Enabling Debug Mode

Set `debug: true` in `src/config.json`:

```json
{
  "debug": true
}
```

This logs cache operations to the browser console.

### Common Patterns in Views

Most view components follow this pattern:

- **News.vue** - Fetches all news
- **Publications.vue** - Fetches all publications
- **MeetingsSingle.vue** - Fetches single meeting by slug
- **TagsSingle.vue** - Fetches content by tag
- **Home.vue** - Fetches multiple content types

All use the same caching mechanism with different query functions.

### Extending the Caching System

#### Adding a New Cached Query

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

### Troubleshooting

#### Data Not Appearing

1. Check browser console for errors
2. Verify query function returns data in expected format
3. Ensure hash is correctly generated
4. Check that contentMap key matches retrieval key

#### Cache Not Working

1. Verify `cacheContent` action completes
2. Check that `inCache` getter returns true for subsequent calls
3. Enable debug mode to see cache operations

#### Performance Issues

1. Check API response times
2. Monitor cache size in debug output
3. Consider implementing cache size limits if needed

### Error Handling Strategies
- **API Failures**: Graceful degradation with cached content
- **Network Issues**: Offline-friendly with service worker (if implemented)
- **Content Missing**: Default content and error pages
- **Search Failures**: Fallback to basic filtering
- **Image Loading**: Placeholder images and lazy loading
- **API Failures**: Graceful degradation with cached content
- **Network Issues**: Offline-friendly with service worker (if implemented)
- **Content Missing**: Default content and error pages
- **Search Failures**: Fallback to basic filtering
- **Image Loading**: Placeholder images and lazy loading

## Setup Instructions

### Prerequisites and System Requirements

⚠️ **IMPORTANT PLATFORM COMPATIBILITY WARNING** ⚠️

This project is **NOT compatible with vanilla Windows** (native Windows without WSL2). Development requires one of these supported platforms:

1. **Windows with WSL2** (Windows Subsystem for Linux 2) - **REQUIRED** for Windows users
2. **macOS** (Apple Silicon M1/M2/M3/M4 preferred over Intel for better performance)
3. **Linux** (Debian/Ubuntu distributions recommended)

**Technical Reasoning**: Node.js development tools, file system operations, and build processes work more reliably on Unix-like systems. Many npm packages, build tools, and file watchers have compatibility issues with native Windows environments.

### Required Software
- **Node.js**: Version 14.x or higher (LTS recommended)
- **npm**: 6.x or higher (included with Node.js)
- **Git**: For version control
- **Code Editor**: VS Code recommended with Vue.js extensions

### Step-by-Step Installation

#### 1. Clone the Repository
```bash
git clone https://github.com/ICJIA/spac-client-next.git
cd spac-client-next
```

#### 2. Install Dependencies
```bash
# Install all dependencies using npm
npm install
```

#### 3. Environment Configuration
```bash
# Copy the environment template
cp .env.sample .env

# Edit .env file with your configuration
# Required variables:
# VUE_APP_BASE_API_URL='spac.icjia-api.cloud'
# VUE_APP_BASE_CLIENT_URL='spac.illinois.gov'
# VUE_APP_IMAGE_SERVER_URL='image.icjia.cloud'
# VUE_APP_ARCHIVE_SERVER_URL='archive.icjia.cloud'
# VUE_APP_THUMBOR_KEY=your_thumbor_key
```

#### 4. Verification Steps
```bash
# Test the development server
npm run serve

# Verify build process
npm run build

# Check linting
npm run lint
```

### Troubleshooting Common Issues

#### Windows Users (WSL2 Required)
- **Error**: `ENOENT: no such file or directory` → Use WSL2, not native Windows
- **Error**: `gyp ERR! stack Error: Can't find Python` → Use WSL2 with proper Linux environment
- **Performance Issues**: Store projects in WSL2 file system (`/home/username/`), not Windows file system (`/mnt/c/`)

#### General Issues
- **Port Conflicts**: Change port in `vue.config.js` or use `npm run serve -- --port 8081`
- **Memory Issues**: Increase Node.js memory limit: `export NODE_OPTIONS="--max-old-space-size=4096"`
- **Build Failures**: Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

## Development Workflow

### Git Workflow and Branching Strategy
- **Main Branch**: `master` (production-ready code)
- **Feature Branches**: Create from master for new features
- **Naming Convention**: `feature/description` or `fix/issue-description`
- **Pull Requests**: Required for all changes to master branch
- **Code Review**: All changes should be reviewed before merging

### Code Standards and Formatting
- **ESLint Configuration**: Extends Vue.js essential and Prettier
- **Prettier Integration**: Automatic code formatting on save
- **Vue Style Guide**: Follow official Vue.js style guide
- **Component Naming**: PascalCase for components, kebab-case for files
- **Linting Command**: `npm run lint` to check code quality

### Testing Approach and Procedures
- **Manual Testing**: Test all functionality in development environment
- **Cross-Browser Testing**: Chrome, Firefox, Safari, Edge
- **Mobile Testing**: Responsive design on various screen sizes
- **Accessibility Testing**: Keyboard navigation and screen readers
- **Performance Testing**: Lighthouse audits for optimization

### Common Development Tasks

#### Starting Development Server
```bash
# Start development server with hot reload
npm run serve

# This will:
# 1. Generate search index (buildSearchIndex.js)
# 2. Create sitemap (buildSitemap.js)
# 3. Start Vue CLI dev server at http://localhost:8080
```

#### Building for Production
```bash
# Create production build
npm run build

# This will:
# 1. Generate search index
# 2. Create sitemap
# 3. Build optimized Vue application
# 4. Output to dist/ directory
```

#### Content Updates
```bash
# Regenerate search index only
npm run build:search

# Full rebuild (recommended after content changes)
npm run build
```

#### Code Quality Checks
```bash
# Run ESLint
npm run lint

# Auto-fix linting issues
npm run lint -- --fix
```

## Build and Deployment

### Build Process Overview
The SPAC website uses a custom build process that runs in sequence:

1. **Search Index Generation** (`buildSearchIndex.js`)
   - Fetches all content from Strapi CMS via GraphQL
   - Processes content for search optimization
   - Generates `src/api/searchIndex.json`

2. **Sitemap Generation** (`buildSitemap.js`)
   - Creates route mappings for all content
   - Generates `src/api/routes.json` and `public/sitemap.xml`
   - Includes last modification dates for SEO

3. **Vue Application Build** (Vue CLI)
   - Transpiles and bundles all source code
   - Optimizes assets and applies tree shaking
   - Outputs production-ready files to `dist/`

### Content Generation Workflows

#### Search Index Process
```javascript
// buildSearchIndex.js workflow:
1. Connect to Strapi GraphQL API
2. Query all published content types
3. Process and optimize for search
4. Write to src/api/searchIndex.json
5. Used by Fuse.js for client-side search
```

#### Sitemap Process
```javascript
// buildSitemap.js workflow:
1. Fetch all published content with URLs
2. Generate route mappings based on categories
3. Create XML sitemap with lastmod dates
4. Output routes.json and sitemap.xml
5. Submit to search engines automatically
```

### Deployment Configuration

#### Netlify Configuration (`netlify.toml`)
```toml
[build]
  command = "npm run build"
  functions = "netlify"
  publish = "dist"

[build.environment]
  NODE_VERSION = "14"
```

#### Serverless Functions
- **Location**: `netlify/` directory (compiled from `src/lambda/`)
- **Functions**: Status monitoring, deployment hooks, health checks
- **Runtime**: Node.js 14.x
- **Endpoints**: `/.netlify/functions/[function-name]`

#### Environment-Specific Considerations
- **Development**: Uses local API endpoints and debug mode
- **Production**: Optimized builds with analytics enabled
- **Staging**: Same as production but with different API endpoints
- **CDN**: Automatic asset optimization and global distribution

### Deployment Process
1. **Code Push**: Push changes to GitHub repository
2. **Automatic Build**: Netlify detects changes and triggers build
3. **Build Execution**: Runs `npm run build` command
4. **Function Deployment**: Deploys serverless functions
5. **Asset Optimization**: Compresses and optimizes static assets
6. **CDN Distribution**: Distributes to global edge locations
7. **DNS Update**: Updates spac.illinois.gov to point to new deployment

## Configuration

### Environment Variables
Required environment variables in `.env` file:

```bash
# API Configuration
VUE_APP_BASE_API_URL='spac.icjia-api.cloud'
VUE_APP_BASE_CLIENT_URL='spac.illinois.gov'

# Image Services
VUE_APP_IMAGE_SERVER_URL='image.icjia.cloud'
VUE_APP_THUMBOR_KEY=your_thumbor_key_here

# External Services
VUE_APP_ARCHIVE_SERVER_URL='archive.icjia.cloud'

# Application Settings
VUE_APP_LS_ROUTE_KEY="spac:referrer"

# Serverless Functions (if needed)
SERVERLESS_USERNAME=username
SERVERLESS_PASSWORD=password
```

### Application Configuration (`src/config.json`)

#### Core Settings
- **clientURL**: Production website URL
- **publicPath**: Base path for routing
- **maxResults**: Maximum search results to display
- **daysToDisplayNewLabel**: Days to show "NEW" labels on content

#### Search Configuration
```json
{
  "search": {
    "shouldSort": true,
    "threshold": 0.8,
    "location": 0,
    "distance": 100,
    "maxPatternLength": 32,
    "minMatchCharLength": 3,
    "keys": ["searchMeta", "title", "summary", "name"]
  }
}
```

#### Content Categories and Enums
- **Publications**: Research reports, impact analyses, projections, annual reports
- **Meetings**: Regular meetings, special meetings, archives
- **News**: Announcements and updates
- **Tags**: Content categorization system

### Build and Deployment Configurations

#### Vue CLI Configuration (`vue.config.js`)
```javascript
module.exports = {
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    moment: {
      locales: ["en"]
    }
  }
};
```

#### Package Manager Configuration
- **Primary Package Manager**: npm (included with Node.js)
- **Lock File**: package-lock.json (committed to repository)
- **Scripts**: Defined in package.json for consistent commands
- **Dependencies**: Production and development dependencies clearly separated

### SEO and Analytics Setup

#### Google Analytics
- **Tracking ID**: UA-150580082-1
- **Implementation**: Vue Analytics plugin
- **Debug Mode**: Enabled in development, disabled in production
- **Events**: Page views, search queries, content interactions

#### SEO Configuration
- **Meta Tags**: Dynamic meta descriptions and titles
- **Canonical URLs**: Automatic canonical URL generation
- **Sitemap**: Auto-generated XML sitemap
- **Robots.txt**: Search engine crawling directives
- **Structured Data**: JSON-LD for enhanced search results

## Troubleshooting

### Common Issues and Solutions

#### Build and Development Issues
**Problem**: `npm run serve` fails with module not found errors
**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Problem**: Search functionality not working
**Solution**:
```bash
# Regenerate search index
npm run build:search
# Or full rebuild
npm run build
```

**Problem**: Sitemap not updating
**Solution**:
```bash
# Check API connectivity and rebuild
npm run build
# Verify sitemap.xml in public/ directory
```

#### Content Display Issues
**Problem**: Missing images or broken thumbnails
**Solution**:
- Check Thumbor configuration in .env
- Verify image URLs in Strapi CMS
- Check network connectivity to image servers

**Problem**: Content not displaying or outdated
**Solution**:
- Verify Strapi CMS API is accessible
- Check content publication status in CMS
- Rebuild search index and sitemap

**Problem**: Search returns no results
**Solution**:
- Check search index generation
- Verify Fuse.js configuration in config.json
- Test with different search terms

#### Deployment Issues
**Problem**: Netlify build failures
**Solution**:
- Check build logs for specific errors
- Verify environment variables are set
- Test build locally first

**Problem**: 404 errors on deployed site
**Solution**:
- Check routing configuration
- Verify _redirects file (if needed)
- Test routes in development

**Problem**: Slow loading or performance issues
**Solution**:
- Run Lighthouse audit
- Check image optimization
- Verify CDN configuration

### Debug Mode and Logging Strategies

#### Development Debugging
```javascript
// Enable Vue.js devtools
Vue.config.devtools = true

// Console logging in development
if (process.env.NODE_ENV === 'development') {
  console.log('Debug info:', data)
}

// Network request debugging
// Check browser Network tab for API calls
```

#### Production Monitoring
- **Google Analytics**: User behavior and error tracking
- **Netlify Analytics**: Performance and traffic monitoring
- **Console Errors**: Check browser console for JavaScript errors
- **API Status**: Monitor Strapi CMS availability

### Performance Optimization Tips

#### Frontend Optimization
- **Code Splitting**: Vue CLI automatically splits routes
- **Image Optimization**: Use Thumbor for responsive images
- **Lazy Loading**: Implement for images and components
- **Bundle Analysis**: Use `npm run build` and check dist/ directory for bundle size

#### Content Optimization
- **Search Index**: Keep search index size manageable
- **Image Sizes**: Optimize images before uploading to CMS
- **Content Caching**: Leverage browser and CDN caching
- **API Queries**: Optimize GraphQL queries for minimal data

### Maintenance Tasks and Schedules

#### Regular Maintenance (Weekly)
- Monitor site performance and uptime
- Check for broken links or missing content
- Review Google Analytics for issues
- Update dependencies if security patches available

#### Monthly Maintenance
- Review and update content in Strapi CMS
- Check search functionality and index size
- Monitor server costs and usage
- Update documentation as needed

#### Quarterly Maintenance
- Dependency updates and security audits
- Performance optimization review
- Backup verification and disaster recovery testing
- SEO audit and optimization

## Node.js Development Guide for New Developers

### Node.js Fundamentals and Ecosystem
Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine. For SPAC development, you need to understand:

- **Package Management**: npm for dependency management
- **Module System**: CommonJS and ES6 modules
- **Asynchronous Programming**: Promises, async/await patterns
- **Build Tools**: Webpack, Babel, and Vue CLI integration

### Platform-Specific Setup Instructions

#### Windows with WSL2 (MANDATORY for Windows Users)
**Why WSL2 is Required:**
- Native Windows lacks proper Unix-like file system operations
- Many Node.js packages have native dependencies that don't compile on Windows
- File watchers and build tools perform poorly on Windows file systems
- Path resolution and symlink handling differ significantly from Unix systems

**Complete WSL2 Setup Process:**
1. **Install WSL2**:
   ```powershell
   # Run in PowerShell as Administrator
   wsl --install
   # Restart computer when prompted
   ```

2. **Install Ubuntu**:
   ```bash
   # Install Ubuntu from Microsoft Store
   # Or via command line:
   wsl --install -d Ubuntu
   ```

3. **Setup Development Environment**:
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y

   # Install Node.js via NodeSource
   curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
   sudo apt-get install -y nodejs

   # Verify installation
   node --version
   npm --version
   ```

4. **VS Code Integration**:
   - Install "Remote - WSL" extension
   - Open project in WSL: `code .` from WSL terminal
   - Store projects in WSL file system: `/home/username/projects/`

#### macOS (Fully Supported)
```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node

# Verify installation
node --version
npm --version
```

#### Linux (Fully Supported)
```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Fedora
sudo dnf install nodejs npm

# Verify installation
node --version
npm --version
```

### Essential Command Line Skills
```bash
# Navigation
cd /path/to/project
ls -la
pwd

# File operations
cp file.txt backup.txt
mv old-name.txt new-name.txt
rm unwanted-file.txt

# Git operations
git status
git add .
git commit -m "message"
git push origin branch-name

# Package management
npm install
npm install package-name
npm uninstall package-name
npm update
```

### Development Workflow Best Practices
1. **Always use WSL2 on Windows** - Never develop in native Windows
2. **Store projects in Unix file system** - Not in `/mnt/c/` on WSL2
3. **Use npm consistently** - Don't mix package managers
4. **Keep dependencies updated** - Regular security updates
5. **Test locally before pushing** - Run `npm run build` before commits

### Project-Specific Quick Start Guide
```bash
# 1. Clone and setup
git clone https://github.com/ICJIA/spac-client-next.git
cd spac-client-next
cp .env.sample .env
# Edit .env with your configuration

# 2. Install dependencies
npm install

# 3. Start development
npm run serve

# 4. Build for production
npm run build

# 5. Run quality checks
npm run lint
```

### Useful Tools and Extensions

#### VS Code Extensions
- **Vetur**: Vue.js language support
- **ESLint**: Code linting integration
- **Prettier**: Code formatting
- **Remote - WSL**: WSL2 integration (Windows only)
- **GitLens**: Enhanced Git capabilities
- **Auto Rename Tag**: HTML/Vue tag renaming

#### Browser Tools
- **Vue.js DevTools**: Browser extension for Vue debugging
- **Lighthouse**: Performance and SEO auditing
- **Network Tab**: API request monitoring
- **Console**: JavaScript error debugging

#### Command Line Utilities
```bash
# Global tools that are helpful
npm install -g @vue/cli          # Vue CLI
npm install -g netlify-cli       # Netlify deployment
npm install -g lighthouse        # Performance auditing
```

This comprehensive documentation provides everything needed for new developers to understand, set up, and contribute to the SPAC website project. The documentation follows the established audit log system and will be maintained according to the project's documentation standards.
