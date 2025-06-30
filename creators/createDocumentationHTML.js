/**
 * @fileoverview Documentation HTML Generator for the SPAC project.
 * Converts project-documentation.md to professional HTML documentation with
 * dark/light theme support, syntax highlighting, and responsive design.
 *
 * @author ICJIA
 * @since 1.0.0
 */

require("dotenv").config();

const fs = require("fs");
const path = require("path");
const MarkdownIt = require("markdown-it");
const markdownItAttrs = require("markdown-it-attrs");
const markdownItAnchor = require("markdown-it-anchor");

// Initialize markdown parser with project configuration
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: false,
})
  .use(markdownItAnchor, {
    level: [1, 2, 3, 4, 5, 6],
    permalink: false,
  })
  .use(markdownItAttrs, {
    allowedAttributes: ["id", "class", "style", "target", "rel"],
  });

/**
 * Generates a complete HTML template with embedded CSS and JavaScript.
 * Creates a professional documentation page with dark/light theme support,
 * syntax highlighting, responsive design, and accessibility features.
 *
 * @function
 * @param {string} content - Rendered HTML content from markdown
 * @param {string} projectName - Name of the project for page title and meta tags
 * @returns {string} Complete HTML document as a string
 * @example
 * const html = generateHTMLTemplate('<h1>Documentation</h1>', 'My Project');
 */
