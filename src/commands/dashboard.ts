import { createDashboard } from '../utils/dashboard-ui.js';

export async function runDashboard() {
  const dashboard = createDashboard();
  
  // Dashboard runs in foreground, wait for user to quit
  return new Promise(() => {});
}
