/**
 * @fileoverview Vue Component Documentation Generator for the SPAC project.
 * Extracts JSDoc comments and component metadata from Vue files using vue-docgen-api
 * and generates comprehensive documentation that integrates with the existing JSDoc setup.
 *
 * @author ICJIA
 * @since 1.0.0
 */

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { parse } = require("vue-docgen-api");
const glob = require("glob");
const minimatch = require("minimatch");

/**
 * Configuration for Vue documentation generation.
 *
 * @type {Object}
 * @property {string[]} includePatterns - Glob patterns for Vue files to include
 * @property {string[]} excludePatterns - Glob patterns for Vue files to exclude
 * @property {string} outputDir - Directory to output generated documentation
 */
const config = {
  includePatterns: [
    "./src/components/**/*.vue",
    "./src/views/**/*.vue",
    "./src/layouts/**/*.vue",
  ],
  excludePatterns: [
    "./src/components/examples/**/*.vue",
    "./src/components/test/**/*.vue",
  ],
  outputDir: "./public/documentation/vue/",
};

/**
 * Finds all Vue files matching the include patterns while excluding specified patterns.
 *
 * @async
 * @function
 * @returns {Promise<string[]>} Array of Vue file paths
 * @throws {Error} When glob pattern matching fails
 */
async function findVueFiles() {
  const allFiles = [];

  for (const pattern of config.includePatterns) {
    const files = glob.sync(pattern);
    allFiles.push(...files);
  }

  // Filter out excluded files
  const filteredFiles = allFiles.filter((file) => {
    return !config.excludePatterns.some((excludePattern) => {
      return minimatch(file, excludePattern);
    });
  });

  return [...new Set(filteredFiles)]; // Remove duplicates
}

/**
 * Parses a single Vue component file and extracts documentation metadata.
 *
 * @async
 * @function
 * @param {string} filePath - Path to the Vue component file
 * @returns {Promise<Object|null>} Component documentation object or null if parsing fails
 * @throws {Error} When file parsing encounters critical errors
 */
async function parseVueComponent(filePath) {
  try {
    console.log(`📄 Parsing ${filePath}...`);

    const componentDoc = await parse(filePath);

    // Add file path information
    componentDoc.filePath = filePath;
    componentDoc.fileName = path.basename(filePath);
    componentDoc.relativePath = path.relative(process.cwd(), filePath);

    return componentDoc;
  } catch (error) {
    console.warn(`⚠️  Warning: Could not parse ${filePath}: ${error.message}`);
    return null;
  }
}

/**
 * Generates HTML documentation for a single Vue component.
 *
 * @function
 * @param {Object} componentDoc - Component documentation object from vue-docgen-api
 * @returns {string} HTML documentation string
 */
