# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
