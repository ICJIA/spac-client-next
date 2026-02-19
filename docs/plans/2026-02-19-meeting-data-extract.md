# Meeting Data Extract & Documentation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create documentation of the SPAC meeting content model and a standalone extraction script that produces JSON + CSV files of all meeting data for the WCM development team.

**Architecture:** A standalone Node script (`extractMeetings.js`) follows the existing `buildSearchIndex.js` pattern — queries the live Strapi GraphQL API, transforms the response into a flat structure with full absolute file URLs, and writes both a JSON file (complete data) and a CSV file (WCM team's requested format). A separate markdown documentation file describes the meeting schema, data flow, and extraction process.

**Tech Stack:** Node.js, graphql-request (already installed), jsonfile (transitive dep, already available), fs (stdlib). No new dependencies needed.

---

## Context for Implementer

### Meeting Schema (Strapi GraphQL)

The `Meeting` content type has these fields (confirmed via introspection schema):

| Field | Type | Notes |
|-------|------|-------|
| `_id` / `id` | ID | Internal Strapi identifier |
| `title` | String | Meeting title |
| `scheduledDate` | DateTime | Scheduled meeting date |
| `summary` | String | Brief summary |
| `content` | String | Full markdown body |
| `isPublished` | Boolean | Publication flag |
| `searchMeta` | String | Search metadata |
| `slug` | String | URL-friendly identifier |
| `category` | ENUM | `specialTopic` or `regular` |
| `createdAt` / `updatedAt` | DateTime | CMS timestamps |
| `meetingMaterial` | GroupMeetingMaterial[] | Attached files (see below) |
| `tags` | Tag[] | Associated tags |

**GroupMeetingMaterial** structure:
- `name` (String) — display name of the material
- `summary` (String) — description of the material
- `file` (UploadFile[]) — array with `name`, `hash`, `url`

**Category enum mapping** (from `src/config.json`):
- `specialTopic` → "Special Topic" (slug: `special-topic`)
- `regular` → "Council Meetings" (slug: `regular`)

**Important gap:** There is NO `location` field in the Meeting schema. The WCM team requested location data — it does not exist as structured data. The CSV output includes an empty `location` placeholder column.

### Existing Patterns to Follow

- `buildSearchIndex.js` — same structure: require graphql-request, read config, build query, write file
- `buildSitemap.js` — shows how meeting categories map to URL paths
- API base URL: `https://spac.icjia-api.cloud`
- GraphQL endpoint: `https://spac.icjia-api.cloud/graphql`
- File URLs: relative paths like `/uploads/filename.pdf`, prepend base URL for absolute

### Output Directory

Script writes to `./src/api/` (same as other build artifacts). Files:
- `meetings.json` — full meeting data
- `meetings.csv` — flat CSV for WCM team

---

## Task 1: Create the meeting documentation

**Files:**
- Create: `docs/meeting-content-model.md`

**Step 1: Write the documentation file**

```markdown
# SPAC Meeting Content Model

## Overview

Meetings are managed in the Strapi CMS at `https://spac.icjia-api.cloud` and served via GraphQL. The SPAC client application at `https://spac.illinois.gov` consumes this data to render meeting listings and detail pages.

There are two meeting categories:
- **Council Meetings** (`regular`) — Regular SPAC council meetings
- **Special Topic** (`specialTopic`) — Special topic meetings

## Meeting Schema

| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Meeting title (e.g., "SPAC Council Meeting - March 2024") |
| `scheduledDate` | DateTime | Date/time the meeting is scheduled |
| `summary` | String | Brief summary of the meeting |
| `content` | Markdown | Full meeting description, rendered as HTML on the site |
| `category` | Enum | `regular` (Council Meetings) or `specialTopic` (Special Topic) |
| `slug` | String | URL identifier (e.g., `spac-council-meeting-march-2024`) |
| `searchMeta` | String | Keywords for site search indexing |
| `isPublished` | Boolean | Controls visibility on the public site |
| `createdAt` | DateTime | CMS record creation timestamp |
| `updatedAt` | DateTime | CMS record last-modified timestamp |

### Meeting Materials (attached files)

Each meeting can have zero or more `meetingMaterial` entries. Each entry contains:

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Display name (e.g., "Meeting Agenda", "Slide Deck", "Adopted Principles") |
| `summary` | String | Description of the material |
| `file` | Array | Uploaded file(s) with `name` (filename), `hash` (unique ID), `url` (relative path) |

File URLs are relative to the API base. To get a downloadable link:
```
https://spac.icjia-api.cloud{file.url}
```

Example: if `file.url` is `/uploads/agenda_abc123.pdf`, the full URL is:
```
https://spac.icjia-api.cloud/uploads/agenda_abc123.pdf
```

### Tags

Meetings can be tagged with zero or more tags, each having a `name` and `slug`.

### Known Data Gaps

- **Location:** There is no `location` field in the meeting schema. Meeting location is not captured as structured data in the CMS.
- **Time:** The `scheduledDate` field stores a date. Specific meeting times may be embedded in the `content` markdown field but are not a discrete queryable field.

## GraphQL API Access

**Endpoint:** `https://spac.icjia-api.cloud/graphql`

### Query: All published meetings

```graphql
{
  meetings(sort: "scheduledDate:desc", where: { isPublished: true }, limit: 250) {
    title
    slug
    scheduledDate
    summary
    content
    category
    searchMeta
    createdAt
    updatedAt
    meetingMaterial {
      name
      summary
      file {
        name
        hash
        url
      }
    }
    tags {
      name
      slug
    }
  }
}
```

### Query: Meetings by category

Replace `"regular"` with `"specialTopic"` as needed:

```graphql
{
  meetings(sort: "scheduledDate:desc", where: { isPublished: true, category: "regular" }, limit: 250) {
    title
    slug
    scheduledDate
    summary
    category
    meetingMaterial {
      name
      summary
      file {
        name
        hash
        url
      }
    }
    tags {
      name
      slug
    }
  }
}
```

## Client Application URLs

Meeting detail pages on the public site follow this pattern:
```
https://spac.illinois.gov/meetings/{category-slug}/{meeting-slug}
```

Category slug mapping:
- `regular` → `/meetings/regular/{slug}`
- `specialTopic` → `/meetings/special-topic/{slug}`

## Data Extraction

Run the extraction script to generate JSON and CSV exports:

```bash
node extractMeetings.js
```

This produces two files in `./src/api/`:
- `meetings.json` — Full structured data (JSON array of meeting objects)
- `meetings.csv` — Flat export with columns: title, scheduledDate, location, category, summary, meetingMaterials, tags, slug, siteUrl, createdAt, updatedAt

The CSV `location` column is empty (see Known Data Gaps above). The `meetingMaterials` column contains a pipe-separated list of material names with their full download URLs.

## Downloading Meeting Material PDFs

The JSON and CSV contain full absolute URLs to all meeting material files. These can be bulk-downloaded via:

1. **Direct HTTP download** from the URLs in the extract
2. **SFTP access** to the server (preferred for bulk downloads of PDFs)

For SFTP access, contact the ICJIA infrastructure team.
```

**Step 2: Commit**

```bash
git add docs/meeting-content-model.md
git commit -m "docs: add meeting content model documentation for WCM team"
```

---

## Task 2: Create the meeting extraction script

**Files:**
- Create: `extractMeetings.js` (project root, alongside `buildSearchIndex.js`)

**Step 1: Write the extraction script**

```javascript
/* eslint-disable no-console */
/**
 * @fileoverview Extraction script for meeting data.
 * Queries the Strapi GraphQL API for all published meetings and generates:
 * 1. meetings.json — full structured meeting data with absolute file URLs
 * 2. meetings.csv — flat CSV export for the WCM development team
 *
 * Usage: node extractMeetings.js
 *
 * @author ICJIA
 */

const { request } = require("graphql-request");
const jsonfile = require("jsonfile");
const fs = require("fs");
const config = require("./src/config.json");

const api = `${config.baseURL}/graphql`;
const outputDir = "./src/api";
const jsonFileName = "meetings.json";
const csvFileName = "meetings.csv";

const categoryMap = {};
config.strapiEnums.meetings.forEach(m => {
  categoryMap[m.enum] = { title: m.title, slug: m.slug };
});

const query = `{
  meetings(sort: "scheduledDate:desc", where: { isPublished: true }, limit: ${config.maxResults}) {
    title
    slug
    scheduledDate
    summary
    content
    category
    searchMeta
    createdAt
    updatedAt
    meetingMaterial {
      name
      summary
      file {
        name
        hash
        url
      }
    }
    tags {
      name
      slug
    }
  }
}`;

function buildAbsoluteUrl(relativeUrl) {
  if (!relativeUrl) return "";
  return `${config.baseURL}${relativeUrl}`;
}

function buildSiteUrl(meeting) {
  const cat = categoryMap[meeting.category];
  if (!cat) return "";
  return `${config.clientURL}/meetings/${cat.slug}/${meeting.slug}`;
}

function transformMeeting(meeting) {
  const materials = (meeting.meetingMaterial || []).map(mat => {
    const files = (mat.file || []).map(f => ({
      fileName: f.name,
      fileHash: f.hash,
      fileUrl: buildAbsoluteUrl(f.url)
    }));
    return {
      name: mat.name,
      summary: mat.summary || "",
      files
    };
  });

  const tags = (meeting.tags || []).map(t => ({
    name: t.name,
    slug: t.slug
  }));

  const cat = categoryMap[meeting.category] || {};

  return {
    title: meeting.title,
    slug: meeting.slug,
    scheduledDate: meeting.scheduledDate,
    summary: meeting.summary || "",
    category: meeting.category,
    categoryTitle: cat.title || meeting.category,
    location: "",
    content: meeting.content || "",
    searchMeta: meeting.searchMeta || "",
    meetingMaterials: materials,
    tags,
    siteUrl: buildSiteUrl(meeting),
    createdAt: meeting.createdAt,
    updatedAt: meeting.updatedAt
  };
}

function escapeCsvField(value) {
  if (value == null) return "";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

function meetingToCsvRow(meeting) {
  const materialsStr = meeting.meetingMaterials
    .map(mat => {
      const urls = mat.files.map(f => f.fileUrl).join(" ");
      return `${mat.name}: ${urls}`.trim();
    })
    .join(" | ");

  const tagsStr = meeting.tags.map(t => t.name).join("; ");

  return [
    meeting.title,
    meeting.scheduledDate,
    meeting.location,
    meeting.categoryTitle,
    meeting.summary,
    materialsStr,
    tagsStr,
    meeting.slug,
    meeting.siteUrl,
    meeting.createdAt,
    meeting.updatedAt
  ]
    .map(escapeCsvField)
    .join(",");
}

function buildCsv(meetings) {
  const header =
    "title,scheduledDate,location,category,summary,meetingMaterials,tags,slug,siteUrl,createdAt,updatedAt";
  const rows = meetings.map(meetingToCsvRow);
  return [header, ...rows].join("\n");
}

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
  console.log(`Created: ${outputDir}/`);
}

request(api, query)
  .then(res => {
    const meetings = res.meetings.map(transformMeeting);

    jsonfile.writeFile(
      `${outputDir}/${jsonFileName}`,
      meetings,
      { spaces: 2 },
      function(err) {
        if (err) console.error(err);
        console.log(`Created: ${outputDir}/${jsonFileName} (${meetings.length} meetings)`);
      }
    );

    const csv = buildCsv(meetings);
    fs.writeFileSync(`${outputDir}/${csvFileName}`, csv, "utf8");
    console.log(`Created: ${outputDir}/${csvFileName} (${meetings.length} meetings)`);
  })
  .catch(err => {
    console.error("Failed to fetch meetings from GraphQL API:");
    console.error(err.message || err);
    process.exit(1);
  });
```

**Step 2: Run the script to verify it works**

```bash
node extractMeetings.js
```

Expected output:
```
Created: ./src/api/meetings.json (N meetings)
Created: ./src/api/meetings.csv (N meetings)
```

**Step 3: Verify the JSON output**

```bash
node -e "const d = require('./src/api/meetings.json'); console.log('Count:', d.length); console.log('First:', JSON.stringify(d[0], null, 2).slice(0, 500))"
```

Verify:
- Meeting objects have all expected fields
- `meetingMaterials[].files[].fileUrl` starts with `https://spac.icjia-api.cloud`
- `siteUrl` starts with `https://spac.illinois.gov/meetings/`
- `location` is empty string (placeholder)

**Step 4: Verify the CSV output**

```bash
head -5 ./src/api/meetings.csv
```

Verify:
- Header row: `title,scheduledDate,location,category,summary,meetingMaterials,tags,slug,siteUrl,createdAt,updatedAt`
- Location column is empty
- Meeting materials column has pipe-separated entries with full URLs

**Step 5: Add npm script**

In `package.json`, add to `"scripts"`:
```json
"extract:meetings": "node extractMeetings.js"
```

**Step 6: Commit**

```bash
git add extractMeetings.js docs/meeting-content-model.md
git commit -m "feat: add meeting data extraction script and documentation

Standalone Node script queries Strapi GraphQL API and produces:
- meetings.json (full structured data with absolute file URLs)
- meetings.csv (flat export for WCM team migration)

Documentation covers the meeting schema, GraphQL queries,
known data gaps (no location field), and download options."
```

---

## Task 3: Verify end-to-end and sanity-check output

**Step 1: Run the full extraction**

```bash
npm run extract:meetings
```

**Step 2: Spot-check a meeting with materials**

```bash
node -e "
const d = require('./src/api/meetings.json');
const withMats = d.find(m => m.meetingMaterials.length > 0);
if (withMats) {
  console.log('Title:', withMats.title);
  console.log('Date:', withMats.scheduledDate);
  console.log('Category:', withMats.categoryTitle);
  console.log('Materials:');
  withMats.meetingMaterials.forEach(m => {
    console.log('  -', m.name);
    m.files.forEach(f => console.log('    URL:', f.fileUrl));
  });
  console.log('Tags:', withMats.tags.map(t => t.name).join(', '));
  console.log('Site URL:', withMats.siteUrl);
} else {
  console.log('No meetings with materials found');
}
"
```

**Step 3: Verify a material URL is downloadable**

Pick a URL from step 2 and verify it resolves (returns a PDF or file, not a 404):

```bash
curl -sI "<url-from-step-2>" | head -5
```

Expected: `HTTP/2 200` with a content-type like `application/pdf`.

**Step 4: Open CSV in a spreadsheet or inspect column count**

```bash
node -e "
const fs = require('fs');
const lines = fs.readFileSync('./src/api/meetings.csv', 'utf8').split('\n');
console.log('Total rows (including header):', lines.length);
console.log('Header columns:', lines[0].split(',').length);
console.log('Header:', lines[0]);
"
```

Expected: 11 columns matching the header.
