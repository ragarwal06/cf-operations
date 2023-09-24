import { type ApplicationConfig } from 'cfenv';

export const getSSHEndpoint = (vcapApplication: ApplicationConfig = {}) => {
  const { cf_api } = vcapApplication;
  return cf_api.replace('https://api', 'ssh');
};
