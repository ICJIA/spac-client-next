# Adobe Experience Manager (AEM) Migration Guide

**📅 Last Updated**: October 23, 2025

## Overview

This guide provides key tips and considerations for migrating the SPAC Client application from its current Vue.js 2.x + Strapi CMS architecture to Adobe Experience Manager (AEM).

## Current Architecture

**Frontend**: Vue.js 2.6.12 with Vuex state management
**CMS**: Strapi (Headless CMS with GraphQL API)
**Image Server**: Thumbor for image optimization
**Hosting**: Netlify with serverless functions
**Package Manager**: npm

## AEM Migration Strategy

### Phase 1: Assessment and Planning

#### 1. Content Audit
- [ ] Inventory all content types (Pages, Posts, Publications, Meetings, Biographies, Sites)
- [ ] Document all custom fields and relationships
- [ ] Identify content hierarchies and taxonomies
- [ ] Map Strapi content models to AEM content fragments
- [ ] Document all tags and categorization schemes

#### 2. Feature Mapping
- [ ] Map Vue.js components to AEM components
- [ ] Identify custom business logic to preserve
- [ ] Document all API integrations (GraphQL, Thumbor, etc.)
- [ ] List all custom filters and utilities
- [ ] Document state management requirements

#### 3. Infrastructure Planning
- [ ] Plan AEM deployment architecture
- [ ] Determine AEM as a Cloud Service vs. On-Premise
- [ ] Plan CDN strategy (AEM includes CDN)
- [ ] Plan image optimization strategy (AEM DAM vs. Thumbor)
- [ ] Plan authentication and authorization

### Phase 2: Content Migration

#### Content Fragment Models

Create AEM Content Fragment Models for each Strapi content type:

**Example: Page Content Fragment Model**
```
- title (Text)
- slug (Text)
- summary (Text)
- content (Rich Text)
- tags (Multi-select)
- section (Reference)
- showToc (Boolean)
- addDivider (Boolean)
- isPublished (Boolean)
- createdAt (Date)
- updatedAt (Date)
```

**Example: Publication Content Fragment Model**
```
- title (Text)
- slug (Text)
- year (Number)
- category (Select)
- summary (Text)
- content (Rich Text)
- tags (Multi-select)
- mediaMaterial (Reference to Assets)
- externalMediaMaterial (Reference)
- addToBanner (Boolean)
- bannerRank (Number)
```

#### Data Migration Process

1. **Export from Strapi**
   - Use GraphQL API to export all content
   - Export as JSON for each content type
   - Include all relationships and metadata

2. **Transform Data**
   - Map Strapi field names to AEM field names
   - Convert data types (e.g., Strapi dates to AEM dates)
   - Handle relationships and references
   - Preserve all custom metadata

3. **Import to AEM**
   - Use AEM Bulk Import API
   - Create Content Fragments from transformed data
   - Validate all content after import
   - Verify relationships and references

4. **Asset Migration**
   - Migrate all images to AEM DAM
   - Update image references in content
   - Configure image optimization profiles
   - Test image delivery

### Phase 3: Java Development for AEM

#### Sling Models (Core Pattern)

Sling Models are the primary pattern for mapping content to Java objects in AEM. They replace the GraphQL query logic from Strapi.

**Example: Page Sling Model**

```java
package com.spac.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import com.adobe.cq.dam.cfm.ContentFragment;
import java.util.List;

@Model(adaptables = Resource.class)
public class PageModel {

    @ValueMapValue
    private String title;

    @ValueMapValue
    private String slug;

    @ValueMapValue
    private String summary;

    @ValueMapValue
    private String content;

    @ValueMapValue
    private boolean showToc;

    @ValueMapValue
    private boolean addDivider;

    @ValueMapValue
    private boolean isPublished;

    @ChildResource
    private List<TagModel> tags;

    // Getters
    public String getTitle() { return title; }
    public String getSlug() { return slug; }
    public String getSummary() { return summary; }
    public String getContent() { return content; }
    public boolean isShowToc() { return showToc; }
    public boolean isAddDivider() { return addDivider; }
    public boolean isPublished() { return isPublished; }
    public List<TagModel> getTags() { return tags; }
}
```

**Example: Publication Sling Model**

```java
package com.spac.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import org.apache.sling.models.annotations.injectorspecific.ChildResource;
import java.util.List;
import java.util.Calendar;

@Model(adaptables = Resource.class)
public class PublicationModel {

    @ValueMapValue
    private String title;

    @ValueMapValue
    private String slug;

    @ValueMapValue
    private int year;

    @ValueMapValue
    private String category;

    @ValueMapValue
    private String summary;

    @ValueMapValue
    private String content;

    @ValueMapValue
    private boolean addToBanner;

    @ValueMapValue
    private int bannerRank;

    @ChildResource
    private List<MediaMaterialModel> mediaMaterial;

    @ChildResource
    private List<TagModel> tags;

    @ValueMapValue
    private Calendar createdAt;

    @ValueMapValue
    private Calendar updatedAt;

    // Getters
    public String getTitle() { return title; }
    public String getSlug() { return slug; }
    public int getYear() { return year; }
    public String getCategory() { return category; }
    public String getSummary() { return summary; }
    public String getContent() { return content; }
    public boolean isAddToBanner() { return addToBanner; }
    public int getBannerRank() { return bannerRank; }
    public List<MediaMaterialModel> getMediaMaterial() { return mediaMaterial; }
    public List<TagModel> getTags() { return tags; }
    public Calendar getCreatedAt() { return createdAt; }
    public Calendar getUpdatedAt() { return updatedAt; }
}
```

