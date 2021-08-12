import Head from 'next/head';

import { getClockTypeByLink } from '@/utils/misc';
import { IMAGE_NOT_FOUND_URL } from '@/constants';
import { Clock } from '@/types';

interface ClockDetailProps {
  clock: Clock;
}

const ClockDetail: React.FC<ClockDetailProps> = ({ clock }) => {
  return (
    <>
      <Head>
        <title>
          {getClockTypeByLink(clock.type)?.singularDisplayName} #{clock.id}
        </title>
      </Head>
      <p>{clock?.description}</p>
      {clock?.qrCodeUrl !== undefined ? (
        <img
          src={clock!.qrCodeUrl}
          onError={(e) => {
            const image = e.target as HTMLImageElement;
            image.src = IMAGE_NOT_FOUND_URL;
          }}
        />
      ) : (
        <p>missing qr code</p>
      )}
      {clock?.imageUrls !== undefined && clock?.imageUrls.length > 0 ? (
        clock?.imageUrls.map((url) => (
          <img
            src={url}
            onError={(e) => {
              const image = e.target as HTMLImageElement;
              image.src = IMAGE_NOT_FOUND_URL;
            }}
          />
        ))
      ) : (
        <p>no images</p>
      )}
    </>
  );
};

export default ClockDetail;
