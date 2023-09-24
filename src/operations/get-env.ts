import { getAppEnv } from '@/cf/app-env.js';
import { findAppAndGetGuid } from '@/cf/get-app-guid.js';
import { checkCfLoggedIn } from '@/cf/login-check.js';
import { type AppProps } from '@/types/app-props.js';

export const getEnvForApp = async ({ appName, isBGDeployment = false }: AppProps) => {
  // step 1
  // check if logged into cf
  try {
    await checkCfLoggedIn();
  } catch (e) {
    throw new Error('Please login to CF first');
  }

  // return env
  return await getAppEnv(await findAppAndGetGuid({ appName: appName.trim(), isBGDeployment }));
};
