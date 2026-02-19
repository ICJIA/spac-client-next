/* eslint-disable no-console */
/**
 * @fileoverview Standalone extraction script for SPAC meeting data.
 *
 * This script queries the Illinois Sentencing Policy Advisory Council (SPAC)
 * Strapi CMS GraphQL API for all published meetings and generates two output
 * files in the current working directory:
 *
 *   1. **meetings.json** — Full structured meeting data (JSON array). Each
 *      meeting includes title, date, category, content, tags, and an array of
 *      meeting materials with absolute downloadable file URLs.
 *
 *   2. **meetings.csv** — Flat CSV optimized for artifact URL lookup. Each row
 *      is one meeting with columns for the agenda URL, minutes URL, and any
 *      other material URLs (pipe-separated). Designed for developers who need
 *      to quickly locate and download specific PDFs.
 *
 * **Zero dependencies** — this script uses only Node.js built-in modules
 * (`https`, `fs`, `path`). No `npm install` required. Copy the file anywhere
 * that has Node.js >= 10 and run it.
 *
 * **How it works (high-level flow):**
 *   1. Sends a GraphQL POST request to the Strapi API (`/graphql` endpoint)
 *   2. Receives an array of raw meeting objects
 *   3. Transforms each meeting: converts relative file URLs to absolute,
 *      maps category enums to display titles, builds public site URLs
 *   4. Writes the transformed array as pretty-printed JSON
 *   5. Flattens the same data into CSV rows, classifying materials into
 *      agenda / minutes / other columns by name matching
 *
 * Usage:  node extractMeetings.js
 *
 * For setup instructions (including how to install Node.js), troubleshooting,
 * adapting this script for other content types, and full output format details,
 * see the companion documentation:
 *   docs/extractMeetings.md
 *
 * @author ICJIA
 * @since 1.0.0
 * @contact Chris Schweda (christopher.schweda@illinois.gov)
 * @see {@link https://spac.icjia-api.cloud/graphql} GraphQL Playground (interactive)
 * @see {@link https://spac.illinois.gov} Public SPAC website
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

// =============================================================================
// Type definitions (for documentation only — no runtime effect)
// =============================================================================

/**
 * A raw meeting object as returned by the Strapi GraphQL API.
 * Field names match the GraphQL schema exactly.
 *
 * @typedef {Object} RawMeeting
 * @property {string} title - Meeting title (e.g., "SPAC Council Meeting - March 2024")
 * @property {string} slug - URL-safe identifier (e.g., "reg-mar-2024")
 * @property {string} scheduledDate - ISO 8601 date string (e.g., "2024-03-15T10:00:00.000Z")
 * @property {string|null} content - Full meeting description in Markdown, or null
 * @property {string} category - Strapi enum: "regular" or "specialTopic"
 * @property {string|null} searchMeta - Search keywords for the site search index, or null
 * @property {string} createdAt - ISO 8601 timestamp when the CMS record was created
 * @property {string} updatedAt - ISO 8601 timestamp when the CMS record was last modified
 * @property {RawMeetingMaterial[]} meetingMaterial - Array of attached material groups
 * @property {RawTag[]} tags - Array of tags associated with this meeting
 */

/**
 * A raw meeting material group from the GraphQL API.
 * This is a Strapi "component" (repeatable group) — not a standalone content type.
 * Note: material groups do NOT have their own tags in the CMS schema.
 *
 * @typedef {Object} RawMeetingMaterial
 * @property {string} name - Display name (e.g., "Agenda", "Meeting Minutes", "Slide Deck")
 * @property {RawFile[]} file - Array of uploaded files attached to this material group
 */

/**
 * A raw uploaded file object from the GraphQL API (Strapi UploadFile type).
 * The `url` field is RELATIVE to the API base URL and must be prepended with
 * {@link BASE_API_URL} to form a downloadable link.
 *
 * @typedef {Object} RawFile
 * @property {string} name - Original filename (e.g., "agenda_march_2024.pdf")
 * @property {string} hash - Unique hash assigned by Strapi on upload, useful for deduplication
 * @property {string} url - Relative URL path (e.g., "/uploads/agenda_march_2024-abc123.pdf")
 */

/**
 * A raw tag object from the GraphQL API.
 * Tags are associated at the meeting level only — individual materials and
 * files do not have tags in this version of the Strapi schema.
 *
 * @typedef {Object} RawTag
 * @property {string} name - Display name (e.g., "Sentencing Policy")
 * @property {string} slug - URL-safe identifier (e.g., "sentencing-policy")
 */

