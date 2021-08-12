import { useEffect, useState } from 'react';

import { AppProps } from 'next/app';
import { useRouter } from 'next/router';

import { QueryClient, QueryClientProvider } from 'react-query';

import { ChakraProvider } from '@chakra-ui/react';

import { useAuthState } from 'react-firebase-hooks/auth';

import firebase from '@/utils/firebase';
import Loading from '@/components/Loading';

import '@/styles/global.scss';

const auth = firebase.auth();

const queryClient = new QueryClient();

export default function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [user, isLoading] = useAuthState(auth);
  const [isLoginPage, setIsLoginPage] = useState<boolean>(false);

  useEffect(() => {
    if (!(user || isLoading)) {
      router.push('/login').then(() => setIsLoginPage(true));
    }
  }, [user, isLoading]);

  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider>
        {!isLoading && (isLoginPage || user) ? (
          <Component {...pageProps} />
        ) : (
          <Loading />
        )}
      </ChakraProvider>
    </QueryClientProvider>
  );
}
