# MR Wedding Design System

## 1. Brand Intent
- Atmosphere: intimate, ceremonial, South-Indian wedding invitation on deep burgundy canvas.
- Signature material: olive-green invitation cards with linen cream typography and script-led hierarchy.
- Interaction signature: side-drawer navigation + 3D event stack transitions + subtle floating hero ornament motion.

## 2. Color Tokens
- `--bg-burgundy: #47181a`
- `--bg-burgundy-deep: rgba(40, 15, 18, 0.8)`
- `--olive: #5a6b35`
- `--olive-strong: #4d5d2d`
- `--linen: #f5ebe0`
- `--linen-soft: #faf5eb`
- `--gold-dark: #9a7b4f`
- `--ink: #2f2324`

## 3. Typography Tokens
- Body + caps labels: `Josefin Sans` (300–600), tracked uppercase for section labels.
- Serif body: `Cormorant Garamond` italic for invitation prose.
- Script: `Great Vibes` primary, `Pinyon Script` optional flourish.
- Formal caps headings: `Cinzel`.

## 4. Spacing + Layout
- Section containers: `max-w-3xl mx-auto px-6 py-14` and `max-w-5xl mx-auto px-6 py-10`.
- Radius scale: `12px / 16px / 20px / 999px`.
- Borders: 1px dashed for invitation/event/venue cards; 1px soft solid for shell cards.

## 5. Reusable Primitives
- SideDrawer Navigation: fixed olive round trigger, left slide panel, black/50 blurred overlay.
- Lattice Overlay: subtle repeating geometric SVG at ~12% opacity over burgundy surfaces.
- Kolam Divider: dot-and-curve SVG divider with dark red/brown stroke.
- Ceremony Card: olive background + dashed linen border + script + caps + serif mix.
- RSVP Event Card: linen card, script title, caps date, pill segmented attendance actions.
- 3D Event Stack: center card active, side cards receded/scaled/dimmed with arrow + dot navigation.

## 6. Motion Rules
- Use transform/opacity only.
- Drawer: x-translation + opacity.
- Hero scroll cue: vertical bounce.
- Event stack: spring translation/scale + flip/expand detail transition.

## 7. Accessibility Constraints
- Keep contrast strong between linen text and burgundy/olive backgrounds.
- Keep keyboard focus visible with linen/olive ring.
- Drawer trigger and close are keyboard and screen-reader labelled.

## 8. Accepted Debt
- Venue/family/hotel factual details intentionally placeholder until final details are provided.
