import { createFileRoute } from "@tanstack/react-router";
import { Bell, ChevronRight, CircleHelp, Phone, ShieldCheck, UserRound } from "lucide-react";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "Профиль — MariMar Private Sauna" },
      { name: "description", content: "Ваш профиль MariMar." },
      { property: "og:title", content: "Профиль — MariMar Private Sauna" },
      { property: "og:description", content: "Ваш профиль MariMar." },
    ],
  }),
  component: ProfilePage,
});

function ProfilePage() {
  return (
    <div className="mx-auto max-w-md px-5 pt-8">
      <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-gold">
        Аккаунт
      </p>
      <h1 className="mt-2 font-display text-2xl font-semibold tracking-tight text-foreground">
        Профиль
      </h1>

      <div className="surface-card mt-6 flex items-center gap-4 p-5">
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-gold/25 bg-gold/10">
          <UserRound className="h-6 w-6 text-gold" />
        </span>
        <div className="min-w-0">
          <p className="text-sm font-bold text-foreground">Гость</p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Войдите, чтобы управлять бронированиями
          </p>
        </div>
      </div>

      <div className="surface-card mt-5 divide-y divide-border overflow-hidden">
        {[
          { icon: Bell, label: "Уведомления" },
          { icon: ShieldCheck, label: "Конфиденциальность" },
          { icon: Phone, label: "Связаться с нами" },
          { icon: CircleHelp, label: "Помощь" },
        ].map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex w-full items-center gap-3.5 px-5 py-4 text-left transition-colors active:bg-accent"
          >
            <Icon className="h-4.5 w-4.5 shrink-0 text-gold" />
            <span className="min-w-0 flex-1 truncate text-sm font-semibold text-foreground">
              {label}
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        ))}
      </div>
    </div>
  );
}
