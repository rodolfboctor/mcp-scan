import blessed from 'blessed';
// @ts-expect-error — no types for blessed-contrib
import contrib from 'blessed-contrib';
import { DashboardView } from '../types/dashboard.js';
import { readAuditLog } from './audit-logger.js';

export function createDashboard() {
  const screen = blessed.screen({
    smartCSR: true,
    title: 'mcp-scan Enterprise Dashboard',
    fullUnicode: true,
  });

  let currentView: DashboardView = 'HISTORY';

  const grid = new contrib.grid({ rows: 12, cols: 12, screen: screen });

  // Header
  grid.set(0, 0, 1, 12, blessed.box, {
    content: '{center}{bold}{#339DFF-fg}MCP SCAN ENTERPRISE DASHBOARD{/|}{/center}',
    tags: true,
    style: { fg: 'white', bg: 'black' }
  });

  // Footer / Key bindings
  grid.set(11, 0, 1, 12, blessed.box, {
    content: '{center}Keybindings: [Q] Quit  |  [H] History View  |  [P] Proxy View  |  [R] Refresh{/center}',
    tags: true,
    style: { fg: '#8B949E', bg: 'black' }
  });

  // --- HISTORY VIEW COMPONENTS ---
  const historyDonut = grid.set(1, 0, 5, 4, contrib.donut, {
    label: ' Overall Severity Breakdown ',
    radius: 8,
    arcWidth: 3,
    remainColor: 'black',
    yPadding: 2,
  });
  
  const historyStatsBox = grid.set(6, 0, 5, 4, blessed.box, {
    label: ' System Stats ',
    content: 'Loading...',
    tags: true,
    style: { fg: 'white', bg: 'black', border: { fg: '#30363d' } }
  });

  const historyTable = grid.set(1, 4, 10, 8, contrib.table, {
    keys: true,
    fg: 'white',
    selectedFg: 'white',
    selectedBg: '#339DFF',
    interactive: true,
    label: ' Recent Scans (Use UP/DOWN to scroll) ',
    width: '100%',
    height: '100%',
    border: { type: "line", fg: "#30363d" },
    columnSpacing: 2,
    columnWidth: [22, 10, 20, 15]
  });

  // --- PROXY VIEW COMPONENTS ---
  const proxyLog = grid.set(1, 0, 10, 8, contrib.log, {
    fg: 'green',
    selectedFg: 'green',
    label: ' Proxy Traffic (JSON-RPC) ',
    border: { type: "line", fg: "#339DFF" }
  });

  const proxyStats = grid.set(1, 8, 10, 4, blessed.box, {
    label: ' Proxy Stats ',
    tags: true,
    content: '\n {bold}Traffic Volume:{/bold} 0 msgs\n {bold}PII Blocked:{/bold} 0 hits\n {bold}Status:{/bold} {green-fg}ACTIVE{/green-fg}',
    style: { fg: 'white', bg: 'black', border: { fg: '#30363d' } }
  });

  proxyLog.hide();
  proxyStats.hide();

  // --- LOGIC ---
  function updateHistoryView() {
    if (currentView !== 'HISTORY') return;
    
    const entries = readAuditLog(20);
    const totalScanned = entries.reduce((acc, e) => acc + e.scannedCount, 0);
    historyStatsBox.setContent(`\n {bold}Total Scans in Log:{/bold} ${entries.length}\n {bold}Servers Analyzed:{/bold} ${totalScanned}\n {bold}Latest Scan:{/bold} ${entries[0] ? new Date(entries[0].timestamp).toLocaleTimeString() : 'N/A'}`);

    let c = 0, h = 0, m = 0, l = 0;
    entries.forEach(e => {
        c += e.findings.critical; h += e.findings.high; m += e.findings.medium; l += e.findings.low;
    });
    const total = c + h + m + l || 1;
    
    historyDonut.setData([
      { percent: Math.round((c/total)*100), label: 'CRITICAL', color: 'red' },
      { percent: Math.round((h/total)*100), label: 'HIGH', color: 'yellow' },
      { percent: Math.round((m/total)*100), label: 'MEDIUM', color: 'cyan' },
      { percent: Math.round((l/total)*100), label: 'LOW', color: 'green' }
    ]);

    const tableData = entries.map(e => [
      new Date(e.timestamp).toLocaleString(),
      e.scannedCount.toString(),
      `${e.findings.critical}/${e.findings.high}/${e.findings.medium}/${e.findings.low}`,
      `${e.durationMs}ms`
    ]);
    
    historyTable.setData({ headers: ['Timestamp', 'Servers', 'Findings (C/H/M/L)', 'Duration'], data: tableData });
    screen.render();
  }

  function switchView(view: DashboardView) {
    currentView = view;
    if (view === 'HISTORY') {
      proxyLog.hide();
      proxyStats.hide();
      historyDonut.show();
      historyStatsBox.show();
      historyTable.show();
      historyTable.focus();
      updateHistoryView();
    } else {
      historyDonut.hide();
      historyStatsBox.hide();
      historyTable.hide();
      proxyLog.show();
      proxyStats.show();
      proxyLog.focus();
      screen.render();
    }
  }

  let totalProxyMsgs = 0;
  let totalPiiHits = 0;

  function appendProxyLog(direction: string, message: string, piiDetected: boolean = false) {
    totalProxyMsgs++;
    if (piiDetected) totalPiiHits++;
    
    const color = direction.includes('CLIENT') ? '{cyan-fg}' : '{magenta-fg}';
    let displayMsg = message.length > 150 ? message.substring(0, 147) + '...' : message;
    if (piiDetected) {
       displayMsg = `{red-bg}{white-fg}PII MASKED{/white-fg}{/red-bg} ${displayMsg}`;
    }
    
    proxyLog.log(`${color}[${direction}]{/} ${displayMsg}`);
    
    proxyStats.setContent(`\n {bold}Traffic Volume:{/bold} ${totalProxyMsgs} msgs\n {bold}PII Blocked:{/bold} ${totalPiiHits} hits\n {bold}Status:{/bold} {green-fg}ACTIVE{/green-fg}`);
    
    if (currentView === 'PROXY') screen.render();
  }

  // --- BINDINGS ---
  screen.key(['escape', 'q', 'C-c'], function() {
    screen.destroy();
    return process.exit(0);
  });

  screen.key(['h', 'H'], () => switchView('HISTORY'));
  screen.key(['p', 'P'], () => switchView('PROXY'));
  screen.key(['r', 'R'], () => updateHistoryView());
  screen.key(['down', 'up'], () => {
    if (currentView === 'HISTORY') historyTable.focus();
  });

  switchView('HISTORY');

  return { screen, grid, updateHistoryView, appendProxyLog, switchView };
}
