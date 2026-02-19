# extractMeetings.js — Documentation

**Companion documentation for the standalone SPAC meeting extraction script.**

---

## What This Script Does

`extractMeetings.js` queries the SPAC Strapi GraphQL API for all published meetings and produces two output files:

1. **meetings.json** — Full structured meeting data (JSON array) with absolute file URLs
2. **meetings.csv** — Flat CSV export suitable for spreadsheets, databases, or the WCM development team

The script has **zero dependencies**. It uses only Node.js built-in modules (`https`, `fs`, `path`). No `npm install` required. Just copy the file and run it.

---

## Installing Node.js

If you don't have Node.js installed, follow the instructions for your operating system below.

### macOS

**Option A — Homebrew (recommended if you have Homebrew):**

```bash
brew install node
```

**Option B — Official installer:**

1. Go to https://nodejs.org
2. Download the **LTS** version (the big green button on the left)
3. Open the `.pkg` file and follow the prompts
4. Open Terminal (Applications > Utilities > Terminal) and verify:

```bash
node --version
```

You should see something like `v20.11.0` (any version >= 10 is fine).

### Linux (Ubuntu / Debian)

```bash
sudo apt update
sudo apt install nodejs
node --version
```

If your distro ships a very old Node.js, use NodeSource:

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version
```

### Windows

1. Go to https://nodejs.org
2. Download the **LTS** Windows Installer (.msi)
3. Run the installer (accept defaults — it adds `node` to your PATH)
4. Open **Command Prompt** or **PowerShell** and verify:

```cmd
node --version
```

> **Note:** Windows is not the typical ICJIA development environment, but the script works fine on Windows if Node.js is installed.

---

## Running the Script

### Step 1: Open a terminal

- **macOS**: Applications > Utilities > Terminal (or Spotlight > "Terminal")
- **Linux**: Ctrl+Alt+T (or your distro's terminal app)
- **Windows**: Start > Command Prompt (or PowerShell)

### Step 2: Navigate to the folder containing the script

```bash
cd /path/to/folder/containing/extractMeetings.js
```

For example, if you saved the script to your Desktop:

```bash
# macOS / Linux
cd ~/Desktop

# Windows
cd %USERPROFILE%\Desktop
```

### Step 3: Run the script

```bash
node extractMeetings.js
```

### Expected Output

```
Fetching meetings from https://spac.icjia-api.cloud/graphql ...
Created: meetings.json (40 meetings)
Created: meetings.csv (40 meetings)
```

The two output files (`meetings.json` and `meetings.csv`) are written to the same folder where you ran the command.

### If Something Goes Wrong

| Symptom | Likely Cause | Fix |
|---------|-------------|-----|
| `node: command not found` | Node.js is not installed | See "Installing Node.js" above |
| `Error: HTTPS request failed` | No internet connection or API is down | Check your network; try opening https://spac.icjia-api.cloud/graphql in a browser |
| `Error: GraphQL errors` | The API schema may have changed | Contact Chris Schweda (christopher.schweda@illinois.gov) |
| `Error: EACCES permission denied` | No write permission in the current folder | Run from a folder you own (e.g., Desktop or Documents) |

---

## Output File Details

### meetings.json

A JSON array where each element is a meeting object:

```json
{
  "title": "Regular Sentencing Policy Advisory Council Meeting November 2025",
  "slug": "reg_nov_2025",
  "scheduledDate": "2025-11-21T10:00:00.000Z",
  "category": "regular",
  "categoryTitle": "Council Meetings",
  "location": "",
  "content": "Markdown content...",
  "searchMeta": "...",
  "meetingMaterials": [
    {
      "name": "Meeting Agenda",
      "files": [
        {
          "fileName": "20251121_agenda_final.pdf",
          "fileHash": "20251121_agenda_final_20251118T18021453",
          "fileUrl": "https://spac.icjia-api.cloud/uploads/20251121_agenda_final-20251118T18021453.pdf"
        }
      ]
    }
  ],
  "tags": [
    { "name": "Sentencing Policy", "slug": "sentencing-policy" }
  ],
  "siteUrl": "https://spac.illinois.gov/meetings/regular/reg_nov_2025",
  "createdAt": "2025-11-01T15:30:00.000Z",
  "updatedAt": "2025-11-20T12:00:00.000Z"
}
```

### meetings.csv

A flat CSV with 7 columns, focused on meeting identification and direct artifact URLs:

| Column | Description |
|--------|-------------|
| `title` | Meeting title |
| `scheduledDate` | ISO 8601 date/time |
| `slug` | URL-safe meeting identifier |
| `siteUrl` | Full URL to the meeting page on https://spac.illinois.gov |
| `agendaUrl` | Direct download URL for the meeting agenda PDF (empty if none) |
| `minutesUrl` | Direct download URL for the meeting minutes PDF (empty if none) |
| `otherMaterialUrls` | Pipe-separated download URLs for all other materials (slide decks, handouts, reports, etc.) |

**How materials are classified:**
- Any material with **"agenda"** in its name goes to `agendaUrl`
- Any material with **"minutes"** in its name goes to `minutesUrl`
- Everything else (presentations, handouts, reports, etc.) goes to `otherMaterialUrls`

If a meeting has no materials, all three URL columns are empty. If a meeting has only an agenda, `minutesUrl` and `otherMaterialUrls` are empty, and so on.

**Example row (November 2025 meeting with 4 materials):**

| Column | Value |
|--------|-------|
| `agendaUrl` | `https://spac.icjia-api.cloud/uploads/20251121_agenda_final-20251118T18021453.pdf` |
| `minutesUrl` | `https://spac.icjia-api.cloud/uploads/SPAC_September_Meeting_Minutes-20251120T18394552.pdf` |
| `otherMaterialUrls` | `https://...Handout_final-20251120T18394552.pdf \| https://...Drug_Trends_Nov21_2025-20251120T18394557.pdf` |

