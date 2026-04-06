'use client';

/**
 * CampaignEditor
 *
 * Full-page overlay editor for Scheduled Campaigns.
 * Two-panel layout: left = config cards, right = phone preview placeholder.
 * Matches canary-prototype-core CampaignEditor.
 */

import { useState, useEffect, useRef } from 'react';
import Icon from '@mdi/react';
import { mdiArrowLeft } from '@mdi/js';
import {
  CanaryButton,
  CanaryInput,
  CanarySelect,
  CanaryInputDate,
  CanaryModal,
  ButtonType,
  ButtonColor,
  InputSize,
  InputType,
} from '@canary-ui/components';
import { useCampaignStore } from '@/lib/store';
import { Channel, ScheduledCampaign, WeekDay } from '@/lib/types';
import { EditorMessageCard } from './EditorMessageCard';

interface CampaignEditorProps {
  isOpen: boolean;
}

// ── Time Options ──────────────────────────────────────────────────────
const TIME_OPTIONS: { value: string; label: string }[] = [];
for (let h = 7; h <= 22; h++) {
  for (const m of [0, 30]) {
    if (h === 22 && m === 30) continue;
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    const ampm = h >= 12 ? 'PM' : 'AM';
    const label = `${hour}:${m === 0 ? '00' : '30'} ${ampm}`;
    TIME_OPTIONS.push({ value: label, label });
  }
}

const CADENCE_OPTIONS = [
  { value: 'weekly', label: 'Weeks' },
  { value: 'monthly', label: 'Months' },
];

const WEEKDAY_OPTIONS: { value: WeekDay; label: string }[] = [
  { value: 'Sunday', label: 'Sunday' },
  { value: 'Monday', label: 'Monday' },
  { value: 'Tuesday', label: 'Tuesday' },
  { value: 'Wednesday', label: 'Wednesday' },
  { value: 'Thursday', label: 'Thursday' },
  { value: 'Friday', label: 'Friday' },
  { value: 'Saturday', label: 'Saturday' },
];

const LANG_MAP: Record<string, string> = {
  en: 'English (EN) - Default',
  es: 'Espanol (ES)',
  fr: 'Francais (FR)',
};

