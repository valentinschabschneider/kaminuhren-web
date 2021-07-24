import { createClient } from 'webdav';

export const OWNCLOUD_ROOT = '/Hagenbrunn/Kaminuhren';

export const getClient = () => {
  return createClient(process.env.OWNCLOUD_URL!, {
    username: process.env.OWNCLOUD_USERNAME,
    password: process.env.OWNCLOUD_PASSWORD,
  });
};
