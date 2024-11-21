import * as net from 'net';

const getAvailablePort = async (
  preferredPort: number,
  fallbackPort: number,
): Promise<number> => {
  return new Promise((resolve) => {
    const server = net.createServer();

    server.once('error', () => {
      resolve(fallbackPort); // If the preferred port is in use, resolve with the fallback port
    });

    server.once('listening', () => {
      server.close();
      resolve(preferredPort); // If the preferred port is free, resolve with it
    });

    server.listen(preferredPort);
  });
};

export default getAvailablePort;
