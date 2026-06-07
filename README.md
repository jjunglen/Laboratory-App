# The Laboratory

A sneaker preference and alert platform built for a real small business. Users set their preferences by brand, size, and price range and receive in-app notifications when a matching sneaker becomes available.

---

## MVP Description

Users can register, log in, and set their sneaker preferences by brand, size, and price range. The app displays a personalized feed of matching sneakers from the inventory, each with a direct link to purchase externally. Users receive in-app notifications when a match is found.

---

## Features

### MVP Features (must have for launch)

| Feature | Why it's MVP |
|---|---|
| User registration & login | Without this, nothing is personalized. Every other feature depends on knowing who the user is. |
| Sneaker preference settings | The core value prop. Without preferences there is nothing to match against. |
| Personalized sneaker feed | The main reason someone opens the app. Filtered results based on saved preferences. |
| Buy link (external storefront) | Without a way to actually buy, the app has no real-world value. Opens store in a new tab. |
| In-app notifications | Core differentiator. Alerts the user when something in their size and price range is available. |

### Nice to Haves (built later)

| Feature | Notes |
|---|---|
| Saved / favorited sneakers | Useful but the feed already shows matches. |
| Search bar | With a small inventory, the filtered feed is enough. |
| Notification email or SMS | Requires third-party service. In-app covers the same need for MVP. |
| User profile page with avatar | Rubric requires a profile page — username and logout satisfies it for now. |

### Future Enhancements (post-graduation)

| Feature | Notes |
|---|---|
| Shopify Storefront API integration | Real inventory from The Laboratory. Mock data covers the same UX for now. |
| Admin inventory dashboard | Lets store staff manage the sneaker catalog from inside the app. |
| Multiple preference profiles | One user saving preferences for different people. Too complex for MVP. |
| Paid subscription | Users pay a monthly fee to get early access to newly arrived inventory before it goes public |
| Social features | Users can post that they have shoes to sell and can send message back and forth |
| Get a quote on your shoes in-app | Users can submit photos of their sneakers and receive an estimated resale price range |

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com) for all styling. No custom CSS files — all styles are applied directly as utility classes in JSX.

### Installation

```bash
npm install tailwindcss @tailwindcss/vite
```

### Vite config

Add the Tailwind plugin to `vite.config.js`:

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```

### Import

Add to `src/index.css`:

```css
@import "tailwindcss";
```

```html
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
```

### Design tokens

| Role | Tailwind Class |
|---|---|
| Page background | `bg-slate-900` |
| Card background | `bg-slate-800` |
| Border | `border-slate-700` |
| Heading text | `text-slate-50` |
| Body text | `text-slate-100` |
| Muted text | `text-slate-400` |
| Primary button | `bg-blue-600 hover:bg-blue-500` |
| Brand labels | `text-blue-400` |
| Success | `text-green-500` |
| Warning | `text-amber-500` |
| Danger | `text-red-500` |
| Notification badge | `bg-yellow-500` |

# Component Architecture

## Components (9 total)

| Component | Used On | Reusable |
|---|---|---|
| `Navbar` | All pages | Yes |
| `AuthForm` | Login, Register | Yes |
| `SneakerCard` | Dashboard | Yes |
| `FilterChips` | Dashboard | Yes |
| `NotificationBell` | Dashboard, Navbar | Yes |
| `BrandSelector` | Preferences | No |
| `SizeSelector` | Preferences | No |
| `StatCard` | Profile | No |

---

## Pages and Components

```
1. Landing
  - Navbar

2. Register
  - Navbar
  - AuthForm (local state: username, password, confirm password)

3. Login
  - Navbar
  - AuthForm (local state: username, password, error)

4. Dashboard
  - Navbar
  - NotificationBell (local state: open/closed, unread count)
  - FilterChips (local state: active brand filter)
  - SneakerCard (no state — receives sneaker as prop)

5. Preferences
  - Navbar
  - BrandSelector (local state: selected brands)
  - SizeSelector (local state: selected sizes)

6. Profile
  - Navbar
  - StatCard (no state — receives value as prop)
```
