# Ski Touring Map – development tasks (V1)

Small tasks for building V1, in the order they should be done. Based on `ski-touring-tatry-v1.md` (spec, Polar blue palette) and the design canvas: https://claude.ai/code/artifact/4d8f6813-d337-45be-a5d7-028f29909b3d

How to use this list:

- Each task is meant to fit in one sitting (roughly 1–3 hours) and end in a working, committable state.
- "Needs" lists the tasks that must be finished first.
- "Done when" is the check to run before closing the task.
- Tick the box when a task is merged.

Stack reminder: TypeScript, React, Vite, MapLibre GL JS, React Router (hash routing), plain CSS with variables, GitHub Pages. No backend.

---

## Phase 0 – Project setup

### - [x] T01 Scaffold the app

- Create a Vite project with the React + TypeScript template. Add ESLint and Prettier with default rules.
- Remove the template's demo content; leave one empty `App` component.
- Needs: nothing.
- Done when: `npm run dev` shows an empty page, `npm run build` and `npm run lint` pass.

### - [x] T02 Deploy to GitHub Pages

- Add `.github/workflows/deploy.yml` with two jobs: build (lint + `npm run build`, uploads `dist` as the Pages artifact) and deploy (`actions/deploy-pages`, only on the default branch). Pages source must be set to "GitHub Actions" in the repo settings.
- Set Vite `base` so assets load from the project's Pages sub-path.
- Needs: T01.
- Done when: a push to the default branch publishes the empty page at the Pages address and assets load without 404s.

### - [x] T03 Design tokens and fonts

- Create `src/styles/tokens.css` with the Polar blue palette from the design canvas as CSS variables (spec section 5.1), the warning amber pair, the four slope colours and the position blue.
- Load Inter (text) and Space Grotesk (headings). Add base styles: page background, text colour, focus outline, `box-sizing`.
- Needs: T01.
- Done when: a test page shows a heading, body text, a primary button and a secondary button that match the design canvas.

### - [x] T04 Routing and app shell

- Add React Router with hash routing and these routes: `/`, `/routes/:id`, `/info`, `/about`, and a catch-all.
- Build the header: logo mark, "Ski Touring Map", "Tatra Mountains", and the nav links Map, Safety and rules, About with the active underline. On narrow screens the nav collapses into a menu button.
- Needs: T03.
- Done when: all five addresses render a placeholder with the header, the active link is marked, and the header works at 390 px width.

---

## Phase 1 – Map

### - [x] T05 Map component

- Add MapLibre GL JS. Create a `MapView` component that fills the area under the header.
- Use an OpenFreeMap style as-is for now. Open on the Tatras, set `maxBounds` to the Tatra area plus a margin, and set sensible min and max zoom.
- Keep the required attribution visible in the corner.
- Needs: T04.
- Done when: the map loads on `/`, cannot be dragged away from the Tatras, and resizes with the window.

### - [x] T06 Custom zoom buttons

- Hide MapLibre's default controls. Add the styled zoom in and zoom out buttons from the design (44 px, top right).
- Needs: T05.
- Done when: both buttons zoom the map, are reachable by keyboard and have `aria-label`s.

### - [x] T07 Map position in the address

- Store centre and zoom in the address so a view can be shared. MapLibre's built-in `hash` option conflicts with hash routing, so keep the position as a query parameter inside the hash route (for example `#/?map=12.5/49.232/19.981`).
- Update it after the map stops moving (not on every frame) and read it on load.
- Needs: T05.
- Done when: copying the address into a new tab opens the same view, and the browser back button is not flooded with entries (use `replace`).

### - [ ] T08 Winter base style – colours

- Copy the OpenFreeMap style JSON into the repo as `src/map/winter-style.json`.
- Recolour it per spec section 5.2: snow ground, muted forest, water, rock and scree, labels in Polar night with a white halo. Hide layers that add noise (most POIs, landuse detail).
- Needs: T05.
- Done when: the map uses the local style and the colours match the base map in the design.

### - [ ] T09 Winter base style – summer trails

- Style hiking paths as thin dashed grey lines (`#8A94A0`), visible from a mid zoom level upwards.
- Needs: T08.
- Done when: trails are visible for orientation but clearly quieter than the ski touring routes will be.

### - [ ] T09a Peak labels

- The OpenFreeMap style has no peak layer. Add a symbol layer on the `mountain_peak` source layer: small Polar night triangle, peak name and elevation (for example "Kasprowy Wierch / 1987 m"), Polar night text with a white halo, as in the design.
- Needs: T08.
- Done when: the main Tatra peaks are labelled from a mid zoom level and labels do not crowd each other.

### - [ ] T10 Hillshade

- Add the Mapterhorn terrain tiles as a `raster-dem` source and a `hillshade` layer with soft blue-grey shadows.
- Check the Mapterhorn documentation for the current tile address, encoding and attribution before wiring it in.
- Needs: T08.
- Done when: ridges and valleys are readable on the map and labels stay legible on top.

### - [ ] T11 Contour lines

