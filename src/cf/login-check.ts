import { executeCommandAsync } from '@/utils/execute-command.js';

export const checkCfLoggedIn = async () => {
  const { stdout, stderr } = await executeCommandAsync('cf target');
  if (stderr) throw new Error(stderr);

  return stdout.trim().includes('Not logged in');
};
