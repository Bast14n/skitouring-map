# Ski Touring Map – Tatra Mountains (V1)

Working title. A free web map of ski touring routes in the Polish and Slovak Tatras, modelled on mapa-turystyczna.pl but focused on winter and ski touring.

Status: specification only. Nothing is built yet.

---

## 1. Goal

Give ski tourers one clear winter map of the Tatras that shows:

- where the allowed ski touring routes run,
- how steep the terrain around them is,
- where the user is right now.

V1 is deliberately small: a map, a set of predefined routes, one overlay. Everything else comes later.

## 2. V1 MVP scope

### In scope

| #   | Feature                       | Notes                                                                                    |
| --- | ----------------------------- | ---------------------------------------------------------------------------------------- |
| 1   | Web app in React              | Desktop and mobile browsers, responsive                                                  |
| 2   | Winter base map               | Polish and Slovak Tatras, winter styling                                                 |
| 3   | Predefined ski touring routes | Hardcoded in the repo, only routes allowed by the parks, **name only**                   |
| 4   | Slope steepness overlay       | Can be switched on and off, with a legend                                                |
| 5   | User position                 | "Locate me" button, browser geolocation                                                  |
| 6   | Info links                    | TPN information; suggested additions: TOPR avalanche bulletin and the Slovak equivalents |
| 7   | Fixed safety notice           | "Check current park rules and avalanche danger before you go"                            |
| 8   | English interface             | Single language                                                                          |
| 9   | Free hosting                  | Static site on GitHub Pages, no accounts, no backend                                     |

### Out of scope for V1 (planned later)

- Route planner (point to point, times)
- Route details: difficulty, ascent and descent, distance, time, description, photos
- Park rules per section: direction, ascent-only stretches, seasonal closures
- Admin panel for adding and editing trails
- User accounts, favourites, track recording, GPX export
- Offline maps and a mobile app
- Polish language version
- 3D terrain view, slope aspect layer, avalanche terrain layer

### Route data for V1

- Source: OpenStreetMap (ski touring ways, tag `piste:type=skitour`), checked against the official TPN and TANAP maps so that only allowed routes are included.
- Storage: one GeoJSON file in the repository. Routes can be added after the map shell exists.
- Shape of one route:

```json
{
  "type": "Feature",
  "properties": {
    "id": "kasprowy-goryczkowa",
    "name": "Kuźnice – Kasprowy Wierch (Dolina Goryczkowa)"
  },
  "geometry": {
    "type": "LineString",
    "coordinates": [
      [19.98, 49.27],
      [19.98, 49.23]
    ]
  }
}
```

The example above is a placeholder, not real route geometry.

All route access goes through one small data module, so replacing the file with a database later does not touch the rest of the app.

## 3. Stack

| Layer                 | Choice                                         | Why                                                     |
| --------------------- | ---------------------------------------------- | ------------------------------------------------------- |
| Language              | TypeScript                                     | Typed route data, safer refactoring later               |
| UI                    | React                                          | Requested                                               |
| Build                 | Vite                                           | Produces a plain static site                            |
| Map engine            | MapLibre GL JS                                 | Open source, vector maps, hillshade and terrain support |
| Routing between pages | React Router with hash routing                 | Works on static hosting without server rewrites         |
| Styling               | Plain CSS with CSS variables                   | The palette below maps directly to variables            |
| Base map tiles        | OpenFreeMap (OpenStreetMap data)               | Free, no API key, no request limits                     |
| Base map style        | Custom winter style JSON in the repo           | Full control over colours                               |
| Elevation data        | Mapterhorn public terrain tiles                | Free, high resolution in Europe                         |
| Slope steepness       | Calculated in the browser from elevation tiles | No tiles of our own to generate or host                 |
| Routes                | GeoJSON file in the repo                       | Hardcoded for V1                                        |
| Position              | Browser Geolocation API                        | Works because Pages serves over HTTPS                   |
| Hosting               | GitHub Pages, deployed by GitHub Actions       | Free, limit of 1 GB per site (published artifact)       |
| Backend               | None                                           | Not needed until the admin panel                        |

Running cost: 0.

Risks to know about:

- OpenFreeMap and Mapterhorn are free public services offered without guarantees. If one changes, the provider can be swapped in the map style without changing the app.
- The slope overlay is only as accurate as the elevation data. It is a planning aid, not an avalanche assessment.

Later, when the admin panel arrives: a small backend with a database that understands geometry (for example Supabase with PostGIS) and an admin role.

## 4. Pages

Descriptions only. No layouts or components yet.

### 4.1 Map (home) – `/`

The main and default view. Almost all time in the app is spent here.

- Full-screen winter map, opened on the Tatras, limited to the Tatra area so users cannot scroll away to an empty map. The area reaches north as far as Myślenice.
- All predefined routes drawn on the map. Selecting one highlights it and shows its name.
- Controls: zoom in and out, "locate me", slope steepness on and off.
- Legend for the slope steepness colours, shown only when the overlay is on.
- Fixed safety notice with a link to the Safety page.
- Map position stored in the address, so a view can be shared as a link.
- Data attribution in the corner.

### 4.2 Route list – panel on the map

A list of all route names, sorted alphabetically.

- Desktop: side panel on the left. Mobile: sheet that slides up from the bottom.
- Choosing a route closes the list on mobile, moves the map to the route and highlights it.
- Simple text filter by name.

