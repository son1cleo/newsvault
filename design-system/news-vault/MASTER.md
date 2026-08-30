# Design System Master File

> **LOGIC:** When building a specific page, first check `design-system/pages/[page-name].md`.
> If that file exists, its rules **override** this Master file.
> If not, strictly follow the rules below.

---

**Project:** News Vault
**Category:** News/Media Archive Platform
**Design Dials:** Variance 6/10 | Motion 5/10 (respect reduced-motion) | Density 4/10

> **Manual override note:** The ui-ux-pro-max `--design-system` search returned a
> "Minimalism & Swiss Style" pattern with a red/blue SaaS palette and rounded
> components (no vintage-newsprint entry exists in `colors.csv` — verified 0
> results on `"vintage newspaper aged paper sepia" --domain color`). That does
> not fit the brief (aged paper, broadsheet, no rounded-corner SaaS defaults),
> so the palette, component specs, and border-radius below are a **manual
> override**, not a database match. Typography, spacing tokens, motion/reduced-
> motion handling, and the a11y checklist ARE from verified `--domain typography`
> / priority-table matches and are kept as-is.

---

## Global Rules

### Color Palette — Aged Newsprint (manual, not a db match)

| Role | Hex | CSS Variable | Usage |
|------|-----|--------------|-------|
| Paper (background) | `#F2E9D8` | `--color-paper` | Page background |
| Paper Raised | `#F8F2E5` | `--color-paper-raised` | Cards, panels, editor surfaces |
| Paper Deep | `#E8DCC3` | `--color-paper-deep` | Recessed areas, hover fill |
| Ink (foreground) | `#1C1712` | `--color-ink` | Primary text — near-black, warm |
| Ink Muted | `#5C5244` | `--color-ink-muted` | Secondary text, captions, metadata |
| Ink Faint | `#8A7F6C` | `--color-ink-faint` | Disabled, placeholder |
| Rule | `#C7B896` | `--color-rule` | Hairline dividers |
| Rule Strong | `#8A7A5C` | `--color-rule-strong` | Masthead double-rules, table borders |
| Accent (oxblood) | `#7A1F1F` | `--color-accent` | Links, CTAs, category tags, "breaking" marks |
| Accent Hover | `#5C1616` | `--color-accent-hover` | Accent hover/active |
| On Accent | `#F8F2E5` | `--color-on-accent` | Text on accent fill |
| Destructive | `#7A1F1F` | `--color-destructive` | Delete actions (admin) — same oxblood, not a separate red |
| Focus Ring | `#1C1712` | `--color-ring` | 2px solid, 2px offset, visible on paper |

Contrast verified: ink `#1C1712` on paper `#F2E9D8` ≈ 15:1. Accent `#7A1F1F` on paper ≈ 7.5:1. On-accent `#F8F2E5` on accent ≈ 8:1. All exceed WCAG 4.5:1.

**Dark mode:** not in scope — a newsprint archive stays on cream paper in both OS themes. If ever added, invert to a deep ink background (`#15120E`) with warm paper-tone text (`#E8DCC3`), keep the same oxblood accent (lighten slightly to `#B5453A` for contrast on dark).

### Typography

- **Display/Headline Font:** Playfair Display (400–900, black used for the masthead wordmark) — per the brand logo spec (`pictures/News Vault logo design.pdf`), superseding the earlier Libre Bodoni pick. High-contrast Didone serif, masthead character, used for H1/H2/article headlines and the boxed "NEWS VAULT" wordmark mark (`src/components/masthead-mark.tsx`) with corner tick-mark rules echoing print masthead borders. Favicon (`src/app/icon.svg`) is an "NV" mark in a bordered square with an underline rule, per the same spec.
- **Body/UI Font:** Public Sans (300/400/500/600/700) — clean sans for body copy, nav, forms, buttons
- **Meta/Label Font:** JetBrains Mono (400/500) — uppercase, tracked-out, for bylines, datelines, category tags, admin metadata (the "print tag" detail)
- **Mood:** magazine, editorial, publishing, journalism, print

**Google Fonts:**
```css
@import url('https://fonts.googleapis.com/css2?family=Libre+Bodoni:wght@400;500;600;700&family=Public+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
```

