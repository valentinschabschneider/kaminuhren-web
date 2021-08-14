import { useState } from 'react';

import { useRouter } from 'next/router';
import Head from 'next/head';

import { useQuery } from 'react-query';

import InfiniteScroll from 'react-infinite-scroll-component';

import { PulseLoader } from 'react-spinners';

import {
  SimpleGrid,
  Text,
  Center,
  useDisclosure,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Box,
} from '@chakra-ui/react';

import getStore from '@/utils/store';
import ClockCard from '@/components/ClockCard';
import Loading from '@/components/Loading';
import { getClockTypeByLink } from '@/utils/misc';
import ClockModal from '@/components/ClockModal';
import ErrorPage from '@/components/Error';
import { Clock } from '@/types';
import { CLOCK_STEP_AMOUNT } from '@/constants';

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

  const [startClocksAt, setStartClocksAt] = useState<number>(
    (Number(router.query.start) || 1) - 1,
  );

  const handleChange = (_: string, value: number) => {
    router.push(`/${clockType.link}?start=${value}`, undefined, {
      shallow: true,
    });
    setStartClocksAt(value - 1);
    setDisplayedClocksAmount(CLOCK_STEP_AMOUNT);
  };

  if (isLoading) return <Loading />;

  return (
    <>
      <Head>
        <title>{clockType.pluralDisplayName}</title>
      </Head>
      {!isLoading && clockIds.length > CLOCK_STEP_AMOUNT && (
        <Center>
          <Box maxWidth={900}>
            <Text>Uhren anzeigen ab Nummer: </Text>
            <NumberInput
              step={10}
              defaultValue={startClocksAt + 1}
              min={1}
              max={clockIds!.length}
              onChange={handleChange}
              maxWidth="80px"
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </Box>
        </Center>
      )}
      <InfiniteScroll
        dataLength={displayedClocksAmount}
        next={() => displayMoreClocks(CLOCK_STEP_AMOUNT)}
        hasMore={clockIds!.length > startClocksAt + displayedClocksAmount}
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
          {clockIds!
            .slice(startClocksAt, startClocksAt + displayedClocksAmount)
            .map((id) => (
              <ClockCard
                key={id}
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
