export interface ComplaintData {
  status: 'Pending' | 'In Progress' | 'Resolved' | string;
}

export interface BinData {
  fillPercentage: number;
}

/**
 * Calculates raw complaint counts by status.
 */
export function getComplaintCounts(complaints: ComplaintData[]) {
  const total = complaints.length;
  const pending = complaints.filter(c => c.status === 'Pending').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const resolved = complaints.filter(c => c.status === 'Resolved').length;

  return { total, pending, inProgress, resolved };
}

/**
 * Calculates complaint status percentages.
 */
export function getComplaintStatusPercentages(complaints: ComplaintData[]) {
  const counts = getComplaintCounts(complaints);
  if (counts.total === 0) {
    return { pending: 0, inProgress: 0, resolved: 0 };
  }
  
  return {
    pending: Number(((counts.pending / counts.total) * 100).toFixed(1)),
    inProgress: Number(((counts.inProgress / counts.total) * 100).toFixed(1)),
    resolved: Number(((counts.resolved / counts.total) * 100).toFixed(1)),
  };
}

/**
 * Calculates the resolution rate as a percentage.
 */
export function getResolutionRate(complaints: ComplaintData[]): number {
  const counts = getComplaintCounts(complaints);
  if (counts.total === 0) return 0;
  return Number(((counts.resolved / counts.total) * 100).toFixed(1));
}

/**
 * Calculates bin fill level statistics based on standard thresholds.
 */
export function getBinStatistics(bins: BinData[]) {
  const total = bins.length;
  const empty = bins.filter(b => b.fillPercentage <= 25).length;
  const normal = bins.filter(b => b.fillPercentage > 25 && b.fillPercentage <= 60).length;
  const almostFull = bins.filter(b => b.fillPercentage > 60 && b.fillPercentage <= 85).length;
  const full = bins.filter(b => b.fillPercentage > 85).length;

  return { total, empty, normal, almostFull, full };
}
