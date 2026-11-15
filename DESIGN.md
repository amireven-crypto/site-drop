# PIXELPOP design system

The public Relay layer supplies the mechanisms: a counting ring that folds into the logo, one light stream the length of the page, a tilting glass window with a live flow, a plate that opens out of the logo and folds back, sections that arrive blurred and settle, and a meter you drag. The color is the existing PIXELPOP palette. Relay’s lime is not used.

## Color

Raw tokens live in `assets/css/tokens.css`.

| Token | Hex | Role |
|---|---|---|
| `--black` | `#050507` | Dark ground |
| `--ink` | `#1d1d1f` | Text on light |
| `--gray` | `#6e6e73` | Neutral |
| `--pale` | `#f5f5f7` | Light ground |
| `--white` | `#ffffff` | |
| `--blue` | `#2B7BFF` | Stream, rings, large accent |
| `--blue-link` | `#1A6AE8` | Primary buttons (white text clears AA) |
| `--blue-text` | `#1559C7` | Small text and links on light |
| `--mint` | `#20E0C0` | Status, stream |
| `--mint-text` | `#06705F` | Small mint text on light |
| `--orange` | `#FF8A1F` | Stream, tags |
| `--orange-text` | `#9A4400` | Small orange text on light |
| `--violet` | `#BF5AF2` | Stream |
| `--pink` | `#FF2D8A` | Plate, stress, stream |
| `--pink-deep` / `--pink-text` | `#C81066` | Italic stress on light |
| `--graphite` | `#272729` | |

Dark scheme (`prefers-color-scheme: dark`) lifts small candy text: pink `#FF7AB8`, blue `#8DB9FF`, mint `#4FEBD2`, orange `#FFB066`, foreground `#F4F2FA`, muted `#CFCBDB`.

The plate is always `#FF2D8A` with `#050507` text. Primary buttons stay `#1A6AE8`.

## Type

- Geist, self-hosted variable Latin, for UI and display. Tracking floor −0.035em on display, −0.011em on body.
- Instrument Serif italic, self-hosted, for the one stressed phrase in a headline. On light it uses `--pink-text`. On the pink plate it is black.
- Scale: `--step-4` hero (max 4.75rem), `--step-3` sections, `--step-2` titles, `--step-1` lead (1.25rem), `--step-0` body (1.0625rem), `--step--1` meta.

Both faces are SIL Open Font License. Notices sit beside the files.

## Space, radius, grid

Space: 4, 8, 12, 16, 24, 32, 48, 72, 112. Content width 1120px. More space above a heading than under it.

Radius: 8, 14, 22, 32, plate 40, pills fully round, mark 10.

Breakpoints: phone under 700, tablet under 900 (one column, no tilt), nav links from 980, desktop split from 900.

## Glass and shadow

Panels use `--card`, a 1px edge, an inset top highlight, and an offset soft shadow (`--shadow`, `--shadow-soft`). Blur is 18px, 12px on phones, and off when `prefers-reduced-transparency` is set. The hero window is the one tilted glass surface.

## Motion

| Token | Value |
|---|---|
| `--dur-instant` | 120ms |
| `--dur-fast` | 220ms |
| `--dur-base` | 480ms |
| `--dur-settle` | 900ms |
| `--dur-loader` | 1200ms |
| `--dur-fold` | 720ms |
| `--ease-mechanism` | cubic-bezier(0.22, 1, 0.36, 1) |
| `--ease-fold` | cubic-bezier(0.65, 0, 0.35, 1) |

The ring counts 0–100, then the mark translates into the nav logo. The canvas stream is one ribbon in the candy colors; the bright knot follows scroll. Sections with `.settle` blur in once. The pink plate scales from the logo and folds back as it leaves the viewport. `prefers-reduced-motion` skips the loader, the tilt, the plate travel, and the blur.

## Components

Nav, pill buttons (primary, ghost, dark), status pill, glass window, project rail, service list, work shots, pink plate, process board, scope meter (three stops, no prices), contact form that opens the visitor’s mail, footer. The showcase is `design-system.html`.

## What this system does not claim

PIXELPOP publishes no rate card, no testimonials, and no performance numbers. The meter changes scope (redesign, new website, online store). The three demos on the page are the real ones.
