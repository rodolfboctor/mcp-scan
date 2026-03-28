import { ResolvedServer } from '../types/config.js';
import { Finding } from '../types/scan-result.js';

interface DataNode {
  type: 'source' | 'transform' | 'sink';
  name: string;
  category: 'filesystem' | 'network' | 'env' | 'clipboard' | 'memory' | 'unknown';
}

interface DataEdge {
  from: string;
  to: string;
}

export function scanDataFlow(server: ResolvedServer, allServers: ResolvedServer[] = []): Finding[] {
  const findings: Finding[] = [];
  
  const tools = server.schema?.tools;
  if (!tools || !Array.isArray(tools)) {
    return findings; // Empty tool list -> 0 findings
  }

  for (const tool of tools) {
    if (!tool || typeof tool !== 'object') continue;
    
    const toolName = tool.name || 'unknown_tool';
    let nodes: DataNode[] = [];
    let edges: DataEdge[] = [];
    
    // Simple heuristic parser for data flow based on tool definition and properties
    const toolStr = JSON.stringify(tool).toLowerCase();
    
    // Sources
    if (toolStr.includes('readfile') || toolStr.includes('read_file') || toolStr.includes('filesystem') || toolStr.includes('path')) {
      nodes.push({ type: 'source', name: 'fs_read', category: 'filesystem' });
    }
    if (toolStr.includes('env') || toolStr.includes('process.env') || toolStr.includes('credential')) {
      nodes.push({ type: 'source', name: 'env_read', category: 'env' });
    }
    
    // Sinks
    if (toolStr.includes('fetch') || toolStr.includes('http') || toolStr.includes('post') || toolStr.includes('network') || toolStr.includes('api')) {
      nodes.push({ type: 'sink', name: 'net_write', category: 'network' });
    }
    
    // Temp storage
    if (toolStr.includes('temp') || toolStr.includes('/tmp') || toolStr.includes('tmpdir')) {
      if (!toolStr.includes('cleanup') && !toolStr.includes('delete') && !toolStr.includes('rm') && !toolStr.includes('unlink')) {
         findings.push({
            id: 'temp-storage-risk',
            severity: 'MEDIUM',
            description: `Tool '${toolName}' stores data in temp directories without apparent cleanup.`,
            fixRecommendation: 'Implement cleanup for temporary files.'
         });
      }
    }

    // Build edges (assume all sources flow to all sinks within the same tool for static analysis)
    const sources = nodes.filter(n => n.type === 'source');
    const sinks = nodes.filter(n => n.type === 'sink');
    
    for (const src of sources) {
      for (const sink of sinks) {
        edges.push({ from: src.name, to: sink.name });
        
        // Path checks
        if (src.category === 'filesystem' && sink.category === 'network') {
           // False positive check: is it sanitized?
           if (toolStr.includes('sanitize') || toolStr.includes('anonymize') || toolStr.includes('strip')) {
               continue; 
           }
           findings.push({
              id: 'data-exfiltration-risk',
              severity: 'HIGH',
              description: `Tool '${toolName}' reads local filesystem and has network egress capability.\nData path: filesystem -> tool handler -> network`,
              fixRecommendation: 'Restrict filesystem access to specific directories. Audit network calls.'
           });
        }
        
        if (src.category === 'env' && sink.category === 'network') {
           findings.push({
              id: 'credential-relay-risk',
              severity: 'CRITICAL',
              description: `Tool '${toolName}' forwards environment variables/credentials to an external API.`,
              fixRecommendation: 'Avoid passing credentials directly to external APIs through tools.'
           });
        }
      }
    }
    
    // Cross-server data flow detection (heuristic)
    if (allServers.length > 1) {
       for (const otherServer of allServers) {
           if (otherServer.name === server.name) continue;
           if (toolStr.includes(otherServer.name.toLowerCase())) {
               findings.push({
                  id: 'cross-server-flow',
                  severity: 'MEDIUM',
                  description: `Cross-server data sharing detected: '${server.name}' references '${otherServer.name}'.`,
                  fixRecommendation: 'Ensure cross-server data flows do not leak sensitive information.'
               });
           }
       }
    }
  }

  return findings;
}