**Tailwind:**
```js
fontFamily: {
  display: ['"Libre Bodoni"', 'Georgia', 'serif'],
  sans: ['"Public Sans"', 'system-ui', 'sans-serif'],
  mono: ['"JetBrains Mono"', 'monospace'],
}
```

**Type scale (rough guide):**
- Masthead wordmark: 3.5–5rem, Bodoni 700, tight tracking
- Article H1: 2.5–3.25rem, Bodoni 600/700
- Section H2: 1.75–2.25rem, Bodoni 600
- Card headline: 1.125–1.5rem, Bodoni 500/600
- Body: 1rem–1.125rem, Public Sans 400, line-height 1.6–1.7
- Byline/date/tag: 0.75rem, JetBrains Mono 500, uppercase, tracking-widest

### Spacing Variables

*Density: 4/10 — Standard*

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | `4px` | Tight gaps |
| `--space-sm` | `8px` | Icon gaps, inline spacing |
| `--space-md` | `16px` | Standard padding |
| `--space-lg` | `24px` | Section padding |
| `--space-xl` | `32px` | Large gaps |
| `--space-2xl` | `48px` | Section margins |
| `--space-3xl` | `64px` | Hero/masthead padding |

### Depth — rules, not shadows

Broadsheets don't float on shadows; they're separated by ruled lines and paper-tone shifts.

| Token | Value | Usage |
|-------|-------|-------|
| `--border-radius` | `0px` everywhere | No rounded corners, ever (except maybe a native `<input type=checkbox>`) |
| `--rule-hairline` | `1px solid var(--color-rule)` | Card/list dividers |
| `--rule-strong` | `2px solid var(--color-rule-strong)` | Masthead top/bottom rule, section breaks |
| `--rule-double` | `3px double var(--color-ink)` | Masthead signature rule (print-style double rule) |
| `--shadow-sm` (sparingly) | `0 1px 3px rgba(28,23,18,0.08)` | Only for modals/dropdowns that must sit above content, never on cards |

---

## Component Specs

### Buttons

```css
.btn-primary {
  background: var(--color-accent);
  color: var(--color-on-accent);
  border: 1px solid var(--color-accent);
  border-radius: 0;
  padding: 12px 24px;
  font-family: var(--font-sans);
  font-weight: 600;
  letter-spacing: 0.02em;
  transition: background-color 200ms ease, transform 150ms ease;
  cursor: pointer;
}
.btn-primary:hover { background: var(--color-accent-hover); }
.btn-primary:active { transform: translateY(1px); }
.btn-primary:focus-visible { outline: 2px solid var(--color-ink); outline-offset: 2px; }

.btn-secondary {
  background: transparent;
  color: var(--color-ink);
  border: 1px solid var(--color-ink);
  border-radius: 0;
  padding: 12px 24px;
  font-weight: 600;
  transition: background-color 200ms ease;
  cursor: pointer;
}
.btn-secondary:hover { background: var(--color-paper-deep); }
```

### Cards (article teasers, index rows)

```css
.card {
  background: var(--color-paper-raised);
  border: none;
  border-bottom: 1px solid var(--color-rule);
  border-radius: 0;
  padding: 24px 0;
  transition: background-color 150ms ease;
}
.card:hover { background: var(--color-paper-deep); }
```
No box-shadow, no lift-on-hover transform, no rounded corners — flat print-column rows separated by hairline rules.

### Inputs (admin forms)

```css
.input {
  background: var(--color-paper);
  border: 1px solid var(--color-rule-strong);
  border-radius: 0;
  padding: 10px 12px;
  font-family: var(--font-sans);
  font-size: 16px;
  color: var(--color-ink);
  transition: border-color 150ms ease;
}
.input:focus {
  border-color: var(--color-ink);
  outline: 2px solid var(--color-ink);
  outline-offset: 1px;
}
```

### Modals (admin only — public site has none)

```css
.modal-overlay { background: rgba(28,23,18,0.55); }
.modal {
  background: var(--color-paper-raised);
  border: 2px solid var(--color-ink);
  border-radius: 0;
  padding: 32px;
  box-shadow: var(--shadow-sm);
  max-width: 480px;
  width: 90%;
}
```

---

## Style Guidelines

