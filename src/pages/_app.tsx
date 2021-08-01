import { useEffect } from 'react';
import { AppProps } from 'next/app';

import { useRouter } from 'next/router';

import { QueryClient, QueryClientProvider } from 'react-query';

import { ChakraProvider } from '@chakra-ui/react';

import { useAuthState } from 'react-firebase-hooks/auth';

import firebase from '../utils/firebase';

const auth = firebase.auth();

const queryClient = new QueryClient();

import '@/styles/global.scss';

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);

  useEffect(() => {
    if (!(user || loading)) {
      router.push('/login');
    }
  }, [user, loading]);

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </QueryClientProvider>
  );
}
