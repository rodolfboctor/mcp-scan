import ora from 'ora';
import chalk from 'chalk';

export const createSpinner = (text: string) => {
  return ora({
    text: chalk.hex('#339DFF')(text),
    color: 'blue',
    spinner: 'dots',
  });
};
