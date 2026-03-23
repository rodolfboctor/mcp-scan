import chalk from 'chalk';

const brandColor = chalk.hex('#339DFF');
const criticalColor = chalk.hex('#F85149');
const mediumColor = chalk.hex('#F0883E');
const dimColor = chalk.dim;
const passColor = chalk.hex('#3FB950');

export const logger = {
  brand: (msg: string) => console.log(brandColor(msg)),
  critical: (msg: string) => console.log(criticalColor(`X ${msg}`)),
  high: (msg: string) => console.log(criticalColor(`X ${msg}`)),
  medium: (msg: string) => console.log(mediumColor(`! ${msg}`)),
  low: (msg: string) => console.log(dimColor(`✓ ${msg}`)),
  pass: (msg: string) => console.log(passColor(`✓ ${msg}`)),
  info: (msg: string) => console.log(brandColor(`i ${msg}`)),
  fix: (msg: string) => console.log(dimColor(`→ ${msg}`)),
  detail: (msg: string) => console.log(dimColor(`  ${msg}`)),
  divider: () => console.log(dimColor('-'.repeat(50))),
  warn: (msg: string) => console.log(chalk.yellow(`! ${msg}`)),
  error: (msg: string) => console.error(chalk.red(`X ${msg}`)),
  log: (msg: string) => console.log(msg),
};