### 4.3 Route detail – `/routes/:id`

In V1 this is a small card on top of the map, not a separate screen.

- Shows the route name and a "show on map" action.
- Has its own address, so a single route can be shared.
- Reserved space for the fields that come later (difficulty, ascent, time, direction, closures).

### 4.4 Safety and rules – `/info`

A short static page.

- Links: TPN ski touring rules, TOPR avalanche bulletin, TANAP rules, Slovak avalanche service.
- A plain statement that the app does not show closures or current conditions.
- Disclaimer: the map is for information only and does not guarantee that a route is open or safe.
- Emergency numbers for both countries.

### 4.5 About – `/about`

- What the project is and who makes it.
- Data sources and required attribution: © OpenStreetMap contributors, OpenFreeMap, Mapterhorn.
- Contact for reporting a wrong or missing route.

### 4.6 Not found

A simple page with a link back to the map.

### Later

- Admin: sign-in, add a trail by uploading a GPX file, edit and remove trails.

## 5. Colours

### Principle

Cool colours for everything normal, warm colours only for warnings and steep terrain. Navy and blue carry the interface and the routes. Yellow, orange, red and purple appear only in the slope overlay and in warnings, so a warm colour on screen always means "pay attention".

### 5.1 Interface

Polar blue palette, as drawn on the design canvas. The CSS variables live in `src/styles/tokens.css`.

| Role                | Name        | Hex       | Used for                                                |
| ------------------- | ----------- | --------- | ------------------------------------------------------- |
| Primary             | Polar night | `#0B2545` | Header, main text, default route line                   |
| Accent              | Cobalt      | `#1660C4` | Buttons, links, active controls, focus outline          |
| Accent bright       | Sky ice     | `#38B6F5` | Selected route, active nav underline, logo mark         |
| Background          | Powder      | `#F5F8FC` | Page background                                         |
| Surface             | White       | `#FFFFFF` | Panels, cards, sheets                                   |
| Border              | Haze        | `#D6E0EE` | Dividers, panel borders                                 |
| Secondary text      | Slate       | `#4F5D73` | Captions, helper text                                   |
| Muted text on dark  | Mist        | `#B8C4D6` | Secondary text on Polar night (header, emergency cards) |
| Selected background | Ice tint    | `#DCEBFB` | Selected row in the route list                          |
| Warning text        | Amber dark  | `#8A4B08` | Safety notice text                                      |
| Warning background  | Amber light | `#FFF4D6` | Safety notice background                                |
| Warning border      | Amber edge  | `#F0DDA8` | Safety notice border                                    |

Fonts: Inter for text, Space Grotesk for headings (self-hosted via Fontsource).

Checked contrast ratios (4.5 or more passes for normal text):

| Combination               | Ratio |
| ------------------------- | ----- |
| Polar night on Powder     | 14.4  |
| White on Polar night      | 15.4  |
| White on Cobalt           | 6.0   |
| Cobalt on Powder          | 5.6   |
| Cobalt on White           | 6.0   |
| Slate on White            | 6.7   |
| Mist on Polar night       | 8.7   |
| Polar night on Ice tint   | 12.7  |
| Amber dark on Amber light | 6.2   |

### 5.2 Winter base map

| Element               | Hex               | Notes                                     |
| --------------------- | ----------------- | ----------------------------------------- |
| Snow and open ground  | `#F4F8FB`         | Slightly cooler than the page background  |
| Forest                | `#C9D8CC`         | Muted grey-green, stays in the background |
| Lakes and streams     | `#A9D3F0`         |                                           |
| Rock and scree        | `#D5D8DC`         |                                           |
| Contour lines         | `#9FB3C8`         | Every fifth line darker: `#7B8FA6`        |
| Hillshade             | Blue-grey shadows | Soft, so the slope overlay stays readable |
| Summer hiking trails  | `#8A94A0`         | Thin dashed lines, for orientation only   |
| Place and peak labels | `#0B2545`         | With a white halo                         |

### 5.3 Routes and position

| Element           | Style                                                                                                              |
| ----------------- | ------------------------------------------------------------------------------------------------------------------ |
| Ski touring route | Polar night `#0B2545` line with a white outline. The white outline keeps it readable on top of every slope colour. |
| Selected route    | Sky ice `#38B6F5` line, thicker, with a Polar night outline                                                        |
| User position     | Blue dot `#1A73E8` with a white ring and a soft halo                                                               |

Blue is not used anywhere in the slope overlay, so a selected route never blends into steep terrain.

### 5.4 Slope steepness overlay

Shown at about 50% opacity over the base map. Terrain under 30° stays uncoloured.

| Steepness | Colour | Hex       |
| --------- | ------ | --------- |
| 30–35°    | Yellow | `#F9E04C` |
| 35–40°    | Orange | `#F39C12` |
| 40–45°    | Red    | `#E03C31` |
| over 45°  | Purple | `#8E3B9E` |

These classes follow the convention common on avalanche terrain maps, so the overlay reads the same way as maps ski tourers already know.

Dark mode is not part of V1.

## 6. Open points

1. Project name and address.
2. The list of routes for V1, and the source for the Slovak side.
3. Final wording of the disclaimer.
4. Whether to add the TOPR and Slovak avalanche links next to the TPN link.
