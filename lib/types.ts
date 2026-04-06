export type Channel = 'email' | 'sms' | 'whatsapp';

export const CHANNEL_LABELS: Record<Channel, string> = {
  email: 'Email',
  sms: 'SMS',
  whatsapp: 'WhatsApp',
};

export type CampaignCadence = 'weekly' | 'monthly';
export type WeekDay = 'Sunday' | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface ChannelContent {
  channel: Channel;
  isEnabled: boolean;
  subject?: string;
  body: string;
  language: string;
}

export interface CampaignVariant {
  id: string;
  name: string;
  segmentId: string | null;
  segmentName: string | null;
  isEnabled: boolean;
  channels: ChannelContent[];
}

export interface ScheduledCampaign {
  id: string;
  title: string;
  sendTime: string;
  cadence: CampaignCadence;
  weeklyDay?: WeekDay;
  repeatEvery: number;
  nextSendDate?: string;
  isEnabled: boolean;
  supportedLanguages: string[];
  variants: CampaignVariant[];
}
