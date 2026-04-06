'use client';

import { useState } from 'react';
import Icon from '@mdi/react';
import {
  mdiChevronDown,
  mdiChevronUp,
  mdiEmailOutline,
  mdiMessageOutline,
  mdiWhatsapp,
  mdiDeleteOutline,
} from '@mdi/js';
import {
  CanaryTag,
  CanaryTabs,
  CanarySwitch,
  CanarySelect,
  CanaryButton,
  TagSize,
  InputSize,
  ButtonType,
  ButtonSize,
  ButtonColor,
} from '@canary-ui/components';
import { CampaignVariant, CHANNEL_LABELS, Channel } from '@/lib/types';

interface VariantRowProps {
  variant: CampaignVariant;
  isDefault: boolean;
  isFirst: boolean;
  onToggleEnabled: () => void;
  onRemove?: () => void;
}

const CUSTOM_TAG_COLOR = {
  fontColor: '#2858C4',
  backgroundColor: '#EAEEF9',
  borderColor: '#93ABE1',
};
const DEFAULT_TAG_COLOR = {
  fontColor: '#2D2D2D',
  backgroundColor: '#EAEAEA',
  borderColor: '#9F9F9F',
};

const LANG_MAP: Record<string, string> = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
};

function renderBodyPreview(text: string) {
  const parts = text.split(/({{[^}]+}})/g);
  return parts.map((part, i) => {
    if (part.startsWith('{{') && part.endsWith('}}')) {
      const tagPath = part.replace(/[{}\s]/g, '');
      const isUdf = tagPath.includes('user_defined_fields');
      return (
        <span
          key={i}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            padding: '1px 5px',
            borderRadius: 3,
            backgroundColor: isUdf ? '#EAEEF9' : '#F0F0F0',
            border: `1px solid ${isUdf ? '#93ABE1' : '#E5E5E5'}`,
            fontSize: 12,
            fontWeight: 500,
            color: isUdf ? '#2858C4' : '#666',
            margin: '0 1px',
            whiteSpace: 'nowrap',
          }}
        >
          {tagPath.split('.').pop()}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function VariantRow({
  variant,
  isDefault,
  isFirst,
  onToggleEnabled,
  onRemove,
}: VariantRowProps) {
  const [expanded, setExpanded] = useState(isFirst);
  const enabledChannels = variant.channels.filter((c) => c.isEnabled);
  const [activeChannel, setActiveChannel] = useState<Channel>(
    enabledChannels[0]?.channel || 'email'
  );

  const activeContent = variant.channels.find((c) => c.channel === activeChannel);

  const channelTabs = enabledChannels.map((ch) => ({
    id: ch.channel,
    label: CHANNEL_LABELS[ch.channel],
    content: <></>,
  }));

  return (
    <div
      style={{
        border: '1px solid #E5E5E5',
        borderRadius: 8,
        overflow: 'hidden',
      }}
    >
      {/* Variant header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          backgroundColor: expanded ? '#FAFAFA' : '#FFF',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Icon
            path={expanded ? mdiChevronUp : mdiChevronDown}
            size={0.8}
            color="#666"
          />
          <span style={{ fontWeight: 500, color: '#000', fontSize: 14 }}>
            {variant.name}
          </span>
          <CanaryTag
            label={isDefault ? 'Default' : variant.segmentName || 'Segment'}
            size={TagSize.COMPACT}
            customColor={isDefault ? DEFAULT_TAG_COLOR : CUSTOM_TAG_COLOR}
          />
        </div>

        <div
          style={{ display: 'flex', alignItems: 'center', gap: 12 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Channel icons */}
          <div style={{ display: 'flex', gap: 6 }}>
            {variant.channels.some((c) => c.channel === 'email' && c.isEnabled) && (
              <Icon path={mdiEmailOutline} size={0.7} color="#666" />
            )}
            {variant.channels.some((c) => c.channel === 'sms' && c.isEnabled) && (
              <Icon path={mdiMessageOutline} size={0.7} color="#666" />
            )}
            {variant.channels.some((c) => c.channel === 'whatsapp' && c.isEnabled) && (
              <Icon path={mdiWhatsapp} size={0.7} color="#666" />
            )}
          </div>
          {!isDefault && onRemove && (
            <CanaryButton
              type={ButtonType.ICON_SECONDARY}
              size={ButtonSize.COMPACT}
              color={ButtonColor.DANGER}
              icon={<Icon path={mdiDeleteOutline} size={0.7} />}
              onClick={onRemove}
            />
          )}
          <CanarySwitch checked={variant.isEnabled} onChange={onToggleEnabled} />
        </div>
      </div>

      {/* Expanded content */}
      {expanded && variant.isEnabled && enabledChannels.length > 0 && (
        <div
          style={{
            borderTop: '1px solid #E5E5E5',
            padding: '16px 16px 8px 16px',
          }}
        >
          {/* Channel tabs + language */}
          <div
            className="flex items-center justify-between"
            style={{ marginBottom: 8 }}
            onClick={(e) => e.stopPropagation()}
          >
            <CanaryTabs
              tabs={channelTabs}
              variant="text"
              size="compact"
              defaultTab={activeChannel}
              onChange={(tabId) => setActiveChannel(tabId as Channel)}
            />
            <div style={{ width: 120, flexShrink: 0 }}>
              <CanarySelect
                value="en"
                size={InputSize.COMPACT}
                options={[{ value: 'en', label: 'English' }, { value: 'es', label: 'Español' }]}
                onChange={() => {}}
              />
            </div>
          </div>

          {/* Content preview */}
          {activeContent && (
            <div>
              {activeContent.channel === 'email' && activeContent.subject && (
                <div style={{ marginBottom: 8 }}>
                  <p style={{ fontSize: 12, lineHeight: '18px', color: '#666', margin: '0 0 4px 0' }}>
                    Subject (English)
                  </p>
                  <div style={{ fontSize: 14, lineHeight: '18px', color: '#000' }}>
                    {renderBodyPreview(activeContent.subject)}
                  </div>
                </div>
              )}
              <div style={{ marginBottom: 8 }}>
                <p style={{ fontSize: 12, lineHeight: '18px', color: '#666', margin: '0 0 4px 0' }}>
                  {activeContent.channel === 'email' ? 'Body content (English)' : 'Content (English)'}
                </p>
                <div
                  style={{
                    fontSize: 14,
                    lineHeight: '18px',
                    color: '#000',
                    whiteSpace: 'pre-wrap',
                    display: '-webkit-box',
                    WebkitLineClamp: 5,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxHeight: 90,
                  }}
                >
                  {renderBodyPreview(activeContent.body)}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