#### Servlets for API Endpoints

Replace Strapi GraphQL queries with AEM Servlets for custom API endpoints.

**Example: Content Query Servlet**

```java
package com.spac.servlets;

import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.api.servlets.SlingSafeMethodsServlet;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.Resource;
import org.osgi.service.component.annotations.Component;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import java.util.Iterator;

@Component(
    service = javax.servlet.Servlet.class,
    property = {
        "sling.servlet.paths=/bin/spac/pages",
        "sling.servlet.methods=GET"
    }
)
public class PagesServlet extends SlingSafeMethodsServlet {

    private static final Gson gson = new Gson();

    @Override
    protected void doGet(SlingHttpServletRequest request,
                       SlingHttpServletResponse response) {

        ResourceResolver resolver = request.getResourceResolver();
        Resource pagesRoot = resolver.getResource("/content/spac/pages");

        JsonArray pages = new JsonArray();

        if (pagesRoot != null) {
            Iterator<Resource> children = pagesRoot.listChildren();

            while (children.hasNext()) {
                Resource child = children.next();
                PageModel page = child.adaptTo(PageModel.class);

                if (page != null && page.isPublished()) {
                    JsonObject pageJson = new JsonObject();
                    pageJson.addProperty("title", page.getTitle());
                    pageJson.addProperty("slug", page.getSlug());
                    pageJson.addProperty("summary", page.getSummary());
                    pageJson.addProperty("content", page.getContent());

                    pages.add(pageJson);
                }
            }
        }

        response.setContentType("application/json");
        response.getWriter().write(gson.toJson(pages));
    }
}
```

#### OSGi Services for Business Logic

Create OSGi services to handle business logic (similar to Strapi plugins).

**Example: Content Service**

```java
package com.spac.services;

import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Component;
import java.util.List;

@Component(service = ContentService.class)
public class ContentServiceImpl implements ContentService {

    /**
     * Fetch all content for a specific tag
     */
    @Override
    public List<ContentModel> getContentByTag(ResourceResolver resolver, String tagSlug) {
        // Implementation to fetch content by tag
        // Similar to Strapi's getContentByTag query
    }

    /**
     * Fetch publications by category
     */
    @Override
    public List<PublicationModel> getPublicationsByCategory(
        ResourceResolver resolver, String category) {
        // Implementation to fetch publications by category
    }

    /**
     * Fetch upcoming meetings
     */
    @Override
    public List<MeetingModel> getUpcomingMeetings(ResourceResolver resolver) {
        // Implementation to fetch meetings after today
    }

    /**
     * Search content
     */
    @Override
    public List<ContentModel> searchContent(ResourceResolver resolver, String query) {
        // Implementation for full-text search
        // Can use AEM Query Builder or Elasticsearch
    }
}
```

#### Caching with AEM

Replace Vuex session-only caching with AEM's built-in caching mechanisms.

**Example: Cached Service**

```java
package com.spac.services;

import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import com.adobe.granite.cache.CacheManager;
import net.sf.ehcache.Cache;
import java.util.List;

@Component(service = CachedContentService.class)
public class CachedContentServiceImpl implements CachedContentService {

    @Reference
    private CacheManager cacheManager;

    private static final String CACHE_NAME = "spac-content-cache";

    @Override
    public List<PublicationModel> getPublicationsByCategory(
        ResourceResolver resolver, String category) {

        Cache cache = cacheManager.getCache(CACHE_NAME);
        String cacheKey = "publications-" + category;

        // Check cache first
        if (cache.get(cacheKey) != null) {
            return (List<PublicationModel>) cache.get(cacheKey).getObjectValue();
        }

        // Fetch from repository if not in cache
        List<PublicationModel> publications = fetchPublications(resolver, category);

        // Store in cache (TTL: 1 hour)
        cache.put(new net.sf.ehcache.Element(cacheKey, publications, 3600));

        return publications;
    }

    private List<PublicationModel> fetchPublications(
        ResourceResolver resolver, String category) {
        // Implementation to fetch publications
    }
}
```

### Phase 3: Frontend Migration

#### Component Architecture

**Current Vue.js Components** → **AEM Components**

```
ListTable.vue                 → AEM List Component
ListTableNews.vue             → AEM News List Component
ListTablePublication.vue      → AEM Publication List Component
ListTableMeeting.vue          → AEM Meeting List Component
ListTableBiography.vue        → AEM Biography List Component
TagList.vue                   → AEM Tag Component
BaseContent.vue               → AEM Page Template
```

