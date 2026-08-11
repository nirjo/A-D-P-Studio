# Aiel Studio Canvas

# AIEL DESIGN & PRINTING STUDIO — Lovable Build Prompt

Paste everything below into Lovable as your project prompt.

---

## PROJECT BRIEF

Build a premium, cinematic, WebGL-driven website for **Aiel Design & Printing Studio**, a custom apparel and merchandise design/printing brand. This is not a template store — it must feel like a high-end interactive digital experience, in the same production tier as award-winning WebGL studio sites (Awwwards/FWA Site-of-the-Day caliber), applied to a custom-print/streetwear brand identity. Every screen, scroll, and click should carry deliberate motion design — nothing should default to a flat fade-in or basic CSS transition.

## BRAND

- **Name:** Aiel Design & Printing Studio
- **Category:** Custom apparel & merchandise design and printing
- **Products:** T-Shirts, Jerseys, Customized Gifts, Mugs, Caps, Keychains, Bags, Corporate Gifts
- **Logo:** multi-color gradient script wordmark "Aiel" (blue → purple → magenta/pink → orange), paired with a stylized pink flower motif with a smiling yellow center
- **Signature visual identity:** bold multi-color paint-splash bursts (blue, magenta, yellow-orange, teal) exploding across a black base — this splash motif is the brand's fingerprint and should be echoed in transitions, cursor trails, and hover states throughout the site, not just on product mockups
- **Brand mascot:** a Pixar/Disney-quality 3D-style curly-haired kid character in black Aiel-branded streetwear (cap, tee, joggers, sneakers), holding an Aiel-branded phone, mug, and tote bag. Use him as a recurring "brand ambassador" presence across the site (hero, about, footer) — I'm attaching his reference art as brand assets.
- **Contact:** WhatsApp +91 91502 34277 · Instagram @aieldesignstudio

## REFERENCE DIRECTION (study the craft, not the content)

Match the production quality and interaction sophistication of:
- https://exp-infinite-passerella.lusion.co/
- https://labs.lusion.co/

Specifically borrow: a full-viewport canvas as the primary interface rather than a decorative background; a percentage-counter loading sequence before the site reveals itself; cursor-reactive camera/parallax movement; minimal, high-contrast UI floating over the visuals; cinematic scroll-triggered camera and object motion. Do not copy their layout, copy, or branding — only the caliber of execution.

## GLOBAL EXPERIENCE REQUIREMENTS

- **Preloader:** full-screen black loader with an animated percentage counter (0→100%) and the Aiel gradient wordmark building itself in (stroke-draw or gradient-wipe reveal) before the site unlocks — same intent as Lusion's loading screen.
- **Custom cursor:** replace the default cursor with a small paint-splash/gradient dot that leaves a brief particle trail in brand colors; it should morph/expand into a splash burst on hover over interactive elements and on click.
- **Smooth scroll:** buttery inertia-based scrolling (Lenis or equivalent) across the whole site, not native scroll.
- **Scroll-driven cinematics:** sections should pin, zoom, rotate, or reveal via scroll (GSAP ScrollTrigger), not just slide up and fade.
- **Micro-interactions everywhere:** buttons should have magnetic hover pull, 3D tilt-on-hover for cards, and a color-splash burst micro-animation on click — every clickable element should feel alive.
- **Page/section transitions:** cinematic wipe or gradient-curtain transitions between major views, not instant cuts.
- **Dark cinematic base:** black/near-black canvas throughout, with the brand gradient (blue-purple-pink-orange) and paint-splash colors used as the only accent — this contrast is what will make the 3D and product colors pop.
- **Sound-optional micro-feedback:** subtle UI sound on key interactions (toggleable/muted by default) is a nice-to-have if feasible.
- **Performance fallback:** detect low-power devices/lack of WebGL support and gracefully degrade to a lighter, still-polished 2D/CSS animated version rather than breaking — mirror Lusion's "not supported device/browser/WebGL" handling pattern.
- **Reduced motion respect:** honor `prefers-reduced-motion` with a calmer fallback animation set.

