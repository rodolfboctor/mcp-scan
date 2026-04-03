import { COMPLIANCE_FRAMEWORKS, getFramework } from '../data/compliance/index.js';
import { runScan } from './scan.js';
import chalk from 'chalk';
import fs from 'fs';

export async function runCompliance(options: { framework: string, output?: string }) {
    const frameworksToRun = (options.framework === 'all' 
        ? COMPLIANCE_FRAMEWORKS 
        : [getFramework(options.framework)]).filter((fw): fw is NonNullable<typeof fw> => !!fw);

    if (frameworksToRun.length === 0) {
        console.error(chalk.red(`Error: Unknown framework '${options.framework}'.`));
        console.log(`Available: soc2, gdpr, hipaa, pci-dss, nist, all`);
        process.exitCode = 1;
        return;
    }

    const report = await runScan({ silent: true });
    const allFindings = report.results.flatMap(r => r.findings);

    const generateReport = (fw: any) => {
        let md = `\n-- ${fw.name} Compliance Report ----------------------\n\n`;
        md += `Framework Controls Coverage:\n`;
        let totalFindings = 0;
        let totalControls = fw.controls.length;
        
        for (const control of fw.controls) {
            const matchingFindings = allFindings.filter((f: any) => control.findingIds.includes(f.id));
            const count = matchingFindings.length;
            totalFindings += count;
            
            const status = count > 0 ? (count > 2 ? '[GAPS DETECTED]' : '[PARTIAL]') : '[COMPLIANT]';
            md += `${control.id} (${control.description.substring(0, 30)})`.padEnd(45, ' ') + `${count} findings  ${status}\n`;
        }
        
        md += `\nSummary: ${totalFindings} total findings across ${totalControls} criteria.\n`;
        if (options.output) {
            md += `Exported to: ${options.output}\n`;
        }
        return md;
    };

    let fullMarkdown = '';
    for (const fw of frameworksToRun) {
        fullMarkdown += generateReport(fw);
    }

    if (options.output) {
        if (options.output.endsWith('.csv')) {
             let csv = 'Framework,ControlID,Description,FindingsCount,Status\n';
             for (const fw of frameworksToRun) {
                 for (const control of fw.controls) {
                     const count = allFindings.filter((f: any) => control.findingIds.includes(f.id)).length;
                     const status = count > 0 ? (count > 2 ? 'GAPS DETECTED' : 'PARTIAL') : 'COMPLIANT';
                     csv += `"${fw.name}","${control.id}","${control.description}",${count},"${status}"\n`;
                 }
             }
             fs.writeFileSync(options.output, csv);
             console.log(`Saved compliance CSV report to ${options.output}`);
        } else if (options.output.endsWith('.json')) {
             const jsonObj = frameworksToRun.map(fw => {
                 return {
                     name: fw.name,
                     controls: fw.controls.map((c: any) => {
                         const matching = allFindings.filter((f: any) => c.findingIds.includes(f.id));
                         return {
                             id: c.id,
                             description: c.description,
                             findingsCount: matching.length,
                             compliant: matching.length === 0
                         }
                     })
                 }
             });
             fs.writeFileSync(options.output, JSON.stringify(jsonObj, null, 2));
             console.log(`Saved compliance JSON report to ${options.output}`);
        } else {
             fs.writeFileSync(options.output, fullMarkdown);
             console.log(`Saved compliance report to ${options.output}`);
        }
    } else {
        console.log(fullMarkdown);
    }
}