/**
 * A transformed meeting object ready for JSON output.
 * This is the shape written to meetings.json.
 *
 * @typedef {Object} TransformedMeeting
 * @property {string} title - Meeting title
 * @property {string} slug - URL-safe identifier
 * @property {string} scheduledDate - ISO 8601 date string
 * @property {string} category - Raw category enum ("regular" or "specialTopic")
 * @property {string} categoryTitle - Human-readable category ("Council Meetings" or "Special Topic")
 * @property {string} location - Always empty string (no location field exists in the CMS schema)
 * @property {string} content - Meeting description in Markdown, or empty string
 * @property {string} searchMeta - Search keywords, or empty string
 * @property {TransformedMaterial[]} meetingMaterials - Array of material groups with absolute URLs
 * @property {TransformedTag[]} tags - Array of meeting-level tags
 * @property {string} siteUrl - Full public URL to the meeting detail page on spac.illinois.gov
 * @property {string} createdAt - ISO 8601 creation timestamp
 * @property {string} updatedAt - ISO 8601 last-modified timestamp
 */

/**
 * A transformed meeting material group with absolute file URLs.
 *
 * @typedef {Object} TransformedMaterial
 * @property {string} name - Display name of the material (e.g., "Agenda")
 * @property {TransformedFile[]} files - Array of files with absolute download URLs
 */

/**
 * A transformed file object with an absolute download URL.
 *
 * @typedef {Object} TransformedFile
 * @property {string} fileName - Original filename (e.g., "agenda_march_2024.pdf")
 * @property {string} fileHash - Unique Strapi upload hash (useful for deduplication)
 * @property {string} fileUrl - Absolute download URL (e.g., "https://spac.icjia-api.cloud/uploads/...")
 */

/**
 * A transformed tag object (same shape as raw, included for completeness).
 *
 * @typedef {Object} TransformedTag
 * @property {string} name - Display name
 * @property {string} slug - URL-safe identifier
 */

// =============================================================================
// Configuration (inlined — no external config file needed)
// =============================================================================

/**
 * Base URL of the Strapi API server. All relative file URLs from the API
 * (e.g., "/uploads/file.pdf") are resolved against this base.
 *
 * This is the CMS backend — it hosts the GraphQL endpoint at `/graphql`
 * and serves uploaded files from `/uploads/`.
 *
 * @constant {string}
 */
const BASE_API_URL = "https://spac.icjia-api.cloud";

/**
 * Base URL of the public-facing SPAC website. Used to construct meeting
 * detail page URLs in the format:
 *   `{CLIENT_URL}/meetings/{category-slug}/{meeting-slug}`
 *
 * @constant {string}
 */
const CLIENT_URL = "https://spac.illinois.gov";

/**
 * Maximum number of meetings to fetch from the API in a single query.
 * The Strapi default limit is 100; we set this higher to ensure we get
 * all meetings. As of February 2026, there are ~40 published meetings.
 *
 * @constant {number}
 */
const MAX_RESULTS = 250;

/**
 * Output path for the JSON file. Resolves to "./meetings.json" relative
 * to the current working directory (wherever you run the script from).
 *
 * @constant {string}
 */
const JSON_FILE = path.join(".", "meetings.json");

/**
 * Output path for the CSV file. Resolves to "./meetings.csv" relative
 * to the current working directory.
 *
 * @constant {string}
 */
const CSV_FILE = path.join(".", "meetings.csv");

/**
 * Lookup map from the Strapi category enum value to its human-readable
 * display title and URL slug.
 *
 * The SPAC site has two meeting categories:
 *   - "regular"      → Council Meetings (URL: /meetings/regular/{slug})
 *   - "specialTopic" → Special Topic    (URL: /meetings/special-topic/{slug})
 *
 * If you add new meeting categories in Strapi, add them here too.
 *
 * @constant {Object.<string, {title: string, slug: string}>}
 */
const categoryMap = {
  regular: { title: "Council Meetings", slug: "regular" },
  specialTopic: { title: "Special Topic", slug: "special-topic" }
};

// =============================================================================
// GraphQL query
// =============================================================================

