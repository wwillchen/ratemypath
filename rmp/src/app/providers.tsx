'use client';

import { CacheProvider } from '@chakra-ui/next-js';
import { SessionProvider } from 'next-auth/react';

import { Chakra as ChakraProvider } from '~/lib/components/Chakra';

type sessionProps = {
  children: React.ReactNode;
};

const Providers = ({ children }: sessionProps) => {
  return (
    <SessionProvider>
      <CacheProvider>
        <ChakraProvider>{children}</ChakraProvider>
      </CacheProvider>
    </SessionProvider>
  );
};

export default Providers;
