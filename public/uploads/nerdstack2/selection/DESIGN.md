---
name: Apex Finance
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#131f00'
  on-tertiary-container: '#718d3e'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#ceee93'
  tertiary-fixed-dim: '#b3d17a'
  on-tertiary-fixed: '#131f00'
  on-tertiary-fixed-variant: '#364e03'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Hanken Grotesk
    fontSize: 64px
    fontWeight: '600'
    lineHeight: 72px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Hanken Grotesk
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 48px
  xl: 80px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
---

## Brand & Style

This design system embodies a **Modern Corporate** aesthetic tailored for the high-end financial sector. It focuses on clarity, precision, and trust. The visual narrative is driven by an "Institutional Tech" philosophy—balancing the stability of traditional banking with the agility of a modern SaaS platform.

The brand personality is authoritative yet accessible. It utilizes high-contrast layouts to ensure readability and "breathing room" through generous whitespace. Visual interest is generated through subtle depth and a sophisticated interplay between deep monochromatic tones and vibrant functional accents. The emotional response should be one of confidence, security, and effortless efficiency.

## Colors

The palette is anchored by **Deep Navy** (`#0F172A`) for text and primary branding, providing a grounded, professional foundation. **Vibrant Blue** (`#2563EB`) serves as the primary action color, drawing the eye to interactive elements and progress indicators. 

A secondary accent of **Lime Green** (`#D9F99D`) is used sparingly for "Special Offers" or positive trend indicators, as seen in the reference. The background strategy relies on a high-contrast white base with multi-layered grays (`#F8FAFC`, `#F1F5F9`, `#E2E8F0`) to define container boundaries and subtle UI depth without relying on heavy lines.

## Typography

The system utilizes **Hanken Grotesk** for headlines to provide a sharp, contemporary edge that feels more distinctive than standard neo-grotesks. Its tight apertures and geometric construction convey technical precision. 

**Inter** is utilized for all body copy and UI labels to ensure maximum legibility at small sizes and high-density data views. Headlines should use tight letter-spacing (`-0.01em` to `-0.02em`) to maintain a "locked-in" editorial feel, while labels and small captions benefit from slight tracking to aid quick scanning.

## Layout & Spacing

The layout follows a **Fluid Grid** model with a maximum content width of 1280px for desktop. It employs a 12-column structure for desktop and a 4-column structure for mobile. 

The "Institutional" feel is achieved through exaggerated vertical padding between major sections (`xl` units) to prevent the interface from feeling cluttered. Gutters are kept consistent at 24px to maintain a rhythmic vertical scan line. Component-level spacing should strictly adhere to an 8px stepping scale to ensure mathematical harmony across the UI.

## Elevation & Depth

Hierarchy is established through **Tonal Layering** and **Ambient Shadows**. Instead of traditional borders, surfaces use extremely soft, multi-stop shadows with a slight navy tint (`rgba(15, 23, 42, 0.08)`) to lift cards off the background.

- **Level 0 (Base):** Solid white or very light gray (`#F8FAFC`).
- **Level 1 (Cards):** White surface with a 12px blur, 4px Y-offset shadow.
- **Level 2 (Dropdowns/Modals):** White surface with a 24px blur, 12px Y-offset shadow to indicate immediate interaction priority.

Backdrop blurs (12px-20px) are used behind fixed navigation bars to maintain a sense of spatial awareness as the user scrolls.

## Shapes

The shape language is defined by **Rounded** geometry. A base radius of 12px-16px is applied to all primary containers and cards to soften the professional aesthetic and make the interface feel modern and approachable.

Small components like checkboxes and tags use a consistent 4px-6px radius, while primary buttons utilize a fully "pill" shape (rounded-full) to maximize their visibility as the primary call-to-action against the more structured rectangular cards.

## Components

### Buttons
- **Primary:** Pill-shaped, Navy background, White text. High contrast.
- **Secondary:** Pill-shaped, White background, Navy border (1px).
- **Ghost:** No background, Navy text, includes a small arrow icon for directional cues.

### Cards
- Standard cards feature a 16px corner radius and a subtle "Soft Shadow". 
- Content inside cards should have a minimum of 24px internal padding.

### Input Fields
- Subtle gray background (`#F1F5F9`) with no initial border. 
- On focus, transition to a white background with a 2px Vibrant Blue border and soft glow.

### Chips & Badges
- Used for categories or status. 
- Utilize the Tertiary Lime color for "Offers" and a subtle Light Blue for "Status Updates". Text is always `label-sm` weight.

### Data Visualizations
- Line charts should use the Vibrant Blue with a subtle gradient fill below the line. 
- Points of interest use the Primary Navy to create high-contrast anchors on the data path.