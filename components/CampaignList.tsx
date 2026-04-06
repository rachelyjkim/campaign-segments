'use client';

import { CanaryButton, ButtonType } from '@canary-ui/components';
import { useCampaignStore } from '@/lib/store';
import CampaignCard from './CampaignCard';

export default function CampaignList() {
  const { campaigns } = useCampaignStore();

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          backgroundColor: '#F0F0F0',
          borderRadius: 4,
          padding: 24,
        }}
      >
        <div className="flex items-start justify-between">
          <div className="flex flex-col" style={{ gap: 8, maxWidth: 700, flex: 1 }}>
            {campaigns.map((campaign, idx) => (
              <div
                key={campaign.id}
                className="campaign-item-animate"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <CampaignCard campaign={campaign} />
              </div>
            ))}
          </div>
          <div className="shrink-0" style={{ marginLeft: 16 }}>
            <CanaryButton type={ButtonType.PRIMARY}>
              New message
            </CanaryButton>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes campaignFadeInSlide {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .campaign-item-animate {
          opacity: 0;
          animation: campaignFadeInSlide 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
