import { create } from 'zustand';
import { ScheduledCampaign, CampaignVariant, ChannelContent } from './types';
import { mockCampaigns } from '@/data/campaigns';

interface CampaignState {
  campaigns: ScheduledCampaign[];
  selectedCampaignId: string | null;

  toggleCampaignEnabled: (campaignId: string) => void;
  toggleVariantEnabled: (campaignId: string, variantId: string) => void;
  addVariant: (campaignId: string, variant: CampaignVariant) => void;
  removeVariant: (campaignId: string, variantId: string) => void;
}

export const useCampaignStore = create<CampaignState>((set) => ({
  campaigns: mockCampaigns,
  selectedCampaignId: null,

  toggleCampaignEnabled: (campaignId) =>
    set((state) => ({
      campaigns: state.campaigns.map((c) =>
        c.id === campaignId ? { ...c, isEnabled: !c.isEnabled } : c
      ),
    })),

  toggleVariantEnabled: (campaignId, variantId) =>
    set((state) => ({
      campaigns: state.campaigns.map((c) =>
        c.id === campaignId
          ? {
              ...c,
              variants: c.variants.map((v) =>
                v.id === variantId ? { ...v, isEnabled: !v.isEnabled } : v
              ),
            }
          : c
      ),
    })),

  addVariant: (campaignId, variant) =>
    set((state) => ({
      campaigns: state.campaigns.map((c) =>
        c.id === campaignId
          ? { ...c, variants: [variant, ...c.variants.filter((v) => v.segmentId !== null), ...c.variants.filter((v) => v.segmentId === null)] }
          : c
      ),
    })),

  removeVariant: (campaignId, variantId) =>
    set((state) => ({
      campaigns: state.campaigns.map((c) =>
        c.id === campaignId
          ? { ...c, variants: c.variants.filter((v) => v.id !== variantId) }
          : c
      ),
    })),
}));