/**
 * GraphQL query string sent to the Strapi API.
 *
 * Fetches all published meetings sorted by scheduled date (newest first).
 * Includes nested meeting materials (with file metadata) and tags.
 *
 * **Fields returned:**
 * - `title`, `slug`, `scheduledDate`, `content`, `category`, `searchMeta`,
 *   `createdAt`, `updatedAt` — scalar meeting fields
 * - `meetingMaterial` — repeatable component group, each containing:
 *   - `name` — display name (e.g., "Agenda", "Minutes")
 *   - `file` — array of UploadFile objects with `name`, `hash`, `url`
 * - `tags` — related Tag objects with `name` and `slug`
 *
 * **Intentional omissions:**
 * - `summary` is excluded because it can contain newlines that break CSV rows
 * - `id` / `_id` are excluded because they are internal Strapi identifiers
 *   not useful for external consumers
 *
 * @constant {string}
 */
const query = `{
  meetings(sort: "scheduledDate:desc", where: { isPublished: true }, limit: ${MAX_RESULTS}) {
    title
    slug
    scheduledDate
    content
    category
    searchMeta
    createdAt
    updatedAt
    meetingMaterial {
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
}`;

// =============================================================================
// HTTP helper (replaces graphql-request dependency)
// =============================================================================

/**
 * Sends a GraphQL query to the API using Node's built-in `https` module.
 *
 * This function replaces the `graphql-request` npm package to keep the script
 * zero-dependency. It performs an HTTPS POST with a JSON body containing the
 * query string, then parses the JSON response.
 *
 * **Error handling:**
 * - Network errors (DNS failure, timeout, connection refused) reject with
 *   an "HTTPS request failed" error
 * - GraphQL-level errors (invalid query, schema mismatch) reject with a
 *   "GraphQL errors" error containing the full error array
 * - Malformed JSON responses reject with a "Failed to parse" error
 *
 * @param {string} endpoint - Full URL of the GraphQL endpoint
 *   (e.g., "https://spac.icjia-api.cloud/graphql")
 * @param {string} queryString - GraphQL query string (the contents of the
 *   `query` constant, or any valid GraphQL query)
 * @returns {Promise<Object>} Resolves with the `data` property of the parsed
 *   GraphQL response (i.e., `response.data`, not the full envelope)
 * @throws {Error} If the HTTP request fails, the response is not valid JSON,
 *   or the GraphQL response contains an `errors` array
 *
 * @example
 * graphqlRequest("https://spac.icjia-api.cloud/graphql", "{ meetings { title } }")
 *   .then(function (data) {
 *     console.log(data.meetings); // [{ title: "..." }, ...]
 *   });
 */
function graphqlRequest(endpoint, queryString) {
  return new Promise(function (resolve, reject) {
    var url = new URL(endpoint);
    var postData = JSON.stringify({ query: queryString });

    var options = {
      hostname: url.hostname,
      port: url.port || 443,
      path: url.pathname,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(postData)
      }
    };

    var req = https.request(options, function (res) {
      var body = "";
      res.on("data", function (chunk) { body += chunk; });
      res.on("end", function () {
        try {
          var json = JSON.parse(body);
          if (json.errors) {
            reject(new Error("GraphQL errors: " + JSON.stringify(json.errors)));
          } else {
            resolve(json.data);
          }
        } catch (e) {
          reject(new Error("Failed to parse API response: " + e.message));
        }
      });
    });

    req.on("error", function (e) {
      reject(new Error("HTTPS request failed: " + e.message));
    });

    req.write(postData);
    req.end();
  });
}

// =============================================================================
// Transform helpers
// =============================================================================

/**
 * Converts a relative Strapi file URL to an absolute downloadable URL.
 *
 * Strapi stores file URLs as relative paths (e.g., "/uploads/file.pdf").
 * This function prepends {@link BASE_API_URL} to produce a full URL that
 * can be opened in a browser or downloaded with curl/wget.
 *
 * @param {string} relativeUrl - Relative file path from the API
 *   (e.g., "/uploads/agenda_abc123.pdf")
 * @returns {string} Absolute URL
 *   (e.g., "https://spac.icjia-api.cloud/uploads/agenda_abc123.pdf"),
 *   or empty string if `relativeUrl` is falsy (null, undefined, or "")
 *
 * @example
 * buildAbsoluteUrl("/uploads/agenda.pdf")
 * // => "https://spac.icjia-api.cloud/uploads/agenda.pdf"
 *
 * buildAbsoluteUrl(null)
 * // => ""
 */
