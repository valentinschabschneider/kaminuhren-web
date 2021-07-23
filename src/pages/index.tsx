import { useEffect, useState } from 'react';
import { Clock } from './api/clocks';

export default function Home() {
  const [clocks, setClocks] = useState<Clock[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    fetch('/api/clocks/')
      .then((response) => response.json())
      .then((data) => {
        setClocks(data.clocks); // Set the clocks variable
        setIsLoading(false);
      });
  }, []);

  return (
    <>
      {isLoading ? (
        'loading'
      ) : (
        <ul>
          {' '}
          {clocks.map((clock) => (
            <li>{clock.name}</li>
          ))}{' '}
        </ul>
      )}
    </>
  );
}
