# AEM Migration: Common Issues and Solutions Summary

**📅 Last Updated**: October 23, 2025

## Overview

This document summarizes the 12 most common issues AEM developers will encounter when migrating the SPAC application from Strapi to Adobe Experience Manager, along with practical solutions and code examples.

## Quick Reference: 12 Common Issues

### 1. Data Type Mismatches ⚠️
**Severity**: High | **Frequency**: Very Common

Strapi data types don't map directly to AEM types. String, Integer, Boolean, DateTime, JSON, and Relations all require conversion.

**Quick Fix**: Create conversion utilities for each data type.

### 2. Relationship and Reference Handling ⚠️
**Severity**: High | **Frequency**: Very Common

Strapi stores relations as arrays of IDs; AEM stores references as paths to content fragments.

**Quick Fix**: Map Strapi IDs to AEM content fragment paths during migration.

### 3. Rich Text Content Migration ⚠️
**Severity**: High | **Frequency**: Common

HTML content may contain broken image URLs and internal links pointing to Strapi.

**Quick Fix**: Migrate images to AEM DAM and update all internal links to use AEM paths.

### 4. Image Asset Migration ⚠️
**Severity**: High | **Frequency**: Common

Large-scale image migration requires proper metadata handling and URL updates.

**Quick Fix**: Use bulk import with metadata extraction and error handling.

### 5. URL Structure and Redirects ⚠️
**Severity**: Critical | **Frequency**: Always

Content paths change from Strapi to AEM, breaking SEO and existing links.

**Quick Fix**: Implement 301 redirects from old Strapi URLs to new AEM URLs.

### 6. SEO Metadata Mapping ⚠️
**Severity**: Medium | **Frequency**: Common

Custom Strapi SEO fields need to map to AEM standard properties.

**Quick Fix**: Map searchMeta, seoTitle, seoDescription to AEM properties.

### 7. Date and Timezone Issues ⚠️
**Severity**: Medium | **Frequency**: Common

Strapi ISO 8601 dates need conversion to AEM Calendar format with proper timezone handling.

**Quick Fix**: Convert to UTC and handle timezone properly during migration.

### 8. Draft vs Published Content ⚠️
**Severity**: High | **Frequency**: Common

Strapi has separate draft/published states; AEM uses versioning.

**Quick Fix**: Only migrate published content; use AEM versioning for drafts.

### 9. Custom Fields and Extensions ⚠️
**Severity**: Medium | **Frequency**: Occasional

Strapi custom fields may not have direct AEM equivalents.

**Quick Fix**: Create custom AEM components or store as generic properties.

### 10. Performance and Bulk Migration ⚠️
**Severity**: High | **Frequency**: Always

Migrating large amounts of content can be slow and resource-intensive.

**Quick Fix**: Use batch processing with delays to avoid rate limiting.

### 11. Content Validation and Data Quality ⚠️
**Severity**: Medium | **Frequency**: Common

Strapi data may have inconsistencies or missing required fields.

**Quick Fix**: Validate data before migration; handle orphaned references.

### 12. Search Index Rebuilding ⚠️
**Severity**: Medium | **Frequency**: Always

After migration, search indexes need to be rebuilt.

**Quick Fix**: Reindex all migrated content paths after migration complete.

## Migration Checklist

### Pre-Migration
- [ ] Audit all Strapi content types and custom fields
- [ ] Document all data type mappings
- [ ] Identify all relationships and references
- [ ] Plan URL redirect strategy
- [ ] Create data validation rules
- [ ] Set up AEM Content Fragment Models

### During Migration
- [ ] Convert data types using utilities
- [ ] Map relationships to AEM references
- [ ] Migrate images to AEM DAM
- [ ] Update rich text content links
- [ ] Map SEO metadata
- [ ] Convert dates to UTC
- [ ] Validate data quality
- [ ] Handle custom fields
- [ ] Process in batches with error handling

### Post-Migration
- [ ] Verify all content migrated correctly
- [ ] Test all relationships and references
- [ ] Verify image URLs work
- [ ] Test internal links
- [ ] Rebuild search indexes
- [ ] Implement 301 redirects
- [ ] Monitor for broken links
- [ ] Validate SEO metadata

## Key Statistics

- **Total Issues Documented**: 12
- **Critical Issues**: 1 (URL Structure)
- **High Severity Issues**: 6
- **Medium Severity Issues**: 4
- **Estimated Migration Time**: 3-5 months
- **Code Examples Provided**: 12+
- **Java Patterns Covered**: 8

## Documentation References

### Main Documentation Files
1. **AEM_MIGRATION_GUIDE.md** (1,523 lines)
   - Comprehensive migration strategy
   - Detailed Java patterns and code examples
   - Phase-by-phase implementation guide
   - All 12 common issues with solutions

2. **README.md**
   - Quick reference for common issues
   - Links to detailed documentation
   - Timeline and key considerations

3. **project-documentation.md**
   - AEM migration overview
   - Common issues summary
   - Java-specific patterns
   - Resources and references

4. **HTML Documentation** (/public/documentation/dev/index.html)
   - Rendered version of project-documentation.md
   - Searchable and interactive
   - Dark/light theme support
   - 88 KB file size

## Java Patterns Covered

1. **Sling Models** - Data mapping
2. **OSGi Services** - Business logic
3. **Query Builder** - Content queries
4. **JCR Structure** - Repository organization
5. **Content Fragment Models** - Schema definition
6. **Adapters** - Type conversion
7. **Workflows** - Publishing logic
8. **Tagging System** - Content organization
9. **Search Services** - Full-text search
10. **Migration Utilities** - Data conversion
11. **Testing** - Unit tests with JUnit/Mockito
12. **Caching** - Performance optimization

## Quick Start for AEM Developers

1. **Read**: Start with `/AEM_MIGRATION_GUIDE.md`
2. **Understand**: Review current Strapi architecture in this documentation
3. **Plan**: Map all Strapi content types to AEM Content Fragments
4. **Develop**: Create AEM components using provided Java patterns
5. **Migrate**: Use provided utilities for data conversion
6. **Test**: Validate all content and functionality
7. **Deploy**: Implement redirects and monitor performance

## Support Resources

- **AEM Documentation**: https://experienceleague.adobe.com/docs/experience-manager-cloud-service/
- **AEM Core Components**: https://github.com/adobe/aem-core-wcm-components
- **AEM GraphQL API**: https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/headless/graphql-api/
- **AEM Dynamic Media**: https://experienceleague.adobe.com/docs/experience-manager-cloud-service/content/assets/dynamicmedia/

## Next Steps

1. Review `/AEM_MIGRATION_GUIDE.md` for comprehensive guidance
2. Study the Java patterns provided for your specific use case
3. Create data validation rules for your content
4. Set up AEM Content Fragment Models
5. Develop migration utilities using provided code examples
6. Plan your migration in phases
7. Test thoroughly before production deployment

---

**All documentation is current as of October 23, 2025 and ready for AEM migration planning!**

