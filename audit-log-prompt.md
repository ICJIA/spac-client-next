# Audit Log Entry Prompt

Use this prompt to create new audit log entries or update existing audit logs. Follow the established format and structure for consistency.

## Prompt Template

When creating or updating an audit log entry, provide the following information:

### Required Information:
1. **Date**: Current date in YYYY-MM-DD format
2. **Change Summary**: Brief 1-2 sentence description of what was changed
3. **Files Modified/Added/Removed**: List of all files affected with descriptions
4. **Technical Notes**: Implementation details, reasoning, or important context

### Entry Format:

```markdown
### YYYY-MM-DD: [Brief title of change]
- **Change Summary**: [1-2 sentence description of the change and its purpose]
- **Files [Modified/Added/Removed]**:
  - `path/to/file.ext`: [Brief description of what was changed in this file]
  - `path/to/another/file.ext`: [Brief description of changes]
- **Technical Notes**: [Implementation details, reasoning, backward compatibility notes, or other important context]
```

## Guidelines:

1. **Reverse Chronological Order**: Add new entries immediately after the "## Site Updates" heading (newest first)
2. **Consistent Dating**: Use YYYY-MM-DD format for all dates
3. **Clear Descriptions**: Be specific but concise about what changed
4. **File Paths**: Use relative paths from project root
5. **Technical Context**: Include information that would help future developers understand the change
6. **Backward Compatibility**: Note if changes affect existing functionality or URLs
7. **Related Changes**: Group related changes into a single entry when appropriate

## Example Usage:

**Input**: "I updated the contact form validation to require phone numbers and added email confirmation"

**Output**:
```markdown
### 2025-06-24: Enhanced contact form validation requirements
- **Change Summary**: Added phone number requirement and email confirmation to the contact form to improve data quality and reduce submission errors.
- **Files Modified**:
  - `src/components/ContactForm.vue`: Added phone number field validation and email confirmation field with matching validation
  - `src/utils/validation.js`: Added phone number format validation function and email confirmation matching logic
- **Technical Notes**: Phone number validation accepts US formats with optional country code. Email confirmation prevents typos by requiring users to enter email twice. Form submission is blocked until all validations pass.
```

## Special Considerations:

- **Display vs. Routing Changes**: When changing display labels without affecting URLs or routing, clearly note that underlying functionality remains unchanged
- **Configuration Changes**: When modifying config files, specify which display elements are affected
- **Breaking Changes**: Clearly mark any changes that might affect existing bookmarks, links, or integrations
- **Dependencies**: Note any new dependencies added or removed
- **Performance Impact**: Mention if changes significantly affect load times or resource usage
