import Head from 'next/head';

import {
  Flex,
  Box,
  Text,
  Spacer,
  Image,
  Popover,
  PopoverTrigger,
  IconButton,
  PopoverContent,
  PopoverArrow,
  PopoverBody,
  Center,
  Skeleton,
} from '@chakra-ui/react';

import { getClockTypeByLink } from '@/utils/misc';
import { IMAGE_NOT_FOUND_URL } from '@/constants';
import { Clock } from '@/types';
import { QRCodeIcon } from '@/components/Icons';

interface ClockDetailProps {
  clock: Clock;
}

const ClockDetail: React.FC<ClockDetailProps> = ({ clock }) => {
  return (
    <>
      <Head>
        <title>
          {getClockTypeByLink(clock.type)?.singularDisplayName} #{clock.id}
        </title>
      </Head>
      <Flex>
        <Box pb="2" pr="2">
          {clock.description ? (
            clock.description.map((line) => <Text>{line}</Text>)
          ) : (
            <Text>{clock.description || 'Keine Beschreibung verfügbar.'}</Text>
          )}
        </Box>
        <Spacer />
        <Popover>
          <PopoverTrigger>
            <IconButton
              isDisabled={!clock.qrCodeUrl}
              aria-label="QR-Code"
              icon={<QRCodeIcon />}
              fontSize="30px"
            />
          </PopoverTrigger>
          <PopoverContent backgroundColor="white">
            <PopoverArrow />
            <PopoverBody>
              <Image src={clock.qrCodeUrl} fallbackSrc={IMAGE_NOT_FOUND_URL} />
            </PopoverBody>
          </PopoverContent>
        </Popover>
      </Flex>
      <Center>
        {clock?.imageUrls !== undefined && clock?.imageUrls.length > 0 ? (
          clock?.imageUrls.map((url) => (
            <Image
              src={url}
              fallback={
                <Skeleton
                  isLoaded={false}
                  height="500px"
                  width="full"
                  borderRadius="md"
                />
              }
              minHeight="500px"
              borderRadius="md"
            />
          ))
        ) : (
          <Image src={IMAGE_NOT_FOUND_URL} borderRadius="md" height="500px" />
        )}
      </Center>
    </>
  );
};

export default ClockDetail;
