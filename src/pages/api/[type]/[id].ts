import type { NextApiRequest, NextApiResponse } from 'next';
import { FileStat } from 'webdav';

import { getClient, OWNCLOUD_SHARE_URL } from '@/utils/owncloud';
import { Clock } from '@/types';

const getFileUrl = (clockType: string, clockId: number, file: string) => {
  return `${OWNCLOUD_SHARE_URL}/download?path=/${clockType}/${clockId}&files=${file}`;
};

export const getClock = async (type: string, id: number): Promise<Clock> => {
  const client = getClient();

  const directoryPath = `/${type}/${id}`;

  const description = await client
    .getFileContents(directoryPath + '/description.txt', {
      format: 'text',
    })
    .then((text) => {
      const str = String(text);
      if (str.replace(/\s/g, '').length)
        return str.split('\r\n').filter((row) => row.replace(/\s/g, '').length);
      else return undefined;
    })
    .catch((error) => undefined);

  const qrCodeUrl = getFileUrl(type, id, 'qr-code.png');

  const thumbnailUrl = getFileUrl(type, id, 'thumbnail.jpg');

  const images: FileStat[] = [];

  images.push(
    ...((await client.getDirectoryContents(directoryPath, {
      glob: 'image-*.jpg',
    })) as FileStat[]),
  );

  const imageUrls = images.map((image) => getFileUrl(type, id, image.basename));

  return {
    id,
    type,
    description,
    qrCodeUrl,
    thumbnailUrl,
    imageUrls,
  };
};

export default async function clockHandler(
  req: NextApiRequest,
  res: NextApiResponse<Clock>,
) {
  const {
    query: { type, id },
    method,
  } = req;

  switch (method) {
    case 'GET':
      res.status(200).json(await getClock(String(type), Number(id)));
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
