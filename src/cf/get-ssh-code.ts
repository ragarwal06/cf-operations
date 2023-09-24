import { executeCommandAsync } from '@/utils/execute-command.js';

export const getSSHCode = async () => {
  const { stdout, stderr } = await executeCommandAsync(`cf ssh-code`);
  if (stderr) throw new Error(stderr);

  return stdout.trim();
};
