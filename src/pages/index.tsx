import { useState, useEffect } from 'react';

import NextLink from 'next/link';

import { useQuery } from 'react-query';

import InfiniteScroll from 'react-infinite-scroll-component';

import { PulseLoader, GridLoader } from 'react-spinners';

import {
  SimpleGrid,
  Box,
  Image,
  Text,
  AspectRatio,
  Link,
  Skeleton,
  SkeletonText,
  Center,
} from '@chakra-ui/react';

import { Clock } from './api/clock/[id]';
import { fetchClock, IMAGE_NOT_FOUND_URL } from './clock/[id]';

export const fetchClockIds = async (): Promise<number[]> => {
  const res = await fetch(`/api/clocks`);
  return res.json().then((data) => data.data);
};

interface ClockCardProps {
  id: number;
}

const ClockCard = ({ id }: ClockCardProps) => {
  const { isLoading, error, data } = useQuery<Clock, Error>(
    ['clock', { id }],
    () => fetchClock(id),
  );

  if (error) return <p>An error has occurred: {error.message}</p>;

  return (
    <Box
      maxW="sm"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      height={375}
      width={260}
      _hover={{
        transform: 'scale3d(1.05, 1.05, 1)',
      }}
      style={{ transition: 'transform 0.15s ease-in-out' }}
    >
      <NextLink href={`/clock/${id}`} passHref>
        <Link style={{ textDecoration: 'none' }}>
          <AspectRatio ratio={1 / 1.2}>
            <Skeleton isLoaded={!isLoading}>
              <Image
                src={data?.thumbnailUrl || IMAGE_NOT_FOUND_URL}
                fallbackSrc={IMAGE_NOT_FOUND_URL}
                alt={data?.name}
                objectFit="cover"
                width="full"
                height="full"
              />
            </Skeleton>
          </AspectRatio>
          <Box p="5">
            <Text isTruncated>{data?.description}</Text>
            <SkeletonText isLoaded={!isLoading} mt="3" noOfLines={1} />
          </Box>
        </Link>
      </NextLink>
    </Box>
  );
};

export default function Home() {
  const [clockIds, setClockIds] = useState<number[]>([]);
  const [displayedClocksAmount, setDisplayedClocksAmount] =
    useState<number>(18);
  const [isLoading, setIsLoading] = useState(true);

  const getClockIds = async () => {
    setIsLoading(true);
    fetchClockIds().then((ids) => {
      setClockIds(ids.sort((a, b) => a - b));
      setIsLoading(false);
    });
  };

  useEffect(() => {
    getClockIds();
  }, []);

  const displayMoreClocks = async (additionalAmount: number) => {
    setDisplayedClocksAmount((a) => (a += additionalAmount));
  };

  if (isLoading)
    return (
      <Center height="100vh">
        <GridLoader size={50} color="#696969" />
      </Center>
    );

  return (
    <InfiniteScroll
      dataLength={displayedClocksAmount}
      next={() => displayMoreClocks(18)}
      hasMore={clockIds.length > displayedClocksAmount}
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
        {clockIds.slice(0, displayedClocksAmount).map((id) => (
          <ClockCard key={id} id={id} />
        ))}
      </SimpleGrid>
    </InfiniteScroll>
  );
}