- Generate contour lines in the browser from the same elevation source (the `maplibre-contour` library does this). Style: `#9FB3C8`, every fifth line `#7B8FA6`.
- Needs: T10.
- Done when: contours appear from a mid zoom level, index lines are darker, and panning stays smooth on a phone.

---

## Phase 2 – Routes

### - [ ] T12 Route data module

- Add `src/data/routes.geojson` with 2–3 placeholder routes in the shape from the spec (`id`, `name`, `LineString`).
- Add `src/data/routes.ts` with types and the only access functions the app may use: `getRoutes()` and `getRouteById(id)`. Sort names with a locale-aware compare so Polish and Slovak letters order correctly.
- Needs: T01.
- Done when: unit tests cover both functions, including an unknown id.

### - [ ] T13 Draw routes on the map

- Add the routes as a GeoJSON source with two line layers: white outline underneath, Polar night line on top. Place them above hillshade and contours and below labels.
- Needs: T05, T12.
- Done when: placeholder routes are visible at every zoom level and readable over forest and rock.

### - [ ] T14 Select a route

- Clicking a route navigates to `/routes/:id`. The route in the address is highlighted: sky blue, thicker, with a Polar night outline. Clicking empty map returns to `/`.
- Widen the click target with an invisible wider line layer so routes are easy to hit on touch screens. Show a pointer cursor on hover.
- An unknown id shows the not-found view.
- Needs: T13, T04.
- Done when: opening `/routes/<id>` directly highlights that route, and selection survives a page reload.

### - [ ] T15 Route list panel (desktop)

- Build the left panel: "Routes" heading, route count, list of names A–Z with the small line marker, selected row highlighted.
- Choosing a name selects the route (same navigation as T14) and fits the map to the route's bounds.
- Needs: T14.
- Done when: list and map selection always agree, whichever one was used to select.

### - [ ] T16 Filter the list by name

- Add the "Filter by name" field. Match case-insensitively and ignore diacritics, so "kuznice" finds "Kuźnice". Show a short message when nothing matches.
- Needs: T15.
- Done when: unit tests cover the matching function and the list updates while typing.

### - [ ] T17 Route card (desktop)

- Build the card over the map: "Selected route" label, route name, "Show on map" (fits the map to the route), "Copy link" (copies the route address and confirms briefly), close button, and the line reserving space for later fields.
- Needs: T14.
- Done when: the copied link opens the same route in a new tab, and close returns to `/`.

### - [ ] T18 Mobile: selected-route card

- Below the mobile breakpoint, hide the side panel and show the bottom card from the mobile design: route name, "Show on map", "All routes", close.
- Needs: T17.
- Done when: at 390 px the card matches the design and does not cover the map controls.

### - [ ] T19 Mobile: route list sheet

- "All routes" opens a sheet that slides up from the bottom with the same list and filter as desktop (reuse the components from T15 and T16). Choosing a route closes the sheet, moves the map to the route and highlights it.
- The sheet closes with a close button and the Escape key, and focus returns to the button that opened it.
- This screen is not drawn on the canvas yet; follow the mobile card's styling.
- Needs: T18, T16.
- Done when: the full select flow works on a phone with one hand.

---

## Phase 3 – Slope overlay and position

### - [ ] T20 Slope calculation (pure function)

- Write `slopeDegrees(elevations, tileSize, metresPerPixel)` that returns the slope angle per pixel from an elevation grid, and `slopeClass(angle)` that maps it to none, 30–35, 35–40, 40–45 or over 45.
- Metres per pixel depends on zoom and latitude; add a helper for it.
- Needs: T01.
- Done when: unit tests pass for flat ground, a known constant slope (for example 45°) and the class boundaries.

### - [ ] T21 Slope tiles in the browser

- Register a custom MapLibre protocol (for example `slope://`) that fetches the matching elevation tile, decodes it, runs T20 and returns a coloured image tile using the four slope colours, transparent under 30°.
- Do the pixel work off the main thread if panning stutters.
- Tile edges will show thin seams because neighbours are not read; accept that for V1 and note it.
- Needs: T10, T20.
- Done when: a raster layer using the protocol renders at about 50% opacity under the routes, and known steep faces show as red or purple.

### - [ ] T22 Slope toggle button

- Add the slope button under the locate button: icon only, the "Slope steepness" label appears on hover and keyboard focus, filled cobalt when on. It shows and hides the layer from T21. Use `aria-pressed`.
- Remember the last state in `localStorage`.
- Needs: T21, T06.
- Done when: the toggle works with mouse, touch and keyboard, and the state survives a reload.

### - [ ] T23 Slope legend

- Show the legend only while the overlay is on. Desktop: the vertical card with four rows and "Under 30° is not coloured". Mobile: the compact horizontal strip.
- Needs: T22.
- Done when: both layouts match the design and the legend never overlaps the route card.

### - [x] T24 Locate me

