import { executeCommandAsync } from '@/utils/execute-command.js';

const isSSHEnabled = async (appName: string) => {
  const { stdout, stderr } = await executeCommandAsync(`cf ssh-enabled ${appName}`);
  if (stderr) throw new Error(stderr);

  return !stdout.trim().includes('ssh is disabled for app');
};

const enableSsh = async (appName: string) => {
  const { stdout, stderr } = await executeCommandAsync(`cf enable-ssh ${appName}`);
  if (stderr) throw new Error(stderr);

  return stdout.trim();
};

const restageApp = async (appName: string) => {
  await executeCommandAsync(`cf restage ${appName}`);
};

export const initSSH = async (name: string) => {
  if (!(await isSSHEnabled(name))) {
    console.log('Enabling SSH for', name);
    await enableSsh(name);
    await restageApp(name);
  }
  console.log('SSH enabled for', name);
};
