import { useState } from 'react';

import { useRouter } from 'next/router';
import Head from 'next/head';

import { useQuery } from 'react-query';

import InfiniteScroll from 'react-infinite-scroll-component';

import { PulseLoader, GridLoader } from 'react-spinners';

import { SimpleGrid, Text, Center } from '@chakra-ui/react';

import getStore from '@/utils/store';

import ClockCard from '@/components/ClockCard';
import Loading from '@/components/Loading';
import { getClockTypeByLink } from '@/utils/owncloud';

const fetchClockIds = (type: string): Promise<number[]> =>
  fetch(`/api/${type}`).then((response) =>
    response.json().then((data) => data.data),
  );

const useClockIds = (type: string) =>
  useQuery<void, Error>(['clockIds', { type }], () => {
    const useStore = getStore(type);
    const clockIds = useStore.getState().clockIds;
    const setClockIds = useStore.getState().setClockIds;
    if (!clockIds.length)
      return fetchClockIds(type).then((data) => setClockIds(data));
  });

export default function ClocksList() {
  const router = useRouter();

  if (!router.isReady) return <Loading />;

  const clockType = String(router.query.type);

  const useStore = getStore(clockType);
  const clockIds = useStore((state) => state.clockIds);

  const { isLoading, error } = useClockIds(clockType);

  const [displayedClocksAmount, setDisplayedClocksAmount] =
    useState<number>(18);

  const displayMoreClocks = async (additionalAmount: number) => {
    setDisplayedClocksAmount((a) => (a += additionalAmount));
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <Head>
        <title>{getClockTypeByLink(clockType)?.pluralDisplayName}</title>
      </Head>
      <InfiniteScroll
        dataLength={displayedClocksAmount}
        next={() => displayMoreClocks(18)}
        hasMore={clockIds!.length > displayedClocksAmount}
        loader={
          <Center my={5}>
            <PulseLoader color="#696969" />
          </Center>
        }
        endMessage={
          <Center marginBottom={5}>
            <Text fontWeight={700}>Hier gibt es nichts mehr zu sehen :)</Text>
          </Center>
        }
      >
        <SimpleGrid
          minChildWidth={260}
          spacing="30px"
          width="full"
          maxWidth={900}
          placeItems="center"
          padding={5}
        >
          {clockIds!.slice(0, displayedClocksAmount).map((id) => (
            <ClockCard key={id} type={clockType} id={id} />
          ))}
        </SimpleGrid>
      </InfiniteScroll>
    </>
  );
}
