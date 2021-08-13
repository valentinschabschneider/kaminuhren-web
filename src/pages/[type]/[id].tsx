import { useRouter } from 'next/router';

import { useQuery } from 'react-query';

import { Box, Center, Text, Heading } from '@chakra-ui/react';

import { Clock } from '@/types';
import Loading from '@/components/Loading';
import getStore from '@/utils/store';
import ClockDetail from '@/components/ClockDetail';
import ErrorPage from '@/components/Error';
import { getClockTypeByLink } from '@/utils/misc';

const fetchClock = (type: string, id: number): Promise<Clock> =>
  fetch(`/api/${type}/${id}`).then((response) => {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  });

export const useClock = (type: string, id: number) =>
  useQuery<Clock, Error>(['clock', { type, id }], () => {
    const useStore = getStore(type);
    const clocks = useStore.getState().clocks;

    const storedClock = clocks.find((c) => c.id == id);
    if (storedClock) return storedClock;

    const addClock = useStore.getState().addClock;

    return fetchClock(type, id).then((clock) => {
      console.log('wat');
      addClock(clock);
      return clock;
    });
  });

export default function ClockPage() {
  const router = useRouter();

  if (!router.isReady) return <Loading />;

  const type = String(router.query.type);
  const id = Number(router.query.id);

  const { isLoading, error, data: clock } = useClock(type, id);

  if (error) return <ErrorPage />;

  if (isLoading) return <Loading />;

  return (
    <Center>
      <Box m="5" maxWidth="1000">
        <Heading mb="5">
          {getClockTypeByLink(clock!.type)?.singularDisplayName} #{clock!.id}
        </Heading>
        <ClockDetail clock={clock!} />
      </Box>
    </Center>
  );
}
