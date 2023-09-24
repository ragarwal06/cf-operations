import { type SSHUrlGenerator } from './tunnel-generic.js';

export const kafkaUrlGenerator: SSHUrlGenerator = (credentials) => {
  credentials.keyformat = '';
  return credentials.cluster['brokers.client_ssl'].split(',')[0];
};
