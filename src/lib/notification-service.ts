/**
 * NotificationService — transport-agnostic abstraction for outbound messages.
 *
 * UI code calls `notificationService.notify(event)` and never talks to a
 * concrete provider (Web Push, Telegram bot, SMS gateway) directly. Channels
 * are registered at startup, so adding a real provider later is a single
 * `registerChannel()` call with no UI changes.
 */

export type NotificationChannelId = "push" | "telegram" | "sms" | "console";

export type NotificationEventType =
  | "booking_created"
  | "booking_reminder"
  | "booking_cancelled"
  | "custom";

export interface NotificationRecipient {
  name?: string;
  phone?: string;
  telegram?: string;
  pushToken?: string;
}

export interface NotificationEvent {
  type: NotificationEventType;
  title: string;
  body: string;
  recipient?: NotificationRecipient;
  data?: Record<string, unknown>;
  channels?: NotificationChannelId[];
}

export interface NotificationChannel {
  id: NotificationChannelId;
  isAvailable(): boolean | Promise<boolean>;
  send(event: NotificationEvent): Promise<void>;
}

export interface NotificationResult {
  channel: NotificationChannelId;
  ok: boolean;
  error?: string;
}

/** Fallback channel — keeps the flow observable until real providers exist. */
const consoleChannel: NotificationChannel = {
  id: "console",
  isAvailable: () => true,
  async send(event) {
    console.info(`[notification:${event.type}] ${event.title} — ${event.body}`);
  },
};

class NotificationService {
  private channels = new Map<NotificationChannelId, NotificationChannel>();

  constructor(initial: NotificationChannel[] = []) {
    for (const channel of initial) this.registerChannel(channel);
  }

  registerChannel(channel: NotificationChannel): void {
    this.channels.set(channel.id, channel);
  }

  unregisterChannel(id: NotificationChannelId): void {
    this.channels.delete(id);
  }

  listChannels(): NotificationChannelId[] {
    return [...this.channels.keys()];
  }

  async notify(event: NotificationEvent): Promise<NotificationResult[]> {
    const targets = [...this.channels.values()].filter(
      (c) => !event.channels || event.channels.includes(c.id),
    );

    return Promise.all(
      targets.map(async (channel): Promise<NotificationResult> => {
        try {
          if (!(await channel.isAvailable())) {
            return { channel: channel.id, ok: false, error: "unavailable" };
          }
          await channel.send(event);
          return { channel: channel.id, ok: true };
        } catch (error) {
          return {
            channel: channel.id,
            ok: false,
            error: error instanceof Error ? error.message : String(error),
          };
        }
      }),
    );
  }
}

export const notificationService = new NotificationService([consoleChannel]);
export type { NotificationService };
