import { useState } from 'react';

import NextLink from 'next/link';

import { useQuery } from 'react-query';

import {
  Button,
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
      height={330}
      width={260}
      _hover={{
        transform: 'scale3d(1.05, 1.05, 1)',
      }}
      style={{ transition: 'transform 0.15s ease-in-out' }}
    >
      <NextLink href={`/clock/${id}`} passHref>
        <Link style={{ textDecoration: 'none' }}>
          <AspectRatio ratio={1}>
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
  const [isLoading, setIsLoading] = useState(false);

  const getClockIds = async () => {
    setIsLoading(true);
    fetchClockIds().then((ids) => {
      setClockIds(ids.sort((a, b) => a - b));
      setIsLoading(false);
    });
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
          getClockIds();
        }}
      >
        Load Clocks
      </Button>
      {!isLoading && (
        <Center>
          <SimpleGrid
            minChildWidth={260}
            spacing={40}
            width="full"
            maxWidth={900}
            placeItems="center"
          >
            {clockIds.map((id) => (
              <ClockCard key={id} id={id} />
            ))}
          </SimpleGrid>
        </Center>
      )}
    </>
  );
}
