import NextLink from 'next/link';

import { Box, Link } from '@chakra-ui/react';

import { HomeIcon } from '@/components/Icons';

const Header = () => {
  return (
    <NextLink href="/" passHref>
      <Link boxShadow="none !important">
        <Box
          zIndex="1"
          w="15rem"
          h="15rem"
          overflow="hidden"
          borderBottomRightRadius="50%"
          borderWidth="1px"
          backgroundColor="#ededee"
          transform="auto"
          translateX="-60%"
          translateY="-55%"
          position="fixed"
          opacity="30%"
          transition="0.3s"
          _hover={{
            opacity: '100%',
          }}
        >
          <Box
            w="100%"
            h="100%"
            _hover={{
              animation: 'shake 0.5s',
              animationIterationCount: 'infinite',
            }}
          >
            <HomeIcon
              fontSize="70px"
              marginTop="11rem"
              marginLeft="12.1rem"
              color="black"
              transform="auto"
              rotate="-8"
            />
          </Box>
        </Box>
      </Link>
    </NextLink>
  );
};

export default Header;
