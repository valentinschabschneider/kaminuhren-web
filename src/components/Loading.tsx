import Head from 'next/head';

import { Center } from '@chakra-ui/react';

import { GridLoader } from 'react-spinners';

export default function Loading() {
  return (
    <>
      <Head>
        <title>Lädt...</title>
      </Head>
      <Center height="100vh">
        <GridLoader size={50} color="#696969" />
      </Center>
    </>
  );
}
