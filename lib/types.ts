/**
 * Types for Campaign Segments prototype.
 * Mirrors canary-prototype-core guest-journey types for campaigns + segments.
 */

// ── Channels ────────────────────────────────────────────────────────────

export type Channel = 'email' | 'sms' | 'whatsapp' | 'expedia' | 'booking';

export const CHANNEL_LABELS: Record<Channel, string> = {
  email: 'Email',
  sms: 'SMS',
  whatsapp: 'WhatsApp',
  expedia: 'Expedia',
  booking: 'Booking',
};

// ── Channel Content ─────────────────────────────────────────────────────

export interface ChannelContent {
  channel: Channel;
  isEnabled: boolean;
  subject?: string; // Email only
  body: string;
  language: string; // "en", "es", etc.
}

// ── Segment Variant ─────────────────────────────────────────────────────

export interface MessageSegmentVariant {
  segmentId: string;
  isEnabled: boolean;
  channels: ChannelContent[];
}

// ── Scheduled Campaigns ─────────────────────────────────────────────────

export type CampaignCadence = 'weekly' | 'monthly';

export type WeekDay = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export type SegmentTargetType = 'ALL_GUESTS' | 'SPECIFIC_SEGMENT';

export interface ScheduledCampaign {
  id: string;
  title: string;
  sendTime: string;
  repeatEvery: number;
  cadence: CampaignCadence;
  weeklyDay?: WeekDay;
  monthlyDay?: number;
  monthlyWeekday?: WeekDay;
  monthlyWeekdayOccurrence?: number;
  endCondition: 'never' | 'after_count' | 'on_date';
  endAfterCount?: number;
  endOnDate?: string;
  channels: ChannelContent[]; // "All Guests" default content
  segmentVariants?: MessageSegmentVariant[]; // Per-segment content overrides
  isEnabled: boolean;
  supportedLanguages: string[];
  segmentTarget: SegmentTargetType;
  segmentId?: string;
  nextSendDate?: string;
  lastRunAt?: string;
}

// ── Segments ────────────────────────────────────────────────────────────

export interface Segment {
  id: string;
  name: string;
  description?: string;
  estimatedGuests?: number;
}

// ── Tab State ───────────────────────────────────────────────────────────

export type GuestJourneyTab = 'reservation-messages' | 'scheduled-campaigns';
