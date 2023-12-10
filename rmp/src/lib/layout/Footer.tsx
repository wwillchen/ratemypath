import { Flex, Link, Text, Icon } from '@chakra-ui/react';
import { FcLike } from 'react-icons/fc';

const Footer = () => {
  return (
    <Flex as="footer" width="full" justifyContent="center">
      <Text fontSize="sm">
        {new Date().getFullYear()} <Icon as={FcLike} />{' '}
        <Link href="/" isExternal rel="noopener noreferrer">
          RateMyPath Team (Bruno, David, Will)
        </Link>
      </Text>
    </Flex>
  );
};

export default Footer;
