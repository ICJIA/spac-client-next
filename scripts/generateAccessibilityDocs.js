/**
 * @fileoverview Accessibility Documentation Generator
 * Generates comprehensive accessibility documentation from audit results
 * and creates an index page for the accessibility section.
 *
 * @author ICJIA
 * @since 1.0.0
 */

/* eslint-disable no-console */

const fs = require('fs');
const path = require('path');

/**
 * Configuration for accessibility documentation
 */
const config = {
  accessibilityDir: path.join(process.cwd(), 'public', 'documentation', 'accessibility'),
  resultsFile: 'results.json',
  indexFile: 'index.html',
  docsFile: 'ACCESSIBILITY.md'
};

/**
 * Read accessibility audit results
 */
function readAuditResults() {
  const resultsPath = path.join(config.accessibilityDir, config.resultsFile);
  
  if (!fs.existsSync(resultsPath)) {
    console.warn('⚠️  No audit results found. Run accessibility audit first.');
    return null;
  }
  
  try {
    const data = fs.readFileSync(resultsPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('❌ Failed to read audit results:', error.message);
    return null;
  }
}

/**
 * Generate accessibility markdown documentation
 */
function generateMarkdownDocs(results) {
  if (!results) return '';
  
  const { axe, lighthouse, timestamp } = results;
  
  let markdown = `# ♿ Accessibility Audit Report

**Generated**: ${new Date(timestamp).toLocaleString()}

## Overview

This page contains comprehensive accessibility audit results for the SPAC Client website. The audits are performed using:
- **axe-core**: Automated accessibility testing
- **Lighthouse**: Google's web performance and accessibility auditing tool

## Summary

| Metric | Value |
|--------|-------|
| Total Violations | ${axe.reduce((sum, r) => sum + (r?.violations?.length || 0), 0)} |
| Passed Checks | ${axe.reduce((sum, r) => sum + (r?.passes?.length || 0), 0)} |
| Pages Audited | ${axe.length} |
| Audit Date | ${new Date(timestamp).toLocaleString()} |

## Lighthouse Accessibility Scores

`;

  lighthouse.forEach(result => {
    if (result) {
      const score = Math.round(result.score);
      const status = score >= 90 ? '✅' : score >= 70 ? '⚠️' : '❌';
      markdown += `- ${status} **${result.url}**: ${score}/100\n`;
    }
  });

  markdown += `\n## Violations by Page\n\n`;

  axe.forEach(result => {
    if (result && result.violations.length > 0) {
      markdown += `### ${result.url}\n\n`;
      markdown += `**Total Violations**: ${result.violations.length}\n\n`;
      
      result.violations.forEach(violation => {
        markdown += `#### ${violation.id} (${violation.impact})\n\n`;
        markdown += `${violation.description}\n\n`;
        markdown += `**Affected Elements**: ${violation.nodes.length}\n\n`;
        markdown += '```html\n';
        violation.nodes.slice(0, 3).forEach(node => {
          markdown += `${node.html}\n`;
        });
        if (violation.nodes.length > 3) {
          markdown += `... and ${violation.nodes.length - 3} more\n`;
        }
        markdown += '```\n\n';
      });
    }
  });

  markdown += `\n## Passed Checks\n\n`;

  axe.forEach(result => {
    if (result && result.passes.length > 0) {
      markdown += `### ${result.url}\n\n`;
      markdown += `**Passed Checks**: ${result.passes.length}\n\n`;
      markdown += result.passes.map(p => `- ✅ ${p.id}`).join('\n');
      markdown += '\n\n';
    }
  });

  markdown += `\n## WCAG 2.1 Compliance\n\n`;
  markdown += `This audit checks compliance with:\n`;
  markdown += `- **WCAG 2.1 Level A**: Basic accessibility\n`;
  markdown += `- **WCAG 2.1 Level AA**: Enhanced accessibility (recommended)\n`;
  markdown += `- **WCAG 2.1 Level AAA**: Advanced accessibility\n\n`;

  markdown += `## Recommendations\n\n`;
  markdown += `1. **Fix Critical Violations**: Address all violations marked as "critical" or "serious"\n`;
  markdown += `2. **Improve Lighthouse Scores**: Aim for scores above 90 on all pages\n`;
  markdown += `3. **Test with Assistive Technologies**: Use screen readers and keyboard navigation\n`;
  markdown += `4. **Regular Audits**: Run accessibility audits regularly during development\n`;
  markdown += `5. **User Testing**: Include users with disabilities in testing\n\n`;

  markdown += `## Resources\n\n`;
  markdown += `- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)\n`;
  markdown += `- [axe DevTools](https://www.deque.com/axe/devtools/)\n`;
  markdown += `- [Lighthouse Documentation](https://developers.google.com/web/tools/lighthouse)\n`;
  markdown += `- [WebAIM](https://webaim.org/)\n`;

  return markdown;
}

/**
 * Generate accessibility index HTML
 */
function generateIndexHTML(results) {
  if (!results) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessibility - SPAC Documentation</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 20px; }
    .container { max-width: 800px; margin: 0 auto; }
    .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 15px; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>♿ Accessibility Audit</h1>
    <div class="warning">
      <p><strong>⚠️ No audit results found.</strong></p>
      <p>Run the accessibility audit first:</p>
      <code>npm run audit:accessibility</code>
    </div>
  </div>
</body>
</html>`;
  }

  const { axe, lighthouse, timestamp } = results;
  const totalViolations = axe.reduce((sum, r) => sum + (r?.violations?.length || 0), 0);
  const avgLighthouseScore = Math.round(
    lighthouse.reduce((sum, r) => sum + (r?.score || 0), 0) / lighthouse.length * 100
  );

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessibility - SPAC Documentation</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      margin: 0;
      padding: 20px;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
      background: white;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 { color: #1976d2; border-bottom: 3px solid #1976d2; padding-bottom: 10px; }
    h2 { color: #1565c0; margin-top: 30px; }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }
    .card {
      background: #f9f9f9;
      border-left: 4px solid #1976d2;
      padding: 20px;
      border-radius: 4px;
      text-align: center;
    }
    .card strong { display: block; font-size: 32px; color: #1976d2; margin: 10px 0; }
    .card p { margin: 0; color: #666; }
    .status-good { border-left-color: #4caf50; }
    .status-good strong { color: #4caf50; }
    .status-warning { border-left-color: #ff9800; }
    .status-warning strong { color: #ff9800; }
    .status-critical { border-left-color: #f44336; }
    .status-critical strong { color: #f44336; }
    .timestamp { color: #999; font-size: 12px; }
    a { color: #1976d2; text-decoration: none; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="container">
    <h1>♿ Accessibility Audit Report</h1>
    <p class="timestamp">Generated: ${new Date(timestamp).toLocaleString()}</p>
    
    <h2>Summary</h2>
    <div class="summary">
      <div class="card ${totalViolations === 0 ? 'status-good' : totalViolations < 10 ? 'status-warning' : 'status-critical'}">
        <p>Total Violations</p>
        <strong>${totalViolations}</strong>
      </div>
      <div class="card status-good">
        <p>Average Lighthouse Score</p>
        <strong>${avgLighthouseScore}</strong>
      </div>
      <div class="card">
        <p>Pages Audited</p>
        <strong>${axe.length}</strong>
      </div>
    </div>
    
    <h2>Lighthouse Scores</h2>
    <div class="summary">
      ${lighthouse.map(r => {
        if (!r) return '';
        const score = Math.round(r.score * 100);
        const statusClass = score >= 90 ? 'status-good' : score >= 70 ? 'status-warning' : 'status-critical';
        return `
          <div class="card ${statusClass}">
            <p>${r.url}</p>
            <strong>${score}</strong>
          </div>
        `;
      }).join('')}
    </div>
    
    <h2>Documentation</h2>
    <p>For detailed accessibility audit results and recommendations, see:</p>
    <ul>
      <li><a href="ACCESSIBILITY.md">📋 Full Accessibility Report (Markdown)</a></li>
      <li><a href="index.html">📊 Detailed HTML Report</a></li>
      <li><a href="results.json">📁 Raw Audit Results (JSON)</a></li>
    </ul>
    
    <h2>Resources</h2>
    <ul>
      <li><a href="https://www.w3.org/WAI/WCAG21/quickref/">WCAG 2.1 Guidelines</a></li>
      <li><a href="https://www.deque.com/axe/devtools/">axe DevTools</a></li>
      <li><a href="https://developers.google.com/web/tools/lighthouse">Lighthouse Documentation</a></li>
      <li><a href="https://webaim.org/">WebAIM</a></li>
    </ul>
  </div>
</body>
</html>`;
}

/**
 * Generate accessibility documentation
 */
function generateAccessibilityDocs() {
  console.log('📝 Generating accessibility documentation...\n');
  
  // Ensure directory exists
  if (!fs.existsSync(config.accessibilityDir)) {
    fs.mkdirSync(config.accessibilityDir, { recursive: true });
  }
  
  // Read audit results
  const results = readAuditResults();
  
  // Generate markdown documentation
  const markdown = generateMarkdownDocs(results);
  if (markdown) {
    const markdownPath = path.join(config.accessibilityDir, config.docsFile);
    fs.writeFileSync(markdownPath, markdown, 'utf8');
    console.log(`✅ Markdown documentation: ${markdownPath}`);
  }
  
  // Generate index HTML
  const indexHTML = generateIndexHTML(results);
  const indexPath = path.join(config.accessibilityDir, 'overview.html');
  fs.writeFileSync(indexPath, indexHTML, 'utf8');
  console.log(`✅ Index HTML: ${indexPath}`);
  
  console.log('\n✅ Accessibility documentation generated successfully!');
}

// Run the generator
generateAccessibilityDocs();

