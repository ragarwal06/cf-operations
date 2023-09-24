import { type GenericType } from '@/types/generic.js';
import { executeCommandAsync } from '@/utils/execute-command.js';
import { type ServicesConfig, type ApplicationConfig } from 'cfenv';

export const getAppEnv = async (appGuid: string) => {
  const { stdout, stderr } = await executeCommandAsync(`cf curl /v2/apps/${appGuid}/env`);
  if (stderr) throw new Error(stderr);

  const {
    system_env_json: { VCAP_SERVICES: vcapServices },
    application_env_json: { VCAP_APPLICATION: vcapApplication },
    environment_json: userProvidedEnv,
  } = JSON.parse(stdout.trim());

  return {
    vcapServices: vcapServices as ServicesConfig,
    vcapApplication: vcapApplication as ApplicationConfig,
    userProvidedEnv: userProvidedEnv as GenericType,
  };
};
