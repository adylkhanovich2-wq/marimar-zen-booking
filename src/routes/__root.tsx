import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";
import { CalendarPlus, House, NotebookText, UserRound } from "lucide-react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { BookingProvider } from "../lib/booking-store";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Страница не найдена</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Запрашиваемая страница не существует или была перемещена.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="btn-gold inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold"
          >
            На главную
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Не удалось загрузить страницу
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Что-то пошло не так. Попробуйте обновить страницу.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="btn-gold inline-flex items-center justify-center rounded-xl px-5 py-2.5 text-sm font-semibold"
          >
            Повторить
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            На главную
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { name: "theme-color", content: "#09090B" },
      { name: "author", content: "MariMar" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&family=Sora:wght@400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="ru">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

const NAV_ITEMS = [
  { to: "/", label: "Главная", icon: House },
  { to: "/book", label: "Забронировать", icon: CalendarPlus },
  { to: "/bookings", label: "Мои брони", icon: NotebookText },
  { to: "/profile", label: "Профиль", icon: UserRound },
] as const;

function BottomNav() {
  return (
    <nav
      aria-label="Основная навигация"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/90 backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
    >
      <div className="mx-auto grid max-w-md grid-cols-4">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            activeOptions={{ exact: to === "/" }}
            className="group flex flex-col items-center gap-1 py-2.5 text-muted-foreground transition-colors"
            activeProps={{ className: "text-gold" }}
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-8 w-14 items-center justify-center rounded-full transition-colors ${
                    isActive ? "bg-gold/10" : "group-active:bg-accent"
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={isActive ? 2.2 : 1.8} />
                </span>
                <span className="text-[10px] font-semibold tracking-wide">{label}</span>
              </>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
}

function AppHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-md items-center justify-between px-5 py-4">
        <div className="min-w-0">
          <p className="font-display text-lg font-semibold tracking-[0.18em] text-foreground">
            MARIMAR
          </p>
          <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Private Sauna · Almaty
          </p>
        </div>
        <span className="flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-[11px] font-semibold text-muted-foreground">
          <span className="status-dot h-1.5 w-1.5 rounded-full bg-gold" />
          Открыто
        </span>
      </div>
    </header>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <BookingProvider>
        <div className="min-h-screen bg-background">
          <AppHeader />
          <main className="pb-28">
            <Outlet />
          </main>
          <BottomNav />
        </div>
      </BookingProvider>
    </QueryClientProvider>
  );
}
