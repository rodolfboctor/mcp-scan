import ora from 'ora';
import chalk from 'chalk';

export const createSpinner = (text: string, isEnabled: boolean = true) => {
  return ora({
    text: chalk.hex('#339DFF')(text),
    color: 'blue',
    spinner: 'dots',
    isEnabled,
  });
};
