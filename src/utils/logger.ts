import chalk from 'chalk';

const brandColor = chalk.hex('#339DFF');
const criticalColor = chalk.hex('#F85149').bold;
const highColor = chalk.hex('#F85149');
const mediumColor = chalk.hex('#F0883E').bold;
const lowColor = chalk.dim;
const passColor = chalk.hex('#3FB950');
const dimColor = chalk.dim;

export const logger = {
  brand: (msg: string) => console.log(brandColor.bold(msg)),
  critical: (msg: string) => console.log(criticalColor('✖ CRITICAL:'), msg),
  high: (msg: string) => console.log(highColor('▲ HIGH:'), msg),
  medium: (msg: string) => console.log(mediumColor('■ MEDIUM:'), msg),
  low: (msg: string) => console.log(lowColor('• LOW:'), msg),
  pass: (msg: string) => console.log(passColor.bold('✓ PASS:'), msg),
  info: (msg: string) => console.log(brandColor('ℹ INFO:'), msg),
  fix: (msg: string) => console.log(dimColor(`  ↳ ${msg}`)),
  detail: (msg: string) => console.log(dimColor(`    ${msg}`)),
  divider: () => console.log(dimColor('──────────────────────────────────────────────────')),
  warn: (msg: string) => console.log(chalk.yellow.bold('! WARN:'), msg),
  error: (msg: string) => console.error(chalk.red.bold('✖ ERROR:'), msg),
  log: (msg: string) => console.log(msg),
  emptyLine: () => console.log(''),
};
