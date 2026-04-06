export interface Segment {
  id: string;
  name: string;
  description: string;
}

export const AVAILABLE_SEGMENTS: Segment[] = [
  { id: 'seg-vip', name: 'VIP Loyalty Guests', description: 'Gold and Platinum loyalty members' },
  { id: 'seg-long-stay', name: 'Multi-Night Stay', description: 'Guests staying multiple nights' },
  { id: 'seg-weekend', name: 'Weekend Stay', description: 'Guests with weekend reservations' },
  { id: 'seg-corporate', name: 'Corporate Booking', description: 'Rate code starts with CORP' },
  { id: 'seg-returning', name: 'Returning Guests', description: 'Guests with prior stays' },
  { id: 'seg-door-code', name: 'Guests with Door Code', description: 'UDF: door_code exists' },
  { id: 'seg-choose-room', name: 'Choose Your Room', description: 'UDF: choose_your_room exists' },
];
