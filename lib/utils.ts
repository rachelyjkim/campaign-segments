/**
 * Campaign utilities — cadence label formatter.
 * Matches canary-prototype-core guest-journey/utils.ts
 */

import { ScheduledCampaign } from './types';

export function campaignCadenceLabel(campaign: ScheduledCampaign): string {
  const time = campaign.sendTime;

  if (campaign.cadence === 'weekly') {
    const day = campaign.weeklyDay || 'Monday';
    if (campaign.repeatEvery === 1) {
      return `Every ${day} at ${time}`;
    }
    return `Every ${campaign.repeatEvery} weeks on ${day} at ${time}`;
  }

  // Monthly by weekday
  if (campaign.monthlyWeekday && campaign.monthlyWeekdayOccurrence) {
    const ordinal = ['', '1st', '2nd', '3rd', '4th', '5th'][campaign.monthlyWeekdayOccurrence] || `${campaign.monthlyWeekdayOccurrence}th`;
    if (campaign.repeatEvery === 1) {
      return `${ordinal} ${campaign.monthlyWeekday} each month at ${time}`;
    }
    return `${ordinal} ${campaign.monthlyWeekday} every ${campaign.repeatEvery} months at ${time}`;
  }

  // Monthly by date
  if (campaign.monthlyDay) {
    const daySuffix = campaign.monthlyDay === 1 ? 'st' : campaign.monthlyDay === 2 ? 'nd' : campaign.monthlyDay === 3 ? 'rd' : 'th';
    if (campaign.repeatEvery === 1) {
      return `${campaign.monthlyDay}${daySuffix} of each month at ${time}`;
    }
    return `${campaign.monthlyDay}${daySuffix} of every ${campaign.repeatEvery} months at ${time}`;
  }

  return `At ${time}`;
}

export function campaignEndLabel(campaign: ScheduledCampaign): string | null {
  if (campaign.endCondition === 'on_date' && campaign.endOnDate) {
    return `Ends: ${campaign.endOnDate}`;
  }
  if (campaign.endCondition === 'after_count' && campaign.endAfterCount) {
    return `Ends: After ${campaign.endAfterCount} occurrences`;
  }
  return null;
}