function generateComponentHTML(componentDoc) {
  const {
    displayName,
    description,
    props,
    events,
    methods,
    slots,
  } = componentDoc;

  let html = `
    <div class="component-doc">
      <h2 id="${displayName || componentDoc.fileName}">${displayName ||
    componentDoc.fileName}</h2>
      <p class="file-path"><code>${componentDoc.relativePath}</code></p>
      
      ${description ? `<div class="description">${description}</div>` : ""}
      
      ${
        props && props.length > 0
          ? `
        <h3>Props</h3>
        <table class="props-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Default</th>
              <th>Required</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            ${props
              .map(
                (prop) => `
              <tr>
                <td><code>${prop.name}</code></td>
                <td><code>${prop.type ? prop.type.name : "any"}</code></td>
                <td><code>${
                  prop.defaultValue ? prop.defaultValue.value : "-"
                }</code></td>
                <td>${prop.required ? "Yes" : "No"}</td>
                <td>${prop.description || "-"}</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      `
          : ""
      }
      
      ${
        events && events.length > 0
          ? `
        <h3>Events</h3>
        <table class="events-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Properties</th>
            </tr>
          </thead>
          <tbody>
            ${events
              .map(
                (event) => `
              <tr>
                <td><code>${event.name}</code></td>
                <td>${event.description || "-"}</td>
                <td>${
                  event.properties
                    ? event.properties
                        .map((p) => `<code>${p.name}</code>`)
                        .join(", ")
                    : "-"
                }</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      `
          : ""
      }
      
      ${
        methods && methods.length > 0
          ? `
        <h3>Methods</h3>
        <div class="methods-list">
          ${methods
            .map(
              (method) => `
            <div class="method">
              <h4><code>${method.name}</code></h4>
              ${method.description ? `<p>${method.description}</p>` : ""}
              ${
                method.params && method.params.length > 0
                  ? `
                <h5>Parameters</h5>
                <ul>
                  ${method.params
                    .map(
                      (param) => `
                    <li><code>${param.name}</code> (${
                        param.type ? param.type.name : "any"
                      }) - ${param.description || ""}</li>
                  `
                    )
                    .join("")}
                </ul>
              `
                  : ""
              }
              ${
                method.returns
                  ? `
                <h5>Returns</h5>
                <p><code>${
                  method.returns.type ? method.returns.type.name : "any"
                }</code> - ${method.returns.description || ""}</p>
              `
                  : ""
              }
            </div>
          `
            )
            .join("")}
        </div>
      `
          : ""
      }
      
      ${
        slots && slots.length > 0
          ? `
        <h3>Slots</h3>
        <table class="slots-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Description</th>
              <th>Bindings</th>
            </tr>
          </thead>
          <tbody>
            ${slots
              .map(
                (slot) => `
              <tr>
                <td><code>${slot.name}</code></td>
                <td>${slot.description || "-"}</td>
                <td>${
                  slot.bindings
                    ? slot.bindings
                        .map((b) => `<code>${b.name}</code>`)
                        .join(", ")
                    : "-"
                }</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      `
          : ""
      }
    </div>
  `;

  return html;
}

/**
 * Generates the complete HTML template for Vue component documentation.
 *
 * @function
 * @param {string} content - HTML content for all components
 * @param {string} title - Page title
 * @returns {string} Complete HTML document
 */
function generateHTMLTemplate(content, title) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title} - Vue Components Documentation</title>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; margin: 0; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        h1, h2, h3, h4 { color: #6A1B9A; }
        .component-doc { margin-bottom: 3rem; padding-bottom: 2rem; border-bottom: 1px solid #eee; }
        .file-path { color: #666; font-size: 0.9em; margin-bottom: 1rem; }
        table { width: 100%; border-collapse: collapse; margin: 1rem 0; }
        th, td { padding: 0.75rem; text-align: left; border-bottom: 1px solid #ddd; }
        th { background-color: #f8f9fa; font-weight: 600; }
        code { background-color: #f1f3f4; padding: 0.2em 0.4em; border-radius: 3px; font-size: 0.9em; }
        .method { margin-bottom: 1.5rem; padding: 1rem; background-color: #f8f9fa; border-radius: 5px; }
        .description { margin: 1rem 0; }
        .nav { position: fixed; top: 20px; right: 20px; background: white; border: 1px solid #ddd; border-radius: 5px; padding: 1rem; max-width: 200px; }
        .nav ul { list-style: none; padding: 0; margin: 0; }
        .nav a { text-decoration: none; color: #6A1B9A; }
        .nav a:hover { text-decoration: underline; }
    </style>
</head>
<body>
    <div class="container">
        <h1>${title} - Vue Components</h1>
        <p>Auto-generated documentation for Vue components with JSDoc comments.</p>
        ${content}
    </div>
    <script>
        // Add dynamic copyright year
        document.addEventListener('DOMContentLoaded', function() {
            const yearElements = document.querySelectorAll('.current-year');
            yearElements.forEach(el => el.textContent = new Date().getFullYear());
        });
    </script>
</body>
</html>`;
}

/**
 * Main function to generate Vue component documentation.
 *
 * @async
 * @function
 * @throws {Error} When documentation generation fails
 */
async function createVueDocumentation() {
  try {
    console.log("📖 Creating Vue component documentation...");

    // Find all Vue files
    const vueFiles = await findVueFiles();
    console.log(`✅ Found ${vueFiles.length} Vue files`);

    // Parse all components
    const componentDocs = [];
    for (const filePath of vueFiles) {
      const doc = await parseVueComponent(filePath);
      if (doc) {
        componentDocs.push(doc);
      }
    }

    console.log(`✅ Successfully parsed ${componentDocs.length} components`);

    // Generate HTML for all components
    const htmlContent = componentDocs
      .map((doc) => generateComponentHTML(doc))
      .join("\n");

    // Get project name
    const packageJsonPath = path.join(process.cwd(), "package.json");
    let projectName = "SPAC Client";
    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      projectName = packageJson.name || "SPAC Client";
    }

    // Generate complete HTML
    const fullHTML = generateHTMLTemplate(htmlContent, projectName);

    // Ensure output directory exists
    if (!fs.existsSync(config.outputDir)) {
      fs.mkdirSync(config.outputDir, { recursive: true });
    }

    // Write documentation file
    const outputPath = path.join(config.outputDir, "index.html");
    fs.writeFileSync(outputPath, fullHTML, "utf8");

    console.log(`✅ Vue component documentation generated at ${outputPath}`);
  } catch (error) {
    console.error("❌ Error generating Vue documentation:", error);
    throw error;
  }
}

// Export for use in other scripts
module.exports = { createVueDocumentation };

// Run if called directly
if (require.main === module) {
  createVueDocumentation().catch(console.error);
}
