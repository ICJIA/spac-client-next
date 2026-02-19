# GraphQL API Guide

**Last Updated**: February 19, 2026

---

## What is GraphQL?

GraphQL is a query language for APIs. Unlike REST (where each URL returns a fixed shape of data), GraphQL lets you **ask for exactly the fields you want** and get back only those fields.

You don't need to install anything to try it. The SPAC API has an interactive playground you can use right in your browser.

---

## GraphQL vs. REST: When to Use Which

Most web APIs use REST — a pattern where each URL (endpoint) returns a fixed shape of data. GraphQL is a different approach that gives the client more control over what comes back. Both are valid choices; which one fits depends on the project.

### Why SPAC Uses GraphQL

The SPAC site has several content types (meetings, publications, news, biographies, pages, tags) that are heavily interrelated. GraphQL makes it easy to fetch a meeting _and_ its materials _and_ its tags in a single request, asking for only the fields needed. With REST, this would require multiple round-trips or bloated endpoints that return everything.

### Comparison

| | **GraphQL** | **REST** |
|---|---|---|
| **Data fetching** | Client specifies exactly which fields it wants | Server decides what each endpoint returns |
| **Over-fetching** | Eliminated — you only get what you ask for | Common — endpoints often return extra fields you don't need |
| **Under-fetching** | Eliminated — one query can span related data | Common — you may need to call multiple endpoints and stitch results together |
| **Number of endpoints** | Single endpoint (`/graphql`) for all queries | One endpoint per resource (`/meetings`, `/meetings/:id`, `/tags`, etc.) |
| **Learning curve** | Steeper — requires learning query syntax, schema concepts | Gentler — URLs and JSON are familiar to most developers |
| **Caching** | Harder — all requests go to the same URL, so HTTP caching doesn't work out of the box | Easier — each URL can be cached independently by browsers, CDNs, and proxies |
| **Tooling** | Interactive playgrounds, schema autocomplete, introspection | `curl`, Postman, browser address bar — works anywhere with no special tools |
| **Error handling** | Always returns HTTP 200; errors are inside the JSON response body | Uses HTTP status codes (404, 500, etc.) that integrations already understand |
| **File uploads** | Not built-in; requires workarounds or multipart extensions | Straightforward with `multipart/form-data` |
| **API versioning** | No versions needed — clients ask for exactly the fields they use, and new fields can be added without breaking anyone | Typically versioned (`/api/v1/`, `/api/v2/`) to avoid breaking clients when the shape changes |

### When to Choose GraphQL

- You have **multiple related content types** and clients need to pull from several at once (this is the SPAC case)
- Different views of the same data need **different field sets** (e.g., a listing page needs title + date, while a detail page needs everything)
- You want a **single, self-documenting API** — the schema _is_ the documentation
- Your frontend team wants **autonomy** to change what data they fetch without backend changes

### When to Choose REST

- Your data model is simple and each resource maps cleanly to a URL
- You need **HTTP-level caching** (CDNs, browser cache, `304 Not Modified`)
- Your consumers are scripts, CLI tools, or third-party integrations that expect standard HTTP conventions
- You want the **simplest possible integration** — `curl https://api.example.com/meetings` just works
- You need to **stream large responses** or handle **file uploads** natively

### In Practice

Many real-world systems (including Strapi, the CMS behind this site) offer _both_. Strapi exposes a REST API alongside its GraphQL plugin. The SPAC client uses GraphQL for its flexibility, but the same data is accessible via REST at `https://spac.icjia-api.cloud/meetings`, `https://spac.icjia-api.cloud/publications`, etc.

---

## How Adobe Experience Manager (AEM) Compares

Adobe Experience Manager is an enterprise content management platform used by large organizations. Its API architecture is fundamentally different from both Strapi and standalone REST/GraphQL services. Understanding how AEM works helps illustrate why simpler tools like Strapi exist and where enterprise platforms add (or impose) complexity.

### AEM's Architecture in Brief

AEM is built on three layers that shape how its APIs work:

