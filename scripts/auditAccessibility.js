/**
 * @fileoverview Accessibility Auditing Script for SPAC Client
 * Runs axe-core and Lighthouse accessibility audits on the application
 * and generates comprehensive accessibility reports.
 *
 * @author ICJIA
 * @since 1.0.0
 */

/* eslint-disable no-console */

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");
const { AxeBuilder } = require("@axe-core/playwright");
const { chromium } = require("playwright");
const lighthouse = require("lighthouse");
const chromeLauncher = require("chrome-launcher");

/**
 * Configuration for accessibility audits
 */
const config = {
  baseURL: "http://localhost:8080",
  outputDir: path.join(
    process.cwd(),
    "public",
    "documentation",
    "accessibility"
  ),
  pages: [
    { name: "Home", path: "/" },
    { name: "Publications", path: "/publications" },
    { name: "News", path: "/news" },
    { name: "About", path: "/about" },
  ],
  axeConfig: {
    runOnly: {
      type: "tag",
      values: ["wcag2aa", "wcag21aa"],
    },
  },
  lighthouseConfig: {
    logLevel: "error",
    output: "json",
    onlyCategories: ["accessibility"],
    port: 9222,
  },
};

/**
 * Run axe-core accessibility audit on a page
 */
async function runAxeAudit(page, url) {
  try {
    console.log(`  🔍 Running axe-core audit on ${url}...`);

    const results = await new AxeBuilder({ page })
      .withTags(["wcag2aa", "wcag21aa"])
      .analyze();

    return {
      url,
      violations: results.violations,
      passes: results.passes,
      incomplete: results.incomplete,
      inapplicable: results.inapplicable,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`  ❌ Axe audit failed for ${url}:`, error.message);
    return null;
  }
}

/**
 * Run Lighthouse accessibility audit on a page
 */
