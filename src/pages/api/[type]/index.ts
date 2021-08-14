import type { NextApiRequest, NextApiResponse } from 'next';

import { FileStat } from 'webdav';

import { getClient } from '@/utils/owncloud';

type Data = {
  data: number[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  const {
    query: { type },
  } = req;

  const client = getClient();
  const directoryItems = (await client.getDirectoryContents(String(type), {
    glob: '*',
  })) as FileStat[];

  res.status(200).json({
    data: directoryItems
      .map((dir) => Number(dir.basename))
      .filter((id) => !isNaN(id))
      .sort((a, b) => a - b),
  });
}
