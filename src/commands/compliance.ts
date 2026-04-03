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
        let md = `\n${chalk.hex('#FFB833').bold('-- ' + fw.name + ' Compliance Report --')}\n\n`;
        let totalFindings = 0;
        let totalControls = fw.controls.length;
        let compliantControls = 0;
        
        let table = '';
        for (const control of fw.controls) {
            const matchingFindings = allFindings.filter((f: any) => control.findingIds.includes(f.id));
            const count = matchingFindings.length;
            totalFindings += count;
            
            if (count === 0) compliantControls++;
            
            const status = count > 0 ? (count > 2 ? chalk.red('[NON-COMPLIANT]') : chalk.yellow('[PARTIAL]')) : chalk.green('[COMPLIANT]');
            table += `${chalk.bold(control.id.padEnd(10))} ${control.description.substring(0, 40).padEnd(42)} ${status} (${count} findings)\n`;
            
            if (count > 0) {
                matchingFindings.slice(0, 3).forEach((f: any) => {
                    const desc = f.description || 'No description provided';
                    table += chalk.dim(`           └─ ${f.id}: ${desc.substring(0, 60)}...\n`);
                });
            }
        }
        
        const score = Math.round((compliantControls / totalControls) * 100);
        const scoreColor = score > 90 ? chalk.green : score > 70 ? chalk.yellow : chalk.red;
        
        md += `Overall Compliance Score: ${scoreColor.bold(score + '%')}\n`;
        md += `Summary: ${compliantControls} / ${totalControls} controls meeting criteria. ${totalFindings} total violations.\n\n`;
        md += table;
        
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
                     const status = count > 0 ? (count > 2 ? 'NON-COMPLIANT' : 'PARTIAL') : 'COMPLIANT';
                     csv += `"${fw.name}","${control.id}","${control.description}",${count},"${status}"\n`;
                 }
             }
             fs.writeFileSync(options.output, csv);
             console.log(`Saved compliance CSV report to ${options.output}`);
        } else if (options.output.endsWith('.json')) {
             const jsonObj = frameworksToRun.map(fw => {
                 const controls = fw.controls.map((c: any) => {
                     const matching = allFindings.filter((f: any) => c.findingIds.includes(f.id));
                     return {
                         id: c.id,
                         description: c.description,
                         findingsCount: matching.length,
                         compliant: matching.length === 0,
                         findings: matching.map((f: any) => ({ id: f.id, severity: f.severity }))
                     };
                 });
                 const score = Math.round((controls.filter((c: any) => c.compliant).length / controls.length) * 100);
                 return {
                     name: fw.name,
                     complianceScore: score,
                     controls
                 };
             });
             fs.writeFileSync(options.output, JSON.stringify(jsonObj, null, 2));
             console.log(`Saved compliance JSON report to ${options.output}`);
        } else {
             // Generate clean markdown (no chalk)
             const generateMdReport = (fw: any) => {
                 const controls = fw.controls.map((c: any) => {
                     const matching = allFindings.filter((f: any) => c.findingIds.includes(f.id));
                     return { ...c, count: matching.length, compliant: matching.length === 0 };
                 });
                 const score = Math.round((controls.filter((c: any) => c.compliant).length / controls.length) * 100);
                 
                 let md = `## ${fw.name}\n\n`;
                 md += `**Compliance Score:** ${score}%\n\n`;
                 md += `| Control | Description | Status | Findings |\n| --- | --- | --- | --- |\n`;
                 controls.forEach((c: any) => {
                     const status = c.count > 0 ? (c.count > 2 ? '🔴 NON-COMPLIANT' : '🟡 PARTIAL') : '🟢 COMPLIANT';
                     md += `| ${c.id} | ${c.description} | ${status} | ${c.count} |\n`;
                 });
                 md += '\n';
                 return md;
             };
             
             let mdOutput = `# Compliance Framework Mapping Report\n\nGenerated: ${new Date().toISOString()}\n\n`;
             for (const fw of frameworksToRun) {
                 mdOutput += generateMdReport(fw);
             }
             fs.writeFileSync(options.output, mdOutput);
             console.log(`Saved compliance Markdown report to ${options.output}`);
        }
    } else {
        console.log(fullMarkdown);
    }
}
