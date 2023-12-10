import {
  Box,
  Flex,
  useColorModeValue,
  chakra,
  useDisclosure,
  Heading,
  IconButton,
  Button,
  Text,
  HStack,
  VStack,
  CloseButton,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useSession, signIn, signOut } from 'next-auth/react';
import { AiOutlineMenu } from 'react-icons/ai';

const Header = () => {
  const bg = useColorModeValue('white', 'gray.800');
  const { data: session } = useSession();

  const mobileNav = useDisclosure();
  return (
    <chakra.header
      bg={bg}
      w="full"
      px={{
        base: 2,
        sm: 6,
      }}
      py={6}
      shadow="md"
    >
      <Flex alignItems="center" justifyContent="space-between" mx="auto">
        <Flex>
          <chakra.a href="/" title="Home" display="flex" alignItems="center">
            <Heading>RateMyPath</Heading>
          </chakra.a>
        </Flex>
        <HStack display="flex" alignItems="center" spacing={1}>
          <HStack
            spacing={1}
            mr={1}
            color="blue.500"
            display={{
              base: 'none',
              md: 'inline-flex',
            }}
          >
            <Link href="/">
              <Button variant="ghost">Search</Button>
            </Link>
            <Link href="/random">
              <Button variant="ghost">Random Course</Button>
            </Link>
            <Link href="/instructors">
              <Button variant="ghost">Instructors</Button>
            </Link>
            {!session?.user && (
              <>
                <Button
                  colorScheme="blue"
                  variant="solid"
                  onClick={() => {
                    console.log('SIGN IN');
                    signIn();
                  }}
                  w="full"
                >
                  Sign In
                </Button>
                <Link href="/sign-up">
                  <Button colorScheme="blue" variant="solid" w="full">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
            {session?.user && (
              <>
                <Button onClick={() => signOut()} w="full" variant="ghost">
                  Sign Out
                </Button>
                <Link href="/comments">
                  <Button variant="ghost">Comments</Button>
                </Link>
                <Text>{session.user.email}</Text>
              </>
            )}
          </HStack>
          <Box
            display={{
              base: 'inline-flex',
              md: 'none',
            }}
          >
            <IconButton
              display={{
                base: 'flex',
                md: 'none',
              }}
              aria-label="Open menu"
              fontSize="20px"
              color="gray.800"
              _dark={{
                color: 'inherit',
              }}
              variant="ghost"
              icon={<AiOutlineMenu />}
              onClick={mobileNav.onOpen}
            />

            <VStack
              pos="absolute"
              top={0}
              left={0}
              right={0}
              display={mobileNav.isOpen ? 'flex' : 'none'}
              flexDirection="column"
              p={2}
              pb={4}
              m={2}
              bg={bg}
              spacing={3}
              rounded="sm"
              shadow="sm"
            >
              <CloseButton
                aria-label="Close menu"
                onClick={mobileNav.onClose}
              />

              <Button w="full" variant="ghost">
                Features
              </Button>
              <Button w="full" variant="ghost">
                Pricing
              </Button>
              <Button w="full" variant="ghost">
                Blog
              </Button>
              <Button w="full" variant="ghost">
                Company
              </Button>
            </VStack>
          </Box>
        </HStack>
      </Flex>
    </chakra.header>
  );
};

export default Header;