function generateHTMLTemplate(content, projectName) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Comprehensive project documentation for ${projectName}">
    <meta name="robots" content="noindex, nofollow">
    <title>${projectName} - Project Documentation</title>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,400;0,700;0,900;1,100&family=Lato:ital,wght@0,100;0,300;0,400;0,700;0,900;1,100&family=Raleway:ital,wght@0,100;0,400;0,900;1,100&display=swap" rel="stylesheet">

    <!-- Syntax highlighting -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css">

    <style>
        /* CSS Variables for theme management */
        :root {
            --bg-primary: #f8f9fa;
            --bg-secondary: #ffffff;
            --text-primary: #333333;
            --text-secondary: #666666;
            --border-color: #e0e0e0;
            --accent-primary: #1976d2;
            --accent-secondary: #1565c0;
            --code-bg: #2d3748;
            --code-text: #e2e8f0;
            --shadow: rgba(0,0,0,0.1);
            --toggle-bg: #ccc;
            --toggle-thumb: #fff;
        }

        [data-theme="dark"] {
            --bg-primary: #1a1a1a;
            --bg-secondary: #2d2d2d;
            --text-primary: #e0e0e0;
            --text-secondary: #b0b0b0;
            --border-color: #404040;
            --accent-primary: #64b5f6;
            --accent-secondary: #42a5f5;
            --code-bg: #1e1e1e;
            --code-text: #f0f0f0;
            --shadow: rgba(0,0,0,0.3);
            --toggle-bg: #555;
            --toggle-thumb: #fff;
        }

        /* Base styles */
        * {
            box-sizing: border-box;
            transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }

        body {
            font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            line-height: 1.6;
            color: var(--text-primary);
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
            background-color: var(--bg-primary);
        }

        .documentation-container {
            background: var(--bg-secondary);
            border-radius: 8px;
            box-shadow: 0 2px 10px var(--shadow);
            padding: 40px;
            margin: 20px 0;
            position: relative;
        }

        /* Theme toggle button */
        .theme-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            background: var(--bg-secondary);
            border: 2px solid var(--border-color);
            border-radius: 25px;
            padding: 8px 16px;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            color: var(--text-primary);
            box-shadow: 0 2px 8px var(--shadow);
            transition: all 0.3s ease;
        }

        .theme-toggle:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px var(--shadow);
        }

        .theme-toggle:focus {
            outline: 2px solid var(--accent-primary);
            outline-offset: 2px;
        }

        .toggle-switch {
            position: relative;
            width: 40px;
            height: 20px;
            background: var(--toggle-bg);
            border-radius: 20px;
            transition: background-color 0.3s ease;
        }

        .toggle-thumb {
            position: absolute;
            top: 2px;
            left: 2px;
            width: 16px;
            height: 16px;
            background: var(--toggle-thumb);
            border-radius: 50%;
            transition: transform 0.3s ease;
        }

        [data-theme="dark"] .toggle-thumb {
            transform: translateX(20px);
        }

        /* Typography */
        h1, h2, h3, h4, h5, h6 {
            font-family: 'Lato', sans-serif;
            font-weight: 700;
            margin-top: 2em;
            margin-bottom: 1em;
            line-height: 1.2;
            color: var(--text-primary);
        }

        h1 {
            color: var(--accent-primary);
            border-bottom: 3px solid var(--accent-primary);
            padding-bottom: 10px;
            font-size: 2.5em;
            margin-top: 0;
        }

        h2 {
            color: var(--accent-secondary);
            border-bottom: 2px solid var(--border-color);
            padding-bottom: 8px;
            font-size: 2em;
        }

        h3 {
            color: var(--accent-secondary);
            font-size: 1.5em;
        }

        h4 {
            color: var(--text-primary);
            font-size: 1.25em;
        }

        /* Links */
        a {
            color: var(--accent-primary);
            text-decoration: none;
            transition: color 0.3s ease;
        }

        a:hover {
            text-decoration: underline;
            color: var(--accent-secondary);
        }

        /* Code blocks */
        code {
            background-color: var(--border-color);
            color: var(--text-primary);
            padding: 2px 6px;
            border-radius: 4px;
            font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, Courier, monospace;
            font-size: 0.9em;
        }

        pre {
            background-color: var(--code-bg);
            color: var(--code-text);
            padding: 20px;
            border-radius: 8px;
            overflow-x: auto;
            margin: 20px 0;
            border: 1px solid var(--border-color);
        }

        pre code {
            background: none;
            padding: 0;
            color: inherit;
        }

        /* Tables */
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            background: var(--bg-secondary);
        }

        th, td {
            border: 1px solid var(--border-color);
            padding: 12px;
            text-align: left;
        }

        th {
            background-color: var(--border-color);
            font-weight: 600;
            color: var(--text-primary);
        }

        /* Lists */
        ul, ol {
            padding-left: 30px;
        }

        li {
            margin-bottom: 8px;
            color: var(--text-primary);
        }

        /* Blockquotes */
        blockquote {
            border-left: 4px solid var(--accent-primary);
            margin: 20px 0;
            padding: 10px 20px;
            background-color: var(--border-color);
            font-style: italic;
            color: var(--text-secondary);
        }

        /* Horizontal rules */
        hr {
            border: none;
            height: 1px;
            background-color: var(--border-color);
            margin: 2em 0;
        }

        /* Responsive design */
        @media (max-width: 768px) {
            body { padding: 10px; }
            .documentation-container { padding: 20px; }
            h1 { font-size: 2em; }
            h2 { font-size: 1.5em; }
            .theme-toggle {
                top: 10px;
                right: 10px;
                padding: 6px 12px;
                font-size: 12px;
            }
        }

        /* Print styles */
        @media print {
            body {
                background: white !important;
                color: black !important;
            }
            .documentation-container {
                box-shadow: none !important;
                border: none !important;
                background: white !important;
            }
            .theme-toggle {
                display: none !important;
            }
            * {
                background: white !important;
                color: black !important;
            }
        }
    </style>
