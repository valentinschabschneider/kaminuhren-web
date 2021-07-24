import { useEffect, useState } from 'react';

import Link from 'next/link';

import { Button } from '@chakra-ui/react';

import { Clock } from './api/clock/[id]';
import { getClock } from './clock/[id]';

export const getClockIds = async (): Promise<number[]> => {
  return fetch(`/api/clocks`).then((response) =>
    response.json().then((data) => data.data),
  );
};

export default function Home() {
  const [clocks, setClocks] = useState<Clock[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const getClocks = () => {
    setIsLoading(true);
    getClockIds().then((ids) => {
      ids.forEach((id: number) => {
        getClock(id).then((clock) => setClocks((state) => [...state, clock]));
      });
      setIsLoading(false);
    });
  };

  // useEffect(() => {
  //   getClocks()
  // }, []);

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
      {isLoading && clocks.length == 0 ? (
        <></>
      ) : (
        <ul>
          {clocks.map((clock) => (
            <li key={clock.id}>
              <Link href={`/clock/${clock.id}`}>{clock.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
