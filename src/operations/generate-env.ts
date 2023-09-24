import { type AppProps } from '@/types/app-props.js';
import { prepareUserEnv } from '@/utils/prepare-user-env.js';
import { writeFile } from 'fs/promises';
import { getEnvForApp } from './get-env.js';
import { config } from 'dotenv';

export const generateDotEnv = async ({ appName, isBGDeployment = false }: AppProps) => {
  // get env
  const { vcapServices, vcapApplication, userProvidedEnv } = await getEnvForApp({
    appName,
    isBGDeployment,
  });

  // prepare env file
  const envFile = [
    `VCAP_SERVICES=${JSON.stringify(vcapServices)}`,
    `VCAP_APPLICATION=${JSON.stringify(vcapApplication)}`,
    `${prepareUserEnv(userProvidedEnv)}`,
  ];

  await writeFile('.generated.env', envFile.join('\n'));
  const output = config({ path: '.generated.env' });
  if (output.error) throw new Error('could not load env');
  return envFile;
};
