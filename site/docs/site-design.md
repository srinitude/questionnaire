# questionnaire.dev Site Design

## Approved Direction

The site is a demo-first Astro documentation site for the Questionnaire Agent Skill. The homepage should feel like entering an active questionnaire run, not reading a marketing page. It uses the existing dark lacquer, petrol green, oxidized brass, and warm ivory UI language from `assets/questionnaire-template.html` and `references/ui-design-system.yaml`.

## Product Decisions

- Build a real browser-only demo using the skill's `state.json` schema and UI behavior.
- Keep filesystem writes explicitly agent-managed. The browser can draft, import, validate, and export, but it cannot write project files.
- Optimize for trust in the artifact model before installation.
- Seed the demo with an adoption/self-setup script.
- Support full local drafts with local edits, validation, `localStorage` autosave, reset, JSON import/export, and transcript export.
- Use an immersive homepage/demo template and quieter token-faithful docs pages.
- Keep the Astro app isolated under `site/`; Railway should build from `site/`.
- Keep Railway deployment details out of visitor-facing skill docs.

## Public Docs Inventory

- Get started
- Artifact model
- State schema
- Question types
- Agent workflow
- Browser demo boundaries
- Validation
- Security/privacy
- Contributing

## Critical Journeys

1. First-time visitor lands on the homepage, answers a seeded adoption question, sees the artifact trail change, and understands the browser/filesystem boundary.
2. Visitor imports a valid `state.json`, sees validation feedback, continues editing locally, and exports JSON.
3. Visitor exports a transcript and understands which files the agent writes during real skill usage.
4. Visitor moves from the demo into concise docs without losing the visual connection to the run UI.
5. Visitor checks privacy/security behavior and sees that demo state stays local unless explicitly exported.

## Implementation Notes

Use Astro for static output and vanilla TypeScript for the demo. Keep schema and export behavior in testable library functions. The visual system should borrow the skill template's double-bezel panels, three-zone run layout, mobile tabs, brass action states, and material texture while avoiding a generic SaaS hero.
