# Nerdstack — clean rebuild

A React + TypeScript + Vite rebuild of the Nerdstack SaaS landing page.
Structure and content mirror the original, with tidy hand-written CSS
(no Webflow output) and small interactive touches.

## Run it

```bash
npm install
npm run dev      # start dev server
npm run build    # type-check + production build
npm run preview  # preview the build
```

## Structure

```
src/
  App.tsx              # page composition
  index.css            # design tokens + all component styles
  hooks/useReveal.ts   # scroll-in reveal animation
  components/
    Icons.tsx          # inline SVG icon set
    Widgets.tsx        # reusable dashboard visuals (charts, tables, lists)
    Navbar.tsx         # banner + nav with dropdown
    Hero.tsx           # headline + interactive product tabs
    LogoMarquee.tsx    # scrolling logo strip
    FeatureSections.tsx# alternating Debug / Docs / Optimize rows
    CaseSlider.tsx     # case-study carousel
    Products.tsx       # 3-up product cards
    Testimonials.tsx   # scrolling testimonial marquee
    FeaturesGrid.tsx   # 3 feature cards
    Blog.tsx           # blog card grid
    FAQ.tsx            # accordion
    CTA.tsx            # closing call-to-action
    Footer.tsx         # footer
```

## Notes
- Interactions: tab switcher (hero), case slider, FAQ accordion, dismissible
  banner, hover dropdowns, IntersectionObserver reveal-on-scroll.
- Fully responsive down to mobile.
- Copy and brand names echo the template; all imagery is replaced with
  CSS gradients / inline SVG so there are no external asset dependencies.

## Clean install
This folder may contain a partial `node_modules` from the build check.
For a fresh setup run:

```bash
rm -rf node_modules package-lock.json
npm install
npm run dev
```
