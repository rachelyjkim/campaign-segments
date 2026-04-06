/**
 * Campaign Segments Store (Zustand)
 *
 * State for campaigns, segments, editor overlay, and toast.
 */

import { create } from 'zustand';
import {
  ScheduledCampaign,
  Segment,
  GuestJourneyTab,
  ChannelContent,
  MessageSegmentVariant,
} from './types';
import { mockCampaigns } from '@/data/campaigns';
import { mockSegments } from '@/data/segments';

interface CampaignState {
  // Data
  campaigns: ScheduledCampaign[];
  segments: Segment[];

  // UI State
  activeTab: GuestJourneyTab;
  selectedCampaignId: string | null;
  isCampaignEditorOpen: boolean;

  // Toast
  toastMessage: string | null;
  showToast: (message: string) => void;
  clearToast: () => void;

  // Tab Actions
  setActiveTab: (tab: GuestJourneyTab) => void;

  // Campaign Actions
  toggleCampaignEnabled: (campaignId: string) => void;
  updateCampaign: (campaignId: string, updates: Partial<ScheduledCampaign>) => void;
  deleteCampaign: (campaignId: string) => void;
  createCampaign: (campaign: ScheduledCampaign) => void;
  openCampaignEditor: (campaignId?: string) => void;
  closeCampaignEditor: () => void;
}

export const useCampaignStore = create<CampaignState>((set) => ({
  campaigns: mockCampaigns,
  segments: mockSegments,

  activeTab: 'scheduled-campaigns',
  selectedCampaignId: null,
  isCampaignEditorOpen: false,

  // Toast
  toastMessage: null,
  showToast: (message) => {
    set({ toastMessage: message });
    setTimeout(() => set({ toastMessage: null }), 3000);
  },
  clearToast: () => set({ toastMessage: null }),

  // Tab Actions
  setActiveTab: (tab) => set({ activeTab: tab }),

  // Campaign Actions
  toggleCampaignEnabled: (campaignId) =>
    set((state) => ({
      campaigns: state.campaigns.map((c) =>
        c.id === campaignId ? { ...c, isEnabled: !c.isEnabled } : c
      ),
    })),

  updateCampaign: (campaignId, updates) =>
    set((state) => ({
      campaigns: state.campaigns.map((c) =>
        c.id === campaignId ? { ...c, ...updates } : c
      ),
    })),

  deleteCampaign: (campaignId) =>
    set((state) => ({
      campaigns: state.campaigns.filter((c) => c.id !== campaignId),
    })),

  createCampaign: (campaign) =>
    set((state) => ({
      campaigns: [...state.campaigns, campaign],
    })),

  openCampaignEditor: (campaignId) =>
    set({
      selectedCampaignId: campaignId || null,
      isCampaignEditorOpen: true,
    }),

  closeCampaignEditor: () =>
    set({ isCampaignEditorOpen: false }),
}));
