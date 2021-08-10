import { useRouter } from 'next/router';
import Head from 'next/head';

import { useQuery } from 'react-query';

import { Clock } from '@/pages/api/[type]/[id]';
import getStore from '@/utils/store';
import Loading from '@/components/Loading';
import { getClockTypeByLink } from '@/utils/owncloud';

export const IMAGE_NOT_FOUND_URL =
  'https://www.freeiconspng.com/uploads/no-image-icon-4.png';

const fetchClock = (type: string, id: number): Promise<Clock> =>
  fetch(`/api/${type}/${id}`).then((response) => response.json());

export const useClock = (type: string, id: number) =>
  useQuery<Clock, Error>(['clock', { type, id }], () => {
    const useStore = getStore(type);
    const clocks = useStore.getState().clocks;

    const storedClock = clocks.find((c) => c.id == id);
    if (storedClock) return storedClock;

    const addClock = useStore.getState().addClock;

    return fetchClock(type, id).then((clock) => {
      addClock(clock);
      return clock;
    });
  });

export default function ClockPage() {
  const router = useRouter();

  if (!router.isReady) return <Loading />;

  const clockType = String(router.query.type);
  const id = Number(router.query.id);

  const { isLoading, error, data: clock } = useClock(clockType, id);

  if (isLoading) return <Loading />;

  return (
    <>
      <Head>
        <title>
          {getClockTypeByLink(clockType)?.singularDisplayName} #{id}
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
}
