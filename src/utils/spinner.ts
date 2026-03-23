import ora from 'ora';
import chalk from 'chalk';

export const createSpinner = (text: string) => {
  return ora({
    text,
    color: 'cyan',
    spinner: 'dots',
  });
};