#### AEM Component Development

1. **Create AEM Components**
   - Use AEM Core Components as base
   - Extend with custom business logic
   - Implement responsive design
   - Add accessibility features

2. **Implement Sling Models**
   - Create Java Sling Models for business logic
   - Map Content Fragment data to component properties
   - Implement caching strategies
   - Handle content relationships

3. **Create Page Templates**
   - Design page templates for each content type
   - Configure allowed components
   - Set up responsive breakpoints
   - Implement SEO metadata

#### State Management

**Current**: Vuex store with session-only caching
**AEM**: Use AEM's built-in caching and CDN

- Remove Vuex store (AEM handles state)
- Leverage AEM's page caching
- Use AEM's dispatcher for edge caching
- Implement cache invalidation strategies

### Phase 4: API and Integration

#### GraphQL API

**Current**: Strapi GraphQL API
**AEM**: AEM GraphQL API (Content Fragments)

```graphql
# AEM GraphQL Query (similar structure)
{
  pageList {
    items {
      title
      slug
      summary
      content
      tags {
        name
        slug
      }
    }
  }
}
```

#### Image Optimization

**Current**: Thumbor image server
**AEM**: AEM Dynamic Media

- Migrate image optimization to AEM Dynamic Media
- Update image URLs to use AEM Dynamic Media format
- Configure image presets for common dimensions
- Implement responsive images with srcset

#### Search and Indexing

**Current**: Client-side search with `buildSearchIndex.js`
**AEM**: AEM Search & Promote or Elasticsearch

- Migrate search index generation to AEM
- Update search component to use AEM search API
- Implement faceted search if needed
- Configure search analytics

### Phase 5: Deployment and Testing

#### Testing Strategy

1. **Content Validation**
   - Verify all content migrated correctly
   - Test all content relationships
   - Validate all custom fields
   - Check content hierarchy

2. **Functional Testing**
   - Test all page templates
   - Test component functionality
   - Test search and filtering
   - Test tagging system

3. **Performance Testing**
   - Benchmark page load times
   - Test image optimization
   - Test caching effectiveness
   - Load testing

4. **SEO Testing**
   - Verify metadata
   - Test sitemap generation
   - Check URL structure
   - Validate redirects

#### Deployment

1. **Pre-deployment**
   - Set up AEM environment
   - Configure CDN and caching
   - Set up monitoring and logging
   - Plan rollback strategy

2. **Deployment**
   - Deploy AEM components
   - Migrate content
   - Configure routing
   - Set up redirects from old URLs

3. **Post-deployment**
   - Monitor performance
   - Verify all functionality
   - Check analytics
   - Gather user feedback

## Java-Specific Patterns and Best Practices

### 1. Dependency Injection with OSGi

AEM uses OSGi for dependency injection. Replace npm package imports with OSGi service references.

**Strapi Pattern (JavaScript)**:
```javascript
import { getContentByTag } from "@/services/Content";
const content = await getContentByTag({ slug: "sentencing-policy" });
```

**AEM Pattern (Java)**:
```java
@Component(service = MyComponent.class)
public class MyComponent {

    @Reference
    private ContentService contentService;

    public void doSomething(ResourceResolver resolver) {
        List<ContentModel> content = contentService.getContentByTag(resolver, "sentencing-policy");
    }
}
```

### 2. Query Builder for Content Queries

Replace GraphQL queries with AEM Query Builder for repository queries.

**Strapi GraphQL Query**:
```graphql
{
  publications(sort: "year:desc", where: {isPublished: true, category: "fiscal-impact"}) {
    title
    slug
    year
  }
}
```

**AEM Query Builder (Java)**:
```java
@Reference
private QueryBuilder queryBuilder;

public List<PublicationModel> getPublicationsByCategory(
    ResourceResolver resolver, String category) {

    Map<String, String> map = new HashMap<>();
    map.put("path", "/content/spac/publications");
    map.put("type", "cq:Page");
    map.put("property", "jcr:content/category");
    map.put("property.value", category);
    map.put("property.operation", "equals");
    map.put("orderby", "@jcr:content/year");
    map.put("orderby.sort", "desc");

    Query query = queryBuilder.createQuery(PredicateGroup.create(map), resolver.adaptTo(Session.class));
    SearchResult result = query.getResult();

    List<PublicationModel> publications = new ArrayList<>();
    for (Hit hit : result.getHits()) {
        Resource resource = hit.getResource();
        PublicationModel pub = resource.adaptTo(PublicationModel.class);
        if (pub != null && pub.isPublished()) {
            publications.add(pub);
        }
    }

    return publications;
}
```

### 3. JCR (Java Content Repository) Structure

Map Strapi content types to JCR node structure.

**Strapi Content Type** → **JCR Node Structure**

