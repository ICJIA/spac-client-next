/* eslint-disable no-console */
/**
 * @fileoverview Standalone extraction script for SPAC meeting data.
 *
 * Queries the Strapi GraphQL API for all published meetings and generates:
 * 1. meetings.json — full structured meeting data with absolute file URLs
 * 2. meetings.csv — flat CSV export for the WCM development team
 *
 * Zero dependencies — uses only Node.js built-in modules (https, fs, path).
 *
 * Usage:  node extractMeetings.js
 *
 * For setup instructions, troubleshooting, adapting this script for other
 * content types, and full output format details, see the companion documentation:
 *   docs/extractMeetings.md
 *
 * @author ICJIA
 * @since 1.0.0
 * @contact Chris Schweda (christopher.schweda@illinois.gov)
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

// =============================================================================
// Configuration (inlined — no external config file needed)
// =============================================================================

/**
 * Base URL of the Strapi API server.
 * @type {string}
 */
const BASE_API_URL = "https://spac.icjia-api.cloud";

/**
 * Base URL of the public-facing SPAC website.
 * @type {string}
 */
const CLIENT_URL = "https://spac.illinois.gov";

/**
 * Maximum number of results to fetch from the API.
 * @type {number}
 */
const MAX_RESULTS = 250;

/**
 * Output file paths (written to the current working directory).
 * @type {string}
 */
const JSON_FILE = path.join(".", "meetings.json");
const CSV_FILE = path.join(".", "meetings.csv");

/**
 * Lookup map from meeting category enum to display title and URL slug.
 *
 * @type {Object.<string, {title: string, slug: string}>}
 */
const categoryMap = {
  regular: { title: "Council Meetings", slug: "regular" },
  specialTopic: { title: "Special Topic", slug: "special-topic" }
};

// =============================================================================
// GraphQL query
// =============================================================================

/**
 * GraphQL query to fetch all published meetings with their materials and tags.
 * Results are sorted by scheduled date in descending order (newest first).
 *
 * @type {string}
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
 * Sends a GraphQL query to the API using Node's built-in https module.
 * No external dependencies required.
 *
 * @param {string} endpoint - Full URL of the GraphQL endpoint
 * @param {string} queryString - GraphQL query string
 * @returns {Promise<Object>} Parsed JSON response data
 * @throws {Error} If the HTTP request fails or the response contains GraphQL errors
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
// Transform and CSV helpers
// =============================================================================

/**
 * Converts a relative Strapi file URL to an absolute downloadable URL.
 *
 * @param {string} relativeUrl - Relative file path from the API (e.g., "/uploads/file.pdf")
 * @returns {string} Absolute URL (e.g., "https://spac.icjia-api.cloud/uploads/file.pdf"),
 *   or empty string if relativeUrl is falsy
 */
function buildAbsoluteUrl(relativeUrl) {
  if (!relativeUrl) return "";
  return BASE_API_URL + relativeUrl;
}

/**
 * Builds the public-facing site URL for a meeting detail page.
 *
 * @param {Object} meeting - Raw meeting object from the GraphQL response
 * @param {string} meeting.category - Category enum value ("regular" or "specialTopic")
 * @param {string} meeting.slug - Meeting URL slug
 * @returns {string} Full site URL (e.g., "https://spac.illinois.gov/meetings/regular/some-slug"),
 *   or empty string if the category is not found in categoryMap
 */
function buildSiteUrl(meeting) {
  var cat = categoryMap[meeting.category];
  if (!cat) return "";
  return CLIENT_URL + "/meetings/" + cat.slug + "/" + meeting.slug;
}

/**
 * Transforms a raw GraphQL meeting object into the output format.
 * Converts relative file URLs to absolute, maps category enums to display titles,
 * and adds a site URL and empty location placeholder.
 *
 * @param {Object} meeting - Raw meeting object from the GraphQL API
 * @returns {Object} Transformed meeting object with absolute URLs and enriched fields
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

/**
 * Escapes a value for safe inclusion in a CSV field.
 * Wraps the value in double quotes if it contains commas, double quotes, or newlines.
 * Internal double quotes are escaped by doubling them (RFC 4180).
 *
 * @param {*} value - The value to escape (converted to string)
 * @returns {string} CSV-safe string representation
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
 * Classifies a meeting material as "agenda", "minutes", or "other" based on
 * its display name. Matching is case-insensitive.
 *
 * @param {string} materialName - Display name of the material (e.g., "Meeting Agenda")
 * @returns {"agenda"|"minutes"|"other"} Classification bucket
 */
function classifyMaterial(materialName) {
  var name = (materialName || "").toLowerCase().trim();
  if (name.indexOf("agenda") !== -1) return "agenda";
  if (name.indexOf("minutes") !== -1) return "minutes";
  return "other";
}

/**
 * Extracts all file URLs from a meeting material entry.
 *
 * @param {Object} mat - A meetingMaterials entry from a transformed meeting
 * @returns {string[]} Array of absolute file URLs
 */
function getFileUrls(mat) {
  return mat.files.map(function (f) { return f.fileUrl; }).filter(Boolean);
}

/**
 * Converts a transformed meeting object into a single CSV row string.
 * Artifact URLs are split into three columns: agendaUrl (first agenda found),
 * minutesUrl (first minutes found), and otherMaterialUrls (pipe-separated
 * URLs for everything else).
 *
 * @param {Object} meeting - Transformed meeting object from {@link transformMeeting}
 * @returns {string} Comma-separated CSV row
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

  return [
    meeting.title,
    meeting.scheduledDate,
    meeting.slug,
    meeting.siteUrl,
    agendaUrl,
    minutesUrl,
    otherUrls.join(" | ")
  ]
    .map(escapeCsvField)
    .join(",");
}

/**
 * Builds a complete CSV string from an array of transformed meetings.
 * Includes a header row followed by one data row per meeting.
 *
 * CSV columns: title, scheduledDate, slug, siteUrl, agendaUrl, minutesUrl,
 * otherMaterialUrls
 *
 * @param {Object[]} meetings - Array of transformed meeting objects
 * @returns {string} Complete CSV file content
 */
function buildCsv(meetings) {
  var header = "title,scheduledDate,slug,siteUrl,agendaUrl,minutesUrl,otherMaterialUrls";
  var rows = meetings.map(meetingToCsvRow);
  return [header].concat(rows).join("\n");
}

// =============================================================================
// Main execution
// =============================================================================

/**
 * Main function. Queries the GraphQL API and writes JSON + CSV output files.
 *
 * @async
 * @function
 * @returns {Promise<void>} Resolves when both files are written
 */
function main() {
  var endpoint = BASE_API_URL + "/graphql";

  console.log("Fetching meetings from " + endpoint + " ...");

  graphqlRequest(endpoint, query)
    .then(function (data) {
      var meetings = data.meetings.map(transformMeeting);

      // Write JSON
      var jsonContent = JSON.stringify(meetings, null, 2);
      fs.writeFileSync(JSON_FILE, jsonContent, "utf8");
      console.log("Created: " + JSON_FILE + " (" + meetings.length + " meetings)");

      // Write CSV
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