function buildAbsoluteUrl(relativeUrl) {
  if (!relativeUrl) return "";
  return BASE_API_URL + relativeUrl;
}

/**
 * Builds the public-facing site URL for a meeting detail page.
 *
 * The SPAC website uses this URL pattern for meeting pages:
 *   `https://spac.illinois.gov/meetings/{category-slug}/{meeting-slug}`
 *
 * The category slug comes from {@link categoryMap}:
 *   - "regular" → "regular"
 *   - "specialTopic" → "special-topic"
 *
 * @param {RawMeeting} meeting - Raw meeting object from the GraphQL response.
 *   Must have `category` and `slug` properties.
 * @returns {string} Full public site URL
 *   (e.g., "https://spac.illinois.gov/meetings/regular/reg-mar-2024"),
 *   or empty string if the category is not found in {@link categoryMap}
 *
 * @example
 * buildSiteUrl({ category: "regular", slug: "reg-mar-2024" })
 * // => "https://spac.illinois.gov/meetings/regular/reg-mar-2024"
 *
 * buildSiteUrl({ category: "specialTopic", slug: "hearing-2024" })
 * // => "https://spac.illinois.gov/meetings/special-topic/hearing-2024"
 */
function buildSiteUrl(meeting) {
  var cat = categoryMap[meeting.category];
  if (!cat) return "";
  return CLIENT_URL + "/meetings/" + cat.slug + "/" + meeting.slug;
}

/**
 * Transforms a raw GraphQL meeting object into the output format used by
 * the JSON file.
 *
 * This function performs three key transformations:
 *   1. **File URLs**: Converts relative file paths to absolute downloadable URLs
 *      using {@link buildAbsoluteUrl}
 *   2. **Category mapping**: Adds a human-readable `categoryTitle` alongside
 *      the raw enum value (e.g., "Council Meetings" for "regular")
 *   3. **Site URL**: Generates the full public URL for the meeting detail page
 *      using {@link buildSiteUrl}
 *
 * It also adds an empty `location` placeholder. The SPAC CMS schema does NOT
 * have a location field — this was confirmed via GraphQL introspection.
 *
 * @param {RawMeeting} meeting - Raw meeting object as returned by the
 *   GraphQL API (shape defined by the `query` constant)
 * @returns {TransformedMeeting} Transformed meeting object ready for JSON
 *   output, with absolute URLs and enriched metadata
 *
 * @see {@link buildAbsoluteUrl} for URL conversion
 * @see {@link buildSiteUrl} for site URL construction
 * @see {@link categoryMap} for category enum → title/slug mapping
 */
function transformMeeting(meeting) {
  var materials = (meeting.meetingMaterial || []).map(function (mat) {
    var files = (mat.file || []).map(function (f) {
      return {
        fileName: f.name,
        fileHash: f.hash,
        fileUrl: buildAbsoluteUrl(f.url)
      };
    });
    return {
      name: mat.name,
      files: files
    };
  });

  var tags = (meeting.tags || []).map(function (t) {
    return { name: t.name, slug: t.slug };
  });

  var cat = categoryMap[meeting.category] || {};

  return {
    title: meeting.title,
    slug: meeting.slug,
    scheduledDate: meeting.scheduledDate,
    category: meeting.category,
    categoryTitle: cat.title || meeting.category,
    location: "",
    content: meeting.content || "",
    searchMeta: meeting.searchMeta || "",
    meetingMaterials: materials,
    tags: tags,
    siteUrl: buildSiteUrl(meeting),
    createdAt: meeting.createdAt,
    updatedAt: meeting.updatedAt
  };
}

// =============================================================================
// CSV helpers
// =============================================================================

/**
 * Escapes a value for safe inclusion in a CSV field, following RFC 4180.
 *
 * Rules applied:
 *   - `null` and `undefined` become empty string
 *   - If the string contains a comma, double quote, or newline, the entire
 *     field is wrapped in double quotes
 *   - Any internal double quotes are escaped by doubling them ("" → """")
 *   - All other values are returned as-is
 *
 * @param {*} value - The value to escape. Can be any type; it will be
 *   converted to a string via `String(value)`.
 * @returns {string} CSV-safe string representation of the value
 *
 * @example
 * escapeCsvField("hello")           // => "hello"
 * escapeCsvField("has, comma")      // => '"has, comma"'
 * escapeCsvField('has "quotes"')    // => '"has ""quotes"""'
 * escapeCsvField(null)              // => ""
 * escapeCsvField(42)                // => "42"
 */