```
Strapi: publications collection
  ↓
JCR: /content/spac/publications/
  ├── publication-1/
  │   └── jcr:content
  │       ├── title
  │       ├── slug
  │       ├── year
  │       ├── category
  │       └── tags (reference)
  └── publication-2/
      └── jcr:content
          ├── title
          ├── slug
          ├── year
          └── category
```

### 4. Content Fragment Models (CFM)

Create Content Fragment Models for each Strapi content type.

**Example: Publication CFM Definition**

```xml
<?xml version="1.0" encoding="UTF-8"?>
<jcr:root xmlns:sling="http://sling.apache.org/jcr/sling/1.0"
    xmlns:cq="http://www.day.com/jcr/cq/1.0"
    xmlns:jcr="http://www.jcp.org/jcr/1.0"
    jcr:primaryType="cq:Template">

    <jcr:content
        jcr:primaryType="cq:PageContent"
        cq:template="/conf/spac/settings/wcm/templates/publication">

        <model
            jcr:primaryType="cq:Model"
            jcr:title="Publication"
            sling:resourceType="cq/dam/cfm/models/editor/components/schemaType/cfm-schemaType">

            <fieldDefs jcr:primaryType="nt:unstructured">
                <title
                    jcr:primaryType="nt:unstructured"
                    fieldType="text"
                    required="{Boolean}true"/>

                <slug
                    jcr:primaryType="nt:unstructured"
                    fieldType="text"
                    required="{Boolean}true"/>

                <year
                    jcr:primaryType="nt:unstructured"
                    fieldType="number"
                    required="{Boolean}true"/>

                <category
                    jcr:primaryType="nt:unstructured"
                    fieldType="enumeration"
                    required="{Boolean}true">
                    <options jcr:primaryType="nt:unstructured">
                        <annualReport jcr:primaryType="nt:unstructured" value="Annual Report"/>
                        <costBenefit jcr:primaryType="nt:unstructured" value="Cost Benefit Analysis"/>
                        <fiscalImpact jcr:primaryType="nt:unstructured" value="Fiscal Impact Analysis"/>
                    </options>
                </category>

                <tags
                    jcr:primaryType="nt:unstructured"
                    fieldType="multivalue"
                    required="{Boolean}false"/>
            </fieldDefs>
        </model>
    </jcr:content>
</jcr:root>
```

### 5. Adapters for Type Conversion

Use Sling Adapters to convert Resources to model objects (similar to GraphQL field resolution).

**Example: Custom Adapter**

```java
package com.spac.adapters;

import org.apache.sling.api.adapter.AdapterFactory;
import org.apache.sling.api.resource.Resource;
import org.osgi.service.component.annotations.Component;

@Component(
    service = AdapterFactory.class,
    property = {
        AdapterFactory.ADAPTABLE_CLASSES + "=org.apache.sling.api.resource.Resource",
        AdapterFactory.ADAPTER_CLASSES + "=com.spac.models.PublicationModel"
    }
)
public class PublicationAdapterFactory implements AdapterFactory {

    @Override
    public <AdapterType> AdapterType getAdapter(Object adaptable, Class<AdapterType> type) {
        if (!(adaptable instanceof Resource)) {
            return null;
        }

        Resource resource = (Resource) adaptable;

        if (type == PublicationModel.class) {
            return (AdapterType) new PublicationModel(resource);
        }

        return null;
    }
}
```

### 6. Workflow for Content Publishing

Implement AEM workflows to replace Strapi publishing logic.

**Example: Publication Workflow Step**

```java
package com.spac.workflows;

import com.adobe.granite.workflow.WorkflowSession;
import com.adobe.granite.workflow.exec.WorkItem;
import com.adobe.granite.workflow.exec.WorkflowProcess;
import org.osgi.service.component.annotations.Component;

@Component(
    service = WorkflowProcess.class,
    property = {
        "process.label=Publish Content",
        "process.description=Publishes content to production"
    }
)
public class PublishContentWorkflow implements WorkflowProcess {

    @Override
    public void execute(WorkItem item, WorkflowSession session, WorkflowData data) {
        String payloadPath = (String) data.getPayloadData();

        // Get resource
        Resource resource = session.adaptTo(ResourceResolver.class)
            .getResource(payloadPath);

        if (resource != null) {
            // Set isPublished property
            ModifiableValueMap props = resource.adaptTo(ModifiableValueMap.class);
            props.put("isPublished", true);
            props.put("publishedDate", Calendar.getInstance());

            // Replicate to publish environment
            replicateContent(resource, session);
        }
    }

    private void replicateContent(Resource resource, WorkflowSession session) {
        // Implementation for content replication
    }
}
```

### 7. Tagging System Implementation

Implement AEM's native tagging system to replace Strapi tags.

**Example: Tag Service**

