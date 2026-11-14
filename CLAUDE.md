# CLAUDE.md

Ski touring map of the Tatra Mountains: a static web app showing allowed ski touring routes and a slope steepness overlay. No backend.

## Key documents

- `docs/ski-touring-tatry-v1.md` – the V1 spec (scope, pages, stack, colours). Source of truth for behaviour.
- `docs/dev-plan.md` – ordered task list (`### - [ ] T05 Title`). Each task has "Needs" and a "Done when" check. Tick a task only after its work is done.
- Design canvas: https://claude.ai/code/artifact/4d8f6813-d337-45be-a5d7-028f29909b3d (boards: Map desktop/mobile, Safety and rules, colour options). The chosen palette is **Option B – Polar blue**; when the spec and canvas disagree on visuals, the canvas wins and the spec gets updated.
- `/next-task [T##]` skill (`.claude/skills/next-task`) picks the next unblocked task and drafts a plan for it.

## Commands

- `npm run dev` – Vite dev server
- `npm run build` – type-check (`tsc -b`) and build to `dist/`
- `npm run lint` – ESLint
- `npm run format` / `npm run format:check` – Prettier (default config)

## Stack and conventions

- TypeScript, React 19, Vite. Planned: MapLibre GL JS, React Router with **hash routing** (static hosting, no rewrites).
- Plain CSS with variables, no CSS framework. Design tokens live in `src/styles/tokens.css`; base element styles and shared `.button` / `.button--secondary` classes in `src/styles/base.css`. Use the variables, never hard-coded hex values.
- Fonts are self-hosted via Fontsource (`@fontsource-variable/inter` for text, `@fontsource-variable/space-grotesk` for headings), imported in `src/main.tsx`. Do not add Google Fonts links.
- Colour rule: cool colours for normal UI; warm colours (yellow, orange, red, purple, amber) only for warnings and the slope overlay.
- Accessibility: touch targets at least 44px (`--tap-min`), text contrast at least 4.5:1, visible `:focus-visible` outline.
- Vite `base` is `"./"` so assets load from the GitHub Pages sub-path.
- Light mode only in V1.

## Deployment

GitHub Pages via `.github/workflows/deploy.yml`: lint and build on every push, deploy only from the default branch.