- Add the locate button. On press, ask for the position with the browser Geolocation API, show the blue dot with a white ring (no accuracy circle, it hides the map), and centre the map on it.
- Also locate once automatically when the app opens, unless the address already holds a map position (a shared view wins). Failures of this automatic attempt stay silent.
- Handle the failure cases with a short message: permission denied, position unavailable, and position outside the map area (do not move the map then).
- Needs: T06.
- Done when: it works on a phone over HTTPS, and each failure case shows its message instead of failing silently.

---

## Phase 4 – Notice and static pages

### - [ ] T25 Safety notice on opening the page

- Build the notice window from the design: amber card, the fixed sentence, "This map does not show closures or current conditions.", link to Safety and rules, "I understand" button. Desktop: bottom centre of the map. Mobile: full width at the bottom.
- Decision needed before starting: show it once per browser (`localStorage`) or on every visit (`sessionStorage`). The design only says "on opening the page".
- Needs: T05, T03.
- Done when: the notice appears on first open, closes with the button, and follows the chosen rule on reload.

### - [ ] T26 Safety and rules page

- Build `/info` from the design: intro, amber statement, four link cards, two emergency number cards, disclaimer, "Back to the map".
- Needs before starting: the four real link addresses (TPN rules, TOPR bulletin, TANAP rules, Slovak avalanche service), confirmed emergency numbers, and the final disclaimer wording.
- Needs: T04.
- Done when: all links open the right official page in a new tab and the page reads well at 390 px.

### - [ ] T27 About page

- Build `/about`: what the project is and who makes it, data sources with the required attribution (© OpenStreetMap contributors, OpenFreeMap, Mapterhorn), and a contact for reporting a wrong or missing route.
- Not drawn on the canvas; reuse the Safety page layout.
- Needs: T04.
- Done when: attribution text and links are complete and correct.

### - [ ] T28 Not found page

- Build the catch-all page: a short message and a link back to the map. Use it for unknown addresses and unknown route ids.
- Needs: T04.
- Done when: a mistyped address and `/routes/does-not-exist` both show it.

---

## Phase 5 – Real data and release

### - [ ] T29 Extract route candidates from OpenStreetMap

- Write a small script (kept in `scripts/`, not shipped) that downloads ways tagged `piste:type=skitour` inside the Tatra bounding box through the Overpass API and writes them as GeoJSON with their names.
- Needs: T12.
- Done when: the script produces a candidates file that opens correctly in a GeoJSON viewer.

### - [ ] T30 Check and publish the Polish routes

- Compare each candidate on the Polish side with the official TPN ski touring map. Keep only allowed routes, join split ways into one line per route, and give each a stable `id` and a clear name.
- Needs: T29.
- Done when: `routes.geojson` holds the checked Polish routes and each one has been looked at on the map.

### - [ ] T31 Check and publish the Slovak routes

- Same as T30 for the Slovak side against the official TANAP source. The source for the Slovak side is still an open point in the spec; if OpenStreetMap coverage is too thin, record what is missing instead of guessing.
- Needs: T29.
- Done when: the Slovak routes are in `routes.geojson`, or the gap is written down in the About page and the spec.

### - [ ] T32 Accessibility and responsive pass

- Walk through every screen with keyboard only and at 390 px, 768 px and 1440 px. Fix focus order, missing labels, touch targets under 44 px and any text that fails the 4.5 contrast ratio.
- Needs: all tasks in phases 1–4.
- Done when: every control is reachable and named, and nothing scrolls sideways on a phone.

### - [ ] T33 Release check

- Write the README (run, build, deploy, how to add a route). Set page title, description and favicon. Check the built site size against the 1 GB Pages limit, check attribution on every page, and test on one iPhone and one Android phone.
- Needs: everything above.
- Done when: the checklist in the README is ticked and the Pages address is ready to share.

## Tooling – AI-assisted route entry

This is a development aid, not part of the shipped site, and not a release blocker.

### - [ ] T34 Claude skill for adding and converting routes

- Create a project skill in `.claude/skills/add-route/SKILL.md`, invoked as `/add-route <file>`, that takes a GeoJSON or KML export (CalTopo, mapy.cz export, Google Earth and similar), converts it to the `routes.geojson` schema (one `LineString` per route, stable kebab-case `id`, clear `name`), validates it (coordinates inside the Tatra bounding box, no duplicate ids, coordinate precision trimmed to 5 decimals) and appends it to `src/data/routes.geojson`. The skill must check the source's licence before converting: own recordings and openly licensed exports are fine, geometry traced from proprietary maps is refused, and required attribution is recorded.
- Needs: T12.
- Done when: running `/add-route` on one sample KML file and one sample GeoJSON file adds valid routes that draw correctly on the map.

---

## Decisions to make along the way

1. Project name and address (affects T02 and T33).
2. Notice rule: once per browser or on every visit (T25).
3. Link addresses, emergency numbers and disclaimer wording (T26).
4. Source for the Slovak routes (T31).

## Not in V1

Route planner, route details, per-section park rules, admin panel, accounts, offline maps, Polish language version, 3D view, aspect and avalanche terrain layers. See the spec for the full list.
