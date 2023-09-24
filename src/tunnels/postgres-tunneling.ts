import { type SSHUrlGenerator } from './tunnel-generic.js';

export const postgresUrlGenerator: SSHUrlGenerator = (credentials) => {
  return `${credentials.hostname}:${credentials.port}`;
};
