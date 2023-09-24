import { type AppProps } from '@/types/app-props.js';
import { getSSHEndpoint } from '@/cf/get-ssh-endpoint.js';
import { getSSHCode } from '@/cf/get-ssh-code.js';
import { getAppGuid, resolveAppName } from '@/cf/get-app-guid.js';
import { startSSHTunnel } from '@/cf/tunnel.js';
import { initSSH } from '@/cf/ssh-checker.js';
import { getAppEnv } from '@/cf/app-env.js';
import { type SSHUrlGenerator } from '@/tunnels/tunnel-generic.js';
import { kafkaUrlGenerator } from '@/tunnels/kafka-tunneling.js';
import { postgresUrlGenerator } from '@/tunnels/postgres-tunneling.js';

export interface StartTunneling {
  urlGenerator?: SSHUrlGenerator;
  serviceName: string;
  outPort?: number;
}

export const startTunneling = async ({
  appName,
  isBGDeployment = false,
  serviceName,
  outPort = 9094,
  urlGenerator,
}: AppProps & StartTunneling) => {
  // get app guid
  appName = await resolveAppName({ appName, isBGDeployment });
  const appGuid = await getAppGuid(appName);

  // check ssh enabled
  await initSSH(appName);

  // get env
  const { vcapApplication, vcapServices } = await getAppEnv(appGuid);

  // get ssh endpoint
  const endpoint = await getSSHEndpoint(vcapApplication);

  // get ssh code
  const code = await getSSHCode();

  // get app url
  let url = '';
  try {
    const service = vcapServices[serviceName];
    if (service == undefined || (Array.isArray(service) && service.length == 0))
      throw new Error('service not found');

    const credentials = service[0]?.credentials;
    if (credentials == undefined) throw new Error('credentials not found');

    if (urlGenerator == undefined)
      switch (serviceName) {
        case 'kafka':
          urlGenerator = kafkaUrlGenerator;
          break;
        case 'postgresql-db':
          urlGenerator = postgresUrlGenerator;
          break;
        default:
          throw new Error('url generator func not defined');
      }
    url = urlGenerator(credentials);
  } catch (e) {
    url = '';
  }

  // get url
  if (url == '') throw new Error('could not get ssh url');

  return new Promise<boolean>((resolve, reject) => {
    // connect tunnel
    startSSHTunnel({
      host: endpoint,
      username: `cf:${appGuid}/0`,
      password: code,
      localPort: outPort,
      remoteHost: url.split(':')[0] ?? '',
      remotePort: Number(url.split(':')[1]),
    })
      .then(() => {
        console.log('ssh operation successfully');
        resolve(true);
      })
      .catch((e) => {
        console.error(e);
        reject(new Error('could not establish ssh'));
        process.exit(1);
      });
  });
};
