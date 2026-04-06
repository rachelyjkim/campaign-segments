import { Segment } from '@/lib/types';

export const mockSegments: Segment[] = [
  {
    id: 'seg-vip',
    name: 'High-level Loyalty',
    description: 'Targets Diamond and Platinum loyalty members for premium experiences.',
    estimatedGuests: 142,
  },
  {
    id: 'seg-long-stay',
    name: 'Multi-night stays',
    description: 'Targets guests staying more than one night.',
    estimatedGuests: 287,
  },
  {
    id: 'seg-weekend',
    name: 'Weekend Leisure',
    description: 'Targets leisure and weekend rate guests staying multiple nights.',
    estimatedGuests: 98,
  },
  {
    id: 'seg-corporate',
    name: 'Corporate Travellers',
    description: 'Targets guests on corporate, government, and business rate codes.',
    estimatedGuests: 203,
  },
  {
    id: 'seg-nonmembers',
    name: 'Non-members',
    description: 'Targets guests who are not part of any loyalty program.',
    estimatedGuests: 412,
  },
];
