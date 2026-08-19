export type ComplaintStatus = 'Pending' | 'In Progress' | 'Resolved';

export interface TimelineEvent {
  status: ComplaintStatus;
  date: string;
  description: string;
}

export interface Complaint {
  id: string;
  title: string;
  issueType: string;
  location: string;
  description: string;
  status: ComplaintStatus;
  date: string;
  imageUrl?: string;
  timeline?: TimelineEvent[];
}

export const MOCK_COMPLAINTS: Complaint[] = [
  {
    id: 'CMP-2023-001',
    title: 'Overflowing bin at Main St.',
    issueType: 'Overflowing Bin',
    location: '123 Main St, Downtown',
    description: 'The main public bin near the intersection has been overflowing for the past 2 days. Trash is starting to blow into the street, creating a hazard and mess. It needs to be cleared immediately before the weekend market.',
    status: 'In Progress',
    date: '2023-10-24T09:30:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1604187351574-c75ca79f5807?auto=format&fit=crop&q=80&w=800',
    timeline: [
      { status: 'Pending', date: '2023-10-24T09:30:00Z', description: 'Complaint submitted by citizen.' },
      { status: 'In Progress', date: '2023-10-25T14:15:00Z', description: 'Assigned to downtown collection team.' },
    ]
  },
  {
    id: 'CMP-2023-002',
    title: 'Missed collection in residential area',
    issueType: 'Missed Collection',
    location: '45 Elm St, Westside',
    description: 'The regular garbage collection was scheduled for Tuesday, but the truck never came by our street. Several houses have bins waiting outside.',
    status: 'Pending',
    date: '2023-10-26T08:15:00Z',
    timeline: [
      { status: 'Pending', date: '2023-10-26T08:15:00Z', description: 'Complaint logged in the system.' }
    ]
  },
  {
    id: 'CMP-2023-003',
    title: 'Illegal dumping near City Park',
    issueType: 'Illegal Dumping',
    location: 'City Park North Entrance',
    description: 'Someone dumped old furniture and construction debris near the north entrance of the park overnight. It is blocking the pedestrian pathway.',
    status: 'Resolved',
    date: '2023-10-18T07:45:00Z',
    imageUrl: 'https://images.unsplash.com/photo-1595278069441-2cf29f8005a4?auto=format&fit=crop&q=80&w=800',
    timeline: [
      { status: 'Pending', date: '2023-10-18T07:45:00Z', description: 'Report received.' },
      { status: 'In Progress', date: '2023-10-18T10:00:00Z', description: 'Special cleanup crew dispatched.' },
      { status: 'Resolved', date: '2023-10-18T15:30:00Z', description: 'Debris cleared and area secured.' }
    ]
  },
  {
    id: 'CMP-2023-004',
    title: 'Damaged public recycling bin',
    issueType: 'Other',
    location: 'Oak Ave & 5th St',
    description: 'The blue recycling bin at the corner of Oak and 5th has a broken lid and a crack in the side. Rainwater is getting in and ruining the recyclables.',
    status: 'Pending',
    date: '2023-10-27T11:20:00Z',
    timeline: [
      { status: 'Pending', date: '2023-10-27T11:20:00Z', description: 'Damage report filed.' }
    ]
  },
  {
    id: 'CMP-2023-005',
    title: 'Recycling not picked up',
    issueType: 'Missed Collection',
    location: '78 Pine Rd',
    description: 'Garbage was collected but the recycling bin was left full. This is the second time this month.',
    status: 'Resolved',
    date: '2023-10-15T13:10:00Z',
    timeline: [
      { status: 'Pending', date: '2023-10-15T13:10:00Z', description: 'Issue reported.' },
      { status: 'In Progress', date: '2023-10-16T09:00:00Z', description: 'Driver notified of missed pickup.' },
      { status: 'Resolved', date: '2023-10-16T11:45:00Z', description: 'Recycling collected successfully.' }
    ]
  },
  {
    id: 'CMP-2023-006',
    title: 'Foul odor from commercial dumpsters',
    issueType: 'Other',
    location: 'Behind 200 Broad St Complex',
    description: 'The commercial dumpsters behind the restaurant complex are emitting a severe foul odor and attracting pests. They appear to not have been emptied on schedule.',
    status: 'In Progress',
    date: '2023-10-25T16:40:00Z',
    timeline: [
      { status: 'Pending', date: '2023-10-25T16:40:00Z', description: 'Odor complaint logged.' },
      { status: 'In Progress', date: '2023-10-26T08:30:00Z', description: 'Health and sanitation inspector dispatched to location.' }
    ]
  },
  {
    id: 'CMP-2023-007',
    title: 'E-waste left on sidewalk',
    issueType: 'Illegal Dumping',
    location: '88 Washington Blvd',
    description: 'Two old CRT televisions and a broken microwave have been left on the sidewalk, obstructing pedestrian traffic.',
    status: 'Pending',
    date: '2023-10-28T09:05:00Z',
    timeline: [
      { status: 'Pending', date: '2023-10-28T09:05:00Z', description: 'Submitted by citizen.' }
    ]
  },
  {
    id: 'CMP-2023-008',
    title: 'Smart bin sensor malfunctioning',
    issueType: 'Other',
    location: 'Central Station Plaza',
    description: 'The smart bin display shows 100% full and is locked, but looking through the flap it appears completely empty. People are leaving trash next to it.',
    status: 'In Progress',
    date: '2023-10-26T14:20:00Z',
    timeline: [
      { status: 'Pending', date: '2023-10-26T14:20:00Z', description: 'Malfunction reported.' },
      { status: 'In Progress', date: '2023-10-27T10:00:00Z', description: 'Maintenance technician assigned to reset/repair sensor.' }
    ]
  },
  {
    id: 'CMP-2023-009',
    title: 'Overflowing bin near school',
    issueType: 'Overflowing Bin',
    location: 'Lincoln Elementary, 4th Ave',
    description: 'The bins outside the elementary school are overflowing with lunch waste. Birds are scattering it everywhere.',
    status: 'Resolved',
    date: '2023-10-20T12:30:00Z',
    timeline: [
      { status: 'Pending', date: '2023-10-20T12:30:00Z', description: 'Reported by school staff.' },
      { status: 'In Progress', date: '2023-10-20T13:00:00Z', description: 'High priority assigned due to school proximity.' },
      { status: 'Resolved', date: '2023-10-20T14:15:00Z', description: 'Bins emptied and surrounding area swept.' }
    ]
  },
  {
    id: 'CMP-2023-010',
    title: 'Yard waste bags not collected',
    issueType: 'Missed Collection',
    location: '302 Maple Dr',
    description: 'Placed 5 bags of yard waste out for Monday collection, but they were skipped while regular trash was taken.',
    status: 'Pending',
    date: '2023-10-28T15:10:00Z',
    timeline: [
      { status: 'Pending', date: '2023-10-28T15:10:00Z', description: 'Citizen reported missed yard waste.' }
    ]
  }
];
