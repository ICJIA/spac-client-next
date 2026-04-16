# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] - 2026-04-16

### Fixed
- **WCAG 1.4.4 Resize Text** — Siteimprove flagged "text clipped when resized"
  on home-page Search and Read links. Vuetify 2 pins `.v-btn`, `.v-chip`, and
  `.v-toolbar` to fixed pixel heights, so at 200% browser text-zoom the labels
  escaped their containers. Fix: switched these classes from `height` to
  `min-height` in `src/css/app.css` so boxes grow with content.
  This criterion is not automatable — axe-core and Lighthouse deliberately
  skip 1.4.4 because the outcome depends on viewport and zoom settings — so
  the 100/100 Lighthouse score did not catch it. Verified manually in-browser:

  | Element | Normal | 200% text zoom | Clipped? |
  |---|---|---|---|
  | Nav "ABOUT" button | 36px | 70px | No |
  | "READ MORE" meeting button | 36px | 139px | No |
  | "READ" publication chip | 24px | 26px | No |

### Verified (re-audit after 1.4.4 fix)

Lighthouse accessibility scores re-run on 2026-04-16 after the button/chip
height change:

| Page | Desktop | Mobile |
|---|---|---|
| `/` | **100 / 100** (0 issues) | **100 / 100** (0 issues) |
| `/publications` | **100 / 100** | — |
| `/meetings` | **100 / 100** | — |
| `/about/council-members` | **100 / 100** (0 issues) | — |
| `/search` | **100 / 100** (0 issues) | — |

axe-core WCAG AA re-run on the same commit:

| Page | Violations |
|---|---|
| `/` | **0** |
| `/about/council-members` | **0** |
| `/search` | **0** |
| `/publications` | 1 — `nested-interactive` on v-select (Vuetify 2 library, carried) |
| `/meetings` | 1 — `nested-interactive` on v-select (Vuetify 2 library, carried) |

Skip-link verified in DOM:
- First focusable element on every page (`document.querySelector(...) === skip`)
- Hidden off-screen at `left: -9999px` until focused, then `left: 0px`
- `href="#content-top"` → `<main id="content-top" tabindex="-1">`, so activation moves focus into the main landmark

## [0.2.0] - 2026-04-16

Accessibility pass to meet WCAG 2.1 AA ahead of the April 24, 2026 ADA Title II
compliance deadline. Home, publications, meetings, council-members, and search
pages now score 100/100 on Lighthouse accessibility (desktop + mobile).

### Added
- Skip-to-main-content link as the first focusable element, targeting `#content-top`.
- Global heading-order normalization in `services/Markdown.js` so CMS content
  that skips heading levels (e.g. `##` → `####`) no longer fails WCAG 1.3.1.
- `alt` text on biography headshots and decorative hero image.
- `aria-label` on mobile navigation hamburger button.
- `CHANGELOG.md` (this file).

### Changed
- Node version bumped from 16.20.2 to 22 in `.nvmrc` and `netlify.toml`.
- Netlify pinned to **npm** (`NETLIFY_USE_YARN = "false"`) and the
  `packageManager` / `resolutions` yarn fields removed from `package.json`
  (replaced with npm-native `overrides`). `sass-loader` declares
  `node-sass` as an optional peer dep; yarn 1.x installs it anyway and
  `node-sass@4.14.1` has no Node-22 binaries, which broke the first
  Node-22 deploy attempt. npm honors the optional peer flag and skips it.
- Splash overlay darkened from `rgba(79,80,79,0.6)` to `rgba(0,0,0,0.65)` and
  `<cite>` color from `#eee` to `#fff` to meet AA contrast on the hero quote.
- Vuetify empty-state "No data available" text darkened from `rgba(0,0,0,0.38)`
  to `rgba(0,0,0,0.76)` for AA contrast.
- `v-img` placeholder slots overridden with empty/`aria-hidden` nodes to
  suppress Vuetify's unlabeled progress-circular spinners.

### Fixed
- `aria-prohibited-attr` on the search field wrapper (removed redundant
  `aria-label` injection — Vuetify's `label` prop already provides the name).
- Heading-order violations surfaced by axe-core on home (meeting cards) and
  biography/meeting content rendered from CMS markdown.

### Known Limitations
- Vuetify 2 renders `v-select` / `v-autocomplete` with `div[role="button"]`
  wrapping an `<input>`, which axe-core flags as `nested-interactive`
  (WCAG 4.1.2 A). This is a framework-level issue that cannot be resolved
  without upgrading Vuetify and is being carried into the AEM migration.
- `v-data-table` cells can fail `td-has-header` under the same constraint.

## [0.1.0] - Previous

Previous work prior to the 0.2.0 accessibility pass:
- `feat: add meeting-level tags column to CSV output` (2600751)
- `feat: split CSV artifact URLs into agenda, minutes, and other columns` (810f0fc)
- `feat: add meeting data extraction script and documentation` (59d0c40)
- `feat: add JSDoc for .vue components` (e397d50)
- `docs: add GraphQL vs REST comparison and AEM overview to API guide` (aa853f9)
- `docs: add ICJIA GraphQL Playground URL across all documentation` (85602dc)
- `docs: update stale references and dates across all documentation` (b757fd5)
- `docs: add comprehensive JSDoc to extractMeetings.js` (54303c1)
- `fix: update docs with AEM migration strategies` (3994564)
- `fix: update docs with cache info and last updated date` (95fd368)
