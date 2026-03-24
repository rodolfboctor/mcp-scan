export type DashboardView = 'HISTORY' | 'PROXY';

export interface DashboardState {
  currentView: DashboardView;
  totalScanned: number;
  criticalIssues: number;
  highIssues: number;
  mediumIssues: number;
  lowIssues: number;
  // This will store recent proxy traffic
  proxyLog: string[];
}
