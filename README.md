[![Netlify Status](https://api.netlify.com/api/v1/badges/71c65928-9986-4104-bd78-465726edb356/deploy-status)](https://app.netlify.com/sites/spac/deploys)

# Illinois Sentencing Policy Advisory Council (SPAC) - Client Website

**📅 Last Updated**: April 16, 2026

**📌 Current version**: 0.2.0 — see [CHANGELOG.md](./CHANGELOG.md)

> The concept for Illinois' sentencing commission, the Sentencing Policy Advisory Council (SPAC), was developed by the Criminal Law Edit, Alignment and Reform (CLEAR) Commission in 2009. The CLEAR Commissioners studied and reorganized the Unified Code of Corrections in an effort to make it less confusing and easier for the public and practitioners to use. That process led to the conclusion that, although many agencies collected statistics and data about sentencing in Illinois, no agency compiled sentencing data specifically to perform comprehensive analysis for reporting to policy makers.

> SPAC was created to collect, analyze and present data from all relevant sources to more accurately determine the consequences of sentencing policy decisions and to review the effectiveness and efficiency of current sentencing policies and practices. SPAC reports directly to the Governor and the General Assembly.

## 🌐 Live Application

**Website**: [https://spac.illinois.gov](https://spac.illinois.gov)

## 📋 Project Overview

This is a **Vue.js 2.x** single-page application (SPA) that serves as the public-facing website for the Illinois Sentencing Policy Advisory Council. The application provides access to:

- **Publications**: Research reports, impact analyses, and policy documents
- **News & Announcements**: Latest updates from SPAC
- **Meeting Information**: Council meetings, archives, and upcoming events
- **Council Members**: Biographies and contact information
- **Search Functionality**: Full-text search across all content types

### Key Features

- ✅ **Responsive Design**: Mobile-first design using Vuetify Material Design framework
- ✅ **Dynamic Content**: Content managed through Strapi CMS backend
- ✅ **Custom Caching System**: Efficient in-memory caching for optimal performance
- ✅ **Full-Text Search**: Client-side search using Fuse.js
- ✅ **SEO Optimized**: Automated sitemap generation and meta tag management
- ✅ **Analytics**: Google Analytics integration for user behavior tracking
- ✅ **Accessibility**: WCAG 2.1 AA — Lighthouse 100/100 (desktop + mobile) on all primary pages

## 🏗️ Architecture

The application follows a **JAMstack architecture pattern**:

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Vue.js SPA)                │
│  - Client-side routing with Vue Router                  │
│  - State management with Vuex                           │
│  - Custom in-memory caching system                      │
│  - Responsive UI with Vuetify components                │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│              Backend (Strapi CMS - GraphQL)             │
│  - Content management and publishing                    │
│  - GraphQL API for data queries                         │
│  - User authentication and permissions                  │
└─────────────────────────────────────────────────────────┘
                           ↓
┌─────────────────────────────────────────────────────────┐
│         Deployment (Netlify + CDN)                      │
│  - Automated builds and deployments                     │
│  - Serverless functions for backend logic               │
│  - Global CDN for static asset delivery                 │
│  - Edge caching for performance                         │
└─────────────────────────────────────────────────────────┘
```

### Technology Stack

**Core Framework:**
- Vue.js 2.6.12 - Progressive JavaScript framework
- Vue Router 3.4.3 - Client-side routing
- Vuex 3.5.1 - State management
- Vue CLI 4.5.6 - Build tooling

**UI & Styling:**
- Vuetify 2.4.3 - Material Design component framework
- Sass ~1.32.0 - CSS preprocessing
- Material Design Icons - Icon library

**Data & APIs:**
- GraphQL - Query language for APIs
- Axios 0.19.0 - HTTP client
- Strapi CMS - Headless content management system

**Search & Utilities:**
- Fuse.js 3.4.6 - Fuzzy search functionality
- Lodash 4.17.15 - Utility functions
- Moment.js 2.24.0 - Date manipulation

**Deployment:**
- Netlify - Hosting and CI/CD
- Netlify Functions - Serverless backend

## 📚 Documentation

This project includes comprehensive documentation accessible through a centralized portal:

### 📚 Documentation Portal

Access the main documentation portal at: **`/documentation/`**

The portal provides easy navigation to all available documentation:

#### 🔧 Developer Documentation (`/documentation/dev/`)
- **Complete project setup and installation guide**
- **Architecture overview and technical specifications**
- **Custom caching system documentation** - In-depth guide to the caching mechanism
- **Development workflows and best practices**
- **Deployment instructions and environment configuration**
- **Component library and usage examples**
- **API integration patterns**

#### 📖 JSDoc API Documentation (`/documentation/jsdoc/`)
- **Auto-generated API documentation from code comments**
- **Function signatures, parameters, and return values**
- **Service and utility module documentation**
- **Interactive search functionality**
- **Light/dark theme support**

### 🛠️ Documentation Commands

```bash
# Generate all documentation (dev + API docs)
npm run docs:generate

# Generate only developer documentation
npm run docs:dev

# Generate only JSDoc API documentation
npm run docs:jsdoc
```

**Note:** Documentation is automatically generated during the build process (`npm run build`) and development server startup (`npm run serve`).

## 🚀 Quick Start

### Prerequisites

- **Node.js**: 22.x (see `.nvmrc` and `netlify.toml`)
- **npm**: 10.x or higher (included with Node.js 22)
- **Git**: For version control

> ⚠️ **Install with npm, not yarn.** `sass-loader` declares `node-sass` as
> an optional peer dependency. npm correctly skips it; Yarn 1.x installs
> it anyway, and `node-sass@4.14.1` has no prebuilt binaries for Node >16
> — the Netlify build fails with "Unsupported runtime (120)" if yarn is
> used. Netlify is pinned to npm via `NETLIFY_USE_YARN = "false"`.

### Installation Steps

#### 1. Clone the Repository
```bash
git clone https://github.com/ICJIA/spac-client-next.git
cd spac-client-next
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Configure Environment Variables
```bash
# Copy the environment template
cp .env.sample .env

# Edit .env with your configuration
# Required variables:
# VUE_APP_BASE_API_URL=your_api_url
# VUE_APP_BASE_CLIENT_URL=your_client_url
# VUE_APP_IMAGE_SERVER_URL=your_image_server_url
# VUE_APP_THUMBOR_KEY=your_thumbor_key
```

#### 4. Start Development Server
```bash
npm run serve
```

The application will be available at `http://localhost:8080`

#### 5. Build for Production
```bash
npm run build
```

The optimized build will be output to the `dist/` directory.

## 📖 Development Workflow

### Available Commands

```bash
# Development server with hot reload
npm run serve

# Production build
npm run build

# Lint and fix code
npm run lint

# Generate search index
npm run build:search

# Generate all documentation
npm run docs:generate

# Generate developer documentation only
npm run docs:dev

# Generate JSDoc API documentation only
npm run docs:jsdoc
```

### Project Structure

```
spac-client-next/
├── src/
│   ├── components/          # Reusable Vue components
│   ├── views/               # Page components
│   ├── services/            # API and utility services
│   ├── store.js             # Vuex state management
│   ├── router.js            # Vue Router configuration
│   ├── main.js              # Application entry point
│   └── config.json          # Application configuration
├── public/
│   ├── documentation/       # Generated documentation
│   └── index.html           # Main HTML template
├── docs/
│   ├── graphql_api_guide.md # Comprehensive GraphQL API guide (29 examples)
│   └── extractMeetings.md   # Meeting extraction script documentation
├── extractMeetings.js       # Standalone meeting data extraction script
├── buildSearchIndex.js      # Search index generation
├── buildSitemap.js          # Sitemap generation
├── package.json             # Dependencies and scripts
└── .env.sample              # Environment variables template
```

## ♿ Accessibility

This site targets **WCAG 2.1 AA** and the **April 24, 2026 ADA Title II** compliance deadline.

### Current status

- Lighthouse accessibility **100/100** on home, publications, meetings, council-members, and search (desktop + mobile).
- axe-core AA: 0 violations on content pages; remaining items are Vuetify 2 library-level (see below).

### Features in place

- **Skip link** — "Skip to main content" is the first focusable element on every page, targeting `#content-top` on `<v-main>`.
- **Semantic landmarks** — `<header>`, `<main>`, `<footer>` via Vuetify app shell; `aria-live="polite"` on `<main>` for SPA route changes.
- **Heading-order normalization** — `services/Markdown.js` clamps every CMS heading to at most `previous + 1`, so markdown that skips levels (e.g. `##` then `####`) is auto-corrected before render.
- **Contrast** — splash hero overlay and Vuetify empty-state text were darkened to meet AA.
- **Alt text** — headshot and decorative image alt values set; decorative images use `alt=""` + `role="presentation"`.
- **Named controls** — mobile nav hamburger has `aria-label`; search icons have labels via `addAttributeToElement`.
- **Loading states** — `v-img` placeholder spinners suppressed so screen readers don't announce unlabeled progress indicators.

### Known library-level limitations

These originate in Vuetify 2 and cannot be resolved without upgrading the framework. They are being carried into the AEM migration rather than patched here:

- `nested-interactive` on `v-select` / `v-autocomplete` (publications + meetings filter controls) — Vuetify 2 wraps the `<input>` in a `div[role="button"]`.
- `td-has-header` on `v-data-table` rows in some configurations.

### Auditing locally

```bash
npm run serve                  # http://localhost:8080
# Then from Claude Code:
#   mcp__lightcap__run_a11y    → Lighthouse accessibility audit
#   mcp__axecap__audit_url     → axe-core WCAG A/AA audit
#   mcp__contrastcap          → WCAG contrast audit
```

## 🚀 Future: Adobe Experience Manager (AEM) Migration

**⚠️ Important**: This application is planned to be migrated to Adobe Experience Manager (AEM).

New developers should be aware that this Vue.js + Strapi application will eventually be upgraded to AEM, which will provide:
- ✅ Enterprise-grade CMS capabilities
- ✅ Built-in CDN and image optimization
- ✅ Improved performance and scalability
- ✅ Reduced maintenance overhead
- ✅ Automatic security updates

### Key Migration Considerations

**Content Structure**:
- All Strapi content types will map to AEM Content Fragments
- Tags and categorization will be preserved
- All custom fields and relationships will be maintained

**Frontend**:
- Vue.js components will be converted to AEM components
- Current URL structure will be maintained for SEO
- Caching strategy will shift from session-only to multi-layer (browser, CDN, dispatcher)

**Images**:
- Thumbor image optimization will be replaced with AEM Dynamic Media
- Image URLs will change format but functionality remains the same

**Search**:
- Client-side search will migrate to AEM Search & Promote or Elasticsearch
- Search functionality will remain the same for users

### For Developers Assigned to AEM Migration

If you're assigned to work on the AEM migration:

1. **Read the Migration Guide**: See `/AEM_MIGRATION_GUIDE.md` for comprehensive strategy
2. **Understand Current Architecture**: Familiarize yourself with this Vue.js + Strapi setup
3. **Plan Content Migration**: Map all Strapi content models to AEM Content Fragments
4. **Develop AEM Components**: Convert Vue.js components to AEM components
5. **Test Thoroughly**: Validate all content and functionality after migration

**Estimated Timeline**: 3-5 months for complete migration

### Common Issues When Migrating from Strapi to AEM

AEM developers should be aware of these common challenges:

1. **Data Type Mismatches**: Strapi data types don't always map directly to AEM types
   - Solution: Create conversion utilities for each data type

2. **Relationship Handling**: Strapi relationships (arrays of IDs) need to become AEM references (paths)
   - Solution: Map Strapi IDs to AEM content fragment paths

3. **Rich Text Content**: HTML content may contain broken image URLs and internal links
   - Solution: Migrate images to AEM DAM and update all internal links

4. **Image Assets**: Large-scale image migration requires proper metadata handling
   - Solution: Use bulk import with metadata extraction

5. **URL Structure Changes**: Content paths change, breaking SEO and existing links
   - Solution: Implement 301 redirects from old Strapi URLs to new AEM URLs

6. **SEO Metadata**: Custom Strapi SEO fields need to map to AEM standard properties
   - Solution: Map searchMeta, seoTitle, seoDescription to AEM properties

7. **Date/Timezone Issues**: Strapi ISO 8601 dates need conversion to AEM Calendar format
   - Solution: Convert to UTC and handle timezone properly

8. **Draft vs Published**: Strapi has separate draft/published states; AEM uses versioning
   - Solution: Only migrate published content; use AEM versioning for drafts

9. **Custom Fields**: Strapi custom fields may not have AEM equivalents
   - Solution: Create custom AEM components or store as generic properties

10. **Performance**: Bulk migration of large datasets can be slow
    - Solution: Use batch processing with delays to avoid rate limiting

11. **Data Quality**: Strapi data may have inconsistencies or missing fields
    - Solution: Validate data before migration; handle orphaned references

12. **Search Indexes**: After migration, search indexes need rebuilding
    - Solution: Reindex all migrated content paths after migration complete

**For detailed solutions and code examples**, see `/AEM_MIGRATION_GUIDE.md` → "Common Issues and Challenges"

**For detailed AEM migration guidance**:
- 📄 **Markdown**: `/AEM_MIGRATION_GUIDE.md`
- 🌐 **HTML**: View in `/public/documentation/dev/index.html` (search for "AEM Migration")
- 📖 **In Developer Docs**: See "AEM Migration Guide" section in developer documentation

## 🔗 GraphQL API

### GraphQL Endpoint

The SPAC application queries the Strapi CMS backend at this endpoint (used in application code, build scripts, etc.):

**Production**: `https://spac.icjia-api.cloud/graphql`

**Development**: `http://localhost:9000/graphql` (when running backend locally)

### Interactive Playground

For experimenting with queries, browsing the schema, and testing before adding queries to code, use the interactive GraphQL playground:

**ICJIA Playground** (recommended): https://playground.icjia.app/

A modern, updated GraphQL playground with all the same features as the built-in Strapi playground plus additional flexibility and download options. Includes schema autocomplete, query validation, and an improved interface.

**Built-in Strapi Playground**: https://spac.icjia-api.cloud/graphql

The default Strapi GraphQL playground. Both point to the same underlying API.

The playground provides:
- ✅ Interactive query editor with schema autocomplete
- ✅ Real-time validation
- ✅ Schema documentation
- ✅ Query history
- ✅ Download options (enhanced in ICJIA Playground)

### Quick Sample Queries

**Fetch all published pages:**
```graphql
{
  pages(where: {isPublished: true}) {
    title
    slug
    summary
  }
}
```

**Fetch latest news posts:**
```graphql
{
  posts(sort: "createdAt:desc", where: {isPublished: true}, limit: 10) {
    title
    slug
    summary
    createdAt
  }
}
```

**Fetch publications by year:**
```graphql
{
  publications(sort: "year:desc", where: {isPublished: true}, limit: 50) {
    title
    slug
    year
    category
  }
}
```

**For comprehensive GraphQL documentation with 29 ready-to-use query examples**, see [`docs/graphql_api_guide.md`](docs/graphql_api_guide.md)

### 🏷️ Tagging System

The application uses a flexible tagging system to organize content across pages, news, publications, meetings, and biographies. Tags enable cross-content discovery and provide secondary navigation.

**Fetch all content for a specific tag:**
```graphql
{
  tags(where: {slug: "sentencing-policy"}) {
    name
    slug
    pages(where: {isPublished: true}) {
      title
      slug
    }
    posts(where: {isPublished: true}) {
      title
      slug
    }
    publications(where: {isPublished: true}) {
      title
      slug
    }
    meetings(where: {isPublished: true}) {
      title
      slug
    }
    biographies(where: {isPublished: true}) {
      firstName
      lastName
    }
  }
}
```

**Tag Features:**
- Tags are displayed as **purple chips** in the UI
- Tags are **clickable** and link to `/tags/{tag-slug}`
- Multiple tags can be applied to a single piece of content
- The "fiscal-impact" tag displays as **"IMPACT ANALYSIS"**

**For detailed tagging documentation**, see [`docs/graphql_api_guide.md`](docs/graphql_api_guide.md) → "Tagging System" section

### 📊 Meeting Data Extraction

The project includes a **standalone zero-dependency** Node.js script for extracting meeting data from the SPAC API:

```bash
# Run the extraction script
npm run extract:meetings
# Or directly: node extractMeetings.js
```

This produces:
- **meetings.json** — Full structured meeting data (JSON array) with absolute file URLs
- **meetings.csv** — Flat CSV export suitable for spreadsheets, databases, or the WCM development team

The script uses only Node.js built-in modules (`https`, `fs`, `path`) — no `npm install` required. See [`docs/extractMeetings.md`](docs/extractMeetings.md) for full documentation including adaptation for other content types.

### 🖼️ Thumbor Image Server

The application uses **Thumbor**, a smart imaging service, to optimize and serve images across the website.

**Image Server**: `https://image.icjia.cloud`

**Image URL Format**:
```
https://image.icjia.cloud/unsafe/{width}x{height}/{image-url}
```

**Example**:
```
https://image.icjia.cloud/unsafe/310x360/spac.icjia-api.cloud/uploads/publication-cover.png
```

**Thumbor Features:**
- ✅ Automatic image resizing
- ✅ Smart cropping
- ✅ Image filtering and optimization
- ✅ Format conversion (JPEG, PNG, WebP)
- ✅ Caching for performance

**⚠️ Important**: For questions about the Thumbor security key or password, please contact the previous SPAC web developer.

**For comprehensive Thumbor documentation**, see `/THUMBOR_IMAGE_SERVER.md`

## 🔄 Understanding the Caching System

### What is the Caching System?

The application uses a custom **session-only in-memory caching system** to optimize performance:

- **Session-based caching**: Data is cached only for the duration of the user's current browser session
- **Not persistent**: Cache is cleared on page reload, new tabs, or when the browser closes
- **MD5 hash keys**: Queries are identified by MD5 hashes for efficient lookup
- **Parallel requests**: Multiple uncached queries execute in parallel
- **Automatic invalidation**: Cache is cleared on app initialization

### ⚠️ Important: Session-Only (NOT Persistent)

The cache is **NOT persistent** across:
- ❌ Page reloads (F5, Cmd+R)
- ❌ New browser tabs
- ❌ New browser sessions
- ❌ Closing and reopening the browser

The cache **IS** useful for:
- ✅ Repeated page lookups within the same session
- ✅ Faster navigation without reloading
- ✅ Reducing API calls during a browsing session

### Historical Context

This custom caching system was implemented to **optimize repeated page lookups within a single session**. At the time of implementation, Apollo GraphQL did not have the robust caching features it has today. Since then, Apollo Client has evolved to include sophisticated caching mechanisms for GraphQL queries. However, this custom system remains in place and continues to provide session-level performance optimization.

**For detailed information**, see the **Custom Caching System** section in the developer documentation at `/documentation/dev/` or read `/CACHING_SYSTEM_CLARIFICATION.md`

### Quick Example

```javascript
// In a Vue component
async fetchContent() {
  const contentMap = new Map();

  contentMap.set("getNews", {
    hash: getHash("getNews"),
    query: getAllNews,
    params: {}
  });

  // Fetch and cache
  await this.$store.dispatch("cacheContent", contentMap);

  // Retrieve from cache
  this.news = this.$store.getters.getContentFromCache(contentMap, "getNews");
}
```

## 🐛 Troubleshooting

### Common Issues

**Issue**: `npm run serve` fails with module errors
```bash
# Solution: Clear and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

**Issue**: Search functionality not working
```bash
# Solution: Regenerate search index
npm run build:search
```

**Issue**: Content not displaying
```bash
# Solution: Verify API connectivity and rebuild
npm run build
```

For more troubleshooting help, see the developer documentation.

## 📝 Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes and commit: `git commit -am 'Add feature'`
3. Push to the branch: `git push origin feature/your-feature`
4. Submit a pull request

## 📄 License

See LICENSE file for details.

## 🤝 Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/ICJIA/spac-client-next).