```java
package com.spac.services;

import com.day.cq.tagging.Tag;
import com.day.cq.tagging.TagManager;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Component;

@Component(service = TaggingService.class)
public class TaggingServiceImpl implements TaggingService {

    /**
     * Get all content tagged with a specific tag
     */
    @Override
    public List<ContentModel> getContentByTag(ResourceResolver resolver, String tagId) {
        TagManager tagManager = resolver.adaptTo(TagManager.class);
        Tag tag = tagManager.resolve(tagId);

        if (tag == null) {
            return new ArrayList<>();
        }

        // Query for all resources with this tag
        String queryString = "SELECT * FROM [cq:Page] WHERE [cq:tags] = '" + tag.getTagID() + "'";

        // Execute query and return results
        List<ContentModel> content = new ArrayList<>();
        // Implementation...

        return content;
    }

    /**
     * Apply tags to content
     */
    @Override
    public void applyTags(Resource resource, String[] tagIds) {
        TagManager tagManager = resource.getResourceResolver().adaptTo(TagManager.class);

        for (String tagId : tagIds) {
            tagManager.setTags(resource, new String[]{tagId}, true);
        }
    }
}
```

### 8. Search Implementation

Replace client-side Fuse.js search with AEM search capabilities.

**Example: Search Service**

```java
package com.spac.services;

import com.day.cq.search.QueryBuilder;
import com.day.cq.search.result.Hit;
import com.day.cq.search.result.SearchResult;
import org.apache.sling.api.resource.ResourceResolver;
import org.osgi.service.component.annotations.Component;
import org.osgi.service.component.annotations.Reference;
import java.util.*;

@Component(service = SearchService.class)
public class SearchServiceImpl implements SearchService {

    @Reference
    private QueryBuilder queryBuilder;

    @Override
    public List<SearchResultModel> search(ResourceResolver resolver, String query) {
        Map<String, String> map = new HashMap<>();
        map.put("path", "/content/spac");
        map.put("type", "cq:Page");
        map.put("fulltext", query);
        map.put("fulltext.relPath", "jcr:content");

        Query q = queryBuilder.createQuery(PredicateGroup.create(map),
            resolver.adaptTo(Session.class));
        SearchResult result = q.getResult();

        List<SearchResultModel> results = new ArrayList<>();
        for (Hit hit : result.getHits()) {
            SearchResultModel model = new SearchResultModel();
            model.setTitle(hit.getTitle());
            model.setPath(hit.getPath());
            model.setDescription(hit.getExcerpt());
            results.add(model);
        }

        return results;
    }
}
```

### 9. Data Migration Utilities

Create Java utilities to migrate data from Strapi to AEM.

**Example: Migration Utility**

```java
package com.spac.migration;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import org.apache.sling.api.resource.ResourceResolver;
import org.apache.sling.api.resource.ResourceUtil;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.URL;

public class StrapiMigrationUtil {

    /**
     * Fetch content from Strapi GraphQL API
     */
    public static JsonArray fetchFromStrapi(String query) throws Exception {
        URL url = new URL("https://spac.icjia-api.cloud/graphql");
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();
        conn.setRequestMethod("POST");
        conn.setRequestProperty("Content-Type", "application/json");

        // Send query
        try (OutputStream os = conn.getOutputStream()) {
            byte[] input = query.getBytes("utf-8");
            os.write(input, 0, input.length);
        }

        // Read response
        BufferedReader br = new BufferedReader(
            new InputStreamReader(conn.getInputStream(), "utf-8"));
        StringBuilder response = new StringBuilder();
        String responseLine;
        while ((responseLine = br.readLine()) != null) {
            response.append(responseLine.trim());
        }

        JsonObject json = JsonParser.parseString(response.toString()).getAsJsonObject();
        return json.getAsJsonArray("data");
    }

    /**
     * Create AEM content from Strapi data
     */
    public static void createAEMContent(ResourceResolver resolver,
                                       JsonObject strapiData) throws Exception {
        String path = "/content/spac/publications/" + strapiData.get("slug").getAsString();

        Map<String, Object> properties = new HashMap<>();
        properties.put("jcr:primaryType", "cq:Page");
        properties.put("title", strapiData.get("title").getAsString());
        properties.put("slug", strapiData.get("slug").getAsString());
        properties.put("year", strapiData.get("year").getAsInt());
        properties.put("category", strapiData.get("category").getAsString());

        ResourceUtil.getOrCreateResource(resolver, path, properties);
        resolver.commit();
    }
}
```

### 10. Testing Java Components

Use JUnit and Mockito for testing AEM components.

**Example: Unit Test**

```java
package com.spac.services;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

public class ContentServiceTest {

    private ContentService contentService;
    private ResourceResolver mockResolver;

    @BeforeEach
    public void setUp() {
        contentService = new ContentServiceImpl();
        mockResolver = mock(ResourceResolver.class);
    }

    @Test
    public void testGetPublicationsByCategory() {
        List<PublicationModel> publications =
            contentService.getPublicationsByCategory(mockResolver, "fiscal-impact");

        assertNotNull(publications);
        assertTrue(publications.size() > 0);
    }

    @Test
    public void testGetContentByTag() {
        List<ContentModel> content =
            contentService.getContentByTag(mockResolver, "sentencing-policy");

        assertNotNull(content);
        // Verify content contains expected items
    }
}
```

