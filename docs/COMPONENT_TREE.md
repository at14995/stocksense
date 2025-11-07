# Component Tree Overview

This document outlines the high-level component structure of the Stock Sense application.

- **`/app`** (Core Pages)
  - `layout.tsx`: Root layout with header, footer, and animated background.
  - `page.tsx`: Landing page.
    - `HeroAlertForm`
    - `LiveMarketTicker`
    - `FeatureGrid`
    - `ContactSection`
    - `FAQAccordion`
  - `/auth/page.tsx`: Authentication page.
    - `AuthTabs`
      - `SignInForm`
      - `SignUpForm`
      - `ResetPasswordForm`
  - `/dashboard/page.tsx`: Main user dashboard.
    - `DashboardGrid`
      - `MarketOverviewWidget`
      - `WatchlistWidget`
      - `AlertsWidget`
      - `SupportWidget`
  - `/alerts/page.tsx`: Page for managing alerts.
    - `AlertsPanel`
      - `EditAlertDialog`
  - `/alerts/create/page.tsx`: Page for creating a new alert.
    - `CreateAlertForm`
  - `/analyst/page.tsx`: Analyst Hub for viewing and creating posts.
    - `PostComposer`
    - `PostCard`
      - `CommentList`
  - `/watchlists/page.tsx`: Page for managing watchlists.
    - `WatchlistPanel`
      - `SymbolEditor`
      - `CreateWatchlistDialog`
      - `RenameWatchlistDialog`
      - `DeleteWatchlistDialog`
  - `/support/page.tsx`: User-facing support page.
    - `UserSupportPage`
      - `NewTicketDialog`
  - `/support/admin/page.tsx`: Admin-facing support ticket management.
    - `AdminSupportPage`
  - `/settings/page.tsx`: User profile and account settings.

- **`/components/ui`**
  - Contains all ShadCN UI components (e.g., `Button`, `Card`, `Input`, `Dialog`).

- **`/components`**
  - `header.tsx`: Global navigation bar.
    - `UserNav`
    - `NotificationBell`
  - `footer.tsx`: Global footer.
  - `logo.tsx`: Site logo component.
  - `backgrounds/DarkVeil.tsx`: OGL animated background shader.

- **`/features`**
  - Contains feature-specific components, hooks, and services.
  - `/alerts`
  - `/analyst`
  - `/auth`
  - `/dashboard`
  - `/notifications`
  - `/support`
  - `/watchlists`
