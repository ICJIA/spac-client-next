[![Netlify Status](https://api.netlify.com/api/v1/badges/71c65928-9986-4104-bd78-465726edb356/deploy-status)](https://app.netlify.com/sites/spac/deploys)

# Illinois Sentencing Policy Advisory Council (SPAC) - Client Website

**📅 Last Updated**: October 23, 2025

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
- ✅ **Accessibility**: WCAG compliant with semantic HTML and ARIA labels

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

- **Node.js**: 14.x or higher (LTS recommended)
- **npm**: 6.x or higher (included with Node.js)
- **Git**: For version control

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
├── buildSearchIndex.js      # Search index generation
├── buildSitemap.js          # Sitemap generation
├── package.json             # Dependencies and scripts
└── .env.sample              # Environment variables template
```

## 🔄 Understanding the Caching System

The application uses a custom in-memory caching system to optimize performance:

- **Session-based caching**: Data is cached for the duration of the user's session
- **MD5 hash keys**: Queries are identified by MD5 hashes for efficient lookup
- **Parallel requests**: Multiple uncached queries execute in parallel
- **Automatic invalidation**: Cache is cleared on app initialization

**For detailed information**, see the **Custom Caching System** section in the developer documentation at `/documentation/dev/`

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