1. **JCR (Java Content Repository)** — All content is stored in a tree of nodes and properties, similar to a filesystem but richer. A page, an image, and a content fragment are all just nodes in this tree.
2. **Apache Sling** — A framework that maps URLs directly to JCR nodes. Requesting `/content/mysite/en/about` doesn't hit a controller — Sling resolves the JCR node at that path and picks a rendering script based on the node's `sling:resourceType` property.
3. **OSGi** — A Java module system that manages all backend services as pluggable bundles.

This means AEM is **content-centric by design**: the URL _is_ the content path, and the repository structure _is_ the API. There's no separate "API layer" sitting in front of a database the way Strapi or a custom REST backend works.

### AEM's Content Delivery APIs

AEM offers multiple ways to deliver content headlessly:

| API | Style | Use Case |
|-----|-------|----------|
| **GraphQL API** (Content Fragments) | GraphQL | Query structured content with field-level precision. Read-only. Supports persisted queries for CDN caching. |
| **Content Fragment Delivery (OpenAPI)** | REST (OpenAPI) | Newer REST-based delivery optimized for CDN integration. Auto-generates OpenAPI schemas from Content Fragment Models. |
| **Assets HTTP API** | REST | CRUD operations on content — create, read, update, delete fragments. Used for management, not just delivery. |
| **Sling JSON export** | REST-like | Any JCR node can be exported as JSON by appending `.model.json` or `.infinity.json` to its URL. Zero configuration needed, but the shape is dictated by the repository structure. |

### Key Differences from Strapi / Standalone APIs

| | **AEM** | **Strapi (this project)** | **Custom REST API** |
|---|---|---|---|
| **Content storage** | JCR tree (nodes & properties) | Relational database (SQL) | Database of your choice |
| **Schema definition** | Content Fragment Models (GUI-based, auto-generates GraphQL schema) | Content Types (GUI-based, auto-generates REST + GraphQL) | Hand-coded models/migrations |
| **URL routing** | Sling resolves URLs to JCR paths automatically | Defined by framework (Koa routes) | Hand-coded routes |
| **GraphQL** | Read-only; persisted queries cached at CDN edge | Read-only (via plugin); standard POST queries | You build it yourself |
| **Write operations** | Separate REST API (Assets HTTP API) | REST or GraphQL mutations | Your own endpoints |
| **Caching** | Persisted queries turn GraphQL into cacheable GET requests via Dispatcher + CDN | Application-level (Vuex in this project) | Your own strategy |
| **Deployment** | Adobe Cloud Service or self-hosted (large Java stack) | Self-hosted Node.js process | Whatever you build |
| **Cost / complexity** | Enterprise licensing; significant infrastructure and expertise required | Free and open-source; runs on a single server | Depends on your stack |
| **Target audience** | Large organizations managing thousands of pages across multiple brands and channels | Small-to-mid projects needing a quick, flexible CMS | Teams that want full control |

### What AEM Does Differently

**Content Fragment Models as schema.** In AEM, you define a Content Fragment Model (through a GUI), and the system auto-generates a GraphQL schema from it. This is conceptually similar to how Strapi auto-generates its schema from Content Types — but AEM layers in publishing workflows, localization, versioning, and permissions at the repository level.

**Persisted queries.** AEM's GraphQL API encourages "persisted queries" — you save a query on the server, then request it with a simple GET URL like `/graphql/execute.json/mysite/my-query`. This converts GraphQL's usual single-endpoint-POST pattern into something that CDNs and the AEM Dispatcher can cache like a REST endpoint. It's a clever hybrid that sidesteps one of GraphQL's biggest weaknesses.

**Sling JSON export.** Any content node in AEM can be exported as JSON by appending a selector to the URL — no API definition needed. For example, `/content/mysite/en/meetings.model.json` returns a JSON representation of that page. This is unique to AEM's architecture and has no equivalent in Strapi or typical REST/GraphQL systems.

