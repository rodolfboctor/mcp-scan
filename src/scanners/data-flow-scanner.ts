import { ResolvedServer } from '../types/config.js';
import { Finding } from '../types/scan-result.js';
import { 
  FILESYSTEM_SOURCES, 
  NETWORK_SINKS, 
  TEMP_STORAGE_PATTERNS, 
  CREDENTIAL_ENV_PATTERNS,
  DataFlowSource,
  DataFlowSink
} from '../data/data-flow-patterns.js';

interface DataNode {
  type: 'source' | 'transform' | 'sink';
  name: string;
  category: 'filesystem' | 'network' | 'env' | 'clipboard' | 'database' | 'process' | 'unknown';
  description: string;
}

interface DataEdge {
  from: string;
  to: string;
}

/**
 * Scan for potentially dangerous data flows in tool definitions.
 * Heuristically maps sources (FS, Env, DB) to sinks (Network, Process, Websocket).
 */
export function scanDataFlow(server: ResolvedServer, allServers: ResolvedServer[] = []): Finding[] {
  const findings: Finding[] = [];
  
  const tools = server.schema?.tools;
  if (!tools || !Array.isArray(tools)) {
    return findings;
  }

  for (const tool of tools) {
    if (!tool || typeof tool !== 'object') continue;
    
    const toolName = tool.name || 'unknown_tool';
    const toolDescription = tool.description || '';
    const toolProperties = tool.inputSchema?.properties ? JSON.stringify(tool.inputSchema.properties) : '';
    const combinedStr = `${toolName} ${toolDescription} ${toolProperties}`.toLowerCase();
    
    let nodes: DataNode[] = [];
    
    // 1. Identify Sources
    for (const source of FILESYSTEM_SOURCES) {
       if (source.patterns.some(p => p.test(combinedStr)) || 
           source.packages.some(pkg => server.name.includes(pkg))) {
          nodes.push({ 
            type: 'source', 
            name: source.name, 
            category: source.name.includes('filesystem') ? 'filesystem' : 
                      source.name.includes('env') ? 'env' :
                      source.name.includes('clipboard') ? 'clipboard' :
                      source.name.includes('database') ? 'database' : 'unknown',
            description: source.description
          });
       }
    }

    // 2. Identify Sinks
    for (const sink of NETWORK_SINKS) {
       if (sink.patterns.some(p => p.test(combinedStr)) || 
           sink.packages.some(pkg => server.name.includes(pkg))) {
          nodes.push({ 
            type: 'sink', 
            name: sink.name, 
            category: sink.name.includes('http') || sink.name.includes('websocket') ? 'network' : 
                      sink.name.includes('process') ? 'process' : 'unknown',
            description: sink.description
          });
       }
    }
    
    // 3. Special Case: Temp Storage Risk
    if (TEMP_STORAGE_PATTERNS.some(p => p.test(combinedStr))) {
      const isCleanup = /cleanup|delete|rm|unlink|remove|purge|sweep/i.test(combinedStr);
      if (!isCleanup) {
         findings.push({
            id: 'temp-storage-risk',
            severity: 'MEDIUM',
            description: `Tool '${toolName}' stores data in temporary directories without apparent cleanup.`,
            fixRecommendation: 'Implement cleanup for temporary files (use try/finally or OS-managed temp dirs) or use in-memory storage.'
         });
      }
    }

    // 4. Build edges and generate findings based on source/sink pairs
    const sources = nodes.filter(n => n.type === 'source');
    const sinks = nodes.filter(n => n.type === 'sink');

    // 3b. Screen capture data flowing to network sink
    if (/screenshot|screen.?capture/i.test(combinedStr) && sinks.some(s => s.category === 'network')) {
      findings.push({
        id: 'screen-data-egress',
        severity: 'HIGH',
        description: `Tool '${toolName}' captures screen data and has a network egress path. Potential privacy violation.`,
        fixRecommendation: 'Ensure screen capture data is only processed locally and never transmitted without explicit user consent.',
      });
    }
    
    for (const src of sources) {
      for (const sink of sinks) {
        // Exfiltration: Any local source -> Any external sink
        if ((src.category === 'filesystem' || src.category === 'database' || src.category === 'clipboard') && 
            (sink.category === 'network' || sink.category === 'process')) {
           
           // Heuristic for "read-and-send" pattern
           const isSanitized = /sanitize|anonymize|strip|filter|mask/i.test(combinedStr);
           if (isSanitized) continue;

           findings.push({
              id: 'data-exfiltration-risk',
              severity: 'HIGH',
              description: `Tool '${toolName}' reads from ${src.category} (${src.description}) and has egress via ${sink.category} (${sink.description}).`,
              fixRecommendation: `Restrict tool capabilities or implement strict filtering for ${src.category} data before transmission.`
           });
        }
        
        // Credential Relay: Env -> Network/Process
        if (src.category === 'env' && (sink.category === 'network' || sink.category === 'process')) {
           // Check if it's likely a credential being passed
           const isCredential = CREDENTIAL_ENV_PATTERNS.some(p => p.test(combinedStr));
           
           findings.push({
              id: 'credential-relay-risk',
              severity: isCredential ? 'CRITICAL' : 'HIGH',
              description: `Tool '${toolName}' forwards environment variables/credentials to an external sink (${sink.description}).`,
              fixRecommendation: 'Avoid passing secrets directly through tools. Use secure credential managers.'
           });
        }
      }
    }
    
    // 5. Cross-server data flow detection (heuristic)
    if (allServers.length > 0) {
       for (const otherServer of allServers) {
           if (otherServer.name === server.name) continue;
           if (combinedStr.includes(otherServer.name.toLowerCase())) {
               findings.push({
                  id: 'cross-server-flow',
                  severity: 'MEDIUM',
                  description: `Potential cross-server data flow: '${server.name}' references '${otherServer.name}'.`,
                  fixRecommendation: 'Audit interactions between servers to prevent unintentional data leakage.'
               });
           }
       }
    }
  }

  return findings;
}
