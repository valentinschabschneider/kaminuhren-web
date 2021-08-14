import { createClient } from 'webdav';

export const OWNCLOUD_SHARE_URL = process.env.OWNCLOUD_SHARE_URL!;

export const getClient = () =>
  createClient(process.env.OWNCLOUD_URL!, {
    username: process.env.OWNCLOUD_USERNAME,
    password: process.env.OWNCLOUD_PASSWORD,
  });
