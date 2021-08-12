import { useState } from 'react';

import {
  Box,
  Image,
  Text,
  AspectRatio,
  Skeleton,
  SkeletonText,
  Code,
  Link,
} from '@chakra-ui/react';

import { useClock } from '@/pages/[type]/[id]';
import { getClockTypeByLink } from '@/utils/misc';
import { IMAGE_NOT_FOUND_URL } from '@/constants';
import { Clock } from '@/types';
import Error from '@/components/Error';

interface ClockCardProps {
  type: string;
  id: number;
  onClick: (clock: Clock) => void;
}

const ClockCard: React.FC<ClockCardProps> = ({ type, id, onClick }) => {
  const { isLoading, error, data: clock } = useClock(type, id);

  const [thumbnailLoaded, setThumbnailLoaded] = useState<boolean>(false);

  if (error) return <Error />;

  return (
    <Link
      key={id}
      href={`/${type}/${id}`}
      textDecoration="none !important"
      onClick={(e) => {
        // open link normally when clock has not been loaded yet
        if (clock) {
          e.preventDefault();
          onClick(clock!);
        }
      }}
      boxShadow="none !important"
    >
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
  );
};

export default ClockCard;
