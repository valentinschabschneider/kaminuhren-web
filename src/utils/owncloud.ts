import { createClient } from 'webdav';

export const OWNCLOUD_SHARE_URL = process.env.OWNCLOUD_SHARE_URL;

export const getClient = () => {
  return createClient(process.env.OWNCLOUD_URL!, {
    username: process.env.OWNCLOUD_USERNAME,
    password: process.env.OWNCLOUD_PASSWORD,
  });
};

export const CLOCK_TYPES = [
  {
    singularDisplayName: 'Kaminuhr',
    pluralDisplayName: 'Kaminuhren',
    link: 'kaminuhren',
  },
  {
    singularDisplayName: 'Wanduhr',
    pluralDisplayName: 'Wanduhren',
    link: 'wanduhren',
  },
  {
    singularDisplayName: 'Schale und Leuchter',
    pluralDisplayName: 'Schalen und Leuchter',
    link: 'schalen-und-leuchter',
  },
  {
    singularDisplayName: 'Burgunderuhr',
    pluralDisplayName: 'Burgunderuhren',
    link: 'burgunderuhren',
  },
];

export const getClockTypeByLink = (link: string) =>
  CLOCK_TYPES.find((x) => x.link == link);
