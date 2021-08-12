import { useState } from 'react';

import { useRouter } from 'next/router';
import Head from 'next/head';

import { useQuery } from 'react-query';

import InfiniteScroll from 'react-infinite-scroll-component';

import { PulseLoader } from 'react-spinners';

import { SimpleGrid, Text, Center, useDisclosure } from '@chakra-ui/react';

import getStore from '@/utils/store';

import ClockCard from '@/components/ClockCard';
import Loading from '@/components/Loading';
import { getClockTypeByLink } from '@/utils/misc';
import ClockModal from '@/components/ClockModal';
import ErrorPage from '@/components/Error';
import { Clock } from '@/types';

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

  const clockType = getClockTypeByLink(String(router.query.type));

  const useStore = getStore(clockType.link);
  const clockIds = useStore((state) => state.clockIds);

  const { isLoading, error } = useClockIds(clockType.link);

  if (error) return <ErrorPage />;

  const [displayedClocksAmount, setDisplayedClocksAmount] =
    useState<number>(18);

  const displayMoreClocks = async (additionalAmount: number) => {
    setDisplayedClocksAmount((a) => (a += additionalAmount));
  };

  const {
    isOpen: modalIsOpen,
    onOpen: modalOnOpen,
    onClose: modalOnClose,
  } = useDisclosure();

  const [openClock, setOpenClock] = useState<Clock>();

  const onClockCardOpen = (clock: Clock) => {
    setOpenClock(clock);
    history.pushState({}, '', `/${clock.type}/${clock.id}`);
    modalOnOpen();
  };

  const onClockCardClose = () => {
    history.back();
    setOpenClock(undefined);
    modalOnClose();
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <Head>
        <title>{clockType.pluralDisplayName}</title>
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
            <ClockCard
              type={clockType.link}
              id={id}
              onClick={onClockCardOpen}
            />
          ))}
        </SimpleGrid>
      </InfiniteScroll>
      {openClock && (
        <ClockModal
          clock={openClock}
          onClose={onClockCardClose}
          isOpen={modalIsOpen}
        />
      )}
    </>
  );
}
