'use client';

import { useState } from 'react';
import Icon from '@mdi/react';
import {
  mdiClockOutline,
  mdiRefresh,
  mdiAccountGroupOutline,
  mdiAccountOutline,
  mdiPlusOutline,
} from '@mdi/js';
import {
  CanarySwitch,
  CanaryButton,
  CanaryModal,
  CanarySelect,
  ButtonType,
  ButtonSize,
  InputSize,
} from '@canary-ui/components';
import { ScheduledCampaign, CampaignVariant } from '@/lib/types';
import { AVAILABLE_SEGMENTS } from '@/data/segments';
import { useCampaignStore } from '@/lib/store';
import VariantRow from './VariantRow';

interface CampaignCardProps {
  campaign: ScheduledCampaign;
}

const CADENCE_LABELS: Record<string, string> = {
  weekly: 'Weekly',
  monthly: 'Monthly',
};

export default function CampaignCard({ campaign }: CampaignCardProps) {
  const { toggleCampaignEnabled, toggleVariantEnabled, addVariant, removeVariant } = useCampaignStore();
  const [showAddSegment, setShowAddSegment] = useState(false);
  const [selectedSegmentId, setSelectedSegmentId] = useState('');

  const segmentVariants = campaign.variants.filter((v) => v.segmentId !== null);
  const defaultVariant = campaign.variants.find((v) => v.segmentId === null);
  const hasSegments = segmentVariants.length > 0;

  const cadenceLabel = `${CADENCE_LABELS[campaign.cadence]}${campaign.weeklyDay ? ` · ${campaign.weeklyDay}` : ''}`;
  const segmentLabel = hasSegments
    ? `${segmentVariants.length} segment${segmentVariants.length > 1 ? 's' : ''}`
    : 'All Guests';
  const segmentIcon = hasSegments ? mdiAccountOutline : mdiAccountGroupOutline;

  // Filter out segments already in use
  const usedSegmentIds = new Set(segmentVariants.map((v) => v.segmentId));
  const availableSegments = AVAILABLE_SEGMENTS.filter((s) => !usedSegmentIds.has(s.id));

  const handleAddVariant = () => {
    const segment = AVAILABLE_SEGMENTS.find((s) => s.id === selectedSegmentId);
    if (!segment) return;

    const newVariant: CampaignVariant = {
      id: `var-${Date.now()}`,
      name: segment.name,
      segmentId: segment.id,
      segmentName: segment.name,
      isEnabled: true,
      channels: [
        { channel: 'email', isEnabled: true, subject: '', body: `Hi {{ primary_guest.first_name }}, a special message for ${segment.name} guests at {{ hotel.name }}.`, language: 'en' },
      ],
    };

    addVariant(campaign.id, newVariant);
    setShowAddSegment(false);
    setSelectedSegmentId('');
  };

  return (
    <div
      style={{
        backgroundColor: '#FFF',
        border: '1px solid #E5E5E5',
        borderRadius: 8,
        padding: 24,
      }}
    >
      {/* Title + toggle */}
      <div className="flex items-center justify-between">
        <h4 style={{ fontSize: 18, fontWeight: 500, color: '#000', margin: 0 }}>
          {campaign.title}
        </h4>
        <CanarySwitch
          checked={campaign.isEnabled}
          onChange={() => toggleCampaignEnabled(campaign.id)}
        />
      </div>

      {/* Info row 1: cadence */}
      <div className="flex items-center" style={{ gap: 4, marginTop: 8, color: '#666', fontSize: 14 }}>
        <Icon path={mdiClockOutline} size={0.75} color="#666" />
        <span>{cadenceLabel}</span>
        <span style={{ margin: '0 4px' }}>·</span>
        <span>send at {campaign.sendTime}</span>
      </div>

      {/* Info row 2: next send + audience */}
      <div className="flex items-center" style={{ gap: 16, marginTop: 4, color: '#666', fontSize: 14 }}>
        {campaign.nextSendDate && (
          <div className="flex items-center" style={{ gap: 4 }}>
            <Icon path={mdiRefresh} size={0.75} color="#666" />
            <span>Next send: {campaign.nextSendDate}</span>
          </div>
        )}
        <div className="flex items-center" style={{ gap: 4 }}>
          <Icon path={segmentIcon} size={0.75} color="#666" />
          <span>{segmentLabel}</span>
        </div>
      </div>

      {/* Variants section */}
      {campaign.isEnabled && (
        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Segment variants first */}
          {segmentVariants.map((variant, idx) => (
            <VariantRow
              key={variant.id}
              variant={variant}
              isDefault={false}
              isFirst={idx === 0}
              onToggleEnabled={() => toggleVariantEnabled(campaign.id, variant.id)}
              onRemove={() => removeVariant(campaign.id, variant.id)}
            />
          ))}

          {/* Default variant last */}
          {defaultVariant && (
            <VariantRow
              key={defaultVariant.id}
              variant={defaultVariant}
              isDefault={true}
              isFirst={segmentVariants.length === 0}
              onToggleEnabled={() => toggleVariantEnabled(campaign.id, defaultVariant.id)}
            />
          )}

          {/* Add segment button */}
          {availableSegments.length > 0 && (
            <CanaryButton
              type={ButtonType.OUTLINED}
              size={ButtonSize.COMPACT}
              icon={<Icon path={mdiPlusOutline} size={0.7} />}
              onClick={() => setShowAddSegment(true)}
            >
              Add Segment
            </CanaryButton>
          )}
        </div>
      )}

      {/* Add segment modal */}
      <CanaryModal
        isOpen={showAddSegment}
        onClose={() => { setShowAddSegment(false); setSelectedSegmentId(''); }}
        title="Add segment variant"
        size="small"
      >
        <p style={{ fontSize: 14, color: '#333', margin: '0 0 16px', lineHeight: '1.5' }}>
          Select a segment to create a targeted variant of this campaign. Guests matching the segment will receive this variant instead of the default.
        </p>
        <CanarySelect
          label="Segment"
          size={InputSize.NORMAL}
          value={selectedSegmentId}
          placeholder="Select a segment"
          options={availableSegments.map((s) => ({ value: s.id, label: `${s.name} — ${s.description}` }))}
          onChange={(e) => setSelectedSegmentId(e.target.value)}
        />
        <div className="flex justify-end" style={{ gap: 8, marginTop: 24 }}>
          <CanaryButton type={ButtonType.OUTLINED} onClick={() => { setShowAddSegment(false); setSelectedSegmentId(''); }}>
            Cancel
          </CanaryButton>
          <CanaryButton
            type={ButtonType.PRIMARY}
            onClick={handleAddVariant}
          >
            Add Variant
          </CanaryButton>
        </div>
      </CanaryModal>
    </div>
  );
}