**Read/write split.** AEM's GraphQL API is read-only. To create or update content programmatically, you use a separate REST API (the Assets HTTP API). Strapi, by contrast, supports both reads and writes through the same GraphQL or REST interface.

### When AEM Makes Sense

- You're an enterprise managing **dozens of sites across multiple brands, languages, and channels**
- You need built-in **publishing workflows, approval chains, and governance**
- You need to deliver the same content to web, mobile apps, kiosks, and third-party systems simultaneously
- Your organization already has Adobe licensing and AEM expertise

### When AEM Is Overkill

- You have a **single site** with a handful of content types (like SPAC)
- Your team is small and doesn't need enterprise publishing workflows
- You want to **move fast** without Java infrastructure, Adobe licensing, or specialized AEM developers
- Your budget and team size favor open-source tools

### Further Reading

- [Introduction to AEM Headless](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/headless/introduction) — Adobe's overview of headless delivery
- [AEM GraphQL API for Content Fragments](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/headless/graphql-api/content-fragments) — How AEM implements GraphQL
- [Content Fragment Delivery with OpenAPI](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/headless/aem-content-fragment-delivery-with-openapi) — AEM's newer REST-based delivery API
- [AEM APIs for Structured Content Delivery](https://experienceleague.adobe.com/en/docs/experience-manager-cloud-service/content/headless/apis-headless-and-content-fragments) — Comparison of all AEM headless APIs

---

## Quick Start: Your First Query

### Step 1: Open the Playground

The playground is for experimenting with queries and browsing the schema — it does not change the GraphQL endpoint used by the application (that remains `https://spac.icjia-api.cloud/graphql`).

Open one of these URLs in your browser:

**ICJIA Playground** (recommended): https://playground.icjia.app/

A modern, updated version of the Strapi playground with all the same features plus additional flexibility, download options, and an improved interface. Includes full schema autocomplete.

**Built-in Strapi Playground**: https://spac.icjia-api.cloud/graphql

The default Strapi GraphQL playground. Both point to the same underlying API — use whichever you prefer.

**Development**: http://localhost:9000/graphql (when running backend locally)

You'll see an interactive editor with two panels:
- **Left panel** — where you type your query
- **Right panel** — where results appear

The playground provides:
- Real-time query validation (errors show as you type)
- Schema documentation and autocomplete
- Query history
- Syntax highlighting
- Download options (enhanced in ICJIA Playground)

### Step 2: Paste and Run

Copy this into the left panel and click the **Play** button (or press Ctrl+Enter):

```graphql
{
  meetings(limit: 3) {
    title
    scheduledDate
  }
}
```

You should see something like:

```json
{
  "data": {
    "meetings": [
      {
        "title": "Regular Sentencing Policy Advisory Council Meeting October 2026",
        "scheduledDate": "2026-10-23T00:00:00.000Z"
      }
    ]
  }
}
```

That's it. You just queried the SPAC API.

---

## GraphQL Basics (5-Minute Primer)

### Ask for what you want

```graphql
{
  meetings {        ← "Give me meetings"
    title           ← "I want the title"
    scheduledDate   ← "and the date"
  }
}
```

You only get back the fields you list. If you don't ask for `content`, you don't get `content`. This keeps responses small and fast.

### Filtering with `where`

Add conditions to narrow results:

```graphql
{
  meetings(where: { isPublished: true }) {
    title
  }
}
```

Multiple conditions act as AND:

```graphql
{
  meetings(where: { isPublished: true, category: "regular" }) {
    title
  }
}
```

### Sorting with `sort`

Format: `"fieldName:direction"` where direction is `asc` or `desc`:

```graphql
{
  meetings(sort: "scheduledDate:desc") {
    title
    scheduledDate
  }
}
```

### Limiting results with `limit`

```graphql
{
  meetings(limit: 5) {
    title
  }
}
```

### Skipping results with `start` (pagination)

```graphql
{
  meetings(limit: 10, start: 10) {
    title
  }
}
```

This skips the first 10 and returns the next 10 (i.e., page 2).

### Nested fields

Some fields contain objects or arrays. Expand them with braces:

```graphql
{
  meetings {
    title
    meetingMaterial {      ← array of objects
      name                ← each has a name
      file {              ← and a nested file object
        url               ← with a url
      }
    }
  }
}
```

### Aliases

Rename a field or collection in the response:

```graphql
{
  news: posts(where: { isPublished: true }) {
    title
  }
}
```

This queries the `posts` collection but the response JSON uses the key `news`.

### Multiple queries in one request

Fetch different content types in the same request:

```graphql
{
  meetings(limit: 5) {
    title
  }
  publications(limit: 5) {
    title
  }
  tags {
    name
  }
}
```

### Combining parameters

Parameters are comma-separated inside parentheses:

```graphql
{
  meetings(sort: "scheduledDate:desc", where: { isPublished: true }, limit: 10) {
    title
    scheduledDate
  }
}
```

---

## GraphQL Endpoint

The application endpoint for content queries (used in code and build scripts):

**Production**: `https://spac.icjia-api.cloud/graphql`

For interactive query experimentation, use the [ICJIA Playground](https://playground.icjia.app/) or the [built-in Strapi playground](https://spac.icjia-api.cloud/graphql).

**Development**: `http://localhost:9000/graphql` (when running backend locally)

---

## Available Content Types

| Query Name | Content Type | Description |
|------------|-------------|-------------|
| `meetings` | Meeting | Council meetings and special topic meetings |
| `publications` | Publication | Annual reports, cost-benefit analyses, research reports, projections |
| `posts` | Post (News) | News articles (aliased as `news` in some queries) |
| `pages` | Page | Static site pages |
| `biographies` | Biography | Council member bios |
| `sections` | Section | Site navigation sections |
| `tags` | Tag | Content tags shared across all types |

---

## Meeting Schema Reference

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `title` | String | Meeting title |
| `scheduledDate` | DateTime | Scheduled date (ISO 8601 format) |
| `summary` | String | Brief summary text |
| `content` | String | Full description (Markdown) |
| `category` | Enum | `"regular"` or `"specialTopic"` |
| `slug` | String | URL-safe identifier |
| `searchMeta` | String | Search keywords |
| `isPublished` | Boolean | `true` if visible on the public site |
| `createdAt` | DateTime | When the record was created in the CMS |
| `updatedAt` | DateTime | When the record was last modified |

### Meeting Materials (nested)

Each meeting can have attached files in `meetingMaterial`:

| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Display name (e.g., "Meeting Agenda", "Slide Deck") |
| `summary` | String | Description of the material |
| `file` | Array | File objects with `name`, `hash`, and `url` |

**File URLs are relative.** To download a file, prepend the API base URL:

```
https://spac.icjia-api.cloud + /uploads/some-file.pdf
= https://spac.icjia-api.cloud/uploads/some-file.pdf
```

### Meeting Categories

| Enum Value | Display Name | URL Slug |
|------------|-------------|----------|
| `regular` | Council Meetings | `regular` |
| `specialTopic` | Special Topic | `special-topic` |

### Known Data Gaps

- **Location:** There is no `location` field in the meeting schema. Meeting locations are not captured as structured data.
- **Time:** `scheduledDate` stores a date. Specific times may appear in the `content` field but are not a separate queryable field.

---

## Copy-Paste Query Examples

Every query below is ready to paste directly into the playground.

---

### Meeting Queries

#### 1. All published meetings (full data)

Everything about every meeting — title, dates, content, materials, tags.

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

#### 2. Meeting titles and dates only

Lightweight listing — no content, no files.

```graphql
{
  meetings(sort: "scheduledDate:desc", where: { isPublished: true }, limit: 250) {
    title
    scheduledDate
    category
    slug
  }
}
```

#### 3. Council Meetings only

Filter to `category: "regular"`.

```graphql
{
  meetings(sort: "scheduledDate:desc", where: { isPublished: true, category: "regular" }, limit: 250) {
    title
    slug
    scheduledDate
    category
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
}
```

#### 4. Special Topic meetings only

Filter to `category: "specialTopic"`.

```graphql
{
  meetings(sort: "scheduledDate:desc", where: { isPublished: true, category: "specialTopic" }, limit: 250) {
    title
    slug
    scheduledDate
    category
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
}
```

#### 5. Single meeting by slug

Look up one specific meeting. Change `"reg_nov_2025"` to any valid slug.

```graphql
{
  meetings(where: { slug: "reg_nov_2025", isPublished: true }) {
    title
    slug
    scheduledDate
    summary
    content
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
    createdAt
    updatedAt
  }
}
```

#### 6. File download manifest

Just titles and their attached file URLs — useful for building a bulk download list.

```graphql
{
  meetings(sort: "scheduledDate:desc", where: { isPublished: true }, limit: 250) {
    title
    scheduledDate
    slug
    meetingMaterial {
      name
      file {
        name
        url
      }
    }
  }
}
```

> **Tip:** Prepend `https://spac.icjia-api.cloud` to each `url` value to get a downloadable link.

#### 7. Most recent 5 meetings

Change `limit: 5` to any number.

```graphql
{
  meetings(sort: "scheduledDate:desc", where: { isPublished: true }, limit: 5) {
    title
    scheduledDate
    category
    slug
    meetingMaterial {
      name
      file {
        name
        url
      }
    }
  }
}
```

#### 8. Oldest meetings first

Flip the sort direction with `asc`.

```graphql
{
  meetings(sort: "scheduledDate:asc", where: { isPublished: true }, limit: 250) {
    title
    scheduledDate
    category
    slug
  }
}
```

#### 9. Recently modified meetings

Sort by `updatedAt` to find meetings edited recently — useful for detecting changes since your last export.

```graphql
{
  meetings(sort: "updatedAt:desc", where: { isPublished: true }, limit: 20) {
    title
    scheduledDate
    slug
    updatedAt
    createdAt
  }
}
```

#### 10. Paginated meetings (page 2 of 10 per page)

Use `start` to skip results. `start: 10, limit: 10` gives you results 11-20.

```graphql
{
  meetings(sort: "scheduledDate:desc", where: { isPublished: true }, limit: 10, start: 10) {
    title
    scheduledDate
    slug
  }
}
```

#### 11. Total meeting count

```graphql
{
  meetingsConnection(where: { isPublished: true }) {
    aggregate {
      count
    }
  }
}
```

#### 12. Meeting count grouped by category

See how many Council Meetings vs. Special Topic meetings exist.

```graphql
{
  meetingsConnection(where: { isPublished: true }) {
    aggregate {
      count
    }
    groupBy {
      category {
        key
        connection {
          aggregate {
            count
          }
        }
      }
    }
  }
}
```

#### 13. Meetings with their tags

Useful for building a tag-based index.

```graphql
{
  meetings(sort: "scheduledDate:desc", where: { isPublished: true }, limit: 250) {
    title
    scheduledDate
    slug
    category
    tags {
      name
      slug
    }
  }
}
```

#### 14. File hashes for deduplication

Hashes are unique identifiers assigned when a file is uploaded. Useful for detecting duplicate uploads.

```graphql
{
  meetings(sort: "scheduledDate:desc", where: { isPublished: true }, limit: 250) {
    title
    slug
    meetingMaterial {
      name
      file {
        name
        hash
        url
      }
    }
  }
}
```

---

### Page Queries

#### 15. All published pages

```graphql
{
  pages(where: { isPublished: true }) {
    title
    slug
    content
    summary
    showToc
    order
    createdAt
    updatedAt
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

#### 16. Single page by slug

```graphql
{
  pages(where: { slug: "about", isPublished: true }) {
    title
    slug
    content
    summary
    showToc
    addDivider
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

---

### News (Post) Queries

#### 17. All news posts (newest first)

```graphql
{
  posts(sort: "createdAt:desc", where: { isPublished: true }, limit: 50) {
    title
    slug
    summary
    content
    searchMeta
    createdAt
    updatedAt
    tags {
      name
      slug
    }
  }
}
```

#### 18. Single news post by slug

```graphql
{
  posts(where: { slug: "latest-announcement", isPublished: true }) {
    title
    slug
    content
    summary
    createdAt
    updatedAt
    tags {
      name
      slug
    }
  }
}
```

---

### Publication Queries

#### 19. All publications

```graphql
{
  publications(sort: "year:desc,title:asc", where: { isPublished: true }) {
    title
    slug
    year
    category
    summary
    searchMeta
    createdAt
    updatedAt
    mediaMaterial {
      name
      summary
      file {
        name
        hash
        url
      }
    }
    externalMediaMaterial {
      name
      summary
      url
    }
    tags {
      name
      slug
    }
  }
}
```

#### 20. Publications by category

Publication categories: `"annualReport"`, `"costBenefitAnalysis"`, `"fiscalImpactAnalysis"`, `"researchReport"`, `"prisonPopulationProjection"`.

```graphql
{
  publications(sort: "year:desc", where: { isPublished: true, category: "annualReport" }) {
    title
    slug
    year
    summary
    mediaMaterial {
      name
      file {
        name
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

---

### Biography Queries

#### 21. All council member biographies

```graphql
{
  biographies(where: { isPublished: true }) {
    firstName
    middleName
    lastName
    prefix
    suffix
    title
    slug
    category
    membership
    content
    order
    alphabetizeBy
    headshot {
      url
      name
    }
  }
}
```

---

### Section Queries

#### 22. Site navigation sections with their pages

```graphql
{
  sections(where: { isPublished: true }) {
    title
    slug
    summary
    searchMeta
    displayNav
    displayFooter
    displayDrawer
    order
    hasSubMenus
    pages(where: { isPublished: true }) {
      title
      slug
      order
    }
  }
}
```

---

### Tag Queries

#### 23. All tags in the system

```graphql
{
  tags {
    name
    slug
    summary
    searchMeta
    content
  }
}
```

#### 24. All content for a specific tag

This is the most powerful tag query — it returns every piece of content associated with a tag across all content types:

```graphql
{
  tags(where: { slug: "sentencing-policy" }) {
    name
    slug
    content
    pages(sort: "title:asc", where: { isPublished: true }) {
      title
      slug
      summary
    }
    posts(sort: "createdAt:desc", where: { isPublished: true }) {
      title
      slug
      summary
      createdAt
    }
    publications(sort: "year:desc", where: { isPublished: true }) {
      title
      slug
      year
      category
    }
    meetings(sort: "scheduledDate:desc", where: { isPublished: true }) {
      title
      slug
      scheduledDate
      category
    }
    biographies(sort: "alphabetizeBy:asc", where: { isPublished: true }) {
      firstName
      lastName
      title
      slug
    }
  }
}
```

#### 25. Tag with only specific content types

Only want publications for a tag? Just ask for those:

```graphql
{
  tags(where: { slug: "fiscal-impact" }) {
    name
    slug
    publications(sort: "year:desc", where: { isPublished: true }, limit: 50) {
      title
      slug
      year
      summary
    }
  }
}
```

---

### Cross-Content Queries

#### 26. Meetings + Publications together

```graphql
{
  meetings(sort: "scheduledDate:desc", where: { isPublished: true }, limit: 250) {
    title
    scheduledDate
    category
    slug
    tags {
      name
      slug
    }
  }
  publications(sort: "year:desc,title:asc", where: { isPublished: true }) {
    title
    slug
    year
    category
    summary
    tags {
      name
      slug
    }
  }
}
```

#### 27. Meetings + News (activity feed)

Note the `news:` alias — the actual content type is `posts`.

```graphql
{
  meetings(sort: "scheduledDate:desc", where: { isPublished: true }, limit: 50) {
    title
    scheduledDate
    category
    slug
  }
  news: posts(sort: "createdAt:desc", where: { isPublished: true }) {
    title
    slug
    createdAt
    summary
    tags {
      name
      slug
    }
  }
}
```

#### 28. Front page data (latest of everything)

```graphql
{
  frontPageNews: posts(sort: "createdAt:desc", limit: 2, where: { isPublished: true }) {
    title
    slug
    summary
    createdAt
  }
  frontPagePublications: publications(sort: "year:desc", limit: 3, where: { isPublished: true }) {
    title
    slug
    year
    category
  }
  upcomingMeetings: meetings(sort: "scheduledDate:asc", limit: 5, where: { isPublished: true }) {
    title
    slug
    scheduledDate
    category
  }
}
```

#### 29. Full site export (everything published)

```graphql
{
  meetings(sort: "scheduledDate:desc", where: { isPublished: true }, limit: 250) {
    title
    scheduledDate
    category
    slug
    meetingMaterial {
      name
      file {
        name
        url
      }
    }
    tags {
      name
      slug
    }
  }
  publications(sort: "year:desc", where: { isPublished: true }) {
    title
    slug
    year
    category
    tags {
      name
      slug
    }
  }
  news: posts(sort: "createdAt:desc", where: { isPublished: true }) {
    title
    slug
    createdAt
    summary
  }
  pages(where: { isPublished: true }) {
    title
    slug
    section {
      title
      slug
    }
  }
  biographies(where: { isPublished: true }) {
    firstName
    lastName
    title
    slug
    category
    membership
  }
  sections(where: { isPublished: true }) {
    title
    slug
    summary
  }
  tags {
    name
    slug
  }
}
```

---

## Tagging System

### Overview

The SPAC application uses a flexible tagging system to organize and cross-reference content across multiple content types. Tags allow users to discover related content across pages, news, publications, meetings, and biographies.

### Taggable Content Types

1. **Pages** - Static content pages
2. **Posts (News)** - News articles and announcements
3. **Publications** - Research reports and documents
4. **Meetings** - Council meetings and events
5. **Biographies** - Council member profiles

### Tag Schema

```graphql
{
  name            # Display name (e.g., "Sentencing Policy")
  slug            # URL-friendly identifier (e.g., "sentencing-policy")
  summary         # Brief tag description
  searchMeta      # Search keywords
  content         # Optional detailed tag description
}
```

### Common Tags in SPAC

- **sentencing-policy** - General sentencing policy topics
- **fiscal-impact** - Financial and impact analysis (displayed as "IMPACT ANALYSIS" in the UI)
- **prison-population** - Prison population data and projections
- **recidivism** - Recidivism studies and data
- **sentencing-guidelines** - Sentencing guideline information

### Tag Display Behavior

- Tags are displayed as **purple chips** with a label icon
- The "fiscal-impact" tag is displayed as **"IMPACT ANALYSIS"** (special case)
- Tags are **clickable** and link to `/tags/{tag-slug}`
- Multiple tags can be applied to a single piece of content
- Tags are displayed in **uppercase** in the UI

---

## Query Parameter Reference

### Sorting

```
sort: "fieldName:direction"
```

| Example | Effect |
|---------|--------|
| `sort: "scheduledDate:desc"` | Newest date first |
| `sort: "scheduledDate:asc"` | Oldest date first |
| `sort: "updatedAt:desc"` | Most recently modified first |
| `sort: "createdAt:desc"` | Most recently created first |
| `sort: "title:asc"` | Alphabetical A-Z |
| `sort: "year:desc,title:asc"` | By year descending, then title A-Z |

### Filtering (`where`)

```
where: { field: value }
```

| Example | Effect |
|---------|--------|
| `where: { isPublished: true }` | Only published items |
| `where: { category: "regular" }` | Filter by category |
| `where: { slug: "some-slug" }` | Exact slug match |
| `where: { isPublished: true, category: "regular" }` | Multiple conditions (AND) |

### Pagination

| Parameter | Effect |
|-----------|--------|
| `limit: 10` | Return at most 10 results |
| `start: 20` | Skip the first 20 results |
| `limit: 10, start: 20` | Results 21-30 (page 3) |

### Aggregation

Use `*Connection` queries for counts and grouping:

```graphql
{
  meetingsConnection(where: { isPublished: true }) {
    aggregate {
      count
    }
  }
}
```

---

## Using GraphQL in Code

### With graphql-request (used in build scripts)

```javascript
const { request } = require("graphql-request");

const query = `{
  posts(where: {isPublished: true}, limit: 10) {
    title
    slug
    summary
  }
}`;

const data = await request("https://spac.icjia-api.cloud/graphql", query);
console.log(data);
```

### With Axios (used in the Vue app)

```javascript
const response = await axios.post(
  "https://spac.icjia-api.cloud/graphql",
  {
    query: `{
      pages(where: {isPublished: true}) {
        title
        slug
      }
    }`
  }
);
console.log(response.data);
```

### Vue Component Example

```javascript
import { getContentByTag } from "@/services/Content";

export default {
  methods: {
    async fetchTagContent(tagSlug) {
      const contentMap = new Map();
      const name = `getContentByTag-${tagSlug}`;

      contentMap.set(name, {
        hash: getHash(name),
        query: getContentByTag,
        params: { slug: tagSlug }
      });

      await this.$store.dispatch("cacheContent", contentMap);
      return this.$store.getters.getContentFromCache(contentMap, name);
    }
  }
}
```

---

## Client Application URLs

### Meeting pages
```
https://spac.illinois.gov/meetings/{category-slug}/{meeting-slug}
```

| Category | URL Pattern |
|----------|------------|
| Council Meetings (`regular`) | `/meetings/regular/{slug}` |
| Special Topic (`specialTopic`) | `/meetings/special-topic/{slug}` |

### Publication pages
```
https://spac.illinois.gov/publications/{category-slug}/{publication-slug}
```

### News pages
```
https://spac.illinois.gov/news/{slug}
```

### Tag pages
```
https://spac.illinois.gov/tags/{tag-slug}
```

---

## Data Extraction Script

To generate JSON and CSV exports of all meeting data:

```bash
node extractMeetings.js
```

Or via npm:

```bash
npm run extract:meetings
```

Outputs to the current working directory:
- `meetings.json` — Structured JSON with absolute file URLs
- `meetings.csv` — Flat CSV (title, scheduledDate, slug, siteUrl, tags, agendaUrl, minutesUrl, otherMaterialUrls)

The CSV is optimized for artifact URL lookup — agenda and minutes get their own columns, and all remaining materials (slide decks, handouts, etc.) are pipe-separated in `otherMaterialUrls`.

For bulk PDF downloads, SFTP access to the server is preferred — contact Chris Schweda (christopher.schweda@illinois.gov).

---

## Tips for Developers

1. **Use the Playground** — Test queries interactively before adding to code (try the [ICJIA Playground](https://playground.icjia.app/) or the [built-in Strapi playground](https://spac.icjia-api.cloud/graphql))
2. **Check Schema** — Use the DOCS/schema tab in either playground to browse all available fields
3. **Always filter `isPublished: true`** — Unpublished content should not appear on the public site
4. **Use `limit`** — Avoid unbounded queries that return everything
5. **Cache results** — The Vue app caches GraphQL responses in Vuex (session-only)
6. **Wrap in try-catch** — Network and API errors should be handled gracefully

## Debugging

### Enable Debug Mode

Set `debug: true` in `src/config.json` to see GraphQL queries in browser console.

### Common Issues

- **No results** — Check if content is published (`isPublished: true`)
- **Slow queries** — Use `limit` parameter to reduce data
- **CORS errors** — Ensure API endpoint is correct in `.env`
- **Timeout errors** — Check API connectivity (10-second timeout configured)

## Related Documentation

- **Caching System**: See `CACHING_SYSTEM_CLARIFICATION.md`
- **Content Service**: See `src/services/Content.js` for implementation examples
- **Meeting Extraction**: See `docs/graphql_api_guide.md` for meeting-focused documentation

---

**Note**: All queries should filter by `isPublished: true` for production content. Use `isPublished: false` in development if needed.
