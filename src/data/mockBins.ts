export type BinStatus = 'Empty' | 'Normal' | 'Almost Full' | 'Full';

export interface SmartBin {
  id: string;
  name: string;
  location: string;
  capacity: string;
  fillPercentage: number;
  status: BinStatus;
  lastCollectedDate: string;
}

export const mockBins: SmartBin[] = [
  { id: 'BIN-001', name: 'Downtown Main St', location: '123 Main St', capacity: '120L', fillPercentage: 15, status: 'Empty', lastCollectedDate: '2023-10-15' },
  { id: 'BIN-002', name: 'City Park North', location: 'Park Entrance', capacity: '240L', fillPercentage: 45, status: 'Normal', lastCollectedDate: '2023-10-14' },
  { id: 'BIN-003', name: 'Metro Station A', location: 'Station Square', capacity: '120L', fillPercentage: 85, status: 'Almost Full', lastCollectedDate: '2023-10-10' },
  { id: 'BIN-004', name: 'Shopping Mall Plaza', location: 'West Wing', capacity: '240L', fillPercentage: 98, status: 'Full', lastCollectedDate: '2023-10-08' },
  { id: 'BIN-005', name: 'High School Gate', location: 'Education Rd', capacity: '120L', fillPercentage: 60, status: 'Normal', lastCollectedDate: '2023-10-13' },
  { id: 'BIN-006', name: 'Residential Block C', location: 'Oak Avenue', capacity: '240L', fillPercentage: 5, status: 'Empty', lastCollectedDate: '2023-10-15' },
  { id: 'BIN-007', name: 'Central Library', location: 'Library Sq', capacity: '120L', fillPercentage: 75, status: 'Almost Full', lastCollectedDate: '2023-10-11' },
  { id: 'BIN-008', name: 'Riverside Walk', location: 'River Path', capacity: '240L', fillPercentage: 25, status: 'Normal', lastCollectedDate: '2023-10-14' },
  { id: 'BIN-009', name: 'Industrial Park', location: 'Sector 5', capacity: '360L', fillPercentage: 92, status: 'Full', lastCollectedDate: '2023-10-09' },
  { id: 'BIN-010', name: 'Tech Hub Center', location: 'Innovation Blvd', capacity: '120L', fillPercentage: 10, status: 'Empty', lastCollectedDate: '2023-10-16' },
  { id: 'BIN-011', name: 'Community Center', location: 'Community Way', capacity: '240L', fillPercentage: 55, status: 'Normal', lastCollectedDate: '2023-10-13' },
  { id: 'BIN-012', name: 'Local Market', location: 'Market St', capacity: '360L', fillPercentage: 88, status: 'Almost Full', lastCollectedDate: '2023-10-10' },
  { id: 'BIN-013', name: 'Hospital West Wing', location: 'Health Ave', capacity: '240L', fillPercentage: 100, status: 'Full', lastCollectedDate: '2023-10-08' },
  { id: 'BIN-014', name: 'Sports Complex', location: 'Arena Rd', capacity: '360L', fillPercentage: 30, status: 'Normal', lastCollectedDate: '2023-10-14' },
  { id: 'BIN-015', name: 'University Campus', location: 'Student Union', capacity: '240L', fillPercentage: 8, status: 'Empty', lastCollectedDate: '2023-10-16' },
  { id: 'BIN-016', name: 'Subway Station B', location: 'Underground Level 1', capacity: '120L', fillPercentage: 68, status: 'Normal', lastCollectedDate: '2023-10-12' },
  { id: 'BIN-017', name: 'Food Court Area', location: 'Mall 2nd Floor', capacity: '240L', fillPercentage: 95, status: 'Full', lastCollectedDate: '2023-10-09' },
  { id: 'BIN-018', name: 'Botanical Gardens', location: 'South Gate', capacity: '120L', fillPercentage: 15, status: 'Empty', lastCollectedDate: '2023-10-15' },
  { id: 'BIN-019', name: 'Bus Terminal', location: 'Platform 3', capacity: '240L', fillPercentage: 78, status: 'Almost Full', lastCollectedDate: '2023-10-11' },
  { id: 'BIN-020', name: 'City Hall Plaza', location: 'Civic Center', capacity: '360L', fillPercentage: 42, status: 'Normal', lastCollectedDate: '2023-10-13' }
];