## TECH STACK TO USE

- React + Vite + TailwindCSS
- **React Three Fiber + drei** for all real 3D scenes (product shelf, hero backdrop)
- **GSAP + ScrollTrigger** for scroll-driven cinematics
- **Framer Motion** for UI-level micro-interactions and transitions
- **Lenis** (or equivalent) for smooth inertia scrolling
- Lightweight **glTF/GLB models** for interactive product viewers (t-shirt, cap, mug) — use free/stock apparel glTF assets as placeholders where custom models aren't supplied, structured so they can be swapped for real product scans later
- Click-to-chat WhatsApp deep link (`wa.me/9191502234277`-style) and Instagram link integration
- Code-split/lazy-load all heavy 3D scenes so first paint stays fast

## PAGE / SECTION STRUCTURE

1. **Hero**
   - Full-viewport 3D/parallax scene: brand mascot on a layered parallax stage (foreground mascot, mid paint-splash particles drifting, background soft gradient glow) reacting subtly to cursor movement/device tilt
   - Gradient Aiel wordmark animates in on load
   - Tagline: "Design & Printing Studio" with a one-line hook (e.g. "Custom apparel, corporate gifts & merch — designed and printed to move")
   - Primary CTA: "Start Your Design" → WhatsApp; secondary CTA: "Explore Products" → scrolls to product shelf

2. **About / Studio Story**
   - Short brand story, framed with scroll-pinned mascot animation and paint-splash transitions between paragraphs

3. **Interactive Product Universe** (this is the centerpiece — invest the most 3D effort here)
   - A horizontally/scroll-driven 3D shelf presenting the 7 categories: T-Shirt, Customized Gifts, Mugs, Caps, Keychains, Bags, Corporate Gifts
   - Each category = a real 3D model (glTF) the user can drag-rotate 360°, with the Aiel paint-splash print mapped onto it as the default texture
   - Clicking a category morphs the camera into that product's dedicated mini-showcase with a short cinematic camera move

4. **How It Works / Customization Process**
   - Step-based scroll sequence (Upload your design → We print & preview → You approve → Delivered) with each step visualized via a small animated 3D/particle moment, not plain icons

5. **Portfolio / Past Work Gallery**
   - Scroll-pinned horizontal gallery with mask-reveal image transitions showcasing finished merch

6. **Corporate & Bulk Orders**
   - Section aimed at businesses/teams (jerseys, corporate gifts) with its own CTA

7. **Testimonials**
   - Auto-advancing carousel with soft 3D card-flip transitions

8. **Contact / CTA**
   - Large closing CTA panel, floating pulse-glow WhatsApp button persistent across the site, Instagram handle prominent
   - Contact: **+91 91502 34277** (WhatsApp) · **@aieldesignstudio** (Instagram)

9. **Footer**
   - Paint-splash gradient divider, social links with hover morph icons, credits line

## ASSET NOTES

- Two brand reference images are attached: the full logo/product lockup sheet and the standalone mascot character — use these for exact gradient colors, mascot styling, and product-category iconography (the 7 outlined icon style: T-shirt, gift box, mug, cap, keychain/glasses, bag, corporate gift box)
- Since bespoke 3D character sculpting isn't feasible inside this build, render the mascot via layered parallax compositing (multiple depth planes + soft blur + light particles) rather than a flat static image, so he still reads as part of a cinematic 3D scene
- Use real glTF apparel models for the interactive product shelf, since that's where genuine 3D interaction (not just parallax) will matter most for showcasing print quality

## WHAT TO AVOID

- No generic e-commerce template layout (no default grid-of-cards Shopify look)
- No basic fade/slide-up as the only transition type — every section needs a distinct motion signature
- No stock photography — everything should tie back to the Aiel gradient/paint-splash identity
- No cluttered UI chrome — keep navigation minimal and let the 3D/motion carry the premium feel

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/8eefc711-d5c9-465a-bb33-536c1f861c80).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
