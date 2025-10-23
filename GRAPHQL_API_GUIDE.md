# GraphQL API Guide

**📅 Last Updated**: October 23, 2025

## GraphQL Endpoint

**Production**: `https://spac.icjia-api.cloud/graphql`

**Development**: `http://localhost:9000/graphql` (when running backend locally)

## Accessing GraphQL Playground

### Online Playground
Visit the GraphQL endpoint directly in your browser to access the interactive playground:
- **Production**: https://spac.icjia-api.cloud/graphql
- **Development**: http://localhost:9000/graphql

The playground provides:
- ✅ Interactive query editor
- ✅ Real-time query validation
- ✅ Schema documentation (right panel)
- ✅ Query history
- ✅ Syntax highlighting

## Available Query Types

The SPAC GraphQL API provides queries for:

1. **Pages** - Static pages and content
2. **Posts** - News and announcements
3. **Publications** - Research reports and documents
4. **Meetings** - Council meetings and events
5. **Biographies** - Council member information
6. **Tags** - Content categorization
7. **Sections** - Content organization

## Sample Queries

### 1. Fetch All Published Pages

```graphql
{
  pages(where: {isPublished: true}) {
    id
    title
    slug
    content
    summary
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

### 2. Fetch Single Page by Slug

```graphql
{
  pages(where: {slug: "about", isPublished: true}) {
    id
    title
    slug
    content
    summary
    showToc
    addDivider
    tags {
      name
      slug
    }
  }
}
```

### 3. Fetch All News Posts (Sorted by Date)

```graphql
{
  posts(sort: "createdAt:desc", where: {isPublished: true}, limit: 50) {
    id
    title
    slug
    summary
    content
    createdAt
    updatedAt
    tags {
      name
      slug
    }
  }
}
```

### 4. Fetch Single News Post by Slug

```graphql
{
  posts(where: {slug: "latest-announcement", isPublished: true}) {
    id
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

### 5. Fetch All Publications

```graphql
{
  publications(sort: "year:desc", where: {isPublished: true}, limit: 100) {
    id
    title
    slug
    year
    category
    summary
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

### 6. Fetch Meetings by Category

```graphql
{
  meetings(
    sort: "scheduledDate:desc"
    where: {isPublished: true, category: "regular"}
    limit: 50
  ) {
    id
    title
    slug
    scheduledDate
    category
    summary
    content
    createdAt
    updatedAt
    meetingMaterial {
      name
      summary
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

### 7. Fetch Content by Tag

```graphql
{
  tags(where: {slug: "sentencing-policy"}) {
    name
    slug
    content
    pages(where: {isPublished: true}, limit: 50) {
      title
      slug
      summary
    }
    posts(where: {isPublished: true}, limit: 50) {
      title
      slug
      summary
    }
    publications(where: {isPublished: true}, limit: 50) {
      title
      slug
      year
    }
    meetings(where: {isPublished: true}, limit: 50) {
      title
      slug
      scheduledDate
    }
  }
}
```

### 8. Fetch Council Member Biographies

```graphql
{
  biographies(sort: "name:asc", where: {isPublished: true}) {
    id
    name
    slug
    title
    organization
    bio
    createdAt
    updatedAt
    tags {
      name
      slug
    }
  }
}
```

### 9. Fetch All Tags

```graphql
{
  tags {
    id
    name
    slug
    content
  }
}
```

### 10. Complex Query - Front Page Data

```graphql
{
  frontPageNews: posts(
    sort: "createdAt:desc"
    limit: 2
    where: {isPublished: true}
  ) {
    title
    slug
    summary
    createdAt
  }

  frontPagePublications: publications(
    sort: "year:desc"
    limit: 3
    where: {isPublished: true}
  ) {
    title
    slug
    year
    category
  }

  upcomingMeetings: meetings(
    sort: "scheduledDate:asc"
    limit: 5
    where: {isPublished: true}
  ) {
    title
    slug
    scheduledDate
    category
  }
}
```

## 🏷️ Tagging System

### Overview

The SPAC application uses a flexible tagging system to organize and cross-reference content across multiple content types. Tags allow users to discover related content across pages, news, publications, meetings, and biographies.

### Taggable Content Types

According to the schema, the following content types support tags:

1. **Pages** - Static content pages
2. **Posts (News)** - News articles and announcements
3. **Publications** - Research reports and documents
4. **Meetings** - Council meetings and events
5. **Biographies** - Council member profiles
6. **Sites** - Site descriptions and special pages

### Tag Schema

Each tag has the following properties:

```graphql
{
  id              # Unique identifier
  name            # Display name (e.g., "Sentencing Policy")
  slug            # URL-friendly identifier (e.g., "sentencing-policy")
  content         # Optional tag description/content
}
```

### Tag Relationships

Tags create relationships between different content types. When you query a tag, you can retrieve all associated content:

```graphql
{
  pages           # All pages tagged with this tag
  posts           # All news posts tagged with this tag
  publications    # All publications tagged with this tag
  meetings        # All meetings tagged with this tag
  biographies     # All council members tagged with this tag
}
```

### Sample Tag Queries

#### Query 1: Fetch All Tags

```graphql
{
  tags {
    id
    name
    slug
    content
  }
}
```

#### Query 2: Fetch All Content for a Specific Tag

This is the most powerful tag query - it returns all content associated with a tag:

```graphql
{
  tags(where: {slug: "sentencing-policy"}) {
    name
    slug
    content

    pages(sort: "title:asc", where: {isPublished: true}) {
      title
      slug
      summary
      content
    }

    posts(sort: "createdAt:desc", where: {isPublished: true}) {
      title
      slug
      summary
      createdAt
    }

    publications(sort: "year:desc", where: {isPublished: true}) {
      title
      slug
      year
      category
    }

    meetings(sort: "scheduledDate:desc", where: {isPublished: true}) {
      title
      slug
      scheduledDate
      category
    }

    biographies(sort: "alphabetizeBy:asc", where: {isPublished: true}) {
      firstName
      lastName
      title
      slug
    }
  }
}
```

#### Query 3: Fetch Tag with Specific Content Types Only

```graphql
{
  tags(where: {slug: "fiscal-impact"}) {
    name
    slug

    publications(sort: "year:desc", where: {isPublished: true}, limit: 50) {
      title
      slug
      year
      summary
    }
  }
}
```

#### Query 4: Fetch Multiple Tags

```graphql
{
  tags(limit: 100) {
    id
    name
    slug
    content
  }
}
```

### Common Tags in SPAC

Based on the application configuration, common tags include:

- **sentencing-policy** - General sentencing policy topics
- **fiscal-impact** - Financial and impact analysis (displayed as "IMPACT ANALYSIS")
- **prison-population** - Prison population data and projections
- **recidivism** - Recidivism studies and data
- **sentencing-guidelines** - Sentencing guideline information
- And other topic-specific tags defined in the CMS

### Using Tags in Your Code

#### Fetch Content by Tag (Vue Component Example)

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
      const tagContent = this.$store.getters.getContentFromCache(contentMap, name);

      return tagContent;
    }
  }
}
```

#### Display Tags on Content

Tags are automatically included in all content queries and displayed as clickable chips:

```javascript
// Tags are included in all content queries
{
  pages(where: {isPublished: true}) {
    title
    slug
    tags {
      name
      slug
    }
  }
}
```

### Tag Display Behavior

- Tags are displayed as **purple chips** with a label icon
- The "fiscal-impact" tag is displayed as **"IMPACT ANALYSIS"** (special case)
- Tags are **clickable** and link to `/tags/{tag-slug}`
- Multiple tags can be applied to a single piece of content
- Tags are displayed in **uppercase** in the UI

### Tag Navigation

When a user clicks on a tag, they are taken to `/tags/{tag-slug}` which displays:

1. **Tag Description** - The tag's content/description (if available)
2. **Tagged Pages** - All pages with this tag
3. **Tagged News** - All news posts with this tag
4. **Tagged Publications** - All publications with this tag
5. **Tagged Meetings** - All meetings with this tag
6. **Tagged Biographies** - All council members with this tag

### Tips for Working with Tags

1. **Always filter by `isPublished: true`** - Only published content should be displayed
2. **Use tag slugs for URLs** - Tag slugs are URL-friendly and unique
3. **Cache tag queries** - Tag queries can return large amounts of data; use the caching system
4. **Limit results** - Use `limit` parameter to avoid large responses
5. **Sort appropriately** - Different content types have different sort options
6. **Check schema** - Use the GraphQL Playground to explore available fields

## Query Parameters

### Common Filters

- **where**: Filter results
  - `isPublished: true` - Only published content
  - `slug: "value"` - Match specific slug
  - `category: "value"` - Filter by category

### Sorting

- **sort**: Sort results
  - `"createdAt:desc"` - Newest first
  - `"createdAt:asc"` - Oldest first
  - `"title:asc"` - Alphabetical
  - `"year:desc"` - Year descending

### Pagination

- **limit**: Maximum results to return (default: 25)
- **start**: Offset for pagination (default: 0)

## Using GraphQL in Your Code

### With graphql-request (Used in this project)

```javascript
import { request } from "graphql-request";

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

### With Axios (Also used in this project)

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

## Tips for Developers

1. **Use the Playground**: Test queries interactively before adding to code
2. **Check Schema**: Use the schema documentation in the playground (right panel)
3. **Limit Results**: Always use `limit` parameter to avoid large responses
4. **Filter Published**: Use `where: {isPublished: true}` for production content
5. **Cache Results**: This project caches GraphQL responses in Vuex (session-only)
6. **Error Handling**: Wrap queries in try-catch blocks

## Debugging

### Enable Debug Mode

Set `debug: true` in `src/config.json` to see GraphQL queries in browser console.

### Common Issues

- **No results**: Check if content is published (`isPublished: true`)
- **Slow queries**: Use `limit` parameter to reduce data
- **CORS errors**: Ensure API endpoint is correct in `.env`
- **Timeout errors**: Check API connectivity and response times

## Related Documentation

- **Caching System**: See `/CACHING_SYSTEM_CLARIFICATION.md`
- **API Configuration**: See `project-documentation.md` → Configuration section
- **Content Service**: See `src/services/Content.js` for implementation examples

---

**Note**: All queries return only published content by default. Use `isPublished: false` in development if needed.

