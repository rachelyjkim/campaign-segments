'use client';

/**
 * Campaign Segments Prototype
 *
 * Guest Journey header -> tabs -> Scheduled campaigns tab active ->
 * campaign list with "New message" button.
 * Clicking a card opens the full-page editor overlay.
 */

import { useState } from 'react';
import Icon from '@mdi/react';
import { mdiHistory } from '@mdi/js';
import {
  CanaryAppShell,
  CanaryButton,
  CanaryTabs,
  SidebarVariant,
  ButtonType,
  IconPosition,
} from '@canary-ui/components';
import { CampaignList } from '@/components/CampaignList';
import { CampaignEditor } from '@/components/CampaignEditor';
import { useCampaignStore } from '@/lib/store';
import { GuestJourneyTab } from '@/lib/types';

const journeyTabs = [
  { id: 'reservation-messages', label: 'Reservation messages', content: <></> },
  { id: 'scheduled-campaigns', label: 'Scheduled campaigns', content: <></> },
];

export default function Home() {
  const {
    campaigns,
    activeTab,
    setActiveTab,
    isCampaignEditorOpen,
    toggleCampaignEnabled,
    openCampaignEditor,
    toastMessage,
  } = useCampaignStore();

  return (
    <CanaryAppShell
      sidebarVariant={SidebarVariant.SETTINGS}
      sidebarTitle="Settings"
      selectedSidebarItemId="guest-journey"
      propertyName="Statler New York"
      userProfile={{ name: 'Theresa Webb', role: 'Front desk', avatarUrl: 'https://i.pravatar.cc/150?img=5' }}
      reservationStatus={{ label: 'Reservations', isConnected: true }}
      contentPadding="none"
      contentBackground="#FAFAFA"
    >
      <div className="relative flex flex-col h-full overflow-hidden">
        {/* Guest Journey Header */}
        <div
          className="flex items-center justify-between bg-white"
          style={{ padding: '16px 24px 16px 32px', borderBottom: '1px solid #E5E5E5' }}
        >
          <h1 style={{ fontSize: '18px', fontWeight: 500, color: '#000000', margin: 0 }}>
            Guest Journey
          </h1>
          <CanaryButton
            type={ButtonType.OUTLINED}
            icon={<Icon path={mdiHistory} size={0.8} />}
            iconPosition={IconPosition.LEFT}
            onClick={() => {}}
          >
            Activity log
          </CanaryButton>
        </div>

        {/* Tabs */}
        <div style={{ padding: '24px 24px 0 24px' }}>
          <CanaryTabs
            tabs={journeyTabs}
            variant="text"
            defaultTab={activeTab}
            onChange={(tabId) => setActiveTab(tabId as GuestJourneyTab)}
          />
        </div>

        {/* Tab content */}
        {activeTab === 'reservation-messages' && (
          <div className="flex-1 flex items-center justify-center" style={{ color: '#999', fontSize: 14 }}>
            Reservation messages timeline (not included in this prototype)
          </div>
        )}

        {activeTab === 'scheduled-campaigns' && (
          <div className="flex-1 overflow-auto" style={{ backgroundColor: '#FAFAFA' }}>
            <CampaignList
              campaigns={campaigns}
              onSelectCampaign={(id) => openCampaignEditor(id)}
              onToggleEnabled={toggleCampaignEnabled}
              onNewCampaign={() => openCampaignEditor()}
            />
          </div>
        )}

        {/* Full-page editor overlay */}
        <CampaignEditor isOpen={isCampaignEditorOpen} />

        {/* Toast */}
        {toastMessage && (
          <div
            style={{
              position: 'fixed',
              bottom: 24,
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#333',
              color: '#FFF',
              padding: '10px 20px',
              borderRadius: 8,
              fontSize: 14,
              zIndex: 100,
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            }}
          >
            {toastMessage}
          </div>
        )}
      </div>
    </CanaryAppShell>
  );
}
