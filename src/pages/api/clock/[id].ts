import type { NextApiRequest, NextApiResponse } from 'next';
import { FileStat } from 'webdav';

import {
  getClient,
  OWNCLOUD_ROOT,
  OWNCLOUD_SHARE_URL,
} from '../../../utils/owncloud';

const zeroPad = (num: number, places: number) =>
  String(num).padStart(places, '0');

const getFileUrl = (clockId: number, file: string) => {
  return `${OWNCLOUD_SHARE_URL}/download?path=/${clockId}&files=${file}`;
};

export type Clock = {
  id: number;
  name: string;
  description: string | undefined;
  qrCodeUrl: string | undefined;
  thumbnailUrl: string | undefined;
  imageUrls: string[];
};

export const getClock = async (id: number): Promise<Clock> => {
  const client = getClient();

  const name = `Kaminuhr-${zeroPad(id, 4)}`;

  const directoryPath = OWNCLOUD_ROOT + `/${id}`;

  const description = await client
    .getFileContents(directoryPath + '/description.txt', {
      format: 'text',
    })
    .catch((error) => undefined);

  const qrCodeUrl = getFileUrl(id, 'qr-code.png');

  const thumbnailUrl = getFileUrl(id, 'thumbnail.jpg');

  const images: FileStat[] = [];

  images.push(
    ...((await client.getDirectoryContents(directoryPath, {
      glob: 'image-*.jpg',
    })) as FileStat[]),
  );

  // images.push(
  //   ...((await client.getDirectoryContents(directoryPath, {
  //     glob: '*.JPG',
  //   })) as FileStat[]),
  // );

  const imageUrls = images.map((image) => getFileUrl(id, image.basename));

  return {
    id,
    name,
    description: String(description),
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
    query: { id: idStr },
    method,
  } = req;

  const id = Number(idStr);

  switch (method) {
    case 'GET':
      res.status(200).json(await getClock(id));
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
