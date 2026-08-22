export type AdminComplaintStatus = 'Pending' | 'In Progress' | 'Resolved';

export interface AdminComplaint {
  id: string;
  title: string;
  issueType: string;
  location: string;
  description: string;
  status: AdminComplaintStatus;
  date: string;
  citizenName: string;
}

export const ADMIN_COMPLAINTS: AdminComplaint[] = [
  {
    id: "CMP-001",
    title: "Overflowing bin at Main St.",
    issueType: "Overflowing Bin",
    location: "123 Main St, Downtown",
    description: "The main public bin near the intersection has been overflowing for the past 2 days. Trash is starting to blow into the street, creating a hazard and mess.",
    status: "In Progress",
    date: "2023-10-24T09:30:00Z",
    citizenName: "Alice Johnson"
  },
  {
    id: "CMP-002",
    title: "Missed collection in residential area",
    issueType: "Missed Collection",
    location: "45 Elm St, Westside",
    description: "The regular garbage collection was scheduled for Tuesday, but the truck never came by our street. Several houses have bins waiting outside.",
    status: "Pending",
    date: "2023-10-26T08:15:00Z",
    citizenName: "Bob Smith"
  },
  {
    id: "CMP-003",
    title: "Illegal dumping near City Park",
    issueType: "Illegal Dumping",
    location: "City Park North Entrance",
    description: "Someone dumped old furniture and construction debris near the north entrance of the park overnight. It is blocking the pedestrian pathway.",
    status: "Resolved",
    date: "2023-10-18T07:45:00Z",
    citizenName: "Charlie Davis"
  },
  {
    id: "CMP-004",
    title: "Damaged public recycling bin",
    issueType: "Other",
    location: "Oak Ave & 5th St",
    description: "The blue recycling bin at the corner of Oak and 5th has a broken lid and a crack in the side. Rainwater is getting in and ruining the recyclables.",
    status: "Pending",
    date: "2023-10-27T11:20:00Z",
    citizenName: "Diana Ross"
  },
  {
    id: "CMP-005",
    title: "Recycling not picked up",
    issueType: "Missed Collection",
    location: "78 Pine Rd",
    description: "Garbage was collected but the recycling bin was left full. This is the second time this month.",
    status: "Resolved",
    date: "2023-10-15T13:10:00Z",
    citizenName: "Evan Wright"
  },
  {
    id: "CMP-006",
    title: "Foul odor from commercial dumpsters",
    issueType: "Other",
    location: "Behind 200 Broad St Complex",
    description: "The commercial dumpsters behind the restaurant complex are emitting a severe foul odor and attracting pests.",
    status: "In Progress",
    date: "2023-10-25T16:40:00Z",
    citizenName: "Fiona Gallagher"
  },
  {
    id: "CMP-007",
    title: "E-waste left on sidewalk",
    issueType: "Illegal Dumping",
    location: "88 Washington Blvd",
    description: "Two old CRT televisions and a broken microwave have been left on the sidewalk, obstructing pedestrian traffic.",
    status: "Pending",
    date: "2023-10-28T09:05:00Z",
    citizenName: "George Miller"
  },
  {
    id: "CMP-008",
    title: "Smart bin sensor malfunctioning",
    issueType: "Other",
    location: "Central Station Plaza",
    description: "The smart bin display shows 100% full and is locked, but looking through the flap it appears completely empty.",
    status: "In Progress",
    date: "2023-10-26T14:20:00Z",
    citizenName: "Hannah Abbott"
  },
  {
    id: "CMP-009",
    title: "Overflowing bin near school",
    issueType: "Overflowing Bin",
    location: "Lincoln Elementary, 4th Ave",
    description: "The bins outside the elementary school are overflowing with lunch waste. Birds are scattering it everywhere.",
    status: "Resolved",
    date: "2023-10-20T12:30:00Z",
    citizenName: "Ian Malcolm"
  },
  {
    id: "CMP-010",
    title: "Yard waste bags not collected",
    issueType: "Missed Collection",
    location: "302 Maple Dr",
    description: "Placed 5 bags of yard waste out for Monday collection, but they were skipped while regular trash was taken.",
    status: "Pending",
    date: "2023-10-28T15:10:00Z",
    citizenName: "Julia Child"
  },
  {
    id: "CMP-011",
    title: "Broken glass near playground",
    issueType: "Illegal Dumping",
    location: "Sunset Park",
    description: "Shattered glass bottles are scattered near the swings. It is very dangerous for the kids.",
    status: "In Progress",
    date: "2023-10-29T08:00:00Z",
    citizenName: "Kevin Hart"
  },
  {
    id: "CMP-012",
    title: "Public bin totally destroyed",
    issueType: "Other",
    location: "15th and Market",
    description: "Someone seems to have run over the public bin with a car. It's completely destroyed and trash is everywhere.",
    status: "Resolved",
    date: "2023-10-21T14:45:00Z",
    citizenName: "Laura Croft"
  },
  {
    id: "CMP-013",
    title: "Missed scheduled bulk pickup",
    issueType: "Missed Collection",
    location: "500 Walnut St",
    description: "Scheduled a bulk pickup for an old mattress, but no one came. Need to know when it will be taken.",
    status: "Pending",
    date: "2023-10-30T10:15:00Z",
    citizenName: "Michael Scott"
  },
  {
    id: "CMP-014",
    title: "Compost bin missing",
    issueType: "Other",
    location: "12 Cherry Ln",
    description: "After collection day, our green compost bin was missing. It might have fallen into the truck.",
    status: "In Progress",
    date: "2023-10-27T16:30:00Z",
    citizenName: "Nancy Drew"
  },
  {
    id: "CMP-015",
    title: "Overflowing recycling station",
    issueType: "Overflowing Bin",
    location: "Community Center",
    description: "The large cardboard recycling containers at the community center are completely overflowing onto the lot.",
    status: "Resolved",
    date: "2023-10-15T09:20:00Z",
    citizenName: "Oscar Martinez"
  },
  {
    id: "CMP-016",
    title: "Tires dumped in alley",
    issueType: "Illegal Dumping",
    location: "Alley behind 4th St Bakery",
    description: "Found a stack of about 8 old tires dumped in the alleyway. They are blocking delivery trucks.",
    status: "Pending",
    date: "2023-10-31T07:45:00Z",
    citizenName: "Pam Beesly"
  },
  {
    id: "CMP-017",
    title: "Leaking garbage truck",
    issueType: "Other",
    location: "Route 4, Sector B",
    description: "The garbage truck that just came through is leaking hydraulic fluid or some other liquid onto the street.",
    status: "Resolved",
    date: "2023-10-10T11:00:00Z",
    citizenName: "Quincy Jones"
  },
  {
    id: "CMP-018",
    title: "Bin smelling terrible",
    issueType: "Other",
    location: "Bus Stop 42, King Ave",
    description: "The bin at the bus stop hasn't been emptied properly and smells like rotting fish.",
    status: "In Progress",
    date: "2023-10-29T18:10:00Z",
    citizenName: "Rachel Green"
  },
  {
    id: "CMP-019",
    title: "Entire street missed",
    issueType: "Missed Collection",
    location: "Willow Creek Development",
    description: "Our entire neighborhood was skipped for collection this week. We need a dispatch immediately.",
    status: "Pending",
    date: "2023-11-01T08:30:00Z",
    citizenName: "Steve Rogers"
  },
  {
    id: "CMP-020",
    title: "Paint cans dumped",
    issueType: "Illegal Dumping",
    location: "Empty lot on 9th St",
    description: "Several open cans of paint have been dumped in the empty lot, and it's seeping into the soil.",
    status: "In Progress",
    date: "2023-10-31T15:20:00Z",
    citizenName: "Tony Stark"
  }
];
