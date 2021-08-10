import { useState } from 'react';

import NextLink from 'next/link';

import {
  Box,
  Image,
  Text,
  AspectRatio,
  Link,
  Skeleton,
  SkeletonText,
  Code,
} from '@chakra-ui/react';

import { useClock, IMAGE_NOT_FOUND_URL } from '@/pages/[type]/[id]';
import { getClockTypeByLink } from '@/utils/owncloud';

interface ClockCardProps {
  type: string;
  id: number;
}

const ClockCard = ({ type, id }: ClockCardProps) => {
  const { isLoading, error, data: clock } = useClock(type, id);

  const [thumbnailLoaded, setThumbnailLoaded] = useState<boolean>(false);

  if (error) return <p>An error has occurred: {error.message}</p>;

  return (
    <NextLink href={`/${type}/${id}`} passHref>
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
          <AspectRatio ratio={1 / 1.2} borderBottomWidth="1px">
            <Skeleton isLoaded={!isLoading && thumbnailLoaded}>
              <Image
                src={clock?.thumbnailUrl || IMAGE_NOT_FOUND_URL}
                alt={`${getClockTypeByLink(type)?.singularDisplayName} #${id}`}
                objectFit="cover"
                width="full"
                height="full"
                onLoad={() => setThumbnailLoaded(true)}
                border={0}
                textAlign="center"
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
            <Text isTruncated>{clock?.description}</Text>
            <SkeletonText isLoaded={!isLoading} mt="3" noOfLines={1} />
          </Box>
        </Box>
      </Link>
    </NextLink>
  );
};

export default ClockCard;