### Known Data Gaps

- **Location:** There is no `location` field in the SPAC meeting schema. Location is not included in the CSV.
- **Time:** `scheduledDate` stores a date. Specific meeting times may appear in the `content` Markdown field but are not a separate queryable field.

---

## Downloading Meeting Material PDFs

The JSON and CSV output contain full absolute URLs to all meeting material files (agendas, slides, etc.). These files can be downloaded directly from the URLs.

For **bulk downloads** of all PDFs, SFTP access to the server is preferred. Contact Chris Schweda (christopher.schweda@illinois.gov) for access.

---

## Adapting This Script for Other Content Types

The SPAC Strapi API serves several content types beyond meetings: **publications**, **news/posts**, **biographies**, **pages**, **sections**, and **tags**. This script can be adapted to extract any of them.

### What changes automatically

The **JSON output** reflects whatever fields your GraphQL query returns. Change the query and the transform function, and the JSON adapts.

### What you must change manually

The **CSV output** is manually mapped to specific columns. When repurposing for a different content type, update these 6 things:

| # | What to Change | Where in the Script | Example |
|---|---------------|-------------------|---------|
| 1 | **GraphQL query** | `const query = ...` | Change `meetings(...)` to `publications(...)` with the fields you want |
| 2 | **Transform function** | `function transformMeeting(meeting)` | Rename to `transformPublication`, map new fields |
| 3 | **CSV row builder** | `function meetingToCsvRow(meeting)` | Update the array of fields to match your new columns |
| 4 | **CSV header** | `function buildCsv(meetings)` | Update the header string to match the new columns |
| 5 | **Output file names** | `const JSON_FILE` / `const CSV_FILE` | Change to `"publications.json"` / `"publications.csv"` |
| 6 | **Data key in main()** | `data.meetings.map(...)` | Change to `data.publications.map(...)` |

### Functions you can reuse as-is

These helper functions are generic and work with any content type:

- `graphqlRequest(endpoint, queryString)` — sends a GraphQL query via HTTPS
- `buildAbsoluteUrl(relativeUrl)` — converts relative file paths to absolute URLs
- `escapeCsvField(value)` — escapes values for safe CSV output (RFC 4180)

### Example: Extracting publications

Here's what a publications query would look like (paste into the `query` variable):

```graphql
{
  publications(sort: "year:desc", where: { isPublished: true }, limit: 250) {
    title
    slug
    year
    category
    searchMeta
    createdAt
    updatedAt
    mediaMaterial {
      name
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

Then update `transformMeeting` → `transformPublication`, adjust the CSV columns, and change `data.meetings` → `data.publications` in `main()`.

### Available content types and their GraphQL query names

| Query Name | Content Type | Key Fields |
|------------|-------------|------------|
| `meetings` | Meetings | title, scheduledDate, category, meetingMaterial, tags |
| `publications` | Publications | title, year, category, mediaMaterial, externalMediaMaterial, tags |
| `posts` | News/Posts | title, slug, content, summary, tags |
| `biographies` | Biographies | firstName, lastName, title, category, membership, headshot |
| `pages` | Pages | title, slug, content, summary, section, tags |
| `sections` | Sections | title, slug, displayNav, pages |
| `tags` | Tags | name, slug, summary, content |

For full schema details and 29 ready-to-use query examples, see the companion guide: [`docs/graphql_api_guide.md`](./graphql_api_guide.md)

---

## API Reference

| Item | Value |
|------|-------|
| **GraphQL Endpoint** | https://spac.icjia-api.cloud/graphql |
| **Interactive Playground** | https://spac.icjia-api.cloud/graphql (open in browser) |
| **Public Site** | https://spac.illinois.gov |
| **File URL Base** | https://spac.icjia-api.cloud (prepend to relative file paths) |
| **Script Requirements** | Node.js >= 10.0.0, network access to API |
| **Dependencies** | None (uses only Node.js built-in modules) |

---

## Contact

Chris Schweda — christopher.schweda@illinois.gov
