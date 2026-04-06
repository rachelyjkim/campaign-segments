'use client';

import {
  CanaryAppShell,
  CanaryTabs,
  SidebarVariant,
} from '@canary-ui/components';
import CampaignList from '@/components/CampaignList';

export default function Home() {
  const tabs = [
    { id: 'reservation-messages', label: 'Reservation messages', content: <></> },
    { id: 'scheduled-campaigns', label: 'Scheduled campaigns', content: <></> },
  ];

  return (
    <CanaryAppShell
      sidebarVariant={SidebarVariant.SETTINGS}
      sidebarTitle="Settings"
      selectedSidebarItemId="guest-journey"
      propertyName="Travelodge London City"
      userProfile={{ name: 'Rachel Kim', role: 'Product Manager' }}
      reservationStatus={{ label: 'Reservations', isConnected: true }}
    >
      <div className="relative h-full overflow-hidden">
        {/* Page header */}
        <div style={{ padding: '24px 24px 0' }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: '#000', marginBottom: 16 }}>
            Guest Journey
          </h1>
          <CanaryTabs
            tabs={tabs}
            variant="text"
            defaultTab="scheduled-campaigns"
            onChange={() => {}}
          />
        </div>

        {/* Campaign list */}
        <div className="overflow-auto" style={{ height: 'calc(100% - 100px)' }}>
          <CampaignList />
        </div>
      </div>
    </CanaryAppShell>
  );
}
