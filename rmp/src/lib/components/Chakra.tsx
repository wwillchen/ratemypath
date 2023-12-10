import { ChakraProvider, cookieStorageManager } from '@chakra-ui/react';

import customTheme from '~/lib/styles/theme/index';

type ChakraProps = {
  children: React.ReactNode;
};

export const Chakra = ({ children }: ChakraProps) => {
  return (
    <ChakraProvider colorModeManager={cookieStorageManager} theme={customTheme}>
      {children}
    </ChakraProvider>
  );
};
