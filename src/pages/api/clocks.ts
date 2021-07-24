import type { NextApiRequest, NextApiResponse } from 'next';

import { FileStat } from 'webdav';

import { getClient, OWNCLOUD_ROOT } from '../../utils/owncloud';

type Data = {
  data: number[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const client = getClient();
  const directoryItems = (await client.getDirectoryContents(OWNCLOUD_ROOT, {
    glob: 'Kaminuhr-*',
  })) as FileStat[];

  res.status(200).json({
    data: directoryItems.map((dir) => Number(dir.basename.split('-')[1])),
  });
}