</head>
<body data-theme="dark">
    <!-- Theme toggle button -->
    <button class="theme-toggle" onclick="toggleTheme()" aria-label="Toggle dark/light mode" tabindex="0">
        <span class="toggle-switch">
            <span class="toggle-thumb"></span>
        </span>
        <span class="toggle-label">Dark</span>
    </button>

    <div class="documentation-container">
        ${content}
    </div>

    <!-- Syntax highlighting -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>

    <!-- Theme management and navigation functionality -->
    <script>
        // Theme management
        function initializeTheme() {
            // Check for saved theme preference or default to dark mode
            const savedTheme = localStorage.getItem('documentation-theme') || 'dark';
            const body = document.body;
            const toggleLabel = document.querySelector('.toggle-label');

            body.setAttribute('data-theme', savedTheme);
            toggleLabel.textContent = savedTheme === 'dark' ? 'Dark' : 'Light';
        }

        function toggleTheme() {
            const body = document.body;
            const toggleLabel = document.querySelector('.toggle-label');
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

            body.setAttribute('data-theme', newTheme);
            toggleLabel.textContent = newTheme === 'dark' ? 'Dark' : 'Light';

            // Save theme preference
            localStorage.setItem('documentation-theme', newTheme);
        }

        // Keyboard accessibility for theme toggle
        document.addEventListener('keydown', function(e) {
            if (e.target.classList.contains('theme-toggle') && (e.key === 'Enter' || e.key === ' ')) {
                e.preventDefault();
                toggleTheme();
            }
        });

        document.addEventListener('DOMContentLoaded', function() {
            // Initialize theme
            initializeTheme();

            // Generate IDs for all headings
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            headings.forEach(function(heading) {
                if (!heading.id) {
                    const text = heading.textContent || heading.innerText;
                    const id = text.toLowerCase()
                        .replace(/[^a-z0-9\\s-]/g, '')
                        .replace(/\\s+/g, '-')
                        .replace(/-+/g, '-')
                        .replace(/^-|-$/g, '');
                    heading.id = id;
                }
            });

            // Add smooth scrolling to anchor links
            const anchorLinks = document.querySelectorAll('a[href^="#"]');
            anchorLinks.forEach(function(link) {
                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    if (targetElement) {
                        targetElement.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
        });
    </script>
</body>
</html>`;
}

/**
 * Main function to create HTML documentation from markdown.
 * Reads project-documentation.md, converts it to HTML, and generates
 * a complete documentation website with professional styling.
 *
 * @async
 * @function
 * @throws {Error} When project-documentation.md file is not found
 * @throws {Error} When file operations fail
 * @example
 * // Run the documentation generator
 * await createDocumentationHTML();
 */
async function createDocumentationHTML() {
  try {
    console.log("📖 Creating documentation HTML...");

    // Read the project-documentation.md file
    const markdownPath = path.join(process.cwd(), "project-documentation.md");

    if (!fs.existsSync(markdownPath)) {
      throw new Error(`project-documentation.md not found at ${markdownPath}`);
    }

    const markdownContent = fs.readFileSync(markdownPath, "utf8");
    console.log("✅ Read project-documentation.md successfully");

    // Convert markdown to HTML
    const htmlContent = md.render(markdownContent);
    console.log("✅ Converted markdown to HTML");

    // Get project name from package.json
    const packageJsonPath = path.join(process.cwd(), "package.json");
    let projectName = "SPAC Client Website";

    if (fs.existsSync(packageJsonPath)) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
      projectName = packageJson.name || "SPAC Client Website";
    }

    // Generate complete HTML document
    const fullHTML = generateHTMLTemplate(htmlContent, projectName);

    // Ensure output directory exists
    const outputDir = path.join(
      process.cwd(),
      "public",
      "documentation",
      "dev"
    );
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Write HTML file
    const outputPath = path.join(outputDir, "index.html");
    fs.writeFileSync(outputPath, fullHTML, "utf8");

    // Get file size for reporting
    const stats = fs.statSync(outputPath);
    const fileSizeKB = Math.round(stats.size / 1024);

    console.log(`✅ Documentation HTML created successfully at: ${outputPath}`);
    console.log(`📄 File size: ${fileSizeKB} KB`);
  } catch (error) {
    console.error("❌ Error creating documentation HTML:", error.message);
    process.exit(1);
  }
}

// Run the script
createDocumentationHTML();
