import ora from 'ora';

export const createSpinner = (text: string) => {
  return ora({
    text,
    color: 'cyan',
    spinner: 'dots',
  });
};
