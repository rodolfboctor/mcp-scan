import chalk from 'chalk';

const brandColor = chalk.hex('#339DFF');
const criticalColor = chalk.hex('#F85149').bold;
const highColor = chalk.hex('#F85149');
const mediumColor = chalk.hex('#F0883E').bold;
const lowColor = chalk.dim;
const passColor = chalk.hex('#3FB950');
const dimColor = chalk.dim;

export const logger = {
  isSilent: false,
  isVerbose: false,
  
  brand: (msg: string) => !logger.isSilent && console.log(brandColor.bold(msg)),
  critical: (msg: string) => !logger.isSilent && console.log(criticalColor('✖ CRITICAL:'), msg),
  high: (msg: string) => !logger.isSilent && console.log(highColor('▲ HIGH:'), msg),
  medium: (msg: string) => !logger.isSilent && console.log(mediumColor('■ MEDIUM:'), msg),
  low: (msg: string) => !logger.isSilent && console.log(lowColor('• LOW:'), msg),
  pass: (msg: string) => !logger.isSilent && console.log(passColor.bold('✓ PASS:'), msg),
  info: (msg: string) => !logger.isSilent && console.log(brandColor('ℹ INFO:'), msg),
  fix: (msg: string) => !logger.isSilent && console.log(dimColor(`  ↳ ${msg}`)),
  detail: (msg: string) => !logger.isSilent && logger.isVerbose && console.log(dimColor(`    ${msg}`)),
  divider: () => !logger.isSilent && console.log(dimColor('──────────────────────────────────────────────────')),
  warn: (msg: string) => !logger.isSilent && console.log(chalk.yellow.bold('! WARN:'), msg),
  error: (msg: string) => console.error(chalk.red.bold('✖ ERROR:'), msg), // Still log errors? Or silence them too? 
  log: (msg: string) => !logger.isSilent && console.log(msg),
  emptyLine: () => !logger.isSilent && console.log(''),
};
