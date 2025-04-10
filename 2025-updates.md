# 2025 SPAC Website Updates

This file serves as a log of changes made to the SPAC website in 2025. It is maintained for external audit purposes and to help new developers understand the changes that have been implemented.

## Audit Log Rules

When updating this audit log:
1. Add a new entry with the current date
2. Include a brief description of the change (1-2 sentences)
3. List all files modified with brief descriptions of changes
4. Document all changes between the last update and the current state of the project

## Navigation Changes

### 2025-05-23: Changed "News" to "Announcements" in navigation
- **Change Summary**: Updated all instances of "News" to "Announcements" in the navigation and related UI elements without modifying routing or backend functionality.
- **Files Modified**:
  - `src/App.vue`: Modified to intercept the sections data after API load to change the "News" label to "Announcements" in the navigation menu
  - `src/views/News.vue`: Updated page title from "News Archive" to "Announcements Archive" for consistency
  - `src/components/NewsCard.vue`: Changed text from "SPAC News" to "SPAC Announcements" to maintain consistent terminology
- **Technical Notes**: Only display labels were changed; all routing, URLs, and backend functionality remain unchanged

### 2025-05-23: Changed "Fiscal Impact Analysis" to "Impact Analysis" in publications menu
- **Change Summary**: Updated the title of the Fiscal Impact Analysis publication type to display as "Impact Analysis" in the publications menu.
- **Files Modified**:
  - `src/config.json`: Changed the title field for the fiscalImpactAnalysis enum from "Fiscal Impact Analysis" to "Impact Analysis" while maintaining the same slug and functionality
- **Technical Notes**: This change affects only the display label in the publications dropdown menu; the underlying enum value, slug, and routing remain unchanged

