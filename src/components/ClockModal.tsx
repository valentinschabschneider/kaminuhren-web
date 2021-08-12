import NextLink from 'next/link';

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Link,
} from '@chakra-ui/react';

import ClockDetail from '@/components/ClockDetail';
import { getClockTypeByLink } from '@/utils/misc';
import { Clock } from '@/types';

interface ClockCardProps {
  clock: Clock;
  onClose: () => void;
  isOpen: boolean;
}

const ClockModal: React.FC<ClockCardProps> = ({ clock, onClose, isOpen }) => {
  return (
    <Modal onClose={onClose} size="xl" isOpen={isOpen}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <NextLink href={`/${clock.type}/${clock.id}`} passHref>
            <Link boxShadow="none !important">
              {getClockTypeByLink(clock.type)?.singularDisplayName} #{clock.id}
            </Link>
          </NextLink>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <ClockDetail clock={clock} />
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ClockModal;
