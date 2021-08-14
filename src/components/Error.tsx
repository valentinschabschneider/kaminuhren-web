import Head from 'next/head';

import {
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

const Error = () => {
  return (
    <>
      <Head>
        <title>Fehler!</title>
      </Head>
      <Center height="100vh">
        <Alert status="error">
          <AlertIcon />
          <AlertTitle mr={2}>Fehler!</AlertTitle>
          <AlertDescription>Es ist ein Fehler aufgetreten.</AlertDescription>
        </Alert>
      </Center>
    </>
  );
};

export default Error;