**Style:** Old-school newsprint / broadsheet editorial (manual direction — see override note above)

**Keywords:** aged paper, high-contrast ink, ruled dividers, masthead hierarchy, print texture, restrained color (one accent only), zero border-radius

**Explicitly avoid:** rounded corners, drop shadows as primary depth cue, SaaS card-grid-with-shadow patterns, multiple bright accent colors, sans-serif headlines

### Page Patterns

**Landing (`/`):** Full-viewport animated intro, no article content, no nav chrome competing with the moment. Single scroll-driven reveal sequence ending in one dominant CTA ("Check the Vault"). Static fallback (no motion, final state shown immediately) under `prefers-reduced-motion: reduce`.

**Vault index / year / month / category (`/vault*`):** Dense editorial list — masthead header with rule, filter/section strip, then a ruled list of article rows (date, category tag, headline, excerpt), cursor-paginated. This is the "dashboard-like" density page but stays flat/ruled, never card-shadow SaaS.

**Article (`/article/[slug]`):** Single-column reading measure (~65–75ch), Bodoni headline, byline/date in mono, pull-rule under headline, body in Public Sans at 1.125rem/1.7.

**Admin (`/admin/*`):** Same ink/paper palette but denser (utility, not marketing) — table-style article list, TipTap editor panel bordered not shadowed, plain form inputs per spec above.

---

## Motion

**Landing scroll reveal (Motion + Lenis):**
- Lenis for smooth-scroll only; keep native scroll-snap feel subtle, not a hijacked wheel.
- Motion (Framer Motion) `useScroll` + `useTransform` to drive opacity/y/scale of masthead elements as the user scrolls through the intro sequence, ending pinned/settled on the "Check the Vault" CTA.
- Duration/easing: treat as a single continuous scroll-linked timeline rather than discrete `duration`-based tweens; keep per-element travel short (16–48px translate, not full-viewport parallax) so it reads intentional, not gimmicky.
- **Reduced motion:** wrap the whole sequence in a `prefers-reduced-motion` check — render the final, settled state immediately (headline + CTA visible, no scroll-linked transforms), per priority-table rule `reduced-motion` (CRITICAL, accessibility domain).

**List/card entry (vault index, verified match — Stagger List, Standard tier):**
```js
gsap.from('.article-row', {
  opacity: 0, y: 12, duration: 0.35,
  stagger: { each: 0.04, from: 'start' },
  ease: 'power2.out', // swapped from back.out(1.4) — overshoot reads sloppy on a dense editorial list, per the tool's own "don't use back.out on dense data tables" guidance
});
```
Skip entirely under `prefers-reduced-motion: reduce` (render final state).

---

## Anti-Patterns (Do NOT Use)

- Rounded corners / `border-radius` on cards, buttons, inputs, images
- Drop-shadow card lift as the default depth cue (use rules/paper-tone shifts instead)
- Multiple saturated accent colors — one oxblood accent only
- Sans-serif for article headlines (Bodoni/serif only for H1/H2/headline)
- `back.out` overshoot easing on dense list/table views
- Cluttered layout, slow loading
- Emojis as icons — use SVG icons (Heroicons/Lucide)
- Missing `cursor: pointer` on clickable elements
- Instant (0ms) state changes — always transition 150–300ms
- Invisible focus states — every interactive element needs a visible focus ring (`--color-ring`, 2px, offset)
- Motion that ignores `prefers-reduced-motion`

---

## Pre-Delivery Checklist

- [ ] No rounded corners anywhere (cards, buttons, inputs, images) — sharp broadsheet edges only
- [ ] No emojis used as icons (SVG only — Heroicons/Lucide)
- [ ] `cursor-pointer` on all clickable elements
- [ ] Hover/focus states with smooth transitions (150–300ms)
- [ ] Text contrast ≥ 4.5:1 (ink/paper/accent combinations verified above)
- [ ] Focus states visible for keyboard navigation
- [ ] `prefers-reduced-motion` respected on landing scroll sequence and list stagger
- [ ] Responsive: 375px, 768px, 1024px, 1440px — no horizontal scroll
- [ ] Landing page has zero article content, only the animated intro + CTA
- [ ] All public sorting/filtering visibly keys off `published_date`, never `created_at`
