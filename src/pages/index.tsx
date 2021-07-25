import { useState } from 'react';

import Link from 'next/link';

import { Button } from '@chakra-ui/react';

import { Clock } from './api/clock/[id]';
import { getClock, IMAGE_NOT_FOUND_URL } from './clock/[id]';

export const getClockIds = async (): Promise<number[]> => {
  return fetch(`/api/clocks`).then((response) =>
    response.json().then((data) => data.data),
  );
};

export default function Home() {
  const [clocks, setClocks] = useState<Clock[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getClocks = async () => {
    setIsLoading(true);
    await setClocks([]);
    const requets = await getClockIds().then((ids) =>
      ids.map((id) =>
        getClock(id).then((clock) => {
          return setClocks((state) => [...state, clock]);
        }),
      ),
    );
    await Promise.all(requets).then(() => setIsLoading(false));
  };

  return (
    <>
      <Button
        isLoading={isLoading}
        loadingText="Loading"
        colorScheme="teal"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          getClocks();
        }}
      >
        Load Clocks
      </Button>
      {isLoading && clocks.length < 10 ? (
        <></>
      ) : (
        <ul>
          {clocks
            .sort((a, b) => a.id - b.id)
            .map((clock) => (
              <li key={clock.id}>
                <Link href={`/clock/${clock.id}`}>{clock.name}</Link>
                <img
                  src={
                    clock.imageUrls?.length
                      ? clock.imageUrls[0]
                      : IMAGE_NOT_FOUND_URL
                  }
                  onError={(e) => {
                    const image = e.target as HTMLImageElement;
                    image.src = IMAGE_NOT_FOUND_URL;
                  }}
                  width={100}
                />
              </li>
            ))}
        </ul>
      )}
    </>
  );
}