export function CampaignEditor({ isOpen }: CampaignEditorProps) {
  const {
    campaigns,
    selectedCampaignId,
    closeCampaignEditor,
    createCampaign,
    updateCampaign,
    deleteCampaign,
    showToast,
  } = useCampaignStore();

  const leftPanelRef = useRef<HTMLDivElement>(null);
  const [activePreviewChannel, setActivePreviewChannel] = useState<Channel>('email');
  const [shouldRender, setShouldRender] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Outer slide animation
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => setAnimateIn(true), 10);
      return () => clearTimeout(timer);
    } else if (shouldRender) {
      setAnimateIn(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
        const store = useCampaignStore.getState();
        if (store.selectedCampaignId) {
          const campaign = store.campaigns.find((c) => c.id === store.selectedCampaignId);
          if (campaign && !campaign.title.trim()) {
            store.deleteCampaign(campaign.id);
          }
        }
        useCampaignStore.setState({ selectedCampaignId: null });
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  // Create mode: when opened with no selectedCampaignId, create a blank campaign
  useEffect(() => {
    if (isOpen && !selectedCampaignId) {
      const newId = `camp-${Date.now()}`;
      createCampaign({
        id: newId,
        title: '',
        sendTime: '9:00 AM',
        repeatEvery: 1,
        cadence: 'weekly',
        weeklyDay: 'Monday',
        endCondition: 'never',
        channels: [
          { channel: 'email', isEnabled: true, subject: '', body: '', language: 'en' },
          { channel: 'sms', isEnabled: false, body: '', language: 'en' },
        ],
        isEnabled: true,
        supportedLanguages: ['en'],
        segmentTarget: 'ALL_GUESTS',
      });
      useCampaignStore.setState({ selectedCampaignId: newId });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const campaign = selectedCampaignId
    ? campaigns.find((c) => c.id === selectedCampaignId)
    : null;

  if (!shouldRender) return null;
  if (!campaign) return null;

  const isWeekly = campaign.cadence === 'weekly';

  return (
    <div
      className={`absolute inset-0 flex flex-col bg-white shadow-2xl
        transition-transform duration-500 ease-out
        ${animateIn ? 'translate-x-0' : 'translate-x-full'}`}
      style={{ zIndex: 20 }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between bg-white shrink-0"
        style={{ padding: '16px 24px', borderBottom: '1px solid #E5E5E5' }}
      >
        <div className="flex items-center" style={{ gap: 16 }}>
          <CanaryButton
            type={ButtonType.ICON_SECONDARY}
            icon={<Icon path={mdiArrowLeft} size={0.85} />}
            onClick={closeCampaignEditor}
          />
          <h1 style={{ fontSize: 18, fontWeight: 500, color: '#000', margin: 0 }}>
            {campaign.title || 'New Campaign'}
          </h1>
        </div>
        <div className="flex items-center" style={{ gap: 8 }}>
          <CanaryButton
            type={ButtonType.PRIMARY}
            color={ButtonColor.DANGER}
            onClick={() => setShowDeleteConfirm(true)}
          >
            Delete
          </CanaryButton>
          <CanaryButton
            type={ButtonType.PRIMARY}
            onClick={() => {
              showToast('Campaign saved');
              closeCampaignEditor();
            }}
          >
            Save
          </CanaryButton>
        </div>
      </div>

      {/* Two-panel content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div
          ref={leftPanelRef}
          className="flex-1 overflow-auto"
          style={{ backgroundColor: '#FAFAFA', padding: 24 }}
        >
          <div className="flex flex-col" style={{ gap: 16, maxWidth: 662 }}>
            {/* Title Card */}
            <div style={{ backgroundColor: '#FFF', border: '1px solid #E5E5E5', borderRadius: 8, padding: 16 }}>
              <CanaryInput
                label="Title"
                size={InputSize.NORMAL}
                value={campaign.title}
                onChange={(e) => updateCampaign(campaign.id, { title: e.target.value })}
              />
            </div>

            {/* Scheduled Time Card */}
            <div style={{ backgroundColor: '#FFF', border: '1px solid #E5E5E5', borderRadius: 8, padding: 16 }}>
              <h3 style={{ fontSize: 18, fontWeight: 500, color: '#000', margin: '0 0 4px 0' }}>
                Scheduled time
              </h3>
              <p style={{ fontSize: 14, color: '#666', margin: '0 0 16px 0' }}>
                Choose a schedule to send messages to in-house guests and same-day arrivals
              </p>
              <div className="flex flex-col" style={{ gap: 12 }}>
                {/* Send at */}
                <div className="flex items-center" style={{ gap: 16 }}>
                  <div style={{ width: 120, flexShrink: 0, fontSize: 14, color: '#000' }}>Send at</div>
                  <div style={{ flex: 1 }}>
                    <CanarySelect
                      size={InputSize.NORMAL}
                      value={campaign.sendTime}
                      options={TIME_OPTIONS}
                      onChange={(e) => updateCampaign(campaign.id, { sendTime: e.target.value })}
                    />
                  </div>
                </div>
                {/* Repeat every */}
                <div className="flex items-center" style={{ gap: 16 }}>
                  <div style={{ width: 120, flexShrink: 0, fontSize: 14, color: '#000' }}>Repeat every</div>
                  <div className="flex items-center" style={{ gap: 8, flex: 1 }}>
                    <div style={{ width: 80 }}>
                      <CanaryInput
                        type={InputType.NUMBER}
                        size={InputSize.NORMAL}
                        value={String(campaign.repeatEvery)}
                        onChange={(e) => updateCampaign(campaign.id, { repeatEvery: Math.max(1, parseInt(e.target.value) || 1) })}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <CanarySelect
                        size={InputSize.NORMAL}
                        value={campaign.cadence}
                        options={CADENCE_OPTIONS}
                        onChange={(e) => updateCampaign(campaign.id, {
                          cadence: e.target.value as 'weekly' | 'monthly',
                          ...(e.target.value === 'weekly'
                            ? { weeklyDay: 'Monday', monthlyDay: undefined, monthlyWeekday: undefined, monthlyWeekdayOccurrence: undefined }
                            : { weeklyDay: undefined, monthlyDay: 1 }),
                        })}
                      />
                    </div>
                  </div>
                </div>
                {/* Repeat on */}
                <div className="flex items-start" style={{ gap: 16 }}>
                  <div style={{ width: 120, flexShrink: 0, fontSize: 14, color: '#000', paddingTop: 8 }}>Repeat on</div>
                  <div style={{ flex: 1 }}>
                    {isWeekly ? (
                      <CanarySelect
                        size={InputSize.NORMAL}
                        value={campaign.weeklyDay || 'Monday'}
                        options={WEEKDAY_OPTIONS}
                        onChange={(e) => updateCampaign(campaign.id, { weeklyDay: e.target.value as WeekDay })}
                      />
                    ) : (
                      <CanaryInputDate
                        size={InputSize.NORMAL}
                        value=""
                        onChange={(dateStr) => {
                          const d = new Date(dateStr);
                          if (!isNaN(d.getTime())) {
                            updateCampaign(campaign.id, { monthlyDay: d.getDate() });
                          }
                        }}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Translations Card */}
            <div
              className="flex items-center justify-between"
              style={{ backgroundColor: '#FFF', border: '1px solid #E5E5E5', borderRadius: 8, padding: 16 }}
            >
              <h3 style={{ fontSize: 18, fontWeight: 500, color: '#000', margin: 0 }}>Translations</h3>
              <div style={{ width: 195 }}>
                <CanarySelect
                  size={InputSize.NORMAL}
                  value="en"
                  options={campaign.supportedLanguages.map((lang) => ({
                    value: lang,
                    label: LANG_MAP[lang] || lang,
                  }))}
                  onChange={() => {}}
                />
              </div>
            </div>

            {/* Message Card with segment accordion */}
            <EditorMessageCard
              campaign={campaign}
              onActiveChannelChange={setActivePreviewChannel}
              onChannelContentChange={(channel, updates) => {
                const exists = campaign.channels.some((c) => c.channel === channel);
                const updatedChannels = exists
                  ? campaign.channels.map((c) => c.channel === channel ? { ...c, ...updates } : c)
                  : [...campaign.channels, { channel, isEnabled: false, body: '', language: 'en', ...updates }];
                updateCampaign(campaign.id, { channels: updatedChannels });
              }}
              onChannelToggle={(channel, enabled) => {
                const exists = campaign.channels.some((c) => c.channel === channel);
                const updatedChannels = exists
                  ? campaign.channels.map((c) => c.channel === channel ? { ...c, isEnabled: enabled } : c)
                  : [...campaign.channels, { channel, isEnabled: enabled, body: '', language: 'en' }];
                updateCampaign(campaign.id, { channels: updatedChannels });
              }}
              onSegmentVariantsChange={(variants) => {
                updateCampaign(campaign.id, { segmentVariants: variants });
              }}
            />
          </div>
        </div>

        {/* Right panel — preview */}
        <div
          className="flex-1 flex items-center justify-center overflow-hidden"
          style={{ backgroundColor: '#F0F0F0', borderLeft: '1px solid #E5E5E5' }}
        >
          {/* Phone preview placeholder */}
          <div
            style={{
              width: 320,
              height: 568,
              backgroundColor: '#FFF',
              borderRadius: 32,
              border: '8px solid #333',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Phone status bar */}
            <div style={{ height: 44, backgroundColor: '#333', borderRadius: '24px 24px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ width: 80, height: 24, backgroundColor: '#000', borderRadius: 12 }} />
            </div>
            {/* Phone content */}
            <div style={{ flex: 1, padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ fontSize: 11, color: '#999', textAlign: 'center', marginTop: 8 }}>
                {activePreviewChannel === 'email' ? 'Email Preview' : activePreviewChannel === 'sms' ? 'SMS Preview' : `${activePreviewChannel.charAt(0).toUpperCase() + activePreviewChannel.slice(1)} Preview`}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{
                  maxWidth: '90%',
                  padding: '12px 16px',
                  backgroundColor: activePreviewChannel === 'whatsapp' ? '#DCF8C6' : activePreviewChannel === 'sms' ? '#E8E8E8' : '#F5F5F5',
                  borderRadius: 12,
                  fontSize: 13,
                  lineHeight: '18px',
                  color: '#333',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}>
                  {(() => {
                    const ch = campaign.channels.find((c) => c.channel === activePreviewChannel);
                    if (!ch) return 'No content for this channel';
                    if (activePreviewChannel === 'email' && ch.subject) {
                      return (
                        <>
                          <div style={{ fontWeight: 600, marginBottom: 8 }}>{ch.subject}</div>
                          <div>{ch.body || 'No body content'}</div>
                        </>
                      );
                    }
                    return ch.body || 'No content';
                  })()}
                </div>
              </div>
            </div>
            {/* Phone bottom bar */}
            <div style={{ height: 24, display: 'flex', justifyContent: 'center', paddingBottom: 8 }}>
              <div style={{ width: 120, height: 4, backgroundColor: '#333', borderRadius: 2 }} />
            </div>
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      <CanaryModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        title="Delete campaign"
        size="small"
      >
        <p style={{ fontSize: 14, color: '#333', margin: '0 0 24px', lineHeight: '1.5' }}>
          Are you sure you want to delete this campaign? This action cannot be undone. You can always create a new one later.
        </p>
        <div className="flex justify-end" style={{ gap: 8 }}>
          <CanaryButton
            type={ButtonType.OUTLINED}
            onClick={() => setShowDeleteConfirm(false)}
          >
            Cancel
          </CanaryButton>
          <CanaryButton
            type={ButtonType.PRIMARY}
            color={ButtonColor.DANGER}
            onClick={() => {
              deleteCampaign(campaign.id);
              showToast('Campaign deleted');
              setShowDeleteConfirm(false);
              closeCampaignEditor();
            }}
          >
            Delete
          </CanaryButton>
        </div>
      </CanaryModal>
    </div>
  );
}