function escapeCsvField(value) {
  if (value == null) return "";
  var str = String(value);
  if (str.indexOf(",") !== -1 || str.indexOf('"') !== -1 || str.indexOf("\n") !== -1) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

/**
 * Classifies a meeting material into one of three buckets based on its
 * display name. Used by {@link meetingToCsvRow} to route material URLs
 * into the correct CSV column.
 *
 * Classification rules (case-insensitive substring match):
 *   - Name contains **"agenda"** → `"agenda"` (e.g., "Agenda", "Meeting Agenda",
 *     "Agenda 6/16/2023")
 *   - Name contains **"minutes"** → `"minutes"` (e.g., "Meeting Minutes",
 *     "Approved Minutes", "July Meeting Minutes", "Sept Minutes")
 *   - Everything else → `"other"` (e.g., "Slide Deck", "Presentation",
 *     "Drug Laws in Illinois Handout", "Adopted Recommendations")
 *
 * If a meeting has multiple materials that match "agenda" or "minutes",
 * only the first match populates the dedicated CSV column; subsequent
 * matches spill into the "other" column to avoid data loss.
 *
 * @param {string} materialName - Display name of the material as stored
 *   in the CMS (e.g., "Meeting Agenda")
 * @returns {"agenda"|"minutes"|"other"} Classification bucket name
 *
 * @example
 * classifyMaterial("Agenda")                    // => "agenda"
 * classifyMaterial("September Meeting Minutes") // => "minutes"
 * classifyMaterial("Slide Deck")                // => "other"
 * classifyMaterial("")                          // => "other"
 */
function classifyMaterial(materialName) {
  var name = (materialName || "").toLowerCase().trim();
  if (name.indexOf("agenda") !== -1) return "agenda";
  if (name.indexOf("minutes") !== -1) return "minutes";
  return "other";
}

/**
 * Extracts all absolute file URLs from a single meeting material entry.
 *
 * Most materials have exactly one file, but the Strapi schema allows
 * multiple files per material group. This function returns all of them,
 * filtering out any empty/falsy URLs.
 *
 * @param {TransformedMaterial} mat - A single entry from a transformed
 *   meeting's `meetingMaterials` array
 * @returns {string[]} Array of absolute file URLs (may be empty if the
 *   material has no files or all file URLs are falsy)
 *
 * @example
 * getFileUrls({
 *   name: "Agenda",
 *   files: [
 *     { fileName: "agenda.pdf", fileHash: "abc", fileUrl: "https://...agenda.pdf" }
 *   ]
 * })
 * // => ["https://...agenda.pdf"]
 */
function getFileUrls(mat) {
  return mat.files.map(function (f) { return f.fileUrl; }).filter(Boolean);
}

/**
 * Converts a transformed meeting object into a single CSV row string.
 *
 * This function flattens the nested meeting data into 8 comma-separated
 * fields optimized for artifact URL lookup:
 *
 * | Position | Column             | Source                                      |
 * |----------|--------------------|---------------------------------------------|
 * | 0        | title              | `meeting.title`                             |
 * | 1        | scheduledDate      | `meeting.scheduledDate`                     |
 * | 2        | slug               | `meeting.slug`                              |
 * | 3        | siteUrl            | `meeting.siteUrl`                           |
 * | 4        | tags               | Meeting-level tags, semicolon-separated     |
 * | 5        | agendaUrl          | First material classified as "agenda"       |
 * | 6        | minutesUrl         | First material classified as "minutes"      |
 * | 7        | otherMaterialUrls  | All remaining material URLs, pipe-separated |
 *
 * **Material classification logic:**
 * Each material is classified by {@link classifyMaterial}. The first "agenda"
 * match fills `agendaUrl`; the first "minutes" match fills `minutesUrl`.
 * All other materials (and any additional agenda/minutes beyond the first)
 * are collected into `otherMaterialUrls` to ensure no URLs are lost.
 *
 * All field values are escaped via {@link escapeCsvField} for RFC 4180
 * compliance before joining.
 *
 * @param {TransformedMeeting} meeting - Transformed meeting object from
 *   {@link transformMeeting}
 * @returns {string} Comma-separated CSV row (no trailing newline)
 *
 * @see {@link classifyMaterial} for how materials are routed to columns
 * @see {@link escapeCsvField} for CSV escaping rules
 */
function meetingToCsvRow(meeting) {
  var agendaUrl = "";
  var minutesUrl = "";
  var otherUrls = [];

  meeting.meetingMaterials.forEach(function (mat) {
    var urls = getFileUrls(mat);
    var type = classifyMaterial(mat.name);
    if (type === "agenda" && !agendaUrl) {
      agendaUrl = urls[0] || "";
      // If this agenda material had extra files, spill to other
      urls.slice(1).forEach(function (u) { otherUrls.push(u); });
    } else if (type === "minutes" && !minutesUrl) {
      minutesUrl = urls[0] || "";
      urls.slice(1).forEach(function (u) { otherUrls.push(u); });
    } else {
      urls.forEach(function (u) { otherUrls.push(u); });
    }
  });

  var tagsStr = meeting.tags.map(function (t) { return t.name; }).join("; ");

  return [
    meeting.title,
    meeting.scheduledDate,
    meeting.slug,
    meeting.siteUrl,
    tagsStr,
    agendaUrl,
    minutesUrl,
    otherUrls.join(" | ")
  ]
    .map(escapeCsvField)
    .join(",");
}

/**
 * Builds a complete CSV string from an array of transformed meetings.
 *
 * The output consists of a header row followed by one data row per meeting.
 * Rows are joined with newline characters (`\n`).
 *
 * **CSV columns (8 total):**
 *
 * | Column             | Description                                                |
 * |--------------------|------------------------------------------------------------|
 * | title              | Meeting title                                              |
 * | scheduledDate      | ISO 8601 date/time string                                  |
 * | slug               | URL-safe meeting identifier                                |
 * | siteUrl            | Full URL to the meeting page on spac.illinois.gov          |
 * | tags               | Semicolon-separated meeting-level tag names                |
 * | agendaUrl          | Direct download URL for the agenda PDF (empty if none)     |
 * | minutesUrl         | Direct download URL for the minutes PDF (empty if none)    |
 * | otherMaterialUrls  | Pipe-separated download URLs for all other materials       |
 *
 * @param {TransformedMeeting[]} meetings - Array of transformed meeting
 *   objects from {@link transformMeeting}
 * @returns {string} Complete CSV file content (header + data rows),
 *   ready to write to disk
 *
 * @see {@link meetingToCsvRow} for per-row formatting
 */
function buildCsv(meetings) {
  var header = "title,scheduledDate,slug,siteUrl,tags,agendaUrl,minutesUrl,otherMaterialUrls";
  var rows = meetings.map(meetingToCsvRow);
  return [header].concat(rows).join("\n");
}

// =============================================================================
// Main execution
// =============================================================================

/**
 * Main entry point. Orchestrates the full extraction pipeline:
 *
 *   1. Constructs the GraphQL endpoint URL from {@link BASE_API_URL}
 *   2. Sends the {@link query} via {@link graphqlRequest}
 *   3. Transforms each raw meeting via {@link transformMeeting}
 *   4. Writes the transformed array as pretty-printed JSON to {@link JSON_FILE}
 *   5. Builds a CSV string via {@link buildCsv} and writes it to {@link CSV_FILE}
 *   6. Logs the count of meetings written to each file
 *
 * On failure (network error, API error, parse error), logs the error message
 * to stderr and exits with code 1.
 *
 * @returns {void} This function does not return a value. It initiates an
 *   async pipeline via Promises; output is written to disk as a side effect.
 */
function main() {
  var endpoint = BASE_API_URL + "/graphql";

  console.log("Fetching meetings from " + endpoint + " ...");

  graphqlRequest(endpoint, query)
    .then(function (data) {
      var meetings = data.meetings.map(transformMeeting);

      // Write JSON — pretty-printed with 2-space indentation
      var jsonContent = JSON.stringify(meetings, null, 2);
      fs.writeFileSync(JSON_FILE, jsonContent, "utf8");
      console.log("Created: " + JSON_FILE + " (" + meetings.length + " meetings)");

      // Write CSV — header row + one data row per meeting
      var csv = buildCsv(meetings);
      fs.writeFileSync(CSV_FILE, csv, "utf8");
      console.log("Created: " + CSV_FILE + " (" + meetings.length + " meetings)");
    })
    .catch(function (err) {
      console.error("Failed to fetch meetings from GraphQL API:");
      console.error(err.message || err);
      process.exit(1);
    });
}

main();
