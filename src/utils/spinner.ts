import ora from 'ora';
import chalk from 'chalk';

export const createSpinner = (text: string, isEnabled: boolean = true) => {
  // Disable spinner in CI environments (no TTY) to prevent broken output
  const ciMode = !process.stdout.isTTY || process.env.CI === 'true' || process.env.NO_COLOR !== undefined;
  return ora({
    text: chalk.hex('#339DFF')(text),
    color: 'blue',
    spinner: 'dots',
    isEnabled: isEnabled && !ciMode,
  });
};
