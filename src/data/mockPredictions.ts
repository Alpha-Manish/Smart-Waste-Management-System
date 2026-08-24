import { type RiskLevel } from '../components/RiskLevelBadge';

export type PredictionRecord = {
  binId: string;
  binName: string;
  currentFill: number;
  predictedFill: number;
  predictedFullDate: string;
  riskLevel: RiskLevel;
};

export const mockPredictions: PredictionRecord[] = [
  { binId: "BIN-001", binName: "Central Station Alpha", currentFill: 45, predictedFill: 85, predictedFullDate: "Tomorrow, 10:00 AM", riskLevel: "Medium" },
  { binId: "BIN-002", binName: "Market Square North", currentFill: 20, predictedFill: 35, predictedFullDate: "Oct 12, 02:00 PM", riskLevel: "Low" },
  { binId: "BIN-003", binName: "Industrial Zone B", currentFill: 80, predictedFill: 98, predictedFullDate: "Today, 4:00 PM", riskLevel: "High" },
  { binId: "BIN-004", binName: "University Campus East", currentFill: 60, predictedFill: 90, predictedFullDate: "Today, 8:00 PM", riskLevel: "High" },
  { binId: "BIN-005", binName: "City Mall Entrance", currentFill: 10, predictedFill: 15, predictedFullDate: "Oct 15, 09:00 AM", riskLevel: "Low" },
  { binId: "BIN-006", binName: "Downtown Central Plaza", currentFill: 88, predictedFill: 100, predictedFullDate: "Today, 1:00 PM", riskLevel: "Critical" },
  { binId: "BIN-007", binName: "Westside Tech Park", currentFill: 82, predictedFill: 95, predictedFullDate: "Today, 3:30 PM", riskLevel: "High" },
  { binId: "BIN-008", binName: "North Station", currentFill: 75, predictedFill: 90, predictedFullDate: "Today, 5:00 PM", riskLevel: "High" },
  { binId: "BIN-009", binName: "South Market", currentFill: 65, predictedFill: 80, predictedFullDate: "Tomorrow, 08:00 AM", riskLevel: "Medium" },
  { binId: "BIN-010", binName: "Riverside Park", currentFill: 15, predictedFill: 25, predictedFullDate: "Oct 18, 11:00 AM", riskLevel: "Low" },
  { binId: "BIN-011", binName: "Grand Avenue Block 1", currentFill: 40, predictedFill: 65, predictedFullDate: "Tomorrow, 03:00 PM", riskLevel: "Medium" },
  { binId: "BIN-012", binName: "Grand Avenue Block 2", currentFill: 55, predictedFill: 75, predictedFullDate: "Tomorrow, 12:00 PM", riskLevel: "Medium" },
  { binId: "BIN-013", binName: "Stadium Gate A", currentFill: 90, predictedFill: 100, predictedFullDate: "Today, 6:00 PM", riskLevel: "Critical" },
  { binId: "BIN-014", binName: "Stadium Gate B", currentFill: 85, predictedFill: 95, predictedFullDate: "Today, 6:30 PM", riskLevel: "High" },
  { binId: "BIN-015", binName: "Library Square", currentFill: 25, predictedFill: 40, predictedFullDate: "Oct 13, 09:00 AM", riskLevel: "Low" },
  { binId: "BIN-016", binName: "Hospital Entrance", currentFill: 70, predictedFill: 85, predictedFullDate: "Tomorrow, 07:00 AM", riskLevel: "High" },
  { binId: "BIN-017", binName: "Subway Station South", currentFill: 92, predictedFill: 100, predictedFullDate: "Today, 2:00 PM", riskLevel: "Critical" },
  { binId: "BIN-018", binName: "Airport Terminal 1", currentFill: 50, predictedFill: 70, predictedFullDate: "Tomorrow, 11:00 AM", riskLevel: "Medium" },
  { binId: "BIN-019", binName: "High School Gate", currentFill: 65, predictedFill: 90, predictedFullDate: "Today, 3:00 PM", riskLevel: "High" },
  { binId: "BIN-020", binName: "Greenwood Residential", currentFill: 30, predictedFill: 45, predictedFullDate: "Oct 14, 08:00 AM", riskLevel: "Low" }
];
