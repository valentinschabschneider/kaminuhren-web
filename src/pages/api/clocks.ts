import type { NextApiRequest, NextApiResponse } from 'next';

import { createClient, FileStat } from 'webdav';

const OWNCLOUD_ROOT = '/Hagenbrunn/Kaminuhren';

export type Clock = {
  name: string;
};

type Data = {
  clocks: Clock[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const client = createClient(process.env.OWNCLOUD_URL!, {
    username: process.env.OWNCLOUD_USERNAME,
    password: process.env.OWNCLOUD_PASSWORD,
  });
  const directoryItems = (await client.getDirectoryContents(OWNCLOUD_ROOT, {
    glob: 'Kaminuhr-*',
  })) as FileStat[];

  res.status(200).json({
    clocks: directoryItems.map((dir) => {
      return { name: dir.basename };
    }),
  });
}