## Key Considerations

### 1. URL Structure
- Maintain current URL structure for SEO
- Implement 301 redirects for any URL changes
- Update sitemap generation
- Update internal links

### 2. Caching Strategy
- **Current**: Session-only in-memory caching
- **AEM**: Multi-layer caching (browser, CDN, dispatcher)
- Plan cache invalidation strategy
- Monitor cache hit rates

### 3. Performance
- AEM includes built-in CDN (AEM as a Cloud Service)
- Dynamic Media handles image optimization
- Dispatcher provides edge caching
- Monitor Core Web Vitals

### 4. Security
- AEM provides built-in security features
- Configure authentication and authorization
- Implement SSL/TLS
- Set up DDoS protection

### 5. Maintenance
- AEM provides automatic updates (Cloud Service)
- Simplified dependency management
- Built-in monitoring and logging
- Reduced infrastructure overhead

## Migration Checklist

### Pre-Migration
- [ ] Complete content audit
- [ ] Document all custom features
- [ ] Plan AEM architecture
- [ ] Set up AEM environment
- [ ] Create content fragment models
- [ ] Plan data migration process

### Migration
- [ ] Export content from Strapi
- [ ] Transform data for AEM
- [ ] Import content to AEM
- [ ] Migrate assets to AEM DAM
- [ ] Develop AEM components
- [ ] Create page templates
- [ ] Implement search functionality

### Post-Migration
- [ ] Validate all content
- [ ] Test all functionality
- [ ] Performance testing
- [ ] SEO verification
- [ ] User acceptance testing
- [ ] Deploy to production
- [ ] Monitor performance
- [ ] Gather feedback

## Common Issues and Challenges

### 1. Data Type Mismatches

**Issue**: Strapi data types don't always map directly to AEM data types.

**Strapi Types** → **AEM Types**:
- String → Text
- Long Text → Rich Text
- Integer → Number
- Boolean → Boolean
- DateTime → Date
- JSON → Structured Content (requires custom handling)
- Relations → References (one-to-many, many-to-many)

**Solution**:
```java
// Handle type conversion during migration
public static Object convertStrapiValue(String strapiType, Object value) {
    switch(strapiType) {
        case "string":
            return value.toString();
        case "integer":
            return Integer.parseInt(value.toString());
        case "boolean":
            return Boolean.parseBoolean(value.toString());
        case "datetime":
            return convertToCalendar(value);
        case "json":
            return parseJsonToStructuredContent(value);
        default:
            return value;
    }
}
```

### 2. Relationship and Reference Handling

**Issue**: Strapi relationships (one-to-many, many-to-many) require different handling in AEM.

**Problem**:
- Strapi: Relations are stored as arrays of IDs
- AEM: References are stored as paths to content fragments

**Example Strapi Data**:
```json
{
  "id": 1,
  "title": "Publication",
  "tags": [1, 2, 3],
  "section": 5
}
```

**Solution**:
```java
public static void migrateRelationships(JsonObject strapiData, ResourceResolver resolver) {
    // Convert tag IDs to AEM tag paths
    JsonArray tagIds = strapiData.getAsJsonArray("tags");
    List<String> tagPaths = new ArrayList<>();

    for (JsonElement tagId : tagIds) {
        String tagPath = "/content/cq:tags/spac/topics/tag-" + tagId.getAsInt();
        tagPaths.add(tagPath);
    }

    // Store as references in AEM
    ModifiableValueMap props = resource.adaptTo(ModifiableValueMap.class);
    props.put("tags", tagPaths.toArray(new String[0]));
}
```

### 3. Rich Text Content Migration

**Issue**: Strapi rich text (HTML) may contain references that break in AEM.

**Problems**:
- Image URLs point to Strapi server
- Internal links use Strapi slug format
- Custom HTML attributes may not be supported

**Solution**:
```java
public static String migrateRichText(String strapiHtml) {
    String aemHtml = strapiHtml;

    // Replace Strapi image URLs with AEM DAM paths
    aemHtml = aemHtml.replaceAll(
        "https://spac\\.icjia-api\\.cloud/uploads/",
        "/content/dam/spac/images/"
    );

    // Convert internal links from slug format to AEM paths
    aemHtml = aemHtml.replaceAll(
        "href=\"/([^\"]+)\"",
        "href=\"/content/spac/$1\""
    );

    // Remove unsupported attributes
    aemHtml = aemHtml.replaceAll(
        " data-[a-z-]+=\"[^\"]*\"",
        ""
    );

    return aemHtml;
}
```

### 4. Image Asset Migration

**Issue**: Images stored in Strapi need to be migrated to AEM DAM with proper metadata.

**Problems**:
- Large number of images to migrate
- Image metadata (alt text, descriptions) may be missing
- Image URLs change format
- Thumbnor optimization URLs need to be updated

