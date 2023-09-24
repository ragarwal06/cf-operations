import { Client, type ClientChannel } from 'ssh2';
import net from 'net';

interface SSHTunnelArgs {
  host: string;
  port?: number;
  username: string;
  password: string;
  localHost?: string;
  localPort?: number;
  remoteHost: string;
  remotePort: number;
}

const createClient = async ({ host, port = 2222, username, password }: SSHTunnelArgs) => {
  const client = new Client();

  return new Promise<Client>((resolve, reject) => {
    client.on('ready', () => {
      resolve(client);
    });

    client.on('error', () => {
      return reject(new Error('SSH tunnelling error -> try updating your .env file'));
    });
    client.connect({
      host,
      port,
      username,
      password,
      readyTimeout: 50000000,
      tryKeyboard: false,
      keepaliveCountMax: 50000000,
    });
  });
};

const createTunnel = async (
  { localHost = 'localhost', localPort = 9094, remoteHost, remotePort }: SSHTunnelArgs,
  client: Client
) => {
  return new Promise<ClientChannel>((resolve, reject) => {
    client.forwardOut(localHost, localPort, remoteHost, remotePort, (err, stream) => {
      if (err) return reject(new Error('SSH tunnelling error while port forward out'));
      resolve(stream);
    });
  });
};

export const startSSHTunnel = async (args: SSHTunnelArgs) => {
  const client = await createClient(args);
  return new Promise<boolean>((resolve, reject) => {
    const server = net.createServer((connection) => {
      createTunnel(args, client)
        .then((stream) => {
          connection.pipe(stream).pipe(connection);
          console.log(`Connected to ${args.remoteHost}:${args.remotePort}`);
          return true;
        })
        .then((result) => {
          resolve(result);
        })
        .catch((error) => {
          reject(error);
        });
    });
    server.on('error', () => {
      client.end();
      return reject(new Error('SSH tunnelling error'));
    });
    server.on('close', () => {
      client.end();
      return reject(new Error('SSH tunnel closed'));
    });
    server.listen(args.localPort, args.localHost, () => {
      console.log(`Tunnel listening on port ${args.localPort}`);
    });
  });
};
