import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';

import { Clock } from '../api/clock/[id]';

export const IMAGE_NOT_FOUND_URL =
  'https://www.freeiconspng.com/uploads/no-image-icon-4.png';

export const fetchClock = async (id: number): Promise<Clock> => {
  const res = await fetch(`/api/clock/${id}`);
  return res.json();
};

export default function ClockPage() {
  const router = useRouter();
  const { id } = router.query;

  const [clock, setClock] = useState<Clock>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    if (id !== undefined)
      fetchClock(Number(id)).then((clock) => {
        setClock(clock); // Set the clocks variable
        setIsLoading(false);
      });
  }, [id]);

  return (
    <>
      {isLoading ? (
        'loading...'
      ) : (
        <>
          <p>{clock?.name}</p>
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
      )}
    </>
  );
}