**Solution**:
```java
public static void migrateImages(ResourceResolver resolver, String strapiImageUrl) throws Exception {
    // Download image from Strapi
    URL url = new URL(strapiImageUrl);
    InputStream imageStream = url.openStream();

    // Create asset in AEM DAM
    String damPath = "/content/dam/spac/images/" + extractFilename(strapiImageUrl);
    Asset asset = resolver.adaptTo(AssetManager.class)
        .createAsset(damPath, imageStream, "image/jpeg");

    // Add metadata
    Metadata metadata = asset.getMetadata();
    metadata.setProperty("dc:title", extractTitle(strapiImageUrl));
    metadata.setProperty("dc:description", "Migrated from Strapi");

    asset.setMetadata(metadata);
    asset.getOriginal().getStream().close();

    resolver.commit();
}
```

### 5. URL Structure and Redirects

**Issue**: Content paths change from Strapi to AEM, breaking SEO and existing links.

**Strapi URLs**:
```
/publications/fiscal-impact-2024
/news/latest-announcement
/about/biographies/john-doe
```

**AEM URLs** (if not configured properly):
```
/content/spac/publications/fiscal-impact-2024
/content/spac/news/latest-announcement
/content/spac/about/biographies/john-doe
```

**Solution**:
```java
// Create redirect mappings
public static void createRedirects(ResourceResolver resolver) {
    Map<String, String> redirects = new HashMap<>();
    redirects.put("/publications/", "/content/spac/publications/");
    redirects.put("/news/", "/content/spac/news/");
    redirects.put("/about/biographies/", "/content/spac/about/biographies/");

    // Implement 301 redirects in dispatcher or AEM
    for (Map.Entry<String, String> redirect : redirects.entrySet()) {
        createRedirectPage(resolver, redirect.getKey(), redirect.getValue());
    }
}

// Or configure in dispatcher.any
# /etc/dispatcher/conf.d/rewrites/rewrite.rules
RewriteRule ^/publications/(.*)$ /content/spac/publications/$1 [PT,L]
RewriteRule ^/news/(.*)$ /content/spac/news/$1 [PT,L]
```

### 6. Metadata and SEO Fields

**Issue**: Strapi custom SEO fields may not map to AEM's standard metadata.

**Strapi Fields**:
```json
{
  "searchMeta": "Custom search metadata",
  "seoTitle": "Custom page title",
  "seoDescription": "Custom meta description"
}
```

**Solution**:
```java
// Map to AEM standard properties
public static void migrateSeoMetadata(Resource resource, JsonObject strapiData) {
    ModifiableValueMap props = resource.adaptTo(ModifiableValueMap.class);

    // Map to AEM standard properties
    if (strapiData.has("seoTitle")) {
        props.put("jcr:title", strapiData.get("seoTitle").getAsString());
    }

    if (strapiData.has("seoDescription")) {
        props.put("cq:description", strapiData.get("seoDescription").getAsString());
    }

    if (strapiData.has("searchMeta")) {
        props.put("searchMeta", strapiData.get("searchMeta").getAsString());
    }
}
```

### 7. Date and Timezone Issues

**Issue**: Strapi dates may be in different timezone or format than AEM expects.

**Problem**:
- Strapi: ISO 8601 format with timezone
- AEM: JCR Calendar format (UTC)
- Timezone conversion errors

**Solution**:
```java
public static Calendar convertStrapiDate(String strapiDateString) {
    // Parse ISO 8601 date
    ZonedDateTime zdt = ZonedDateTime.parse(strapiDateString);

    // Convert to UTC
    ZonedDateTime utc = zdt.withZoneSameInstant(ZoneId.of("UTC"));

    // Convert to Calendar
    Calendar calendar = Calendar.getInstance(TimeZone.getTimeZone("UTC"));
    calendar.setTimeInMillis(utc.toInstant().toEpochMilli());

    return calendar;
}
```

### 8. Duplicate Content and Versioning

**Issue**: Strapi may have draft and published versions; AEM has different versioning.

**Problem**:
- Strapi: Separate draft/published states
- AEM: Versioning system with author/publish environments
- Risk of duplicating content

**Solution**:
```java
public static void migrateWithVersioning(ResourceResolver resolver, JsonObject strapiData) {
    // Only migrate published content
    if (!strapiData.get("isPublished").getAsBoolean()) {
        return; // Skip draft content
    }

    // Create content in author environment
    String path = "/content/spac/publications/" + strapiData.get("slug").getAsString();
    Resource resource = ResourceUtil.getOrCreateResource(resolver, path, new HashMap<>());

    // Set properties
    ModifiableValueMap props = resource.adaptTo(ModifiableValueMap.class);
    props.put("jcr:title", strapiData.get("title").getAsString());

    // Create version
    VersionManager versionManager = resolver.adaptTo(VersionManager.class);
    versionManager.checkin(path);

    resolver.commit();
}
```

### 9. Custom Fields and Extensions

**Issue**: Strapi custom fields may not have direct AEM equivalents.

**Examples**:
- Custom validation rules
- Custom UI components
- Plugin-specific fields
- Dynamic field configurations

