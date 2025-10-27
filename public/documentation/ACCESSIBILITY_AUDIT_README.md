# ♿ Accessibility Audit Guide

## Overview

The SPAC Client website includes automated accessibility auditing tools to ensure compliance with WCAG 2.1 standards. The audit system uses:

- **axe-core**: Automated accessibility testing engine
- **Lighthouse**: Google's web performance and accessibility auditing tool
- **Playwright**: Browser automation for testing

## Running Accessibility Audits

### Prerequisites

Before running audits, ensure:
1. The development server is running: `npm run serve`
2. The application is accessible at `http://localhost:8080`
3. All dependencies are installed: `npm install`

### Run Audit

Execute the accessibility audit:

```bash
npm run audit:accessibility
```

This command will:
1. Launch a browser and navigate to each configured page
2. Run axe-core accessibility checks
3. Run Lighthouse accessibility audits
4. Generate comprehensive reports
5. Auto-generate accessibility documentation

### Output

The audit generates the following files in `/public/documentation/accessibility/`:

- **index.html** - Detailed HTML report with violations and passed checks
- **overview.html** - Summary page with scores and recommendations
- **ACCESSIBILITY.md** - Markdown documentation with full details
- **results.json** - Raw audit results in JSON format

## Understanding Results

### Violation Severity Levels

- **Critical**: Blocks access for users with disabilities
- **Serious**: Significantly impacts user experience
- **Moderate**: Causes some difficulty
- **Minor**: Minimal impact

### Lighthouse Scores

- **90-100**: Excellent accessibility
- **70-89**: Good accessibility (needs improvement)
- **Below 70**: Poor accessibility (requires fixes)

## Common Issues and Fixes

### Missing Alt Text
**Issue**: Images without alt text
**Fix**: Add descriptive alt text to all images
```html
<img src="image.jpg" alt="Description of image content">
```

### Color Contrast
**Issue**: Text color doesn't have sufficient contrast with background
**Fix**: Ensure contrast ratio meets WCAG AA standards (4.5:1 for normal text)

### Keyboard Navigation
**Issue**: Interactive elements not accessible via keyboard
**Fix**: Ensure all interactive elements are focusable and operable with keyboard

### Form Labels
**Issue**: Form inputs without associated labels
**Fix**: Use `<label>` elements with `for` attribute
```html
<label for="email">Email:</label>
<input id="email" type="email">
```

### Heading Structure
**Issue**: Improper heading hierarchy (e.g., h1 → h3)
**Fix**: Use sequential heading levels (h1 → h2 → h3)

## WCAG 2.1 Compliance

The audits check compliance with:

- **WCAG 2.1 Level A**: Basic accessibility requirements
- **WCAG 2.1 Level AA**: Enhanced accessibility (recommended standard)
- **WCAG 2.1 Level AAA**: Advanced accessibility (optional)

### Key Principles

1. **Perceivable**: Information must be perceivable to users
2. **Operable**: Users must be able to operate the interface
3. **Understandable**: Content and interface must be understandable
4. **Robust**: Content must work with assistive technologies

## Testing with Assistive Technologies

### Screen Readers

Test with popular screen readers:
- **NVDA** (Windows, free)
- **JAWS** (Windows, commercial)
- **VoiceOver** (macOS, built-in)
- **TalkBack** (Android, built-in)

### Keyboard Navigation

Test keyboard-only navigation:
1. Disable mouse
2. Use Tab to navigate
3. Use Enter/Space to activate buttons
4. Use Arrow keys for menus

### Browser Extensions

- **axe DevTools**: Automated accessibility testing
- **WAVE**: Web accessibility evaluation tool
- **Lighthouse**: Built into Chrome DevTools

## Continuous Integration

To integrate accessibility audits into your CI/CD pipeline:

```bash
# In your CI configuration
npm run serve &
sleep 5
npm run audit:accessibility
```

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [axe DevTools Documentation](https://www.deque.com/axe/devtools/)
- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)
- [WebAIM](https://webaim.org/)
- [MDN Accessibility](https://developer.mozilla.org/en-US/docs/Web/Accessibility)

## Support

For questions or issues with accessibility audits:
1. Check the audit results for specific violations
2. Review WCAG 2.1 guidelines for the failing criteria
3. Consult WebAIM for implementation guidance
4. Test with actual assistive technologies

