import type { NextApiRequest, NextApiResponse } from 'next';

import { getClient, OWNCLOUD_ROOT } from '../../../utils/owncloud';

const zeroPad = (num: number, places: number) =>
  String(num).padStart(places, '0');

export type Clock = {
  id: number;
  name: string;
  description: string | undefined;
  qrCodeUrl: string | undefined;
};

export const getClock = async (id: number): Promise<Clock> => {
  const client = getClient();

  const name = `Kaminuhr-${zeroPad(id, 4)}`;

  const description = await client
    .getFileContents(OWNCLOUD_ROOT + `/${name}/Beschreibung.txt`, {
      format: 'text',
    })
    .catch((error) => undefined);

  const qrCodeUrl = client.getFileDownloadLink(
    OWNCLOUD_ROOT + `/${name}/${name}.png`,
  );

  const censoredQrCodeUrl = 'https://' + qrCodeUrl.split('@')[1];

  return {
    id,
    name,
    description: String(description),
    qrCodeUrl: censoredQrCodeUrl,
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
      // Get data from your database
      res.status(200).json(await getClock(id));
      break;
    default:
      res.setHeader('Allow', ['GET']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
