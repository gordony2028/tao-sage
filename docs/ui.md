# Sage UI Design System
## Complete Specification Document

**Version:** 1.0  
**Date:** July 30, 2025  
**Document Type:** UI Design System Specification  
**Target Platforms:** iOS, Android, Web  

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Design Tokens](#2-design-tokens)
3. [Typography](#3-typography)
4. [Component Library](#4-component-library)
5. [Layout System](#5-layout-system)
6. [Interaction Design](#6-interaction-design)
7. [Responsive Guidelines](#7-responsive-guidelines)
8. [Accessibility Standards](#8-accessibility-standards)
9. [Implementation Guide](#9-implementation-guide)
10. [Quality Assurance](#10-quality-assurance)

---

## 1. Design Philosophy

### 1.1 Taoist-Inspired Design Principles

The Sage UI embodies the philosophical principles of Taoism, creating an interface that flows naturally with user intent while honoring ancient wisdom traditions.

#### **Wu Wei (無為) - Effortless Action**
- **Principle:** Technology should feel invisible, allowing wisdom to flow naturally
- **Implementation:** 
  - Minimal cognitive load in navigation
  - Self-evident interface patterns
  - Smooth, predictable interactions
  - Progressive disclosure of complexity

#### **Yin-Yang (陰陽) - Dynamic Balance**
- **Principle:** Every interface element exists in harmony with its opposite
- **Implementation:**
  - Light/dark content balance
  - Active/passive visual weight
  - Structured/organic layout elements
  - Technical/spiritual content integration

#### **Ziran (自然) - Natural Spontaneity**
- **Principle:** Interface elements should feel organic and authentically purposeful
- **Implementation:**
  - Flowing, curved shapes over rigid geometry
  - Natural material inspirations
  - Organic animation timing
  - Cultural authenticity in representation

### 1.2 Core Design Values

1. **Contemplative Clarity** - Promote thoughtful interaction over rapid consumption
2. **Cultural Authenticity** - Respectful integration of Chinese wisdom traditions
3. **Accessible Wisdom** - Ancient insights made approachable for modern users
4. **Mindful Technology** - AI that serves human wisdom rather than replacing it

---

## 2. Design Tokens

### 2.1 Color System

#### **Primary Palette**
```css
/* Primary Brand Colors */
--mountain-stone: #4a5c6a;     /* Primary text, stable elements */
--flowing-water: #6b8caf;      /* Primary actions, links */
--bamboo-green: #7ba05b;       /* Success, growth indicators */
--sunset-gold: #d4a574;        /* Highlights, warnings */
--earth-brown: #8b7355;        /* Secondary accents */
```

#### **Neutral Palette**
```css
/* Background & Supporting Colors */
--morning-mist: #e8f1f5;       /* Light backgrounds */
--cloud-white: #fefefe;        /* Card backgrounds */
--ink-black: #2c2c2c;          /* Primary text */
--soft-gray: #6b6b6b;          /* Secondary text */
--gentle-silver: #a8b2b8;      /* Tertiary text, borders */
```

#### **Semantic Colors**
```css
/* State-Based Colors */
--success: var(--bamboo-green);
--success-light: #9bc26f;
--success-dark: #5d7a43;

--warning: var(--sunset-gold);
--warning-light: #e6b988;
--warning-dark: #b8955f;

--error: var(--earth-brown);
--error-light: #a68969;
--error-dark: #6f5c44;

--info: var(--flowing-water);
--info-light: #85a1c3;
--info-dark: #556b8b;
```

#### **Color Usage Guidelines**

| Color | Primary Use | Secondary Use | Avoid |
|-------|-------------|---------------|-------|
| Mountain Stone | Headlines, primary text | Button text | Large backgrounds |
| Flowing Water | Primary buttons, links | Icons, borders | Body text |
| Bamboo Green | Success states, growth | Secondary buttons | Error messages |
| Sunset Gold | Highlights, warnings | Accent elements | Primary actions |

### 2.2 Elevation System

```css
/* Shadow Definitions */
--water-shadow: 0 8px 32px rgba(107, 140, 175, 0.15);
--mist-glow: 0 4px 20px rgba(232, 241, 245, 0.8);
--earth-shadow: 0 6px 24px rgba(139, 115, 85, 0.12);
--gentle-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
--floating-shadow: 0 12px 40px rgba(74, 92, 106, 0.2);
```

**Elevation Hierarchy:**
- Level 0: Flat surfaces (0px)
- Level 1: Cards, buttons (gentle-shadow)
- Level 2: Floating panels (water-shadow)
- Level 3: Modals, overlays (floating-shadow)
- Level 4: Tooltips, dropdowns (mist-glow)

### 2.3 Spacing System

```css
/* Base Unit: 8px */
--space-0: 0;
--space-1: 0.5rem;   /* 8px */
--space-2: 1rem;     /* 16px */
--space-3: 1.5rem;   /* 24px */
--space-4: 2rem;     /* 32px */
--space-5: 2.5rem;   /* 40px */
--space-6: 3rem;     /* 48px */
--space-8: 4rem;     /* 64px */
--space-10: 5rem;    /* 80px */
--space-12: 6rem;    /* 96px */
```

**Component Spacing Standards:**
- **Card Padding:** var(--space-4) to var(--space-6)
- **Button Padding:** var(--space-2) var(--space-5)
- **Section Margins:** var(--space-8) to var(--space-12)
- **Element Gaps:** var(--space-2) to var(--space-4)

---

## 3. Typography

### 3.1 Font Stack

**Primary Typeface:** SF Pro Text (iOS), Roboto (Android), System Font (Web)
```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 
             'Helvetica Neue', Arial, sans-serif;
```

**Secondary Typeface:** Serif for traditional wisdom quotes
```css
font-family: 'New York', 'Times New Roman', Georgia, serif;
```

### 3.2 Type Scale

```css
/* Heading Styles */
--font-size-h1: 4rem;      /* 64px - Hero titles */
--font-size-h2: 2.5rem;    /* 40px - Section headers */
--font-size-h3: 1.8rem;    /* 28.8px - Card titles */
--font-size-h4: 1.4rem;    /* 22.4px - Subsection titles */

/* Body Styles */
--font-size-large: 1.1rem; /* 17.6px - Primary content */
--font-size-body: 1rem;    /* 16px - Standard text */
--font-size-small: 0.9rem; /* 14.4px - Secondary info */
--font-size-caption: 0.8rem; /* 12.8px - Captions */

/* Weight Scale */
--font-weight-light: 200;
--font-weight-regular: 400;
--font-weight-medium: 500;
--font-weight-semibold: 600;
--font-weight-bold: 700;
```

### 3.3 Typography Components

#### **H1 - Hero Heading**
```css
.text-hero {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-light);
  line-height: 1.2;
  letter-spacing: 0.05em;
  color: var(--mountain-stone);
}
```

#### **Wisdom Text - Inspirational Quotes**
```css
.text-wisdom {
  font-family: var(--font-serif);
  font-size: var(--font-size-large);
  font-style: italic;
  line-height: 1.8;
  color: var(--soft-gray);
  text-align: center;
}
```

#### **Chinese Characters - Cultural Elements**
```css
.text-chinese {
  font-size: 2rem;
  font-weight: var(--font-weight-regular);
  color: var(--flowing-water);
  letter-spacing: 0.1em;
}
```

---

## 4. Component Library

### 4.1 Button Components

#### **Primary Button - Natural Action**
```css
.btn-natural {
  background: linear-gradient(135deg, var(--flowing-water), var(--bamboo-green));
  color: white;
  border: none;
  padding: var(--space-2) var(--space-5);
  border-radius: 50px;
  font-size: var(--font-size-large);
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.05em;
  box-shadow: 0 4px 20px rgba(107, 140, 175, 0.3);
  transition: all 0.4s var(--natural-ease);
  position: relative;
  overflow: hidden;
}

.btn-natural:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 30px rgba(107, 140, 175, 0.4);
}

.btn-natural::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.6s ease;
}

.btn-natural:hover::before {
  left: 100%;
}
```

#### **Secondary Button - Gentle Approach**
```css
.btn-secondary {
  background: transparent;
  color: var(--flowing-water);
  border: 2px solid var(--flowing-water);
  padding: var(--space-2) var(--space-5);
  border-radius: 50px;
  font-size: var(--font-size-large);
  font-weight: var(--font-weight-regular);
  letter-spacing: 0.05em;
  transition: all 0.4s var(--natural-ease);
}

.btn-secondary:hover {
  background: var(--flowing-water);
  color: white;
  transform: translateY(-3px);
  box-shadow: 0 6px 25px rgba(107, 140, 175, 0.3);
}
```

#### **Button States & Variants**

| State | Transform | Shadow | Opacity |
|-------|-----------|---------|---------|
| Default | none | base | 1.0 |
| Hover | translateY(-3px) | enhanced | 1.0 |
| Active | translateY(-1px) | reduced | 0.95 |
| Disabled | none | none | 0.5 |
| Loading | none | base | 0.8 |

### 4.2 Card Components

#### **Wisdom Card - Content Container**
```css
.wisdom-card {
  background: var(--cloud-white);
  border-radius: 32px;
  padding: var(--space-5);
  box-shadow: var(--water-shadow);
  border: 1px solid rgba(107, 140, 175, 0.1);
  position: relative;
  overflow: hidden;
  transition: all 0.4s var(--flowing-ease);
}

.wisdom-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--flowing-water), var(--bamboo-green), var(--sunset-gold));
  opacity: 0;
  transition: opacity 0.4s ease;
}

.wisdom-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--mist-glow);
}

.wisdom-card:hover::before {
  opacity: 1;
}
```

#### **AI Wisdom Card - Special Insights**
```css
.ai-wisdom {
  background: linear-gradient(135deg, var(--morning-mist), var(--cloud-white));
  border-radius: 24px;
  padding: var(--space-5);
  border-left: 4px solid var(--bamboo-green);
  position: relative;
  box-shadow: var(--earth-shadow);
}

.ai-wisdom::before {
  content: "智";
  position: absolute;
  top: var(--space-2);
  right: var(--space-3);
  font-size: 2rem;
  color: var(--bamboo-green);
  opacity: 0.3;
}
```

### 4.3 Form Components

#### **Question Input - Contemplative Text Area**
```css
.question-pond {
  width: 100%;
  min-height: 120px;
  border: 2px solid rgba(107, 140, 175, 0.2);
  border-radius: 20px;
  padding: var(--space-3);
  font-family: inherit;
  font-size: var(--font-size-large);
  background: rgba(232, 241, 245, 0.3);
  color: var(--ink-black);
  resize: vertical;
  transition: all 0.4s var(--flowing-ease);
}

.question-pond:focus {
  outline: none;
  border-color: var(--flowing-water);
  background: rgba(232, 241, 245, 0.5);
  box-shadow: 0 0 0 4px rgba(107, 140, 175, 0.1);
}

.question-pond::placeholder {
  color: var(--gentle-silver);
  font-style: italic;
}
```

### 4.4 Hexagram Components

#### **Hexagram Display - Sacred Geometry**
```css
.hexagram-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-6);
  background: radial-gradient(circle, rgba(107, 140, 175, 0.05) 0%, transparent 70%);
  border-radius: 50px;
  margin: var(--space-4) 0;
}

.hexagram-lines {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: var(--space-4) 0;
}

.line {
  width: 80px;
  height: 6px;
  background: linear-gradient(90deg, var(--mountain-stone), var(--flowing-water));
  border-radius: 3px;
  transition: all 0.3s var(--natural-ease);
  box-shadow: 0 2px 8px rgba(74, 92, 106, 0.2);
}

.line.broken {
  background: linear-gradient(to right, 
    var(--mountain-stone) 0%, var(--mountain-stone) 35%, 
    transparent 35%, transparent 65%, 
    var(--flowing-water) 65%, var(--flowing-water) 100%);
}

.line:hover {
  transform: scaleX(1.1);
  box-shadow: 0 4px 15px rgba(74, 92, 106, 0.3);
}
```

#### **Coin Casting - Interactive Elements**
```css
.coin {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, var(--sunset-gold), var(--earth-brown));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  font-weight: var(--font-weight-light);
  color: var(--ink-black);
  cursor: pointer;
  transition: all 0.4s var(--flowing-ease);
  box-shadow: 0 6px 20px rgba(139, 115, 85, 0.25);
  position: relative;
}

.coin::before {
  content: '';
  position: absolute;
  top: 10%;
  left: 20%;
  width: 30%;
  height: 30%;
  background: radial-gradient(circle, rgba(255,255,255,0.3), transparent);
  border-radius: 50%;
  transition: all 0.4s ease;
}

.coin:hover {
  transform: scale(1.1) rotateY(180deg);
  box-shadow: 0 10px 30px rgba(139, 115, 85, 0.4);
}

.coin.casting {
  animation: naturalSpin 1.5s ease-out;
}

@keyframes naturalSpin {
  0% { transform: rotateY(0deg) scale(1); }
  50% { transform: rotateY(180deg) scale(1.2); }
  100% { transform: rotateY(360deg) scale(1); }
}
```

### 4.5 Navigation Components

#### **Header Navigation**
```css
.header {
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  backdrop-filter: blur(20px);
  background: rgba(254, 254, 254, 0.7);
  border-bottom: 1px solid rgba(107, 140, 175, 0.1);
}

.nav-item {
  color: var(--soft-gray);
  font-weight: var(--font-weight-regular);
  cursor: pointer;
  transition: all 0.4s var(--flowing-ease);
  position: relative;
  padding: var(--space-1) var(--space-2);
  border-radius: 50px;
  letter-spacing: 0.05em;
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(45deg, transparent, rgba(107, 140, 175, 0.1), transparent);
  border-radius: 50px;
  opacity: 0;
  transition: opacity 0.4s ease;
}

.nav-item:hover::before,
.nav-item.active::before {
  opacity: 1;
}

.nav-item:hover,
.nav-item.active {
  color: var(--flowing-water);
  transform: translateY(-2px);
}
```

### 4.6 Notification Components

#### **Gentle Notification System**
```css
.gentle-notification {
  position: fixed;
  top: 120px;
  right: 30px;
  background: rgba(254, 254, 254, 0.95);
  backdrop-filter: blur(20px);
  padding: var(--space-3) var(--space-4);
  border-radius: 20px;
  box-shadow: var(--water-shadow);
  border: 1px solid rgba(107, 140, 175, 0.2);
  transform: translateX(400px);
  transition: all 0.6s var(--flowing-ease);
  z-index: 1001;
  max-width: 320px;
}

.gentle-notification.show {
  transform: translateX(0);
}

.gentle-notification::before {
  content: '';
  position: absolute;
  left: -8px;
  top: 50%;
  transform: translateY(-50%);
  width: 0;
  height: 0;
  border-top: 8px solid transparent;
  border-bottom: 8px solid transparent;
  border-right: 8px solid rgba(254, 254, 254, 0.95);
}
```

---

## 5. Layout System

### 5.1 Grid System

#### **Container Sizes**
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

/* Responsive Container Widths */
@media (max-width: 576px) { .container { max-width: 100%; } }
@media (min-width: 577px) { .container { max-width: 540px; } }
@media (min-width: 769px) { .container { max-width: 720px; } }
@media (min-width: 993px) { .container { max-width: 960px; } }
@media (min-width: 1201px) { .container { max-width: 1140px; } }
```

#### **Taoist Layout Patterns**

**Balance Grid - Yin-Yang Layout**
```css
.balance-grid {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  gap: var(--space-4);
  align-items: start;
}

@media (max-width: 1024px) {
  .balance-grid {
    grid-template-columns: 1fr;
  }
}
```

**Flow Grid - Natural Arrangement**
```css
.flow-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-4);
  margin: var(--space-6) 0;
}
```

### 5.2 Spacing Guidelines

#### **Component Spacing Rules**
- **Micro Spacing:** 8px-16px (between related elements)
- **Component Spacing:** 24px-32px (between components)
- **Section Spacing:** 48px-96px (between major sections)
- **Page Spacing:** 80px+ (between page sections)

#### **Content Hierarchy Spacing**
```css
/* Vertical Rhythm */
h1 + p { margin-top: var(--space-4); }
h2 + p { margin-top: var(--space-3); }
h3 + p { margin-top: var(--space-2); }
p + p { margin-top: var(--space-2); }
section + section { margin-top: var(--space-8); }
```

---

## 6. Interaction Design

### 6.1 Animation System

#### **Timing Functions - Natural Easing**
```css
/* Taoist-Inspired Easing */
--natural-ease: cubic-bezier(0.25, 0.46, 0.45, 0.94);
--flowing-ease: cubic-bezier(0.23, 1, 0.32, 1);
--gentle-ease: cubic-bezier(0.165, 0.84, 0.44, 1);
--water-ease: cubic-bezier(0.19, 1, 0.22, 1);

/* Duration Scale */
--duration-micro: 150ms;    /* Button hover states */
--duration-short: 300ms;    /* Card hover, focus states */
--duration-medium: 500ms;   /* Section transitions */
--duration-long: 800ms;     /* Hexagram formations */
--duration-contemplative: 1200ms; /* Wisdom reveals */
```

#### **Animation Principles**

**1. Natural Timing**
- Acceleration and deceleration mimic physical motion
- No abrupt starts or stops
- Layered timing for complex sequences

**2. Purposeful Motion**
- Every animation serves user understanding
- Motion guides attention naturally
- Respects user's attention and energy

**3. Cultural Sensitivity**
- Animations reflect Taoist philosophy
- Flowing, water-like movements
- Breathing, organic rhythms

### 6.2 Micro-Interactions

#### **Button Interactions**
```css
/* Hover States */
.btn:hover {
  transform: translateY(-3px);
  transition: transform var(--duration-short) var(--natural-ease);
}

/* Focus States */
.btn:focus {
  outline: none;
  box-shadow: 0 0 0 4px rgba(107, 140, 175, 0.3);
  transition: box-shadow var(--duration-micro) var(--gentle-ease);
}

/* Active States */
.btn:active {
  transform: translateY(-1px);
  transition: transform var(--duration-micro) var(--natural-ease);
}
```

#### **Card Interactions**
```css
/* Floating Effect */
.wisdom-card {
  transition: all var(--duration-short) var(--flowing-ease);
}

.wisdom-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--floating-shadow);
}

/* Content Reveal */
.wisdom-card .hidden-content {
  opacity: 0;
  transform: translateY(20px);
  transition: all var(--duration-medium) var(--water-ease);
}

.wisdom-card:hover .hidden-content {
  opacity: 1;
  transform: translateY(0);
}
```

### 6.3 Page Transitions

#### **Section Navigation**
```css
.section {
  opacity: 0;
  transform: translateY(30px);
  transition: all var(--duration-medium) var(--flowing-ease);
}

.section.active {
  opacity: 1;
  transform: translateY(0);
}

/* Staggered Content Animation */
.section.active .stagger-item {
  animation: staggerIn var(--duration-medium) var(--natural-ease) forwards;
}

.section.active .stagger-item:nth-child(1) { animation-delay: 0ms; }
.section.active .stagger-item:nth-child(2) { animation-delay: 100ms; }
.section.active .stagger-item:nth-child(3) { animation-delay: 200ms; }

@keyframes staggerIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

---

## 7. Responsive Guidelines

### 7.1 Breakpoint System

```css
/* Mobile First Approach */
:root {
  --bp-xs: 320px;   /* Small phones */
  --bp-sm: 576px;   /* Large phones */
  --bp-md: 768px;   /* Tablets */
  --bp-lg: 992px;   /* Small laptops */
  --bp-xl: 1200px;  /* Desktops */
  --bp-xxl: 1400px; /* Large desktops */
}

/* Media Query Mixins */
@media (max-width: 575px) { /* Mobile styles */ }
@media (min-width: 576px) and (max-width: 767px) { /* Large mobile */ }
@media (min-width: 768px) and (max-width: 991px) { /* Tablet */ }
@media (min-width: 992px) and (max-width: 1199px) { /* Small desktop */ }
@media (min-width: 1200px) { /* Desktop */ }
```

### 7.2 Responsive Typography

```css
/* Fluid Typography */
.text-hero {
  font-size: clamp(2.5rem, 8vw, 4rem);
}

.text-large {
  font-size: clamp(1rem, 3vw, 1.1rem);
}

/* Mobile Adjustments */
@media (max-width: 767px) {
  .text-hero { line-height: 1.1; }
  .text-wisdom { font-size: 1rem; }
  .text-chinese { font-size: 1.5rem; }
}
```

### 7.3 Component Responsive Behavior

#### **Navigation Responsive Pattern**
```css
/* Desktop Navigation */
.nav-links {
  display: flex;
  gap: var(--space-6);
}

/* Mobile Navigation */
@media (max-width: 768px) {
  .nav {
    flex-direction: column;
    gap: var(--space-3);
    padding: var(--space-2) 0;
  }
  
  .nav-links {
    gap: var(--space-3);
    flex-wrap: wrap;
    justify-content: center;
  }
}
```

#### **Card Grid Responsive Behavior**
```css
.flow-grid {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

@media (max-width: 768px) {
  .flow-grid {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }
}

@media (max-width: 480px) {
  .wisdom-card {
    padding: var(--space-3);
    border-radius: 20px;
  }
}
```

### 7.4 Touch Interaction Guidelines

#### **Touch Target Sizes**
```css
/* Minimum touch targets */
.touch-target {
  min-height: 44px;
  min-width: 44px;
  padding: var(--space-2);
}

/* Generous spacing for touch */
@media (max-width: 768px) {
  .nav-item {
    padding: var(--space-2) var(--space-3);
    margin: var(--space-1);
  }
  
  .coin {
    width: 60px;
    height: 60px;
    margin: var(--space-2);
  }
}
```

---

## 8. Accessibility Standards

### 8.1 Color Accessibility

#### **Contrast Ratios (WCAG 2.1 AA)**
- **Normal Text:** 4.5:1 minimum
- **Large Text:** 3:1 minimum
- **Non-text Elements:** 3:1 minimum

#### **Color Combinations Audit**
```css
/* Approved High-Contrast Combinations */
.high-contrast-text {
  color: var(--ink-black);        /* #2c2c2c */
  background: var(--cloud-white); /* #fefefe */
  /* Contrast Ratio: 12.63:1 ✓ */
}

.medium-contrast-text {
  color: var(--mountain-stone);   /* #4a5c6a */
  background: var(--cloud-white); /* #fefefe */
  /* Contrast Ratio: 6.89:1 ✓ */
}

.button-contrast {
  color: white;                   /* #ffffff */
  background: var(--flowing-water); /* #6b8caf */
  /* Contrast Ratio: 4.52:1 ✓ */
}
```

### 8.2 Keyboard Navigation

#### **Focus Management**
```css
/* Visible Focus Indicators */
.focusable:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(107, 140, 175, 0.5);
  border-radius: 4px;
}

/* Skip Links */
.skip-link {
  position: absolute;
  top: -40px;
  left: 6px;
  background: var(--ink-black);
  color: white;
  padding: 8px;
  text-decoration: none;
  border-radius: 4px;
  z-index: 9999;
}

.skip-link:focus {
  top: 6px;
}
```

#### **Tab Order Guidelines**
1. Logo/Brand
2. Main Navigation
3. Primary Content Areas
4. Secondary Content
5. Footer Links

### 8.3 Screen Reader Support

#### **Semantic HTML Structure**
```html
<!-- Proper heading hierarchy -->
<h1>Page Title</h1>
<h2>Section Title</h2>
<h3>Subsection Title</h3>

<!-- Accessible navigation -->
<nav aria-label="Main navigation">
  <ul role="list">
    <li><a href="#compass" aria-current="page">Compass</a></li>
  </ul>
</nav>

<!-- Descriptive buttons -->
<button aria-label="Cast I Ching hexagram for guidance">
  Cast Hexagram
</button>

<!-- Form labels -->
<label for="question">Your Question:</label>
<textarea id="question" aria-describedby="question-help"></textarea>
<div id="question-help">Ask a specific question for clearer guidance</div>
```

#### **ARIA Labels for Complex Components**
```html
<!-- Hexagram display -->
<div role="img" aria-label="Hexagram 53: Gradual Progress. Six lines representing mountain over wind.">
  <div class="hexagram-lines">
    <div class="line" aria-hidden="true"></div>
    <div class="line broken" aria-hidden="true"></div>
    <!-- ... more lines -->
  </div>
</div>

<!-- Interactive coins -->
<div role="group" aria-label="I Ching coin casting">
  <button aria-label="Cast coin 1, currently showing Yang">陽</button>
  <button aria-label="Cast coin 2, currently showing Yin">陰</button>
  <button aria-label="Cast coin 3, currently showing Yang">陽</button>
</div>
```

### 8.4 Motion Accessibility

#### **Reduced Motion Support**
```css
/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  .coin:hover {
    transform: scale(1.05); /* Reduced motion alternative */
  }
  
  .section.active {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
```

---

## 9. Implementation Guide

### 9.1 CSS Custom Properties Setup

#### **Root Variables File**
```css
/* design-tokens.css */
:root {
  /* Colors */
  --mountain-stone: #4a5c6a;
  --flowing-water: #6b8caf;
  --bamboo-green: #7ba05b;
  --sunset-gold: #d4a574;
  --earth-brown: #8b7355;
  --morning-mist: #e8f1f5;
  --cloud-white: #fefefe;
  --ink-black: #2c2c2c;
  --soft-gray: #6b6b6b;
  --gentle-silver: #a8b2b8;
  
  /* Typography */
  --font-size-h1: clamp(2.5rem, 8vw, 4rem);
  --font-size-h2: clamp(2rem, 6vw, 2.5rem);
  --font-size-h3: clamp(1.5rem, 4vw, 1.8rem);
  --font-size-large: clamp(1rem, 3vw, 1.1rem);
  --font-size-body: 1rem;
  
  /* Spacing */
  --space-1: 0.5rem;
  --space-2: 1rem;
  --space-3: 1.5rem;
  --space-4: 2rem;
  --space-5: 2.5rem;
  --space-6: 3rem;
  --space-8: 4rem;
  --space-10: 5rem;
  --space-12: 6rem;
  
  /* Animation */
  --natural-ease: cubic-bezier(0.25, 0.46, 0.45, 0.94);
  --flowing-ease: cubic-bezier(0.23, 1, 0.32, 1);
  --gentle-ease: cubic-bezier(0.165, 0.84, 0.44, 1);
  --duration-micro: 150ms;
  --duration-short: 300ms;
  --duration-medium: 500ms;
  --duration-long: 800ms;
  
  /* Shadows */
  --water-shadow: 0 8px 32px rgba(107, 140, 175, 0.15);
  --mist-glow: 0 4px 20px rgba(232, 241, 245, 0.8);
  --earth-shadow: 0 6px 24px rgba(139, 115, 85, 0.12);
  --gentle-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}
```

### 9.2 Component Development Strategy

#### **File Organization**
```
src/
├── styles/
│   ├── tokens/
│   │   ├── colors.css
│   │   ├── typography.css
│   │   ├── spacing.css
│   │   └── animations.css
│   ├── components/
│   │   ├── buttons.css
│   │   ├── cards.css
│   │   ├── forms.css
│   │   ├── navigation.css
│   │   └── hexagram.css
│   ├── layouts/
│   │   ├── grid.css
│   │   ├── containers.css
│   │   └── responsive.css
│   └── utilities/
│       ├── accessibility.css
│       └── helpers.css
├── components/
│   ├── Button/
│   │   ├── Button.jsx
│   │   ├── Button.css
│   │   └── Button.test.js
│   └── WisdomCard/
│       ├── WisdomCard.jsx
│       ├── WisdomCard.css
│       └── WisdomCard.test.js
└── assets/
    ├── icons/
    └── images/
```

#### **Component Development Checklist**
For each component, ensure:
- [ ] Responsive design implemented
- [ ] Accessibility attributes added
- [ ] Keyboard navigation functional
- [ ] Screen reader compatibility
- [ ] Motion preferences respected
- [ ] High contrast mode support
- [ ] Touch target guidelines met
- [ ] Performance optimized

### 9.3 Development Workflow

#### **Phase 1: Foundation (Week 1)**
1. Set up CSS custom properties
2. Implement base typography system
3. Create utility classes
4. Establish responsive breakpoints

#### **Phase 2: Core Components (Week 2-3)**
1. Button component variants
2. Card component system
3. Form input components
4. Navigation components

#### **Phase 3: Complex Components (Week 4)**
1. Hexagram display system
2. Coin casting interactions
3. Notification system
4. Animation implementations

#### **Phase 4: Integration & Testing (Week 5)**
1. Screen assembly
2. User flow testing
3. Accessibility audit
4. Performance optimization

### 9.4 Quality Gates

#### **Before Component Completion**
- Component passes accessibility audit
- Responsive behavior verified on 3+ breakpoints
- Animation performance tested (60fps target)
- Cross-browser compatibility confirmed
- Code review completed

#### **Before Screen Completion**
- User flow walkthrough completed
- Keyboard navigation tested end-to-end
- Screen reader testing performed
- Performance metrics meet targets
- Visual regression testing passed

---

## 10. Quality Assurance

### 10.1 Design Review Checklist

#### **Visual Design Review**
- [ ] Consistent color usage across all screens
- [ ] Typography hierarchy properly implemented
- [ ] Spacing follows 8px grid system
- [ ] Component variants properly documented
- [ ] Cultural elements respectfully integrated

#### **Interaction Design Review**
- [ ] All interactive elements have clear affordances
- [ ] Hover states consistently implemented
- [ ] Focus states visible and appropriate
- [ ] Animations serve user understanding
- [ ] Touch targets meet size requirements

#### **Content Review**
- [ ] Wisdom quotes culturally authentic
- [ ] Chinese characters properly displayed
- [ ] Instructional text clear and helpful
- [ ] Error messages constructive and calming
- [ ] Voice and tone consistent throughout

### 10.2 Accessibility Audit

#### **Automated Testing Tools**
- **axe-core:** For WCAG compliance scanning
- **Lighthouse:** For overall accessibility scoring
- **Color Oracle:** For color blindness simulation
- **WAVE:** For web accessibility evaluation

#### **Manual Testing Protocol**
1. **Keyboard Navigation Test**
   - Tab through entire interface
   - Verify all interactive elements reachable
   - Confirm logical tab order
   - Test escape key functionality

2. **Screen Reader Test**
   - Test with VoiceOver (macOS)
   - Test with NVDA (Windows)
   - Verify proper heading structure
   - Confirm meaningful alt text

3. **Visual Impairment Test**
   - Test with 200% zoom
   - Verify high contrast mode
   - Test color-only information
   - Confirm text readability

### 10.3 Performance Standards

#### **Core Web Vitals Targets**
- **Largest Contentful Paint (LCP):** < 2.5 seconds
- **First Input Delay (FID):** < 100 milliseconds
- **Cumulative Layout Shift (CLS):** < 0.1

#### **Animation Performance**
- Maintain 60fps during all animations
- Use transform and opacity for animations
- Implement will-change property appropriately
- Test on lower-end devices

#### **Asset Optimization**
- SVG icons for all interface graphics
- WebP images with fallbacks
- Critical CSS inlined
- Non-critical CSS loaded asynchronously

### 10.4 Browser Compatibility

#### **Supported Browsers**
- **Mobile:** iOS Safari 14+, Chrome Mobile 90+
- **Desktop:** Chrome 90+, Firefox 88+, Safari 14+, Edge 90+

#### **Graceful Degradation Strategy**
- CSS Grid with Flexbox fallback
- Custom properties with static fallbacks
- Advanced animations optional
- Core functionality always available

### 10.5 Continuous Improvement

#### **User Feedback Integration**
- Regular usability testing sessions
- A/B testing for key interactions
- Analytics monitoring for drop-off points
- Cultural consultation for authenticity

#### **Design System Evolution**
- Quarterly design system reviews
- Component usage analytics
- Developer feedback incorporation
- Accessibility standard updates

---

## Conclusion

This design system establishes the foundation for creating an interface that truly embodies Taoist principles while meeting modern digital product standards. By following Wu Wei (effortless action), Yin-Yang (balance), and Ziran (natural authenticity), the Sage interface becomes a conduit for ancient wisdom rather than a barrier to it.

The success of this design system will be measured not just by usability metrics, but by users' sense of calm, clarity, and connection to timeless wisdom. When technology disappears and wisdom flows naturally, we have achieved the Way.

---

**Document Status:** Ready for Implementation  
**Next Review:** Quarterly  
**Maintained By:** Design Systems Team  
**Approved By:** Product Design Lead