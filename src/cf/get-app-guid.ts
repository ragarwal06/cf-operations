import { type AppProps } from '@/types/app-props.js';
import { executeCommandAsync } from '@/utils/execute-command.js';

export const getAppGuid = async (appName: string) => {
  const { stdout, stderr } = await executeCommandAsync(`cf app ${appName} --guid`);
  if (stderr) throw new Error(stderr);

  return stdout.trim();
};

export const findAppAndGetGuid = async ({ appName, isBGDeployment = false }: AppProps) => {
  return await getAppGuid(await resolveAppName({ appName, isBGDeployment }));
};

export const resolveAppName = async ({ appName, isBGDeployment = false }: AppProps) => {
  let appGuid = '';
  try {
    if (!isBGDeployment) {
      appGuid = await getAppGuid(`${appName}`);
      console.log('App found', appName);
    } else {
      try {
        appGuid = await getAppGuid(`${appName}-green`);
        appName = `${appName}-green`;
        console.log('App found', appName);
      } catch (e) {
        console.log('App not found', appName, 'trying blue');
        appGuid = await getAppGuid(`${appName}-blue`);
        appName = `${appName}-blue`;
        console.log('App found', appName);
      }
    }
  } catch (e) {
    throw new Error(`could not get the app guid for ${appName}`);
  }
  if (appGuid == '') throw new Error('App not found');
  return appName;
};
