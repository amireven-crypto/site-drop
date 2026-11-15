# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Inferred from the site and the owner's brief (no question tool was available in this session): small-business owners who need a website that works on a phone and a computer. They arrive to see real sites, understand what PIXELPOP builds, and start a project.

## Product Purpose

PIXELPOP designs and builds modern, mobile-friendly websites for businesses: new sites, redesigns, and online stores, with booking, maps, and tap-to-call where the work calls for them. Success is a visitor who can open the live demos, understand the offer, and contact PIXELPOP.

## Positioning

The work is shown live, on the visitor's own phone and computer, before anything is asked to go public. A preview link is the proof, not a mockup gallery.

## Operating Context

A single marketing site on GitHub Pages, project site `https://amireven-crypto.github.io/site-drop/`, published from the `main` branch (legacy Pages, source `/`). Visitors read on desktop, tablet, and phone. Contact is email (`pixelpopsite@gmail.com`); phone/WhatsApp and Instagram are still placeholders in the content.

## Capabilities and Constraints

- Confirmed pages and anchors: home, work, services, process, contact. Live demo links: The Barber Crew, FreshDrop Shop, IKG Wien, plus the original barber and IKG sites.
- Keep existing copy, links, legal notes on demos, and the unfinished contact placeholders. Do not invent customers, testimonials, benchmarks, or prices. PIXELPOP publishes no rate card; scope is quoted after a preview.
- Do not merge this work to `main`. `main` is the live site.
- GitHub Pages builds are static files (`.nojekyll` present). A Pages run on 11 Nov 2026 failed at startup on commit `865a48f` ("Retrigger Pages"), not because of page content. Commit `27e7039` is an ancestor of current `main` (`f662880`). The live site's last deployment is `f662880` and matches `main`.
- Content-Security-Policy stays same-origin: no remote scripts, fonts, or connections.
- Visual constraint the owner made binding: rebuild the experience on the public Relay layer's structure and motion, in original code, without GetLayers' paid prompt or source. A later instruction forbids Relay's black/lime palette. Color tokens come from the existing PIXELPOP stylesheet.

## Brand Commitments

- Name: PIXELPOP. Title: "PIXELPOP | Websites for businesses".
- Voice: plain, specific, no hype. Demos are labeled as concepts or as a demo store when that is what they are.
- Assets to keep: wordmark SVGs, favicons, apple touch icon, Open Graph image, work screenshots, candy motif in the existing mark.
- Palette commitment (owner, this rebuild): the colors already in `assets/css/style.css` (neutrals, blue, mint, orange, violet, pink, and the light/dark text tokens). Relay's lime is not a PIXELPOP color.
- Structure and motion commitment (owner): Relay's public mechanisms — loader ring into the logo, one light stream the length of the page, tilting glass hero with a live flow, logo plate that opens and folds back, focus-settle section reveals, draggable meter — rebuilt for PIXELPOP content and the PIXELPOP palette.

## Evidence on Hand

- `index.html`, `assets/css/style.css`, `assets/js/main.js`, `assets/work/*`, `assets/brand/*`.
- Public Relay study material only: the layer page at `https://www.getlayers.ai/layer/relay` and its public preview videos (`relay-4ee0729d77-desktop.mp4`, `-mobile.mp4`, `-preview.mp4`) and poster. No paid prompt or template source was fetched.

## Product Principles

- Show the real site, then explain it.
- Say only what the business already says. Quotes and prices are not invented to fill a layout.
- A preview comes before a public launch.
- The page has to work with motion reduced, on a phone, and without a subscription to anyone else's template.

## Accessibility & Inclusion

The current site already aims at readable contrast, a skip link, keyboard menus, and `prefers-reduced-motion`. The IKG Wien demo is described as multilingual and senior-friendly; that claim belongs to the demo, not a new PIXELPOP certification. This rebuild keeps those behaviors.
