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
  Code,
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
    <NextLink href={`/clock/${id}`} passHref>
      <Link textDecoration="none !important">
        <Box
          maxW="sm"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          height={375}
          width={260}
          position="relative"
          transition="transform 0.15s ease-in-out"
          _hover={{
            transform: 'scale3d(1.05, 1.05, 1)',
          }}
        >
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
          <Code
            position="absolute"
            padding="0 5px"
            borderBottomRightRadius="lg"
            borderWidth="0 1px 1px 0"
            background="#1a202c"
            color="#ededed"
            top="0"
          >
            {'#' + id}
          </Code>
          <Box p="5">
            <Text isTruncated>{data?.description}</Text>
            <SkeletonText isLoaded={!isLoading} mt="3" noOfLines={1} />
          </Box>
        </Box>
      </Link>
    </NextLink>
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
