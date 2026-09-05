# MariMar Private Oasis

Create a mobile-first, ultra-premium PWA web application for "MariMar — Private Sauna" in Almaty, Kazakhstan.

DESIGN SYSTEM & THEME:

- Dark Luxury Hospitality Aesthetic (like boutique hotel / premium booking apps).

- Background: Deep Obsidian / Charcoal (#09090B, #121215).

- Accent: Warm Muted Gold (#C5A059) for primary buttons and active indicators.

- Borders & Dividers: Subtle dark slate (#222228).

- Typography: Clean modern sans-serif with subtle tracking and large elegant headers. High contrast white/silver text for legibility.

- Visual style: No loud gradients, no visual noise, no cheap colors. Lots of whitespace, rounded corners (rounded-2xl), soft shadows, smooth micro-interactions.

NAVIGATION & LAYOUT:

1. Header: Minimalist header with "MariMar" brand name, "Private Sauna Almaty" subtitle, and a discreet status tag.

2. Bottom Mobile Navigation Bar (sticky on mobile):

   - Home (Главная)

   - Book (Забронировать)

   - My Bookings (Мои бронирования)

   - Profile (Профиль)

HOME PAGE CONTENT:

1. Hero Section:

   - High-resolution atmospheric image of a luxury sauna/spa space.

   - Tagline: "PRIVATE. CONFIDENTIAL. PREMIUM."

   - Primary CTA Button: "Забронировать" (navigates to booking flow).

   - Secondary Quick Links: "Кабинки", "Мои бронирования", "Контакты".

2. Cabins Section (Показать 3 реальные кабинки карточками):

   - LUX (Люкс): 8 000 ₸ / час | Вместимость: до 12 человек | Мин. заказ: 2 часа.

   - COMFORT (Комфорт): 6 000 ₸ / час | Вместимость: до 6 человек | Мин. заказ: 2 часа.

   - UYUT (Уют): 5 000 ₸ / час | Вместимость: 2–3 человека | Мин. заказ: 2 часа.

   Each cabin card must include:

   - Placeholder high-quality photo with dark gradient overlay.

   - Title, capacity badge, minimum hours tag.

   - Price per hour highlighted in gold.

   - "Выбрать" CTA button.

3. Quick Features Section:

   - Highlights: 100% Приватность, Онлайн-бронирование, Премиальный сервис.

TECHNICAL SPECIFICATIONS:

- React + Tailwind CSS + shadcn/ui + Lucide Icons.

- Mobile-first responsive layout (optimized for iPhone / Android viewports).

- Include skeleton loaders and subtle hover/active animations.

- Prepare state management for selecting a cabin to initiate the booking flow.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/980efea8-f44b-483a-b484-90485cff9196).

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
