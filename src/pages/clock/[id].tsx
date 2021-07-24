import { useEffect, useState } from 'react';

import { useRouter } from 'next/router';
//import Image from 'next/image';

import { Clock } from '../api/clock/[id]';

export const getClock = async (id: number): Promise<Clock> => {
  return fetch(`/api/clock/${id}`).then((response) => response.json());
};

export default function ClockPage() {
  const router = useRouter();
  const { id } = router.query;

  const [clock, setClock] = useState<Clock>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    if (id !== undefined)
      getClock(Number(id)).then((clock) => {
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
            <img src={clock!.qrCodeUrl} />
          ) : (
            // <Image
            //   alt="QR Code"
            //   src={clock!.qrCodeUrl}
            //   width={305}
            //   height={135}
            //   layout="responsive"
            // />
            <p>missing qr code</p>
          )}
        </>
      )}
    </>
  );
}
