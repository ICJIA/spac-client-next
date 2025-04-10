# 2025 SPAC Website Updates

## Project Overview

The SPAC (Illinois Sentencing Policy Advisory Council) client website is a Vue.js-based frontend application that serves as the public-facing website for SPAC. The site provides access to publications, news/announcements, meeting information, and other resources related to sentencing policy in Illinois.

**Live URL**: [https://spac.illinois.gov](https://spac.illinois.gov)

### Technical Specifications

- **Project Name**: spac-client-next-prod
- **Version**: 0.1.0
- **Framework**: Vue.js 2.6.12
- **Node.js Version**: v14.20.1 (as specified in .nvmrc)
- **Package Manager**: Yarn 1.22.22
- **UI Framework**: Vuetify 2.4.3
- **State Management**: Vuex 3.5.1
- **Routing**: Vue Router 3.4.3
- **Build System**: Vue CLI 4.5.6
- **CSS Preprocessor**: Sass (node-sass 4.9.0, sass-loader 10.0.0)
- **JavaScript Transpiler**: Babel with @vue/cli-plugin-babel/preset and @babel/preset-env
- **API Communication**: GraphQL (graphql-request 1.8.2)
- **Search Functionality**: Fuse.js 3.4.6
- **Date Handling**: Moment.js 2.24.0
- **Content Rendering**: Markdown-it 10.0.0 with plugins (attrs, named-headers)
- **Analytics**: Vue Analytics 5.22.1 (Google Analytics integration)
- **Meta Tags Management**: Vue Meta 2.4.0
- **Security**: XSS protection via xss 1.0.6

### Build Process

The application uses a custom build process that:
1. Generates a search index (buildSearchIndex.js)
2. Creates a sitemap (buildSitemap.js)
3. Builds the Vue application using Vue CLI

#### Development Server

To start a development server for local development:

```bash
# Install dependencies first (only needed once or when dependencies change)
npm install
# OR if using Yarn
yarn

# Start the development server
npm run serve
# OR if using Yarn
yarn serve
```

This will:
- Run the buildSearchIndex.js script to generate the search index
- Run the buildSitemap.js script to create the sitemap
- Start a Vue CLI development server with hot-reload
- Make the application available at http://localhost:8080/

#### Production Build

To create a production build for deployment:

```bash
# Build for production
npm run build
# OR if using Yarn
yarn build
```

This will:
- Run the buildSearchIndex.js script to generate the search index
- Run the buildSitemap.js script to create the sitemap
- Create an optimized production build using Vue CLI
- Output the built files to the `dist/` directory

The contents of the `dist/` directory can then be deployed to a web server or hosting service like Netlify.

### Deployment

The site is deployed on Netlify and uses Netlify functions for serverless functionality.

## Audit Log Purpose

This file serves as a log of changes made to the SPAC website in 2025. It is maintained for external audit purposes and to help new developers understand the changes that have been implemented.

## Audit Log Rules

When updating this audit log:
1. Add a new entry with the current date
2. Include a brief description of the change (1-2 sentences)
3. List all files modified with brief descriptions of changes
4. Document all changes between the last update and the current state of the project

## Site Updates

### 2025-05-23: Updated hardcoded "Fiscal Impact Analyses" to "Impact Analyses" in HomeBoxes
- **Change Summary**: Changed the hardcoded reference from "Fiscal Impact Analyses" to "Impact Analyses" in the HomeBoxes component to maintain consistency with config changes.
- **Files Modified**:
  - `src/components/HomeBoxes.vue`: Updated the heading text from "Fiscal Impact Analyses" to "Impact Analyses"
- **Technical Notes**: This change ensures consistent terminology throughout the application while maintaining the same routing and functionality.

### 2025-05-23: Updated publication titles and found hardcoded "Fiscal Impact Analyses" reference
- **Change Summary**: Identified and documented a hardcoded reference to "Fiscal Impact Analyses" in the HomeBoxes component and discovered additional publication title changes in config.json.
- **Files Examined**:
  - `src/components/HomeBoxes.vue`: Contains a hardcoded reference to "Fiscal Impact Analyses" that needs to be updated to "Impact Analyses"
  - `src/config.json`: Multiple publication titles have been simplified
- **Technical Notes**: The HomeBoxes component contains a hardcoded plural reference that should be updated to maintain consistency with the config changes.

### 2025-05-23: Changed publication titles in config.json
- **Change Summary**: Simplified multiple publication type titles throughout the application.
- **Files Modified**:
  - `src/config.json`: Changed several publication titles:
    - Changed "Fiscal Impact Analysis" to "Impact Analysis"
    - Changed "Research Reports" to "Reports"
    - Changed "Prison Population Projections" to "Projections"
    - Changed "Annual Report" to "Annual Reports" (pluralized)
- **Technical Notes**: These changes affect the display labels in the publications dropdown menu and category headings; the underlying enum values, slugs, and routing remain unchanged

### 2025-05-23: Changed "News" to "Announcements" in navigation
- **Change Summary**: Updated all instances of "News" to "Announcements" in the navigation and related UI elements without modifying routing or backend functionality.
- **Files Modified**:
  - `src/App.vue`: Modified to intercept the sections data after API load to change the "News" label to "Announcements" in the navigation menu
  - `src/views/News.vue`: Updated page title from "News Archive" to "Announcements Archive" for consistency
  - `src/components/NewsCard.vue`: Changed text from "SPAC News" to "SPAC Announcements" to maintain consistent terminology
- **Technical Notes**: Only display labels were changed; all routing, URLs, and backend functionality remain unchanged
