# 2025 SPAC Website Updates

## Project Overview

The SPAC (Illinois Sentencing Policy Advisory Council) client website is a Vue.js-based frontend application that serves as the public-facing website for SPAC. The site provides access to publications, news/announcements, meeting information, and other resources related to sentencing policy in Illinois.

**Live URL**: [https://spac.illinois.gov](https://spac.illinois.gov)

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
1. **Use the standardized prompt**: Reference `audit-log-prompt.md` for the proper format and guidelines
2. **Add new entries at the top**: Place new entries immediately after the "## Site Updates" heading (reverse chronological order)
3. Add a new entry with the current date in YYYY-MM-DD format
4. Include a brief description of the change (1-2 sentences)
5. List all files modified/added/removed with brief descriptions of changes
6. Document all changes between the last update and the current state of the project
7. Include technical notes with implementation details and context
8. **Update for significant changes**: Use this process for any meaningful modifications to the codebase, configuration, or project structure

**Important**: Always use the template and guidelines in `audit-log-prompt.md` to ensure consistency and completeness in documentation. New entries should always be added at the top of the "Site Updates" section so the most recent changes are immediately visible.

## Site Updates

### 2025-06-30: Documentation Portal Restructuring and JSDoc Theme Enhancement
- **Change Summary**: Restructured the entire documentation system with a centralized portal, implemented clean-jsdoc-theme with light/dark mode support, added dynamic copyright year functionality, and updated README with comprehensive documentation information. Created a professional documentation portal that provides easy access to both developer documentation and auto-generated API documentation.
- **Files Modified**:
  - **Documentation Portal**:
    - `public/documentation/index.html` - Created new centralized documentation portal with modern design, theme toggle, and navigation to dev/JSDoc sections
    - `public/documentation/dev/index.html` - Moved existing developer documentation to new `/dev/` subdirectory
  - **JSDoc Configuration**:
    - `jsdoc.conf.json` - Updated to use clean-jsdoc-theme with dark mode default, custom branding, search functionality, and dynamic footer
    - Added clean-jsdoc-theme package dependency for enhanced documentation appearance
  - **Build Scripts**:
    - `package.json` - Updated scripts to use local JSDoc installation with `npx`, added new documentation generation commands (`docs:dev`, `docs:jsdoc`, `docs:generate`)
    - `creators/createDocumentationHTML.js` - Modified output path to generate documentation in `/dev/` subdirectory
  - **Documentation Content**:
    - `README.md` - Added comprehensive documentation section explaining portal structure, available documentation types, and generation commands
    - `src/main.js` - Fixed JSDoc warning by correcting `@type` tag syntax (removed description from type-only tag)
- **Technical Implementation**:
  - **Portal Design**: Responsive layout with SPAC brand colors (#6A1B9A), CSS variables for theme management, flexbox sticky footer, and Material Design icons
  - **JSDoc Theme**: Integrated clean-jsdoc-theme v4.3.0 with search functionality, light/dark mode toggle, and custom SPAC branding
  - **Dynamic Year**: Implemented JavaScript-based dynamic copyright year using `new Date().getFullYear()` for both portal and JSDoc footers
  - **Build Integration**: Documentation generation now integrated into serve/build processes, ensuring docs are always up-to-date
  - **Directory Structure**: Organized as `/documentation/` (portal), `/documentation/dev/` (manual docs), `/documentation/jsdoc/` (API docs)
- **User Experience Improvements**: Centralized access point for all documentation, professional appearance matching project branding, automatic theme detection, and comprehensive navigation between documentation types

### 2025-06-30: Comprehensive JSDoc documentation implementation across entire codebase
- **Change Summary**: Added comprehensive JSDoc comments to all JavaScript, TypeScript, and Vue.js files throughout the project, implementing standardized documentation patterns with @param, @returns, @example, and @since tags. Enhanced ESLint configuration to support JSDoc patterns while maintaining code quality standards.
- **Files Modified**:
  - **Core Application Files**:
    - `src/main.js`: Added JSDoc comments for Vue application entry point, plugin configurations, and polyfills
    - `src/router.js`: Documented Vue Router configuration, route definitions, and navigation guards
    - `src/store.js`: Added comprehensive Vuex store documentation including state, mutations, and actions
    - `src/entry.js`: Documented application entry point with browser compatibility handling
  - **Build and Utility Scripts**:
    - `buildSearchIndex.js`: Added JSDoc comments for GraphQL search index generation functionality
    - `buildSitemap.js`: Documented sitemap and routes generation with XML output
    - `vue.config.js`: Added Vue CLI configuration documentation
    - `babel.config.js`: Documented Babel transpilation configuration
  - **Service Layer**:
    - `src/services/Content.js`: Comprehensive documentation for GraphQL content fetching service
    - `src/services/Download.js`: Added JSDoc for file download handling with security attributes
    - `src/services/Image.js`: Documented Thumbor image optimization service functions
    - `src/services/Markdown.js`: Added markdown-to-HTML rendering service documentation
    - `src/services/Search.js`: Documented search index processing and transformation
    - `src/services/Utilities.js`: Added utility functions documentation with examples
  - **Vue Components - Core Layout**:
    - `src/App.vue`: Documented root application component with initialization logic
    - `src/components/AppNav.vue`: Added navigation bar component documentation
    - `src/components/AppDrawer.vue`: Documented mobile navigation drawer functionality
    - `src/components/AppFooter.vue`: Added footer component with archive server integration
    - `src/components/BaseContent.vue`: Documented base content wrapper with loading states
  - **Vue Components - Content Display**:
    - `src/components/BiographyCard.vue`: Added person profile card documentation
    - `src/components/NewsCard.vue`: Documented news article card with read more functionality
    - `src/components/MeetingCard.vue`: Added meeting information card documentation
    - `src/components/Loader.vue`: Documented loading spinner component
  - **Vue Components - Navigation and Search**:
    - `src/components/Search.vue`: Added full-text search component documentation
    - `src/components/SearchCard.vue`: Documented search result card display
    - `src/components/SearchMini.vue`: Added mini search component for navigation
    - `src/components/NavMeetings.vue`: Documented meetings navigation dropdown
    - `src/components/NavPublications.vue`: Added publications navigation dropdown documentation
  - **Vue Views**:
    - `src/views/Home.vue`: Documented homepage view with content loading and caching
    - `src/views/News.vue`: Added news listing view documentation
    - `src/views/Publications.vue`: Documented publications view with category filtering
    - `src/views/Page.vue`: Added generic page view documentation with route handling
    - `src/views/Error.vue`: Documented error page with analytics tracking
  - **Mixins and Plugins**:
    - `src/mixins/handleClicks.js`: Added comprehensive mixin documentation for dynamic link handling
    - `src/plugins/vuetify.js`: Documented Vuetify configuration with SPAC theme colors
    - `src/filters.js`: Added Vue filters documentation for date formatting and text manipulation
  - **Creator Scripts**:
    - `creators/createDocumentationHTML.js`: Enhanced existing JSDoc comments with comprehensive function documentation
  - **Configuration Files**:
    - `package.json`: Enhanced ESLint configuration with JSDoc-friendly rules including spaced-comment, prefer-const, no-var, and no-unused-vars warnings
- **Technical Notes**: Implemented standardized JSDoc patterns following Vue.js and JavaScript best practices. All exported functions, components, and classes now include @param and @returns documentation where applicable. Added @example blocks for complex functions and @vue/@displayName tags for Vue components. Enhanced ESLint configuration to catch code quality issues while accommodating JSDoc comment patterns. Used targeted eslint-disable comments for legitimate edge cases (e.g., arrays modified via push operations). All documentation follows the established pattern of explaining WHY and HOW rather than just WHAT, providing meaningful context for future developers. The documentation supports IDE intellisense and automated documentation generation tools.

### 2025-06-24: Implemented HTML documentation generator with build integration
- **Change Summary**: Created automated HTML documentation generator using the createDocumentationHTML.js template, integrated it into the build process, and configured robots.txt to restrict search engine access to the documentation directory.
- **Files Added**:
  - `creators/createDocumentationHTML.js`: Complete HTML generator script with dark/light mode toggle, responsive design, syntax highlighting, and smooth scrolling functionality
  - `public/documentation/index.html`: Generated HTML documentation (53 KB) with professional styling and interactive features
- **Files Modified**:
  - `package.json`: Added `markdown-it-anchor` dependency and integrated documentation generation into serve/build scripts with new `create:documentation` command
  - `public/robots.txt`: Updated to include `Disallow: /documentation/` directive while maintaining existing crawling permissions and adding sitemap reference
- **Technical Notes**: The HTML generator converts project-documentation.md to a professional HTML interface with CSS variables for theme management, localStorage theme persistence, automatic heading ID generation, and smooth anchor scrolling. The documentation is now automatically generated during both development and production builds, ensuring it stays current with project changes. The robots.txt configuration keeps the documentation accessible to team members while hiding it from search engines.

### 2025-06-24: Created comprehensive project documentation
- **Change Summary**: Developed complete project documentation following the project-documentation-prompt.md template, providing comprehensive guidance for new developers and covering all aspects of the SPAC website project from setup to deployment.
- **Files Added**:
  - `project-documentation.md`: Complete project documentation with 13 major sections including project overview, technology stack, architecture, setup instructions, development workflow, build processes, configuration, troubleshooting, and Node.js development guide
- **Technical Notes**: The documentation follows the established template structure and includes platform-specific setup instructions with mandatory WSL2 requirements for Windows users, comprehensive troubleshooting guides, and detailed explanations of the custom build process including search index generation and sitemap creation. This serves as the definitive guide for onboarding new developers and understanding the complete SPAC website architecture and development workflow.

### 2025-06-24: Created audit log documentation and prompt template
- **Change Summary**: Developed a standardized prompt template for creating and updating audit log entries to ensure consistency and completeness in project documentation. Updated audit log rules to require use of the new template for all significant changes.
- **Files Added**:
  - `audit-log-prompt.md`: Created comprehensive prompt template with guidelines, format specifications, and examples for maintaining audit logs
- **Files Modified**:
  - `audit-log.md`: Updated the "Audit Log Rules" section to reference the new prompt template and establish it as the standard process for documenting changes
- **Technical Notes**: The prompt template provides a structured approach for documenting changes, including required information fields, formatting guidelines, and special considerations for different types of modifications. All future significant changes to the codebase should use this template to maintain consistent documentation standards and assist new developers in understanding the change history.

### 2025-04-10: Added MIT LICENSE file
- **Change Summary**: Added a standard MIT license file to the project repository.
- **Files Added**:
  - `LICENSE`: Created a new MIT license file with copyright attributed to "Sentencing Policy Advisory Council" for the year 2025
- **Technical Notes**: The MIT license allows for free use, modification, and distribution of the software while providing liability protection for the authors.

### 2025-04-10: Added social media links to footer
- **Change Summary**: Added LinkedIn and X/Twitter social media links to the website footer.
- **Files Modified**:
  - `src/components/AppFooter.vue`: Added social media icons with links to SPAC's LinkedIn and X/Twitter profiles
- **Technical Notes**: Used Material Design Icons (mdi-linkedin and mdi-twitter) from the Vuetify framework. Added hover effects and proper accessibility attributes (aria-labels) to the social media links.

### 2025-04-10: Changed "Fiscal Impact" tag display to "Impact Analysis" in tag chips
- **Change Summary**: Updated the display of the "Fiscal Impact" tag to show as "Impact Analysis" in the tag chips/badges throughout the application.
- **Files Modified**:
  - `src/components/TagList.vue`: Added conditional logic to display "IMPACT ANALYSIS" instead of "FISCAL IMPACT" in the tag chips when the tag slug is "fiscal-impact"
- **Technical Notes**: This change ensures consistent terminology in the tag chips displayed on publication pages and other content types. The underlying tag slug and routing remain unchanged.

### 2025-04-10: Changed "Fiscal Impact" tag display to "Impact Analysis"
- **Change Summary**: Updated the display of the "Fiscal Impact" tag to show as "Impact Analysis" in the tag page while maintaining the same URL and routing.
- **Files Modified**:
  - `src/views/TagsSingle.vue`: Added conditional logic to display "Impact Analysis" instead of "Fiscal Impact" when the tag slug is "fiscal-impact"
- **Technical Notes**: This change affects only the display of the tag name in the UI; the underlying tag slug ("fiscal-impact") and routing remain unchanged. Since tags are stored in the backend database, this frontend override ensures consistent terminology without requiring backend changes.

### 2025-04-10: Changed "Council Meeting" to "Council Meetings" in meetings menu
- **Change Summary**: Updated the display label for the regular meeting type from singular "Council Meeting" to plural "Council Meetings" in the meetings menu and related UI elements.
- **Files Modified**:
  - `src/config.json`: Changed both the title and short fields for the regular meeting enum from "Council Meeting" to "Council Meetings"
- **Technical Notes**: This change affects only the display labels; the underlying enum value ("regular"), slug ("regular"), and routing remain unchanged. The application dynamically displays meeting type titles from the config.json file.

### 2025-04-10: Changed "Regular Meeting" to "Council Meeting" in meetings menu
- **Change Summary**: Updated the display label for the Regular Meeting type to Council Meeting in the meetings menu and related UI elements.
- **Files Modified**:
  - `src/config.json`: Changed both the title and short fields for the regular meeting enum from "Regular Meeting" to "Council Meeting"
- **Technical Notes**: This change affects only the display labels; the underlying enum value ("regular"), slug ("regular"), and routing remain unchanged. The application dynamically displays meeting type titles from the config.json file.

### 2025-04-10: Updated hardcoded "Fiscal Impact Analyses" to "Impact Analyses" in HomeBoxes
- **Change Summary**: Changed the hardcoded reference from "Fiscal Impact Analyses" to "Impact Analyses" in the HomeBoxes component to maintain consistency with config changes.
- **Files Modified**:
  - `src/components/HomeBoxes.vue`: Updated the heading text from "Fiscal Impact Analyses" to "Impact Analyses"
- **Technical Notes**: This change ensures consistent terminology throughout the application while maintaining the same routing and functionality.

### 2025-04-10: Updated publication titles and found hardcoded "Fiscal Impact Analyses" reference
- **Change Summary**: Identified and documented a hardcoded reference to "Fiscal Impact Analyses" in the HomeBoxes component and discovered additional publication title changes in config.json.
- **Files Examined**:
  - `src/components/HomeBoxes.vue`: Contains a hardcoded reference to "Fiscal Impact Analyses" that needs to be updated to "Impact Analyses"
  - `src/config.json`: Multiple publication titles have been simplified
- **Technical Notes**: The HomeBoxes component contains a hardcoded plural reference that should be updated to maintain consistency with the config changes.

### 2025-04-10: Changed publication titles in config.json
- **Change Summary**: Simplified multiple publication type titles throughout the application.
- **Files Modified**:
  - `src/config.json`: Changed several publication titles:
    - Changed "Fiscal Impact Analysis" to "Impact Analysis"
    - Changed "Research Reports" to "Reports"
    - Changed "Prison Population Projections" to "Projections"
    - Changed "Annual Report" to "Annual Reports" (pluralized)
- **Technical Notes**: These changes affect the display labels in the publications dropdown menu and category headings; the underlying enum values, slugs, and routing remain unchanged

### 2025-04-10: Changed "News" to "Announcements" in navigation
- **Change Summary**: Updated all instances of "News" to "Announcements" in the navigation and related UI elements without modifying routing or backend functionality.
- **Files Modified**:
  - `src/App.vue`: Modified to intercept the sections data after API load to change the "News" label to "Announcements" in the navigation menu
  - `src/views/News.vue`: Updated page title from "News Archive" to "Announcements Archive" for consistency
  - `src/components/NewsCard.vue`: Changed text from "SPAC News" to "SPAC Announcements" to maintain consistent terminology
- **Technical Notes**: Only display labels were changed; all routing, URLs, and backend functionality remain unchanged