async function runLighthouseAudit(url) {
  let chrome;
  try {
    console.log(`  💡 Running Lighthouse audit on ${url}...`);

    chrome = await chromeLauncher.launch({ chromeFlags: ["--headless"] });

    const options = {
      ...config.lighthouseConfig,
      port: chrome.port,
    };

    const runnerResult = await lighthouse(url, options);

    return {
      url,
      score: runnerResult.lhr.categories.accessibility.score * 100,
      audits: runnerResult.lhr.audits,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error(`  ❌ Lighthouse audit failed for ${url}:`, error.message);
    return null;
  } finally {
    if (chrome) {
      await chrome.kill();
    }
  }
}

/**
 * Generate accessibility report HTML
 */
function generateReportHTML(axeResults, lighthouseResults) {
  const timestamp = new Date().toLocaleString();

  let violationsHTML = "";
  let passesHTML = "";

  // Generate violations section
  axeResults.forEach((result) => {
    if (result && result.violations.length > 0) {
      violationsHTML += `
        <div class="page-result">
          <h3>${result.url}</h3>
          <div class="violations">
            <h4>❌ Violations (${result.violations.length})</h4>
            ${result.violations
              .map(
                (v) => `
              <div class="violation">
                <strong>${v.id}</strong> - ${v.impact}
                <p>${v.description}</p>
                <ul>
                  ${v.nodes.map((n) => `<li>${n.html}</li>`).join("")}
                </ul>
              </div>
            `
              )
              .join("")}
          </div>
        </div>
      `;
    }
  });

  // Generate passes section
  axeResults.forEach((result) => {
    if (result && result.passes.length > 0) {
      passesHTML += `
        <div class="page-result">
          <h3>${result.url}</h3>
          <div class="passes">
            <h4>✅ Passed Checks (${result.passes.length})</h4>
            <ul>
              ${result.passes.map((p) => `<li>${p.id}</li>`).join("")}
            </ul>
          </div>
        </div>
      `;
    }
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SPAC Accessibility Audit Report</title>
  <style>
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .container {
      background: white;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    }
    h1 { color: #1976d2; border-bottom: 3px solid #1976d2; padding-bottom: 10px; }
    h2 { color: #1565c0; margin-top: 30px; }
    h3 { color: #666; }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin: 20px 0;
    }
    .summary-card {
      background: #f9f9f9;
      border-left: 4px solid #1976d2;
      padding: 15px;
      border-radius: 4px;
    }
    .summary-card strong { display: block; font-size: 24px; color: #1976d2; }
    .violation {
      background: #fff3cd;
      border-left: 4px solid #ff9800;
      padding: 15px;
      margin: 10px 0;
      border-radius: 4px;
    }
    .violation strong { color: #ff6f00; }
    .passes { background: #e8f5e9; padding: 15px; border-radius: 4px; }
    .passes ul { margin: 10px 0; }
    .page-result { margin: 20px 0; }
    .timestamp { color: #999; font-size: 12px; }
    code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>♿ SPAC Accessibility Audit Report</h1>
    <p class="timestamp">Generated: ${timestamp}</p>
    
    <h2>Summary</h2>
    <div class="summary">
      <div class="summary-card">
        <strong>${axeResults.reduce(
          (sum, r) => sum + (r?.violations?.length || 0),
          0
        )}</strong>
        Total Violations
      </div>
      <div class="summary-card">
        <strong>${axeResults.reduce(
          (sum, r) => sum + (r?.passes?.length || 0),
          0
        )}</strong>
        Passed Checks
      </div>
      <div class="summary-card">
        <strong>${axeResults.length}</strong>
        Pages Audited
      </div>
    </div>
    
    <h2>Violations</h2>
    ${violationsHTML || "<p>✅ No violations found!</p>"}
    
    <h2>Passed Checks</h2>
    ${passesHTML || "<p>No checks passed.</p>"}
    
    <h2>Lighthouse Scores</h2>
    <div class="summary">
      ${lighthouseResults
        .map((r) =>
          r
            ? `
        <div class="summary-card">
          <strong>${Math.round(r.score)}</strong>
          ${r.url}
        </div>
      `
            : ""
        )
        .join("")}
    </div>
  </div>
</body>
</html>`;
}

/**
 * Main audit function
 */
async function runAccessibilityAudit() {
  console.log("\n🚀 Starting Accessibility Audit...\n");

  // Ensure output directory exists
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const axeResults = [];
  const lighthouseResults = [];

  try {
    // Run audits on each page
    for (const pageConfig of config.pages) {
      const url = `${config.baseURL}${pageConfig.path}`;
      console.log(`\n📄 Auditing: ${pageConfig.name} (${url})`);

      // Run axe audit
      const page = await browser.newPage();
      await page.goto(url, { waitUntil: "networkidle" });
      const axeResult = await runAxeAudit(page, url);
      axeResults.push(axeResult);
      await page.close();

      // Run Lighthouse audit
      const lighthouseResult = await runLighthouseAudit(url);
      lighthouseResults.push(lighthouseResult);
    }

    // Generate report
    console.log("\n📝 Generating accessibility report...");
    const reportHTML = generateReportHTML(axeResults, lighthouseResults);

    const reportPath = path.join(config.outputDir, "index.html");
    fs.writeFileSync(reportPath, reportHTML, "utf8");

    // Save raw results as JSON
    const resultsPath = path.join(config.outputDir, "results.json");
    fs.writeFileSync(
      resultsPath,
      JSON.stringify(
        {
          axe: axeResults,
          lighthouse: lighthouseResults,
          timestamp: new Date().toISOString(),
        },
        null,
        2
      ),
      "utf8"
    );

    console.log(`\n✅ Accessibility audit complete!`);
    console.log(`📊 Report: ${reportPath}`);
    console.log(`📋 Results: ${resultsPath}`);

    // Generate documentation
    console.log("\n📝 Generating accessibility documentation...");
    await generateDocumentation();
  } catch (error) {
    console.error("❌ Audit failed:", error.message);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

/**
 * Generate accessibility documentation
 */
function generateDocumentation() {
  return new Promise((resolve, reject) => {
    const docScript = path.join(
      process.cwd(),
      "scripts",
      "generateAccessibilityDocs.js"
    );
    const child = spawn("node", [docScript], { stdio: "inherit" });

    child.on("close", (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Documentation generation failed with code ${code}`));
      }
    });

    child.on("error", (error) => {
      reject(error);
    });
  });
}

// Run the audit
runAccessibilityAudit();