**Solution**:
```java
// Create custom AEM components for Strapi-specific fields
@Component(service = CustomFieldHandler.class)
public class CustomFieldHandlerImpl implements CustomFieldHandler {

    @Override
    public void handleCustomField(Resource resource, String fieldName, Object value) {
        // Implement custom logic for each Strapi custom field
        switch(fieldName) {
            case "customRating":
                handleRatingField(resource, value);
                break;
            case "customGallery":
                handleGalleryField(resource, value);
                break;
            default:
                // Store as generic property
                resource.adaptTo(ModifiableValueMap.class)
                    .put(fieldName, value);
        }
    }
}
```

### 10. Performance and Bulk Migration

**Issue**: Migrating large amounts of content can be slow and resource-intensive.

**Problems**:
- API rate limiting
- Memory issues with large datasets
- Network timeouts
- Database locks

**Solution**:
```java
public static void bulkMigrate(ResourceResolver resolver, List<JsonObject> strapiData) {
    int batchSize = 100;
    int totalProcessed = 0;

    for (int i = 0; i < strapiData.size(); i += batchSize) {
        int end = Math.min(i + batchSize, strapiData.size());
        List<JsonObject> batch = strapiData.subList(i, end);

        try {
            // Process batch
            for (JsonObject item : batch) {
                migrateContent(resolver, item);
            }

            // Commit batch
            resolver.commit();
            totalProcessed += batch.size();

            System.out.println("Processed: " + totalProcessed + "/" + strapiData.size());

            // Add delay between batches to avoid rate limiting
            Thread.sleep(1000);

        } catch (Exception e) {
            System.err.println("Error processing batch: " + e.getMessage());
            resolver.revert();
        }
    }
}
```

### 11. Content Validation and Data Quality

**Issue**: Strapi data may have inconsistencies or missing required fields.

**Problems**:
- Missing required fields
- Invalid data formats
- Orphaned references
- Inconsistent naming conventions

**Solution**:
```java
public static ValidationResult validateStrapiData(JsonObject strapiData) {
    ValidationResult result = new ValidationResult();

    // Check required fields
    if (!strapiData.has("title") || strapiData.get("title").getAsString().isEmpty()) {
        result.addError("Missing required field: title");
    }

    if (!strapiData.has("slug") || strapiData.get("slug").getAsString().isEmpty()) {
        result.addError("Missing required field: slug");
    }

    // Validate data formats
    if (strapiData.has("year")) {
        try {
            int year = strapiData.get("year").getAsInt();
            if (year < 1900 || year > 2100) {
                result.addWarning("Year out of expected range: " + year);
            }
        } catch (Exception e) {
            result.addError("Invalid year format");
        }
    }

    // Check for orphaned references
    if (strapiData.has("tags")) {
        JsonArray tags = strapiData.getAsJsonArray("tags");
        for (JsonElement tag : tags) {
            if (!tagExists(tag.getAsInt())) {
                result.addWarning("Orphaned tag reference: " + tag.getAsInt());
            }
        }
    }

    return result;
}
```

### 12. Search Index Rebuilding

**Issue**: After migration, search indexes need to be rebuilt.

**Problems**:
- Old Strapi content still in search index
- New AEM content not indexed
- Search results pointing to old URLs
- Performance degradation during reindexing

**Solution**:
```java
public static void rebuildSearchIndex(ResourceResolver resolver) {
    // Get index manager
    IndexManager indexManager = resolver.adaptTo(IndexManager.class);

    // Reindex migrated content
    String[] paths = {"/content/spac"};

    for (String path : paths) {
        try {
            indexManager.reindex(path);
            System.out.println("Reindexing: " + path);
        } catch (Exception e) {
            System.err.println("Error reindexing " + path + ": " + e.getMessage());
        }
    }

    // Wait for reindexing to complete
    while (indexManager.isReindexing()) {
        Thread.sleep(5000);
        System.out.println("Reindexing in progress...");
    }

    System.out.println("Reindexing complete");
}
```

## Estimated Timeline

- **Assessment**: 2-4 weeks
- **Content Migration**: 2-4 weeks
- **Frontend Development**: 4-8 weeks
- **Testing**: 2-4 weeks
- **Deployment**: 1-2 weeks
- **Total**: 11-22 weeks (3-5 months)

## Resources

- **AEM Documentation**: https://experienceleague.adobe.com/docs/experience-manager-cloud-service/
- **AEM Core Components**: https://github.com/adobe/aem-core-wcm-components
- **AEM GraphQL API**: https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/headless/graphql-api/
- **AEM Dynamic Media**: https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/assets/dynamicmedia/

## Support

For questions about AEM migration:
1. Consult Adobe Experience Manager documentation
2. Contact Adobe support or AEM implementation partner
3. Review this guide for SPAC-specific considerations
4. Reference current architecture documentation

---

**Note**: This migration will modernize the SPAC platform with enterprise-grade CMS capabilities, improved performance, and reduced maintenance overhead.

