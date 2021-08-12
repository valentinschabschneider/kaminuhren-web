import NextLink from 'next/link';
import Head from 'next/head';

import { Center, UnorderedList, ListItem, Link } from '@chakra-ui/react';

import { CLOCK_TYPES } from '@/constants';

const Home = () => {
  return (
    <>
      <Head>
        <title>Index</title>
      </Head>
      <Center>
        <UnorderedList>
          {CLOCK_TYPES.map((type) => (
            <ListItem key={type.link}>
              <NextLink href={`/${type.link}`} passHref>
                <Link>{type.pluralDisplayName}</Link>
              </NextLink>
            </ListItem>
          ))}
          )
        </UnorderedList>
      </Center>
    </>
  );
};

export default Home;
